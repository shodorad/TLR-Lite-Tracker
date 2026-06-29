import { pct } from '../dataProcessor.js'

// Each Global-Refinements flow can carry up to four discipline subtasks. We read
// their per-flow status only to roll a flow up into a single line item with one
// status — the disciplines are no longer surfaced as separate cards.
const DISC_FIELDS = [
  { statusKey: 'ux',          doneKey: 'uxDone' },
  { statusKey: 'frontend',    doneKey: 'feDone' },
  { statusKey: 'backend',     doneKey: 'beDone' },
  { statusKey: 'integration', doneKey: 'intDone' },
]

const STATE_LABEL = { done: 'Done', prog: 'In Progress', todo: 'To Do' }
const STATE_CLASS = { done: 'badge-done', prog: 'badge-prog', todo: 'badge-todo' }

// Collapse a flow's discipline subtasks into one status + a done/total count.
function rollup(flow) {
  const present = DISC_FIELDS.filter(d => flow[d.statusKey] != null)
  const total   = present.length
  const done    = present.filter(d => flow[d.doneKey]).length
  const anyProg = present.some(d => (flow[d.statusKey] ?? '').toLowerCase().includes('progress'))
  let state = 'todo'
  if (total > 0 && done === total) state = 'done'
  else if (anyProg || done > 0)    state = 'prog'
  return { total, done, state }
}

// Standalone widget for the "Global Refinements" journey — pulled out of Journey
// Health so the cross-cutting polish work reads on its own rather than skewing the
// per-journey chart. Renders nothing when the epic isn't present on this surface.
export default function GlobalRefinements({ module, flows = [] }) {
  if (!module) return null

  // Progress is measured by flow tickets, not the underlying discipline subtasks:
  // a flow counts as done only when every discipline subtask it carries is done.
  const flowTotal = flows.length
  const flowsDone = flows.filter(f => rollup(f).state === 'done').length
  const overall   = pct(flowsDone, flowTotal)
  const remaining = flowTotal - flowsDone

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.9 4.8L18.7 9l-4.8 1.9L12 15.7 10.1 10.9 5.3 9l4.8-1.2z"/>
            <path d="M18 14l.8 2 2 .8-2 .8L18 20l-.8-2-2-.8 2-.8z"/>
          </svg>
          {module.name}
        </span>
        <span className="badge badge-done" style={{ fontSize: 11, padding: '4px 12px', fontWeight: 600 }}>
          {flowsDone} / {flowTotal} done
        </span>
      </div>

      <div style={{ padding: '14px 20px 20px' }}>
        {/* Overview row: headline % + context, then a single overall progress bar */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
          <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1, color: '#111', fontVariantNumeric: 'tabular-nums' }}>
            {overall}%
          </span>
          <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
            complete · {remaining} task{remaining === 1 ? '' : 's'} remaining
          </span>
        </div>

        <div style={{ height: 8, borderRadius: 999, overflow: 'hidden', background: 'rgba(0,0,0,.07)', marginBottom: 18 }}>
          <div style={{ width: `${overall}%`, height: '100%', background: '#7C3AED', borderRadius: 999, transition: 'width .7s cubic-bezier(.16,1,.3,1)' }} />
        </div>

        {/* Line-item task list — one row per refinement item with its status */}
        {flows.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>No refinement items yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {flows.map((f, i) => {
              const r    = rollup(f)
              const name = f.name.replace(/^F-\d+\s*/, '').trim() || f.name
              return (
                <div
                  key={f.key}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '11px 2px',
                    borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,.06)',
                  }}
                >
                  <span className="tkey">{f.code}</span>
                  <span
                    style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 500, color: '#1A1A2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={name}
                  >
                    {name}
                  </span>
                  <span className={`badge ${STATE_CLASS[r.state]}`}>{STATE_LABEL[r.state]}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
