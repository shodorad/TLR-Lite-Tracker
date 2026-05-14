import { Bar } from 'react-chartjs-2'
import { pct } from '../dataProcessor.js'

const DISC_COLORS = {
  ux:          { bg: 'rgba(61,158,82,.75)',    zero: 'rgba(61,158,82,.15)'   },
  backend:     { bg: 'rgba(43,108,176,.75)',   zero: 'rgba(43,108,176,.15)'  },
  integration: { bg: 'rgba(212,146,10,.75)',   zero: 'rgba(212,146,10,.15)'  },
  frontend:    { bg: 'rgba(124,58,237,.75)',   zero: 'rgba(124,58,237,.15)'  },
}

// Per-discipline label colors (green / purple / blue / amber)
const LABEL_COLORS = ['#267339', '#5B21B6', '#1A4F8A', '#8C5E00']

// Which module fields to read per dataset index
const DISC_FIELDS = [
  { doneKey: 'uxD', totalKey: 'uxT' },
  { doneKey: 'feD', totalKey: 'feT' },
  { doneKey: 'beD', totalKey: 'beT' },
  { doneKey: 'inD', totalKey: 'inT' },
]

export default function ModuleHealthChart({ modules }) {
  const labels = modules.map(m => m.name)

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
  const PILL_STYLES = [
    { bg: 'rgba(61,158,82,.18)',   text: '#267339' },   // UX — green
    { bg: 'rgba(124,58,237,.18)',  text: '#5B21B6' },   // Frontend — purple
    { bg: 'rgba(43,108,176,.18)',  text: '#1A4F8A' },   // Backend — blue
    { bg: 'rgba(212,146,10,.18)',  text: '#8C5E00' },   // Integration — amber
  ]

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
        const { doneKey, totalKey } = DISC_FIELDS[di]
        const { bg, text } = PILL_STYLES[di]

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
    datasets: [
      {
        label: 'UX',
        data: modules.map(m => pct(m.uxD, m.uxT)),
        backgroundColor: modules.map(m => pct(m.uxD, m.uxT) === 0 ? DISC_COLORS.ux.zero : DISC_COLORS.ux.bg),
        ...shared,
      },
      {
        label: 'Frontend',
        data: modules.map(m => pct(m.feD, m.feT)),
        backgroundColor: modules.map(m => pct(m.feD, m.feT) === 0 ? DISC_COLORS.frontend.zero : DISC_COLORS.frontend.bg),
        ...shared,
      },
      {
        label: 'Backend',
        data: modules.map(m => pct(m.beD, m.beT)),
        backgroundColor: modules.map(m => pct(m.beD, m.beT) === 0 ? DISC_COLORS.backend.zero : DISC_COLORS.backend.bg),
        ...shared,
      },
      {
        label: 'Integration',
        data: modules.map(m => pct(m.inD, m.inT)),
        backgroundColor: modules.map(m => pct(m.inD, m.inT) === 0 ? DISC_COLORS.integration.zero : DISC_COLORS.integration.bg),
        ...shared,
      },
    ],
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
          Journey Health
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="badge badge-ux">UX</span>
          <span className="badge" style={{ background: 'rgba(124,58,237,.12)', color: '#5B21B6' }}>Frontend</span>
          <span className="badge badge-be">Backend</span>
          <span className="badge badge-int">Integration</span>
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
