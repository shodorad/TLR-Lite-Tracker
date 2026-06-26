import { Doughnut } from 'react-chartjs-2'
import { pct } from '../dataProcessor.js'

const DISC = [
  { key: 'ux',  label: 'UX',          doneKey: 'uxDone',  totalKey: 'uxTotal',  color: '#3D9E52', bg: 'rgba(61,158,82,0.11)',   fg: '#267339' },
  { key: 'fe',  label: 'Frontend',    doneKey: 'feDone',  totalKey: 'feTotal',  color: '#7C3AED', bg: 'rgba(124,58,237,0.11)',  fg: '#5B21B6' },
  { key: 'be',  label: 'Backend',     doneKey: 'beDone',  totalKey: 'beTotal',  color: '#2B6CB0', bg: 'rgba(43,108,176,0.11)',  fg: '#1A4F8A' },
  { key: 'int', label: 'Integration', doneKey: 'intDone', totalKey: 'intTotal', color: '#D4920A', bg: 'rgba(212,146,10,0.11)',  fg: '#8C5E00' },
]

export default function OverallProgress({ stats, totalFlows = 0, journeyCount = 0, journeyNoun = 'journeys' }) {
  // Data-driven: only show disciplines that actually have subtasks on this
  // surface. Portals have no Frontend, so it drops off automatically; mobile
  // (65 Frontend subtasks) keeps all four.
  const disc = DISC.filter(d => (stats[d.totalKey] ?? 0) > 0)
  const totalDone = disc.reduce((sum, d) => sum + (stats[d.doneKey] ?? 0), 0)
  // Sum of subtasks that actually exist per discipline — not totalFlows × 4,
  // which assumes every flow has all four disciplines.
  const TOTAL_TASKS = disc.reduce((sum, d) => sum + (stats[d.totalKey] ?? 0), 0)
  const totalPct  = pct(totalDone, TOTAL_TASKS)
  const remaining = TOTAL_TASKS - totalDone

  // 0% reads as "not started" (neutral), not "blocked" (red) — DESIGN.md status rule.
  const gaugeColor = totalPct === 0 ? '#CCCCCC' : totalPct > 75 ? '#3D9E52' : totalPct >= 25 ? '#D4920A' : '#E05252'

  // With no tasks at all (a not-yet-broken-out portal), [0,0] would render no ring.
  // Fall back to a full neutral track so the gauge still reads as "empty", not missing.
  const gaugeData = TOTAL_TASKS === 0 ? [0, 1] : [totalDone, remaining]

  const chartData = {
    datasets: [{
      data: gaugeData,
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
    <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 344 }}>

      {/* Header */}
      <div style={{ padding: '12px 16px 8px', background: 'rgba(61,158,82,.05)', borderBottom: '1px solid rgba(61,158,82,.1)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.01em', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3D9E52" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12l3 3 5-5"/>
          </svg>
          Overall Progress
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{disc.length} disciplines · {totalFlows} flows</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'stretch', padding: '12px 16px', gap: 18, flex: 1, minHeight: 0 }}>

        {/* Left: donut gauge — vertically centered in the full card height */}
        <div style={{ width: 160, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 160, height: 160 }}>
            <Doughnut data={chartData} options={chartOptions} />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: 40, fontWeight: 800, color: '#111111',
                lineHeight: 1, letterSpacing: '-.04em',
                fontFamily: "'Inter', sans-serif",
                fontVariantNumeric: 'tabular-nums',
              }}>
                {totalPct}%
              </span>
              <span style={{ fontSize: 11, color: '#777', fontWeight: 600, marginTop: 4, letterSpacing: '.04em', textTransform: 'uppercase' }}>
                complete
              </span>
            </div>
          </div>
        </div>

        {/* Right: top group (context + badge + bar), disc grid below */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, minWidth: 0 }}>

          {/* Top: overview cluster — context tight, then badge+bar grouped below */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                <strong style={{ color: '#333', fontWeight: 600 }}>{totalFlows} flows</strong>
                {' '}across{' '}
                <strong style={{ color: '#333', fontWeight: 600 }}>{journeyCount} {journeyNoun}</strong>
              </p>
              <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, marginTop: 2 }}>
                {remaining} tasks remaining
              </p>
            </div>

            <span className="badge badge-done" style={{ fontSize: 11, padding: '4px 12px', fontWeight: 600, alignSelf: 'flex-start', marginTop: 10 }}>
              {totalDone} / {TOTAL_TASKS} done
            </span>

            <div style={{ height: 8, borderRadius: 999, overflow: 'hidden', background: 'rgba(0,0,0,.07)', display: 'flex', marginTop: 6 }}>
              {disc.map(d => {
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

          {/* Bottom: discipline breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {disc.map(d => {
              const p = pct(stats[d.doneKey], stats[d.totalKey])
              return (
                <div key={d.key} style={{ background: d.bg, borderRadius: 8, padding: '7px 10px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: d.fg, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: d.fg, lineHeight: 1, letterSpacing: '-.04em', fontFamily: "'Inter', sans-serif", fontVariantNumeric: 'tabular-nums' }}>
                    {p}%
                  </div>
                  <div style={{ fontSize: 12, color: d.fg, opacity: .75, marginTop: 3, fontWeight: 600 }}>
                    {stats[d.doneKey]}/{stats[d.totalKey]}
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </div>
  )
}
