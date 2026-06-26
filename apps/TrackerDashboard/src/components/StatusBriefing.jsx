import { useState } from 'react'
import { pct as calcPct } from '../dataProcessor.js'

const STREAMS = [
  { key: 'ux',          label: 'UX Design',   discField: 'UX',          flowKey: 'ux',          doneKey: 'uxDone',  totalKey: 'uxTotal',  progKey: 'uxProg',  blockedKey: 'uxBlocked',  fill: '#3D9E52', dot: '#3D9E52' },
  { key: 'frontend',    label: 'Frontend',     discField: 'Frontend',    flowKey: 'frontend',     doneKey: 'feDone',  totalKey: 'feTotal',  progKey: 'feProg',  blockedKey: 'feBlocked',  fill: '#7C3AED', dot: '#7C3AED' },
  { key: 'backend',     label: 'Backend',      discField: 'Backend',     flowKey: 'backend',      doneKey: 'beDone',  totalKey: 'beTotal',  progKey: 'beProg',  blockedKey: 'beBlocked',  fill: '#2B6CB0', dot: '#2B6CB0' },
  { key: 'integration', label: 'Integration',  discField: 'Integration', flowKey: 'integration',  doneKey: 'intDone', totalKey: 'intTotal', progKey: 'intProg', blockedKey: 'intBlocked', fill: '#D4920A', dot: '#D4920A' },
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


const EMPTY_DUE = { overdue: 0, today: 0, upcoming: 0, noDate: 0 }

function buildStreams(stats) {
  return STREAMS.map(s => {
    const done       = stats[s.doneKey] ?? 0
    const total      = stats[s.totalKey] ?? 0
    const p          = calcPct(done, total)
    // In-progress / blocked / due-date status all come from the same surface-scoped
    // pass as done/total, so nothing leaks in from portals or Phase 2.
    const inProgress = stats[s.progKey] ?? 0
    const blocked    = stats[s.blockedKey] ?? 0
    const notStarted = Math.max(0, total - done - inProgress - blocked)
    const due        = stats.due?.[s.key] ?? EMPTY_DUE
    return { ...s, done, total, pct: p, inProgress, blocked, notStarted, due }
  })
}

const PILL_TONE = {
  green:   { bg: 'rgba(61,158,82,.1)',  color: '#267339', dot: '#3D9E52' },
  amber:   { bg: 'rgba(212,146,10,.1)', color: '#8C5E00', dot: '#D4920A' },
  red:     { bg: 'rgba(224,82,82,.1)',  color: '#B83030', dot: '#E05252' },
  neutral: { bg: 'rgba(0,0,0,.05)',     color: 'var(--muted)', dot: '#B0B0B0' },
}

// Formats a Jira "YYYY-MM-DD" due date as "15 Jul" (no timezone shift).
function formatDue(ymd) {
  return new Date(`${ymd}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// Due-date pill for a discipline. Shows the NEAREST open due date — overdue dates
// in red, today in amber, upcoming in neutral — and "No due date present" when none
// of the open subtasks carry a date. "All done" when nothing is open.
function DuePill({ counts }) {
  const { overdue = 0, today = 0, upcoming = 0, noDate = 0, nearest = null } = counts ?? {}
  const open = overdue + today + upcoming + noDate

  // `nearest` is the min open due date, so the bucket counts classify it directly:
  // any overdue → it's overdue; else any today → it's today; else it's upcoming.
  let tone, label
  if (open === 0) {
    tone = 'green';   label = 'All done'
  } else if (!nearest) {
    tone = 'neutral'; label = 'No due date present'
  } else if (overdue) {
    tone = 'red';     label = `Overdue ${formatDue(nearest)}`
  } else if (today) {
    tone = 'amber';   label = 'Due today'
  } else {
    tone = 'neutral'; label = `Due ${formatDue(nearest)}`
  }
  const s = PILL_TONE[tone]

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
    { n: done,       label: 'done',        color: 'var(--ink)' },
    inProgress > 0 ? { n: inProgress, label: 'in progress', color: 'var(--ink)'      } : null,
    blocked    > 0 ? { n: blocked,    label: 'blocked',     color: 'var(--red-text)' } : null,
    notStarted > 0 ? { n: notStarted, label: 'not started', color: 'var(--ink)'      } : null,
  ].filter(Boolean)
  return (
    <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && <span style={{ color: 'rgba(0,0,0,.2)', margin: '0 5px' }}>·</span>}
          <strong style={{ color: item.color, fontWeight: 700 }}>{item.n}</strong>{' '}{item.label}
        </span>
      ))}
    </div>
  )
}

function Metric({ stream }) {
  const { pct, done, total, inProgress, blocked, notStarted, fill } = stream

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: fill }}>{pct}%</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>
          of {total} subtasks
        </div>
      </div>
      <div style={{ height: 7, background: 'rgba(0,0,0,.07)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: fill, borderRadius: 3, transition: 'width 0.4s ease' }} />
      </div>
      <MetricParts done={done} inProgress={inProgress} blocked={blocked} notStarted={notStarted} />
    </div>
  )
}

function StreamCard({ stream, onViewDetails }) {
  return (
    <div className="briefing-stream-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 15.5, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: stream.dot, flexShrink: 0 }} />
        <span>{stream.label}</span>
        <DuePill counts={stream.due} />
      </div>
      <Metric stream={stream} />
      <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="briefing-view-btn" onClick={() => onViewDetails(stream.key)}>
          View details
        </button>
      </div>
    </div>
  )
}

// Per-module discipline fields for the breakdown table.
const MOD_DISC = [
  { key: 'ux',  label: 'UX',          doneKey: 'uxD', totalKey: 'uxT', fill: '#3D9E52' },
  { key: 'fe',  label: 'Frontend',    doneKey: 'feD', totalKey: 'feT', fill: '#7C3AED' },
  { key: 'be',  label: 'Backend',     doneKey: 'beD', totalKey: 'beT', fill: '#2B6CB0' },
  { key: 'int', label: 'Integration', doneKey: 'inD', totalKey: 'inT', fill: '#D4920A' },
]

function ModuleRow({ module, disc, openKey, onToggle }) {
  const isOpen     = openKey === module.name
  const totalDone  = disc.reduce((sum, d) => sum + (module[d.doneKey] ?? 0), 0)
  const totalItems = disc.reduce((sum, d) => sum + (module[d.totalKey] ?? 0), 0)
  const overall    = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0

  const disciplines = disc.map(d => ({
    label: d.label, done: module[d.doneKey] ?? 0, total: module[d.totalKey] ?? 0, fill: d.fill,
  }))

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
          {module.flowKeys.size === 0 ? (
            <span style={{ whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--quiet)' }}>
              No flows yet
            </span>
          ) : (
            <span style={{
              whiteSpace: 'nowrap', fontWeight: 600,
              color: module.flowsDone === module.flowKeys.size ? 'var(--green-text)' : 'var(--text)',
            }}>
              {module.flowsDone} of {module.flowKeys.size} done
            </span>
          )}
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

// ── Stream cards (goes in the right column) ──────────────────────────────────
export default function StatusBriefing({ stats }) {
  if (!stats) return null

  const streams = buildStreams(stats)

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
        <span className="card-title">This Week</span>
        <div style={{ fontSize: 12, color: 'var(--quiet)' }}>{weekLabel}</div>
      </div>

      {/* Stream cards */}
      <div className="briefing-band">
        {streams.map(s => (
          <StreamCard
            key={s.key}
            stream={s}
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
export function StatusBriefingModules({ modules, title = 'Journey Health' }) {
  const [openModule, setOpenModule] = useState(null)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('journeyAccordionCollapsed') === 'true'
  )

  if (!modules?.length) return null

  // Data-driven: only show disciplines with subtasks on this surface
  // (Frontend drops off the portals, stays on mobile).
  const activeDisc = MOD_DISC.filter(d => modules.some(m => (m[d.totalKey] ?? 0) > 0))

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
          {title}
          <span className={`chevron ${collapsed ? 'collapsed' : ''}`}>▼</span>
        </span>
      </div>
      {!collapsed && (
        <div style={{ padding: '8px 20px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {modules.map(m => (
              <ModuleRow key={m.name} module={m} disc={activeDisc} openKey={openModule} onToggle={toggleModule} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
