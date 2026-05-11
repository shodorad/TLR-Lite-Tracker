import { Doughnut } from 'react-chartjs-2'
import { pct, TOTAL_FLOWS } from '../dataProcessor.js'

const DISC = [
  { key: 'ux',  label: 'UX',          doneKey: 'uxDone',  color: '#3D9E52', bg: 'rgba(61,158,82,0.11)',   fg: '#267339' },
  { key: 'be',  label: 'Backend',     doneKey: 'beDone',  color: '#2B6CB0', bg: 'rgba(43,108,176,0.11)',  fg: '#1A4F8A' },
  { key: 'int', label: 'Integration', doneKey: 'intDone', color: '#D4920A', bg: 'rgba(212,146,10,0.11)',  fg: '#8C5E00' },
  { key: 'fe',  label: 'Frontend',    doneKey: 'feDone',  color: '#7C3AED', bg: 'rgba(124,58,237,0.11)',  fg: '#5B21B6' },
]

export default function OverallProgress({ stats }) {
  const totalDone = DISC.reduce((sum, d) => sum + (stats[d.doneKey] ?? 0), 0)
  const TOTAL_TASKS = TOTAL_FLOWS * DISC.length
  const totalPct  = pct(totalDone, TOTAL_TASKS)
  const remaining = TOTAL_TASKS - totalDone

  const gaugeColor = totalPct > 75 ? '#3D9E52' : totalPct >= 25 ? '#D4920A' : '#E05252'

  const chartData = {
    datasets: [{
      data: [totalDone, remaining],
      backgroundColor: [gaugeColor, 'rgba(0,0,0,.07)'],
      borderWidth: 0,
      hoverBackgroundColor: [gaugeColor, 'rgba(0,0,0,.07)'],
    }],
  }

  const chartOptions = {
    cutout: '62%',   /* thicker ring — point 5 */
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: { duration: 900, easing: 'easeInOutQuart' },
  }

  return (
    <div className="card">
      <div style={{ padding: '28px 24px 20px', textAlign: 'center' }}>

        {/* Hero gauge — large, centred like DF's credit score ring */}
        <div style={{ position: 'relative', width: 196, height: 196, margin: '0 auto 20px' }}>
          <Doughnut data={chartData} options={chartOptions} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Point 3: extreme size contrast — 68px hero number */}
            <span style={{
              fontSize: 46, fontWeight: 800, color: '#111111',
              lineHeight: 1, letterSpacing: '-.04em',
              fontFamily: "'Inter', sans-serif",
            }}>
              {totalPct}%
            </span>
            <span style={{ fontSize: 11, color: '#999', fontWeight: 500, marginTop: 5, letterSpacing: '.02em', textTransform: 'uppercase' }}>
              complete
            </span>
          </div>
        </div>

        {/* Context line */}
        <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>
          <strong style={{ color: '#111', fontWeight: 700 }}>{TOTAL_FLOWS} flows</strong>
          {' '}across{' '}
          <strong style={{ color: '#111', fontWeight: 700 }}>10 modules</strong>
        </p>
        <p style={{ fontSize: 12, color: '#999999', fontWeight: 500, marginTop: 3 }}>
          {remaining} tasks remaining
        </p>

        {/* Done badge */}
        <div style={{ marginTop: 16 }}>
          <span className="badge badge-done" style={{ fontSize: 12, padding: '5px 14px', fontWeight: 600 }}>
            {totalDone} / {TOTAL_TASKS} done
          </span>
        </div>
      </div>

      {/* Stacked progress bar */}
      <div style={{ padding: '0 24px' }}>
        <div style={{
          height: 10, borderRadius: 999, overflow: 'hidden',
          background: 'rgba(0,0,0,.07)', display: 'flex',
        }}>
          {DISC.map(d => {
            const seg = pct(stats[d.doneKey], TOTAL_TASKS)
            return (
              <div key={d.key} style={{
                width: `${seg}%`, background: d.color,
                transition: 'width .7s cubic-bezier(.16,1,.3,1)',
              }} />
            )
          })}
        </div>
      </div>

      {/* Discipline mini-tiles */}
      <div style={{ display: 'flex', gap: 10, padding: '14px 24px 24px' }}>
        {DISC.map(d => {
          const p = pct(stats[d.doneKey], TOTAL_FLOWS)
          return (
            <div key={d.key} style={{
              flex: 1, background: d.bg, borderRadius: 10,
              padding: '11px 13px',
            }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: d.fg, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>
                {d.label}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: d.fg, lineHeight: 1, letterSpacing: '-.04em', fontFamily: "'Inter', sans-serif" }}>
                {p}%
              </div>
              <div style={{ fontSize: 10.5, color: d.fg, opacity: .65, marginTop: 3 }}>
                {stats[d.doneKey]}/{TOTAL_FLOWS}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
