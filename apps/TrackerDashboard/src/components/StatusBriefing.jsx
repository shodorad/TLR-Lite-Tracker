import { useState } from 'react'
import { pct as calcPct, TOTAL_FLOWS } from '../dataProcessor.js'

const STREAMS = [
  { key: 'ux',          label: 'UX Design',   discField: 'UX',          flowKey: 'ux',          doneKey: 'uxDone',  fill: '#8b5cf6', dot: '#8b5cf6' },
  { key: 'backend',     label: 'Backend',      discField: 'Backend',     flowKey: 'backend',      doneKey: 'beDone',  fill: '#3b82f6', dot: '#3b82f6' },
  { key: 'integration', label: 'Integration',  discField: 'Integration', flowKey: 'integration',  doneKey: 'intDone', fill: '#10b981', dot: '#10b981' },
  { key: 'frontend',    label: 'Frontend',     discField: 'Frontend',    flowKey: 'frontend',     doneKey: 'feDone',  fill: '#7c3aed', dot: '#7c3aed' },
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
function healthFor(p) {
  if (p >= 75) return { status: 'green', label: 'On track' }
  if (p >= 45) return { status: 'amber', label: 'At risk'  }
  return         { status: 'red',   label: 'Behind'   }
}

function countStatus(subtasks, discField, match) {
  return (subtasks ?? []).filter(iss => {
    const disc = (iss.fields?.summary ?? '').trim()
    const s    = (iss.fields?.status?.name ?? '').toLowerCase()
    return disc === discField && match(s)
  }).length
}

function buildStreams(stats, subtasks) {
  return STREAMS.map(s => {
    const done       = stats[s.doneKey] ?? 0
    const total      = TOTAL_FLOWS
    const p          = calcPct(done, total)
    const { status: health, label: healthLabel } = healthFor(p)
    const inProgress = countStatus(subtasks, s.discField, st => st.includes('progress'))
    const blocked    = countStatus(subtasks, s.discField, st => st.includes('block'))
    const notStarted = Math.max(0, total - done - inProgress - blocked)
    return { ...s, done, total, pct: p, health, healthLabel, inProgress, blocked, notStarted }
  })
}

// ── Narratives ───────────────────────────────────────────────────────────────
function narrative(stream, cadence, targeting) {
  const { label, pct, done, total, inProgress, blocked } = stream
  if (cadence === 'targeting') {
    const t = targeting
    if (t.total === 0) return `No ${label} flows have a due date set for this week in Jira. Set due dates on flow issues to enable targeted tracking.`
    const pace = t.remaining === 0 ? 'All on track.' : `${t.remaining} flow${t.remaining > 1 ? 's' : ''} still need${t.remaining === 1 ? 's' : ''} ${label} work.`
    return `${t.total} flow${t.total > 1 ? 's' : ''} due this week. ${t.done} already ${t.done === 1 ? 'has' : 'have'} ${label} shipped. ${pace}`
  }
  if (cadence === 'midweek') {
    const pace = pct >= 75 ? 'On pace for a strong close.' : pct >= 45 ? 'Some risk — tracking daily.' : 'Behind pace, needs attention.'
    return `${pct}% complete as of mid-week. ${done} of ${total} subtasks shipped${inProgress > 0 ? `, ${inProgress} in progress` : ''}${blocked > 0 ? `, ${blocked} blocked` : ''}. ${pace}`
  }
  const remaining = total - done
  return `Week closed at ${pct}%. ${done} of ${total} tasks shipped.${remaining > 0 ? ` ${remaining} carried to next week.` : ' Full week delivered.'}`
}

function HealthPill({ status, label }) {
  const map = {
    green: { bg: '#ecfdf5', color: '#047857', dot: '#10b981' },
    amber: { bg: '#fffbeb', color: '#b45309', dot: '#f59e0b' },
    red:   { bg: '#fef2f2', color: '#b91c1c', dot: '#ef4444' },
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

function Metric({ stream, cadence, targeting }) {
  const { pct, done, total, inProgress, blocked, notStarted, fill } = stream

  const parts = [
    `<strong style="color:#1a1a1a">${done}</strong> done`,
    inProgress > 0 ? `<strong style="color:#1a1a1a">${inProgress}</strong> in progress` : null,
    blocked    > 0 ? `<strong style="color:#b91c1c">${blocked}</strong> blocked`         : null,
    notStarted > 0 ? `<strong style="color:#1a1a1a">${notStarted}</strong> not started`  : null,
  ].filter(Boolean).join('<span style="color:#a3a3a3;margin:0 5px">·</span>')

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
            <div style={{ height: 4, background: '#f0f0f2', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${targetPct}%`, background: fill, borderRadius: 2, transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
              <span style={{ color: '#047857', fontWeight: 600 }}>{t.done} shipped</span>
              <span style={{ color: '#737373' }}>·</span>
              <span style={{ color: t.remaining > 0 ? '#b45309' : '#737373', fontWeight: t.remaining > 0 ? 600 : 400 }}>
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
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1 }}>{pct}%</div>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: '#737373' }}>
          {cadence === 'recap' ? 'final this week' : `of ${total} subtasks`}
        </div>
      </div>
      <div style={{ height: 4, background: '#f0f0f2', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: fill, borderRadius: 2, transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ fontSize: 12, color: '#737373' }} dangerouslySetInnerHTML={{ __html: parts }} />
    </div>
  )
}

function StreamCard({ stream, cadence, targeting, onViewDetails }) {
  return (
    <div className="briefing-stream-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: 15, letterSpacing: '-0.005em' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: stream.dot, flexShrink: 0 }} />
        <span>{stream.label}</span>
        <HealthPill status={stream.health} label={stream.healthLabel} />
      </div>
      <Metric stream={stream} cadence={cadence} targeting={targeting} />
      <p style={{ color: '#404040', fontSize: 13.5, lineHeight: 1.55, flex: 1 }}>
        {narrative(stream, cadence, targeting)}
      </p>
      <div style={{ paddingTop: 14, borderTop: '1px solid #e7e7ea', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="briefing-view-btn" onClick={() => onViewDetails(stream.key)}>
          View module details →
        </button>
      </div>
    </div>
  )
}

function ModuleRow({ module, openKey, onToggle }) {
  const isOpen     = openKey === module.name
  const totalDone  = module.uxD + module.beD + module.inD
  const totalItems = module.uxT + module.beT + module.inT
  const overall    = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0

  const disciplines = [
    { label: 'UX',          done: module.uxD, total: module.uxT, fill: '#8b5cf6' },
    { label: 'Backend',     done: module.beD, total: module.beT, fill: '#3b82f6' },
    { label: 'Integration', done: module.inD, total: module.inT, fill: '#10b981' },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#737373', fontSize: 12.5 }}>
          <span style={{
            whiteSpace: 'nowrap', fontWeight: 600,
            color: module.flowsDone === module.flowKeys.size ? '#047857' : '#1a1a1a',
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
                    <td style={{ color: '#737373' }}>{d.done}</td>
                    <td style={{ color: '#737373' }}>{d.total}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: '#f0f0f2', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${p}%`, background: d.fill, borderRadius: 2, transition: 'width 0.4s' }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#404040', width: 34, textAlign: 'right' }}>{p}%</span>
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

  const streams       = buildStreams(stats, subtasks)
  const flowDateMap   = buildFlowDateMap(rawFlows, subtasks)
  const targetedFlows = getTargetedFlows(flows, flowDateMap)
  const cadenceLabel  = CADENCES.find(c => c.key === cadence)?.label ?? ''

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
        <div>
          <div className="briefing-ctrl-label">Cadence</div>
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
        </div>
        <div style={{ fontSize: 12, color: '#737373' }}>
          {cadence === 'targeting'
            ? <><strong style={{ color: '#0a0a0a' }}>Week of {weekLabel}</strong> · {targetedFlows.length} flow{targetedFlows.length !== 1 ? 's' : ''} due</>
            : <>Viewing: <strong style={{ color: '#0a0a0a', fontWeight: 600 }}>{cadenceLabel}</strong></>
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
        margin: '0 20px 18px',
        padding: '12px 16px',
        background: '#f7f7f9',
        borderRadius: 10,
        fontSize: 13.5,
        color: '#404040',
        lineHeight: 1.6,
      }}>
        This week we completed UX for{' '}
        <strong style={{ color: '#267339' }}>{streams[0].done} flows</strong>,
        {' '}backend for{' '}
        <strong style={{ color: '#1A4F8A' }}>{streams[1].done} flows</strong>,
        {' '}integration for{' '}
        <strong style={{ color: '#8C5E00' }}>{streams[2].done} flows</strong>,
        {' '}and frontend for{' '}
        <strong style={{ color: '#5B21B6' }}>{streams[3].done} flows</strong>.
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
        <span className="badge badge-blue" style={{ fontSize: 11 }}>
          {collapsed ? 'Click to expand' : 'Click to collapse'}
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
