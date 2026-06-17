import { pct } from '../dataProcessor.js'

// Build-readiness panel for the portals hero. Where the mobile dashboard tracks
// a live weekly cadence, the portals are pre-build: the useful exec read is
// "how far through the pipeline is this portal" — scoped, broken out, started.

function StageIcon({ state }) {
  if (state === 'done') {
    return (
      <span className="portal-stage-icon done" aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    )
  }
  if (state === 'partial') {
    return (
      <span className="portal-stage-icon partial" aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>
    )
  }
  return <span className="portal-stage-icon todo" aria-hidden="true" />
}

export default function PortalSummary({ data, surface }) {
  const s = data.stats
  const moduleCount      = data.modules.length
  const modulesWithFlows = data.modules.filter(m => m.flowKeys.size > 0).length
  const flowCount        = data.totalFlows
  const subtaskTotal     = (s.uxTotal ?? 0) + (s.beTotal ?? 0) + (s.intTotal ?? 0) + (s.feTotal ?? 0)
  const subtaskDone      = (s.uxDone ?? 0) + (s.beDone ?? 0) + (s.intDone ?? 0) + (s.feDone ?? 0)
  const started          = subtaskDone > 0
  const overallPct       = pct(subtaskDone, subtaskTotal)

  const hasFlows = flowCount > 0

  const verdict = !hasFlows
    ? `All ${moduleCount} modules are scoped in Jira. Flows and subtasks haven't been broken out yet.`
    : started
      ? `${subtaskDone} of ${subtaskTotal} subtasks complete across ${flowCount} flows.`
      : `${flowCount} flows across ${modulesWithFlows} of ${moduleCount} modules are fully specced. Engineering hasn't started.`

  const statusLabel = started ? 'In progress' : hasFlows ? 'Ready to start' : 'Scoping'
  const statusTone  = started ? 'prog' : 'todo'

  const stages = [
    {
      label: 'Modules scoped',
      detail: `${moduleCount} epic${moduleCount === 1 ? '' : 's'} defined`,
      state: moduleCount > 0 ? 'done' : 'todo',
    },
    {
      label: 'Flows broken out',
      detail: hasFlows
        ? `${modulesWithFlows} of ${moduleCount} modules · ${flowCount} flows`
        : 'Not started',
      state: modulesWithFlows === 0 ? 'todo' : modulesWithFlows === moduleCount ? 'done' : 'partial',
    },
    {
      label: 'Subtasks assigned',
      detail: subtaskTotal > 0 ? `${subtaskTotal} across UX · Backend · Integration` : 'Not started',
      state: subtaskTotal > 0 ? 'done' : 'todo',
    },
    {
      label: 'Engineering started',
      detail: started ? `${overallPct}% complete` : 'Not started',
      state: started ? (overallPct >= 100 ? 'done' : 'partial') : 'todo',
    },
  ]

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

        <div className="portal-stages">
          <div className="portal-stages-label">Pipeline</div>
          {stages.map(st => (
            <div className={`portal-stage ${st.state}`} key={st.label}>
              <StageIcon state={st.state} />
              <div className="portal-stage-text">
                <span className="portal-stage-name">{st.label}</span>
                <span className="portal-stage-detail">{st.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
