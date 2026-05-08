import { Bar } from 'react-chartjs-2'
import { pct } from '../dataProcessor.js'

const DISC_COLORS = {
  ux:          { bg: 'rgba(61,158,82,.75)',   zero: 'rgba(61,158,82,.15)'  },
  backend:     { bg: 'rgba(43,108,176,.75)',  zero: 'rgba(43,108,176,.15)' },
  integration: { bg: 'rgba(212,146,10,.75)',  zero: 'rgba(212,146,10,.15)' },
}

// Per-discipline label colors (green / blue / amber)
const LABEL_COLORS = ['#267339', '#1A4F8A', '#8C5E00']

// Which module fields to read per dataset index
const DISC_FIELDS = [
  { doneKey: 'uxD', totalKey: 'uxT' },
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

  // Plugin B: per-bar "X of Y" labels at the right end of each bar
  const barEndLabels = {
    id: 'barEndLabels',
    afterDraw(chart) {
      const { ctx } = chart
      ctx.save()
      chart.data.datasets.forEach((_, di) => {
        const meta = chart.getDatasetMeta(di)
        if (meta.hidden) return
        const { doneKey, totalKey } = DISC_FIELDS[di]
        const color = LABEL_COLORS[di]

        meta.data.forEach((bar, i) => {
          const m = modules[i]
          if (!m) return
          const total = m[totalKey]
          const done  = m[doneKey]
          if (total === 0 || done === 0) return

          ctx.font = "600 10px 'Inter', sans-serif"
          ctx.fillStyle = color
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillText(`${done} of ${total} completed`, bar.x + 6, bar.y)
        })
      })
      ctx.restore()
    },
  }

  const shared = {
    borderWidth: 0,
    borderRadius: 6,
    borderSkipped: false,
    barPercentage: 0.85,
    categoryPercentage: 0.60,
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
    layout: { padding: { right: 110 } },
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
          <span className="badge badge-be">Backend</span>
          <span className="badge badge-int">Integration</span>
        </div>
      </div>
      <div style={{ padding: '16px 20px 22px' }}>
        <div style={{ height: 680 }}>
          <Bar data={data} options={options} plugins={[twoLineLabel, barEndLabels]} />
        </div>
      </div>
    </div>
  )
}
