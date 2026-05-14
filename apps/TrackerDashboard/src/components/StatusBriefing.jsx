import { useState } from 'react'
import { pct as calcPct, TOTAL_FLOWS, MODULE_ORDER } from '../dataProcessor.js'

const MODULE_ORDER_SET = new Set(MODULE_ORDER)

const STREAMS = [
  { key: 'ux',          label: 'UX Design',   discField: 'UX',          flowKey: 'ux',          doneKey: 'uxDone',  fill: '#3D9E52', dot: '#3D9E52' },
  { key: 'frontend',    label: 'Frontend',     discField: 'Frontend',    flowKey: 'frontend',     doneKey: 'feDone',  fill: '#7C3AED', dot: '#7C3AED' },
  { key: 'backend',     label: 'Backend',      discField: 'Backend',     flowKey: 'backend',      doneKey: 'beDone',  fill: '#2B6CB0', dot: '#2B6CB0' },
  { key: 'integration', label: 'Integration',  discField: 'Integration', flowKey: 'integration',  doneKey: 'intDone', fill: '#D4920A', dot: '#D4920A' },
]

const CADENCES = [
  { key: 'targeting', label: 'Mon — Targeting' },
  { key: 'midweek',   label: 'Wed — Mid-week'  },
  { key: 'recap',     label: 'Fri — Recap'     },
]

// ── Date helpers ─────────────────────────────────────────────────────────────
function thisWeekBounds() {
  const now = new Date()
  const mon = new Date(now)
  mon.setDate(now.getDate() - ((now.getDay() + 6) % 7)) // back to Monday
  mon.setHours(0, 0, 0, 0)
  const fri = new Date(mon)
  fri.setDate(mon.getDate() + 4) // Friday
  fri.setHours(23, 59, 59, 999)
  return { mon, fri }
}

function isThisWeek(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const { mon, fri } = thisWeekBounds()
  return d >= mon && d <= fri
}

// Build a map of flow key → duedate.
// Checks due dates on the flow issue itself first, then falls back to
// due dates set on any of the flow's subtasks.
function buildFlowDateMap(rawFlows, subtasks) {
  const map = {}
  for (const f of (rawFlows ?? [])) {
    const due   = f.fields?.duedate ?? null
    const start = f.fields?.customfield_10015 ?? null
    if (due || start) map[f.key] = { due, start }
  }
  // If a subtask has a due date, bubble it up to the parent flow
  for (const s of (subtasks ?? [])) {
    const due = s.fields?.duedate ?? null
    if (!due) continue
    const pk = s.fields?.parent?.key
    if (pk && !map[pk]) map[pk] = { due, start: null }
  }
  return map
}

// Flows (processed) that have a due date falling within the current week
function getTargetedFlows(flows, flowDateMap) {
  return (flows ?? []).filter(f => isThisWeek(flowDateMap[f.key]?.due))
}

// Per-stream targeting counts from this week's targeted flows
function targetingCounts(targetedFlows, flowKey) {
  const DONE_RE = /done|closed|resolved|complet/i
  let done = 0, remaining = 0
  for (const f of targetedFlows) {
    const status = f[flowKey] ?? ''  // e.g. f.ux = 'Done'
    if (DONE_RE.test(status)) done++
    else remaining++
  }
  return { done, remaining, total: targetedFlows.length }
}

// ── Overall stream metrics (mid-week / recap) ─────────────────────────────
// module name → due date string
function getModuleDueDates(rawFlows) {
  const map = {}
  for (const f of (rawFlows ?? [])) {
    const summary = (f.fields?.summary ?? '').trim()
    const due = f.fields?.duedate ?? null
    if (due && MODULE_ORDER_SET.has(summary)) map[summary] = due
  }
  return map
}

// Per-stream: which module fields hold done/total counts
const STREAM_MOD_KEYS = {
  ux:          { done: 'uxD', total: 'uxT' },
  frontend:    { done: 'feD', total: 'feT' },
  backend:     { done: 'beD', total: 'beT' },
  integration: { done: 'inD', total: 'inT' },
}

function healthFor(p, streamKey, modules, moduleDueDates) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const keys = STREAM_MOD_KEYS[streamKey]
  let flowsBehind = 0

  for (const mod of (modules ?? [])) {
    const due = moduleDueDates[mod.name]
    if (!due) continue
    const dueDate = new Date(due)
    dueDate.setHours(0, 0, 0, 0)
    if (today <= dueDate) continue
    const done  = mod[keys.done]  ?? 0
    const total = mod[keys.total] ?? 0
    if (total === 0) continue
    flowsBehind += Math.max(0, total - done)
  }

  if (flowsBehind > 0) return { status: 'red', label: `${flowsBehind} flow${flowsBehind !== 1 ? 's' : ''} behind` }
  return { status: 'green', label: 'On track' }
}

function countStatus(subtasks, discField, match) {
  return (subtasks ?? []).filter(iss => {
    const disc = (iss.fields?.summary ?? '').trim()
    const s    = (iss.fields?.status?.name ?? '').toLowerCase()
    return disc === discField && match(s)
  }).length
}

function buildStreams(stats, subtasks, rawFlows, modules) {
  const moduleDueDates = getModuleDueDates(rawFlows)
  return STREAMS.map(s => {
    const done       = stats[s.doneKey] ?? 0
    const total      = TOTAL_FLOWS
    const p          = calcPct(done, total)
    const { status: health, label: healthLabel } = healthFor(p, s.key, modules, moduleDueDates)
    const inProgress = countStatus(subtasks, s.discField, st => st.includes('progress'))
    const blocked    = countStatus(subtasks, s.discField, st => st.includes('block'))
    const notStarted = Math.max(0, total - done - inProgress - blocked)
    return { ...s, done, total, pct: p, health, healthLabel, inProgress, blocked, notStarted }
  })
}

// ── Narratives ───────────────────────────────────────────────────────────────
function narrative(stream, cadence, targeting) {
  const { label, pct, done, total } = stream
  if (cadence === 'targeting') {
    const t = targeting
    if (t.total === 0) return `No ${label} flows have a due date set for this week. Set due dates on flow issues to enable targeting.`
    const pace = t.remaining === 0 ? 'All on track.' : `${t.remaining} flow${t.remaining > 1 ? 's' : ''} still need${t.remaining === 1 ? 's' : ''} ${label} work.`
    return `${t.total} flow${t.total > 1 ? 's' : ''} due this week. ${t.done} already shipped. ${pace}`
  }
  if (cadence === 'midweek') {
    if (pct >= 75) return 'On pace for a strong close.'
    if (pct >= 45) return 'Some risk; tracking daily.'
    if (pct >= 25) return `${total - done} tasks outstanding. Consistent daily progress needed.`
    return `Only ${pct}% complete. Risk escalation warranted.`
  }
  const remaining = total - done
  if (remaining === 0) return 'Full week delivered.'
  return `${remaining} task${remaining > 1 ? 's' : ''} carried to next week.`
}

function HealthPill({ status, label }) {
  const map = {
    green: { bg: 'rgba(61,158,82,.1)',    color: '#267339', dot: '#3D9E52' },
    amber: { bg: 'rgba(212,146,10,.1)',   color: '#8C5E00', dot: '#D4920A' },
    red:   { bg: 'rgba(224,82,82,.1)',    color: '#B83030', dot: '#E05252' },
  }
  const s = map[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 500,
      background: s.bg, color: s.color, flexShrink: 0, marginLeft: 'auto',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {label}
    </span>
  )
}

function MetricParts({ done, inProgress, blocked, notStarted }) {
  const items = [
    { n: done,       label: 'done',        color: 'var(--text)' },
    inProgress > 0 ? { n: inProgress, label: 'in progress', color: 'var(--text)'     } : null,
    blocked    > 0 ? { n: blocked,    label: 'blocked',     color: 'var(--red-text)' } : null,
    notStarted > 0 ? { n: notStarted, label: 'not started', color: 'var(--text)'     } : null,
  ].filter(Boolean)
  return (
    <div style={{ fontSize: 12, color: 'var(--quiet)', lineHeight: 1.5 }}>
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && <span style={{ color: 'var(--quiet)', margin: '0 4px' }}>·</span>}
          <strong style={{ color: item.color, fontWeight: 600 }}>{item.n}</strong>{' '}{item.label}
        </span>
      ))}
    </div>
  )
}

function Metric({ stream, cadence, targeting }) {
  const { pct, done, total, inProgress, blocked, notStarted, fill } = stream

  if (cadence === 'targeting') {
    const t = targeting
    const targetPct = t.total > 0 ? Math.round((t.done / t.total) * 100) : 0
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span className="briefing-meta-label">Due this week</span>
          <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
            {t.total === 0 ? '—' : `${t.total} flow${t.total > 1 ? 's' : ''}`}
          </span>
        </div>
        {t.total > 0 && (
          <>
            <div style={{ height: 5, background: 'rgba(0,0,0,.07)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${targetPct}%`, background: fill, borderRadius: 3, transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
              <span style={{ color: '#267339', fontWeight: 600 }}>{t.done} shipped</span>
              <span style={{ color: '#999999' }}>·</span>
              <span style={{ color: t.remaining > 0 ? '#8C5E00' : '#999999', fontWeight: t.remaining > 0 ? 600 : 400 }}>
                {t.remaining} remaining
              </span>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: fill }}>{pct}%</div>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--quiet)' }}>
          {cadence === 'recap' ? 'final this week' : `of ${total} subtasks`}
        </div>
      </div>
      <div style={{ height: 7, background: 'rgba(0,0,0,.07)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: fill, borderRadius: 3, transition: 'width 0.4s ease' }} />
      </div>
      <MetricParts done={done} inProgress={inProgress} blocked={blocked} notStarted={notStarted} />
    </div>
  )
}

function StreamCard({ stream, cadence, targeting, onViewDetails }) {
  return (
    <div className="briefing-stream-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: 15, letterSpacing: '-0.005em' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: stream.dot, flexShrink: 0 }} />
        <span>{stream.label}</span>
        <HealthPill status={stream.health} label={stream.healthLabel} />
      </div>
      <Metric stream={stream} cadence={cadence} targeting={targeting} />
      <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.55, flex: 1 }}>
        {narrative(stream, cadence, targeting)}
      </p>
      <div style={{ paddingTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="briefing-view-btn" onClick={() => onViewDetails(stream.key)}>
          View details
        </button>
      </div>
    </div>
  )
}

function ModuleRow({ module, openKey, onToggle }) {
  const isOpen     = openKey === module.name
  const totalDone  = module.uxD + module.feD + module.beD + module.inD
  const totalItems = module.uxT + module.feT + module.beT + module.inT
  const overall    = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0

  const disciplines = [
    { label: 'UX',          done: module.uxD, total: module.uxT, fill: '#3D9E52' },
    { label: 'Frontend',    done: module.feD, total: module.feT, fill: '#7C3AED' },
    { label: 'Backend',     done: module.beD, total: module.beT, fill: '#2B6CB0' },
    { label: 'Integration', done: module.inD, total: module.inT, fill: '#D4920A' },
  ]

  return (
    <div className={`briefing-accordion${isOpen ? ' open' : ''}`}>
      <div
        className="briefing-accordion-hdr"
        role="button"
        tabIndex={0}
        onClick={() => onToggle(module.name)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(module.name) } }}
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500, fontSize: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: module.color, flexShrink: 0 }} />
          {module.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--quiet)', fontSize: 12.5 }}>
          <span style={{
            whiteSpace: 'nowrap', fontWeight: 600,
            color: module.flowsDone === module.flowKeys.size ? 'var(--green-text)' : 'var(--text)',
          }}>
            {module.flowsDone} of {module.flowKeys.size} done
          </span>
          <span style={{ whiteSpace: 'nowrap' }}>{overall}%</span>
          <svg className="briefing-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className="briefing-accordion-body">
          <table className="briefing-detail-table">
            <thead>
              <tr>
                <th>Discipline</th>
                <th>Done</th>
                <th>Total</th>
                <th style={{ minWidth: 160 }}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {disciplines.map(d => {
                const p = d.total > 0 ? Math.round((d.done / d.total) * 100) : 0
                return (
                  <tr key={d.label}>
                    <td style={{ fontWeight: 500 }}>{d.label}</td>
                    <td style={{ color: 'var(--quiet)' }}>{d.done}</td>
                    <td style={{ color: 'var(--quiet)' }}>{d.total}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: 'rgba(0,0,0,.07)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${p}%`, background: d.fill, borderRadius: 2, transition: 'width 0.4s' }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', width: 34, textAlign: 'right' }}>{p}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Cadence + stream cards (goes in the right column) ────────────────────────
export default function StatusBriefing({ stats, modules, subtasks, flows, rawFlows, dateRange }) {
  const [cadence, setCadence] = useState('midweek')

  if (!stats || !modules) return null

  const streams       = buildStreams(stats, subtasks, rawFlows, modules)
  const flowDateMap   = buildFlowDateMap(rawFlows, subtasks)
  const targetedFlows = getTargetedFlows(flows, flowDateMap)
  const targetingMap = {}
  for (const s of STREAMS) {
    targetingMap[s.key] = targetingCounts(targetedFlows, s.flowKey)
  }

  const { mon, fri } = thisWeekBounds()
  const weekLabel = `${mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${fri.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`

  function handleViewDetails() {
    const el = document.getElementById('briefing-modules')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="card" style={{ height: '100%' }}>
      {/* Controls */}
      <div className="briefing-controls">
        <div className="briefing-segmented">
          {CADENCES.map(opt => (
            <button
              key={opt.key}
              className={`briefing-seg-btn${cadence === opt.key ? ' active' : ''}`}
              onClick={() => setCadence(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--quiet)' }}>
          {cadence === 'targeting'
            ? <><strong style={{ color: 'var(--ink)' }}>Week of {weekLabel}</strong> · {targetedFlows.length} flow{targetedFlows.length !== 1 ? 's' : ''} due</>
            : weekLabel
          }
        </div>
      </div>

      {/* Stream cards */}
      <div className="briefing-band">
        {streams.map(s => (
          <StreamCard
            key={s.key}
            stream={s}
            cadence={cadence}
            targeting={targetingMap[s.key]}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Weekly summary sentence */}
      <div style={{
        margin: '0 26px 20px',
        padding: '12px 16px',
        background: 'var(--bg)',
        borderRadius: 10,
        fontSize: 13.5,
        color: 'var(--muted)',
        lineHeight: 1.6,
      }}>
        Done to date: UX{' '}
        <strong style={{ color: 'var(--green-text)' }}>{streams[0].done}</strong>,
        {' '}Frontend{' '}
        <strong style={{ color: '#5B21B6' }}>{streams[1].done}</strong>,
        {' '}Backend{' '}
        <strong style={{ color: '#1A4F8A' }}>{streams[2].done}</strong>,
        {' '}Integration{' '}
        <strong style={{ color: 'var(--yellow-text)' }}>{streams[3].done}</strong>
        {' '}flows.
      </div>
    </div>
  )
}

// ── Module Health accordions (full-width, below the hero row) ─────────────────
export function StatusBriefingModules({ modules }) {
  const [openModule, setOpenModule] = useState(null)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('journeyAccordionCollapsed') === 'true'
  )

  if (!modules?.length) return null

  function toggleModule(name) {
    setOpenModule(prev => prev === name ? null : name)
  }

  function toggleCollapsed() {
    setCollapsed(c => {
      const next = !c
      localStorage.setItem('journeyAccordionCollapsed', String(next))
      return next
    })
  }

  return (
    <div className="card">
      <div className="card-header clickable" onClick={toggleCollapsed} id="briefing-modules">
        <span className="card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(57% 0.19 142)" strokeWidth="2.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Journey Health
          <span className={`chevron ${collapsed ? 'collapsed' : ''}`}>▼</span>
        </span>
      </div>
      {!collapsed && (
        <div style={{ padding: '8px 20px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {modules.map(m => (
              <ModuleRow key={m.name} module={m} openKey={openModule} onToggle={toggleModule} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
