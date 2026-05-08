import { pct, colorForPct } from '../dataProcessor.js'

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

export default function ModuleRollup({ modules }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(57% 0.19 258)" strokeWidth="2.5">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
          Per-Module Rollup
        </span>
        <span className="badge badge-blue">10 Modules</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Module</th>
              <th style={{ textAlign: 'center' }}># Flows</th>
              <th style={{ minWidth: 130 }}>UX %</th>
              <th style={{ minWidth: 130 }}>Backend %</th>
              <th style={{ minWidth: 130 }}>Integration %</th>
              <th style={{ minWidth: 130 }}>Overall %</th>
            </tr>
          </thead>
          <tbody>
            {modules.map(m => (
              <tr key={m.name}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mdot" style={{ background: m.color }} />
                    <strong style={{ fontSize: 13 }}>{m.name}</strong>
                  </div>
                </td>
                <td style={{ textAlign: 'center', color: 'var(--muted)', fontWeight: 600 }}>
                  {m.flowKeys.size}
                </td>
                <td><ProgressBar done={m.uxD} total={m.uxT} /></td>
                <td><ProgressBar done={m.beD} total={m.beT} /></td>
                <td><ProgressBar done={m.inD} total={m.inT} /></td>
                <td>
                  <ProgressBar
                    done={m.uxD + m.beD + m.inD}
                    total={m.uxT + m.beT + m.inT}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
