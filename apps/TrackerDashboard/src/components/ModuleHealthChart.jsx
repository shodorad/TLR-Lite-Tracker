import { Bar } from 'react-chartjs-2'
import { pct } from '../dataProcessor.js'

// One row per discipline — bar/zero fills, end-pill colors, and the module
// fields each reads. Order is the display order of the bars.
const DISC = [
  { key: 'ux',  label: 'UX',          doneKey: 'uxD', totalKey: 'uxT', bar: 'rgba(61,158,82,.75)',  zero: 'rgba(61,158,82,.15)',  pillBg: 'rgba(61,158,82,.18)',  pillText: '#267339', badge: { className: 'badge-ux' } },
  { key: 'fe',  label: 'Frontend',    doneKey: 'feD', totalKey: 'feT', bar: 'rgba(124,58,237,.75)', zero: 'rgba(124,58,237,.15)', pillBg: 'rgba(124,58,237,.18)', pillText: '#5B21B6', badge: { style: { background: 'rgba(124,58,237,.12)', color: '#5B21B6' } } },
  { key: 'be',  label: 'Backend',     doneKey: 'beD', totalKey: 'beT', bar: 'rgba(43,108,176,.75)', zero: 'rgba(43,108,176,.15)', pillBg: 'rgba(43,108,176,.18)', pillText: '#1A4F8A', badge: { className: 'badge-be' } },
  { key: 'int', label: 'Integration', doneKey: 'inD', totalKey: 'inT', bar: 'rgba(212,146,10,.75)', zero: 'rgba(212,146,10,.15)', pillBg: 'rgba(212,146,10,.18)', pillText: '#8C5E00', badge: { className: 'badge-int' } },
]

export default function ModuleHealthChart({ modules, title = 'Journey Health' }) {
  const labels = modules.map(m => m.name)

  // Data-driven: only chart disciplines that have subtasks on this surface
  // (drops Frontend from the portals, keeps it on mobile).
  const activeDisc = DISC.filter(d => modules.some(m => (m[d.totalKey] ?? 0) > 0))

  // Plugin A: y-axis 2-line labels (journey name + total flows done)
  const twoLineLabel = {
    id: 'twoLineLabel',
    afterDraw(chart) {
      const { ctx, scales: { y } } = chart
      if (!y) return
      const x = y.right - 8
      ctx.save()
      for (let i = 0; i < y.ticks.length; i++) {
        const m = modules[i]
        if (!m) continue
        const pixelY = y.getPixelForTick(i)

        ctx.textAlign = 'right'
        ctx.font = "600 11.5px 'Inter', sans-serif"
        ctx.fillStyle = '#1A1A1A'
        ctx.textBaseline = 'middle'
        ctx.fillText(m.name, x, pixelY)
      }
      ctx.restore()
    },
  }

  // Plugin B: colored pill labels in fixed right column — one per bar
  function pillRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arcTo(x + w, y, x + w, y + r, r)
    ctx.lineTo(x + w, y + h - r)
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
    ctx.lineTo(x + r, y + h)
    ctx.arcTo(x, y + h, x, y + h - r, r)
    ctx.lineTo(x, y + r)
    ctx.arcTo(x, y, x + r, y, r)
    ctx.closePath()
  }

  const barEndLabels = {
    id: 'barEndLabels',
    afterDraw(chart) {
      const { ctx, chartArea } = chart
      if (!chartArea) return
      ctx.save()

      chart.data.datasets.forEach((_, di) => {
        const meta = chart.getDatasetMeta(di)
        if (meta.hidden) return
        const { doneKey, totalKey, pillBg: bg, pillText: text } = activeDisc[di]

        meta.data.forEach((bar, i) => {
          const m = modules[i]
          if (!m || m[totalKey] === 0) return

          const done  = m[doneKey]
          const total = m[totalKey]
          const label = `${done} / ${total}`

          ctx.font = "600 10.5px 'Inter', sans-serif"
          const tw = ctx.measureText(label).width
          const pH = 17
          const pW = tw + 14
          const pR = pH / 2
          const px = chartArea.right + 10
          const py = bar.y - pH / 2

          pillRoundRect(ctx, px, py, pW, pH, pR)
          ctx.fillStyle = bg
          ctx.fill()

          ctx.fillStyle = text
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(label, px + pW / 2, bar.y)
        })
      })
      ctx.restore()
    },
  }

  const shared = {
    borderWidth: 0,
    borderRadius: 6,
    borderSkipped: false,
    barPercentage: 0.90,
    categoryPercentage: 0.82,
    minBarLength: 3,
  }

  const data = {
    labels,
    datasets: activeDisc.map(d => ({
      label: d.label,
      data: modules.map(m => pct(m[d.doneKey], m[d.totalKey])),
      backgroundColor: modules.map(m => pct(m[d.doneKey], m[d.totalKey]) === 0 ? d.zero : d.bar),
      ...shared,
    })),
  }

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { right: 135 } },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10, boxHeight: 10,
          borderRadius: 5, useBorderRadius: true,
          font: { size: 11.5, weight: '600', family: "'Inter', sans-serif" },
          color: '#666666',
          padding: 14,
        },
      },
      tooltip: {
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.x}%` },
      },
    },
    scales: {
      x: {
        min: 0, max: 100,
        ticks: {
          callback: v => `${v}%`,
          font: { size: 11, family: "'Inter', sans-serif" },
          color: '#999999',
          stepSize: 25,
        },
        grid: { color: 'rgba(0,0,0,.05)' },
        border: { color: 'rgba(0,0,0,.07)' },
      },
      y: {
        ticks: {
          color: 'transparent',
          font: { size: 11.5, family: "'Inter', sans-serif" },
          padding: 8,
          callback(val, idx) {
            const m = modules[idx]
            return m ? m.name : val
          },
        },
        grid: { display: false },
        border: { display: false },
      },
    },
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3D9E52" strokeWidth="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18M3 15h18M9 3v18"/>
          </svg>
          {title}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {activeDisc.map(d => (
            <span key={d.key} className={`badge${d.badge.className ? ` ${d.badge.className}` : ''}`} style={d.badge.style}>
              {d.label}
            </span>
          ))}
        </div>
      </div>
      <div style={{ padding: '16px 20px 22px' }}>
        <div style={{ height: Math.max(680, (modules?.length ?? 10) * 88) }}>
          <Bar data={data} options={options} plugins={[twoLineLabel, barEndLabels]} />
        </div>
      </div>
    </div>
  )
}
