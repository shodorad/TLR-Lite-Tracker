// Build-readiness panel for the portals hero. Where the mobile dashboard tracks
// a live weekly cadence, the portals are pre-build: the useful exec read is how
// much is scoped/broken-out plus a recap of what was just completed.

const DISC_CLASS = { UX: 'badge-ux', Backend: 'badge-be', Integration: 'badge-int', Frontend: 'badge-fe' }

export default function PortalSummary({ data, surface }) {
  const s = data.stats
  const moduleCount      = data.modules.length
  const modulesWithFlows = data.modules.filter(m => m.flowKeys.size > 0).length
  const flowCount        = data.totalFlows
  const subtaskTotal     = (s.uxTotal ?? 0) + (s.beTotal ?? 0) + (s.intTotal ?? 0) + (s.feTotal ?? 0)
  const subtaskDone      = (s.uxDone ?? 0) + (s.beDone ?? 0) + (s.intDone ?? 0) + (s.feDone ?? 0)
  const started          = subtaskDone > 0

  const hasFlows = flowCount > 0

  const verdict = !hasFlows
    ? `All ${moduleCount} modules are scoped in Jira. Flows and subtasks haven't been broken out yet.`
    : started
      ? `${subtaskDone} of ${subtaskTotal} subtasks complete across ${flowCount} flows.`
      : `${flowCount} flows across ${modulesWithFlows} of ${moduleCount} modules are fully specced. Engineering hasn't started.`

  const statusLabel = started ? 'In progress' : hasFlows ? 'Ready to start' : 'Scoping'
  const statusTone  = started ? 'prog' : 'todo'

  const recent = data.doneRecently ?? []

  const figures = [
    { n: moduleCount,  label: moduleCount === 1 ? 'module' : 'modules' },
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
        <p className="portal-verdict">{verdict}</p>

        <div className="portal-figures">
          {figures.map(f => (
            <div className="portal-figure" key={f.label}>
              <span className="portal-figure-n">{f.n}</span>
              <span className="portal-figure-label">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="portal-recent">
          <div className="portal-recent-head">
            <span className="portal-recent-label">Issues completed since yesterday</span>
            <span className="portal-recent-count">{recent.length}</span>
          </div>
          {recent.length === 0 ? (
            <p className="portal-recent-empty">No issues completed in the last day.</p>
          ) : (
            <ul className="portal-recent-list">
              {recent.map(r => (
                <li className="portal-recent-item" key={r.key}>
                  <span className={`badge ${DISC_CLASS[r.discipline] ?? 'badge-todo'}`}>{r.discipline}</span>
                  <span className="portal-recent-name" title={r.flowName}>
                    {r.flowCode ? `${r.flowCode} · ` : ''}{r.flowName}
                  </span>
                  <span className="portal-recent-key">{r.key}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
