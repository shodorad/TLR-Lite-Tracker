import { Doughnut } from 'react-chartjs-2'
import { pct, TOTAL_FLOWS } from '../dataProcessor.js'

const DEMO_DATE = new Date('2026-05-31T00:00:00')

function daysToDemo() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((DEMO_DATE - today) / 86_400_000))
}

const KPI_S = {
  label: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 },
  num:   { lineHeight: 1, letterSpacing: '-.04em', fontFamily: "'Inter', sans-serif", fontVariantNumeric: 'tabular-nums' },
  count: { fontSize: 10, opacity: .6, marginTop: 3, fontWeight: 500 },
  tile:  { borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
}

function flowsBehindForDemo(modules, rawFlows) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDates = {}
  for (const f of (rawFlows ?? [])) {
    const due = f.fields?.duedate ?? null
    const summary = (f.fields?.summary ?? '').trim()
    if (due) dueDates[summary] = due
  }
  let behind = 0
  for (const mod of (modules ?? [])) {
    const due = dueDates[mod.name]
    if (!due) continue
    const dueDate = new Date(due)
    dueDate.setHours(0, 0, 0, 0)
    if (today <= dueDate) continue
    behind += Math.max(0, mod.uxT - mod.uxD)
    behind += Math.max(0, mod.feT - mod.feD)
  }
  return behind
}

export default function DemoReadiness({ stats, flows, modules, rawFlows }) {
  const { uxDone = 0, feDone = 0 } = stats ?? {}
  const TOTAL_DEMO = TOTAL_FLOWS * 2
  const demoDone = uxDone + feDone
  const demoPct  = pct(demoDone, TOTAL_DEMO)
  const uxPct    = pct(uxDone, TOTAL_FLOWS)
  const fePct    = pct(feDone, TOTAL_FLOWS)
  const days     = daysToDemo()

  const atRisk = flowsBehindForDemo(modules, rawFlows)

  const chartData = {
    datasets: [{
      data: [demoDone, TOTAL_DEMO - demoDone],
      backgroundColor: ['#7c3aed', 'rgba(0,0,0,.07)'],
      borderWidth: 0,
      hoverBackgroundColor: ['#7c3aed', 'rgba(0,0,0,.07)'],
    }],
  }

  const chartOptions = {
    cutout: '62%',
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: { duration: 900, easing: 'easeInOutQuart' },
  }

  return (
    <div className="demo-panel">
      {/* Header */}
      <div className="demo-panel-header">
        <div className="demo-panel-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          Client Demo
        </div>
        <div className="demo-panel-sub">UX + Frontend · End of May</div>
      </div>

      {/* Content: 2×2 KPI grid (left) | full donut (right) */}
      <div style={{ display: 'flex', flex: 1, padding: '14px 18px 16px', gap: 16 }}>

        {/* Left: 2×2 KPI grid — top row primary (days/risk), bottom row discipline */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8 }}>

          {/* Days Left */}
          <div style={{ ...KPI_S.tile, background: 'rgba(124,58,237,.08)' }}>
            <div style={{ ...KPI_S.label, color: '#5B21B6' }}>Days Left</div>
            <div style={{ ...KPI_S.num, fontSize: 30, fontWeight: 800, color: '#7c3aed' }}>{days}</div>
          </div>

          {/* At Risk */}
          <div style={{ ...KPI_S.tile, background: 'rgba(224,82,82,.08)' }}>
            <div style={{ ...KPI_S.label, color: '#B83030' }}>At Risk</div>
            <div style={{ ...KPI_S.num, fontSize: 30, fontWeight: 800, color: '#E05252' }}>{atRisk}</div>
          </div>

          {/* UX */}
          <div style={{ ...KPI_S.tile, background: 'rgba(139,92,246,.1)' }}>
            <div style={{ ...KPI_S.label, color: '#5235A0' }}>UX</div>
            <div style={{ ...KPI_S.num, fontSize: 22, fontWeight: 800, color: '#5235A0' }}>{uxPct}%</div>
            <div style={{ ...KPI_S.count, color: '#5235A0' }}>{uxDone}/{TOTAL_FLOWS}</div>
          </div>

          {/* Frontend */}
          <div style={{ ...KPI_S.tile, background: 'rgba(124,58,237,.1)' }}>
            <div style={{ ...KPI_S.label, color: '#5B21B6' }}>Frontend</div>
            <div style={{ ...KPI_S.num, fontSize: 22, fontWeight: 800, color: '#5B21B6' }}>{fePct}%</div>
            <div style={{ ...KPI_S.count, color: '#5B21B6' }}>{feDone}/{TOTAL_FLOWS}</div>
          </div>

        </div>

        {/* Right: full donut + task count */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ position: 'relative', width: 150, height: 150 }}>
            <Doughnut data={chartData} options={chartOptions} />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: 30, fontWeight: 800, color: '#7c3aed',
                lineHeight: 1, letterSpacing: '-.04em',
                fontFamily: "'Inter', sans-serif",
                fontVariantNumeric: 'tabular-nums',
              }}>
                {demoPct}%
              </span>
              <span style={{
                fontSize: 9, color: '#7c3aed', fontWeight: 700,
                marginTop: 4, textTransform: 'uppercase', letterSpacing: '.07em', opacity: .7,
              }}>
                ready
              </span>
            </div>
          </div>
          <div className="demo-done-label">{demoDone} of {TOTAL_DEMO} done</div>
        </div>

      </div>
    </div>
  )
}
