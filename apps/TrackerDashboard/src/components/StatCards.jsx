import { pct, colorForPct, PCT_HEX, TOTAL_FLOWS } from '../dataProcessor.js'

const CARDS = [
  { label: 'UX',          doneKey: 'uxDone'  },
  { label: 'Frontend',    doneKey: 'feDone'  },
  { label: 'Backend',     doneKey: 'beDone'  },
  { label: 'Integration', doneKey: 'intDone' },
]

function StatCard({ label, done }) {
  const p   = pct(done, TOTAL_FLOWS)
  const col = colorForPct(p)
  const hex = PCT_HEX[col]

  return (
    <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
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

      <div style={{ flex: 1, minWidth: 0 }}>
        <span className="stat-name" style={{ margin: '0 0 8px', display: 'block' }}>{label}</span>
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
        <StatCard key={c.label} label={c.label} done={stats[c.doneKey]} />
      ))}
    </div>
  )
}
