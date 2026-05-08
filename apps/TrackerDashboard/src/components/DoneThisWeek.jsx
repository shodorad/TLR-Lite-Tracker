import { useState, Fragment } from 'react'

const DISC_CLASS = { UX: 'badge-ux', Backend: 'badge-be', Integration: 'badge-int' }

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function groupByFlow(issues) {
  const map = {}
  for (const iss of issues) {
    const flowKey  = iss.fields.parent?.key ?? '—'
    const flowName = iss.fields.parent?.fields?.summary ?? flowKey
    if (!map[flowKey]) {
      map[flowKey] = { flowKey, flowName, uxCount: 0, backendCount: 0, integrationCount: 0, tickets: [] }
    }
    const disc = (iss.fields.summary ?? '').trim()
    if (disc === 'UX') map[flowKey].uxCount++
    else if (disc === 'Backend') map[flowKey].backendCount++
    else if (disc === 'Integration') map[flowKey].integrationCount++
    map[flowKey].tickets.push(iss)
  }
  return Object.values(map).sort((a, b) => a.flowName.localeCompare(b.flowName))
}

function CountDot({ n, cls }) {
  return <span className={`count-dot ${cls}`}>{n}</span>
}

function TicketSubTable({ tickets }) {
  return (
    <tr className="flow-group-detail">
      <td colSpan={6}>
        <table className="subtask-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Discipline</th>
              <th>Assignee</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(iss => {
              const disc = (iss.fields.summary ?? '').trim()
              const who  = iss.fields.assignee?.displayName ?? 'Unassigned'
              const when = fmtDate(iss.fields.statuscategorychangedate ?? iss.fields.resolutiondate)
              return (
                <tr key={iss.key}>
                  <td><span className="tkey">{iss.key}</span></td>
                  <td><span className={`badge ${DISC_CLASS[disc] ?? 'badge-todo'}`}>{disc}</span></td>
                  <td>{who}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{when}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </td>
    </tr>
  )
}

export default function DoneThisWeek({ issues }) {
  const [expanded, setExpanded] = useState(new Set())

  function toggleFlow(flowKey) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(flowKey)) next.delete(flowKey)
      else next.add(flowKey)
      return next
    })
  }

  const groups = groupByFlow(issues)

  return (
    <div>
      <div style={{ padding: '4px 22px 8px', borderBottom: '1px solid rgba(0,0,0,.05)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <span className="badge badge-blue" style={{ fontSize: 11 }}>
          {groups.length} {groups.length === 1 ? 'flow' : 'flows'} · {issues.length} tickets
        </span>
      </div>

      {issues.length === 0 ? (
        <div className="empty">No subtasks completed in the selected date range.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 28 }} />
                <th>Flow</th>
                <th style={{ textAlign: 'center' }}>UX</th>
                <th style={{ textAlign: 'center' }}>Backend</th>
                <th style={{ textAlign: 'center' }}>Integration</th>
                <th style={{ textAlign: 'center' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {groups.map(g => {
                const isOpen = expanded.has(g.flowKey)
                const flowName = g.flowName.replace(/^F-\d+\s*/, '')
                return (
                  <Fragment key={g.flowKey}>
                    <tr
                      className={`flow-group-row${isOpen ? ' is-open' : ''}`}
                      onClick={() => toggleFlow(g.flowKey)}
                    >
                      <td className="flow-chevron-cell">
                        <span className={`chevron ${isOpen ? '' : 'collapsed'}`}>▼</span>
                      </td>
                      <td className="flow-name-cell">{flowName}</td>
                      <td className="flow-count-cell">
                        {g.uxCount > 0 ? <CountDot n={g.uxCount} cls="dot-ux" /> : <span className="muted-dash">—</span>}
                      </td>
                      <td className="flow-count-cell">
                        {g.backendCount > 0 ? <CountDot n={g.backendCount} cls="dot-be" /> : <span className="muted-dash">—</span>}
                      </td>
                      <td className="flow-count-cell">
                        {g.integrationCount > 0 ? <CountDot n={g.integrationCount} cls="dot-int" /> : <span className="muted-dash">—</span>}
                      </td>
                      <td className="flow-count-cell">
                        <CountDot n={g.uxCount + g.backendCount + g.integrationCount} cls="dot-total" />
                      </td>
                    </tr>
                    {isOpen && <TicketSubTable key={`${g.flowKey}-detail`} tickets={g.tickets} />}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
