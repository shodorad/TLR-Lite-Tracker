import { pct, colorForPct, PCT_HEX, TOTAL_FLOWS } from '../dataProcessor.js'

const CARDS = [
  { label: 'UX',          doneKey: 'uxDone',  impact: 'High impact',   impactCls: 'chip chip-high'   },
  { label: 'Backend',     doneKey: 'beDone',  impact: 'High impact',   impactCls: 'chip chip-high'   },
  { label: 'Integration', doneKey: 'intDone', impact: 'Medium impact', impactCls: 'chip chip-medium' },
]

function StatCard({ label, done, impact, impactCls }) {
  const p   = pct(done, TOTAL_FLOWS)
  const col = colorForPct(p)
  const hex = PCT_HEX[col]

  return (
    <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      {/* Big number — left anchor */}
      <div style={{ flexShrink: 0, minWidth: 72 }}>
        <div style={{
          fontSize: 44, fontWeight: 800, lineHeight: 1,
          letterSpacing: '-.04em', color: hex,
          fontFamily: "'Inter', sans-serif",
        }}>
          {p}%
        </div>
        <div style={{ fontSize: 11, color: '#BBBBBB', marginTop: 2, fontWeight: 500 }}>
          {done}/{TOTAL_FLOWS}
        </div>
      </div>

      {/* Label + chip + bar — right */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="stat-name" style={{ margin: 0 }}>{label}</span>
          <span className={impactCls}>{impact}</span>
        </div>
        <div className="stat-bar" style={{ margin: 0 }}>
          <div className="stat-bar-fill" style={{ width: `${p}%`, background: hex }} />
        </div>
      </div>
    </div>
  )
}

export default function StatCards({ stats }) {
  return (
    <div className="stat-row">
      {CARDS.map(c => (
        <StatCard key={c.label} label={c.label} done={stats[c.doneKey]} impact={c.impact} impactCls={c.impactCls} />
      ))}
    </div>
  )
}
