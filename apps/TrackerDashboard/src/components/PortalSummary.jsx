// Build-readiness panel for the portals hero. Where the mobile dashboard tracks
// a live weekly cadence, the portals are pre-build: the useful exec read is how
// much is scoped/broken-out plus a per-discipline progress pulse. The cards
// mirror the mobile briefing widget, minus Frontend (portals have none) and
// scoped to this portal rather than the whole project.

// UX · Backend · Integration — Frontend is intentionally absent on portals.
const DISC = [
  { key: 'ux',  label: 'UX Design',   disc: 'UX',          doneKey: 'uxDone',  totalKey: 'uxTotal',  color: '#3D9E52' },
  { key: 'be',  label: 'Backend',     disc: 'Backend',     doneKey: 'beDone',  totalKey: 'beTotal',  color: '#2B6CB0' },
  { key: 'int', label: 'Integration', disc: 'Integration', doneKey: 'intDone', totalKey: 'intTotal', color: '#D4920A' },
]

function statusFor(done, total, inProg) {
  if (done === total) return { label: 'Complete',    tone: 'done' }
  if (done === 0 && inProg === 0) return { label: 'Not started', tone: 'todo' }
  return { label: 'In progress', tone: 'prog' }
}

function DisciplineCard({ d, stats, inProgByDisc }) {
  const done       = stats[d.doneKey] ?? 0
  const total      = stats[d.totalKey] ?? 0
  const inProg     = inProgByDisc[d.disc] ?? 0
  const notStarted = Math.max(0, total - done - inProg)
  const p          = total > 0 ? Math.round((done / total) * 100) : 0
  const status     = statusFor(done, total, inProg)

  const parts = [
    { n: done, label: 'done' },
    inProg > 0     ? { n: inProg,     label: 'in progress' } : null,
    notStarted > 0 ? { n: notStarted, label: 'to go' }       : null,
  ].filter(Boolean)

  return (
    <div className="portal-disc-card">
      <div className="portal-disc-top">
        <span className="portal-disc-name">
          <span className="portal-disc-dot" style={{ background: d.color }} />
          {d.label}
        </span>
        <span className={`portal-disc-pill ${status.tone}`}>{status.label}</span>
      </div>
      <div className="portal-disc-pct" style={{ color: d.color }}>
        {p}%<span className="portal-disc-of">of {total} subtasks</span>
      </div>
      <div className="portal-disc-bar">
        <div className="portal-disc-fill" style={{ width: `${p}%`, background: d.color }} />
      </div>
      <div className="portal-disc-parts">
        {parts.map((pt, i) => (
          <span key={pt.label}>
            {i > 0 && <span className="portal-disc-sep">·</span>}
            <strong>{pt.n}</strong> {pt.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function PortalSummary({ data, surface }) {
  const s = data.stats
  const journeyCount = data.modules.length
  const flowCount    = data.totalFlows
  const subtaskTotal = (s.uxTotal ?? 0) + (s.beTotal ?? 0) + (s.intTotal ?? 0)
  const subtaskDone  = (s.uxDone ?? 0) + (s.beDone ?? 0) + (s.intDone ?? 0)
  const started      = subtaskDone > 0
  const hasFlows     = flowCount > 0

  const statusLabel = started ? 'In progress' : hasFlows ? 'Ready to start' : 'Scoping'
  const statusTone  = started ? 'prog' : 'todo'

  // Per-discipline in-progress tally from the surface-scoped recap data.
  const inProgByDisc = {}
  for (const r of (data.inProgress ?? [])) {
    inProgByDisc[r.discipline] = (inProgByDisc[r.discipline] ?? 0) + 1
  }
  const closed     = (data.doneRecently ?? []).length
  const activeDisc = DISC.filter(d => (s[d.totalKey] ?? 0) > 0)

  const figures = [
    { n: journeyCount, label: journeyCount === 1 ? 'journey' : 'journeys' },
    { n: flowCount,    label: flowCount === 1 ? 'flow' : 'flows' },
    { n: subtaskTotal, label: subtaskTotal === 1 ? 'subtask' : 'subtasks' },
  ]

  return (
    <div className="card portal-summary">
      <div className="portal-summary-head">
        <div className="portal-summary-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3D9E52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Build Readiness
        </div>
        <span className={`badge badge-${statusTone === 'prog' ? 'prog' : 'todo'}`}>{statusLabel}</span>
      </div>

      <div className="portal-summary-body">
        <div className="portal-figures">
          {figures.map(f => (
            <div className="portal-figure" key={f.label}>
              <span className="portal-figure-n">{f.n}</span>
              <span className="portal-figure-label">{f.label}</span>
            </div>
          ))}
        </div>

        {subtaskTotal > 0 && (
          <div className="portal-streams">
            <div className="portal-streams-head">
              <span className="portal-streams-label">Discipline progress</span>
              <span className="portal-streams-note"><strong>{closed}</strong> closed since yesterday</span>
            </div>
            <div className="portal-disc-grid">
              {activeDisc.map(d => (
                <DisciplineCard key={d.key} d={d} stats={s} inProgByDisc={inProgByDisc} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
