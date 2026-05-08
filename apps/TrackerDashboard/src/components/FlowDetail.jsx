import { useState } from 'react'
import { pct, colorForPct, MODULE_ORDER, MODULE_COLORS } from '../dataProcessor.js'

const STATUS_BADGE = {
  done:         <span className="badge badge-done">Done</span>,
  progress:     <span className="badge badge-prog">In Progress</span>,
  todo:         <span className="badge badge-todo">To Do</span>,
  empty:        <span className="badge badge-todo">—</span>,
}

function statusBadge(s) {
  if (!s) return STATUS_BADGE.empty
  const l = s.toLowerCase()
  if (l.includes('done')) return STATUS_BADGE.done
  if (l.includes('progress')) return STATUS_BADGE.progress
  return STATUS_BADGE.todo
}

function hasProgress(f) {
  return (
    f.ux === 'Done' || f.backend === 'Done' || f.integration === 'Done' ||
    (f.ux ?? '').includes('Progress') ||
    (f.backend ?? '').includes('Progress') ||
    (f.integration ?? '').includes('Progress')
  )
}

function ProgressBar({ done, total }) {
  const p = pct(done, total)
  const c = colorForPct(p)
  return (
    <div className="pb-wrap">
      <div className="pb">
        <div className={`pb-fill ${c}`} style={{ width: `${p}%` }} />
      </div>
      <span className={`pb-pct ${c}`}>{p}%</span>
    </div>
  )
}

export default function FlowDetail({ flows }) {
  const [filter, setFilter] = useState('active')
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('flowDetailCollapsed') !== 'false'
  )

  function toggleCollapsed() {
    setCollapsed(c => {
      const next = !c
      localStorage.setItem('flowDetailCollapsed', String(next))
      return next
    })
  }

  const shown = filter === 'active' ? flows.filter(hasProgress) : flows

  return (
    <div className="card">
      <div
        className="card-header clickable"
        onClick={toggleCollapsed}
      >
        <span className="card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(67% 0.17 155)" strokeWidth="2.5">
            <polyline points="16 3 21 3 21 8"/>
            <line x1="4" y1="20" x2="21" y2="3"/>
            <polyline points="21 16 21 21 16 21"/>
            <line x1="15" y1="15" x2="21" y2="21"/>
          </svg>
          Flow Detail Breakdown
          <span className={`chevron ${collapsed ? 'collapsed' : ''}`}>▼</span>
        </span>
        <div className="card-controls" onClick={e => e.stopPropagation()}>
          <div className="tog">
            <button
              className={`tog-btn ${filter === 'active' ? 'on' : ''}`}
              onClick={() => setFilter('active')}
            >
              With Progress
            </button>
            <button
              className={`tog-btn ${filter === 'all' ? 'on' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Flows
            </button>
          </div>
          <span className="badge badge-blue">{shown.length} / 65</span>
        </div>
      </div>

      {!collapsed && (
        shown.length === 0 ? (
          <div className="empty">
            No flows with progress yet.{' '}
            <span
              style={{ color: 'var(--blue)', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setFilter('all')}
            >
              Show all 65 →
            </span>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>F-###</th>
                  <th>Flow Name</th>
                  <th>Module</th>
                  <th>UX</th>
                  <th>Backend</th>
                  <th>Integration</th>
                  <th style={{ minWidth: 110 }}>% Complete</th>
                </tr>
              </thead>
              <tbody>
                {shown.map(f => {
                  const mIdx = MODULE_ORDER.indexOf(f.module)
                  const dotColor = mIdx >= 0 ? MODULE_COLORS[mIdx] : '#94A3B8'
                  const doneN = [f.ux, f.backend, f.integration].filter(s => s === 'Done').length
                  const flowName = f.name.replace(/^F-\d+\s*/, '')
                  return (
                    <tr key={f.key}>
                      <td><span className="tkey">{f.code}</span></td>
                      <td
                        style={{ maxWidth: 210, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={flowName}
                      >
                        {flowName}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span className="mdot" style={{ background: dotColor }} />
                          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{f.module}</span>
                        </div>
                      </td>
                      <td>{statusBadge(f.ux)}</td>
                      <td>{statusBadge(f.backend)}</td>
                      <td>{statusBadge(f.integration)}</td>
                      <td><ProgressBar done={doneN} total={3} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}
