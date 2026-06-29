import { pct } from '../dataProcessor.js'

// Discipline config — mirrors OverallProgress, but reads the per-module field names
// (uxD/uxT …) the dataProcessor writes onto each journey bucket.
const DISC = [
  { key: 'ux',  label: 'UX',          doneKey: 'uxD', totalKey: 'uxT', color: '#3D9E52', bg: 'rgba(61,158,82,0.11)',  fg: '#267339' },
  { key: 'fe',  label: 'Frontend',    doneKey: 'feD', totalKey: 'feT', color: '#7C3AED', bg: 'rgba(124,58,237,0.11)', fg: '#5B21B6' },
  { key: 'be',  label: 'Backend',     doneKey: 'beD', totalKey: 'beT', color: '#2B6CB0', bg: 'rgba(43,108,176,0.11)', fg: '#1A4F8A' },
  { key: 'int', label: 'Integration', doneKey: 'inD', totalKey: 'inT', color: '#D4920A', bg: 'rgba(212,146,10,0.11)', fg: '#8C5E00' },
]

// Standalone widget for the "Global Refinements" journey — pulled out of Journey
// Health so the cross-cutting polish work reads on its own rather than skewing the
// per-journey chart. Renders nothing when the epic isn't present on this surface.
export default function GlobalRefinements({ module }) {
  if (!module) return null

  // Only show disciplines that actually carry subtasks (data-driven, like OverallProgress).
  const disc       = DISC.filter(d => (module[d.totalKey] ?? 0) > 0)
  const totalDone  = disc.reduce((sum, d) => sum + (module[d.doneKey] ?? 0), 0)
  const totalTasks = disc.reduce((sum, d) => sum + (module[d.totalKey] ?? 0), 0)
  const overall    = pct(totalDone, totalTasks)
  const flowTotal  = module.flowKeys?.size ?? 0

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.9 4.8L18.7 9l-4.8 1.9L12 15.7 10.1 10.9 5.3 9l4.8-1.2z"/>
            <path d="M18 14l.8 2 2 .8-2 .8L18 20l-.8-2-2-.8 2-.8z"/>
          </svg>
          {module.name}
        </span>
        <span className="badge badge-done" style={{ fontSize: 11, padding: '4px 12px', fontWeight: 600 }}>
          {totalDone} / {totalTasks} done
        </span>
      </div>

      <div style={{ padding: '14px 20px 20px' }}>
        {/* Overview row: headline % + context, then a segmented overall bar */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
          <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1, color: '#111', fontVariantNumeric: 'tabular-nums' }}>
            {overall}%
          </span>
          <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
            complete · {totalTasks - totalDone} task{totalTasks - totalDone === 1 ? '' : 's'} remaining
            {flowTotal > 0 ? ` · ${module.flowsDone} of ${flowTotal} flows done` : ''}
          </span>
        </div>

        <div style={{ height: 8, borderRadius: 999, overflow: 'hidden', background: 'rgba(0,0,0,.07)', display: 'flex', marginBottom: 16 }}>
          {disc.map(d => {
            const seg = pct(module[d.doneKey], totalTasks)
            return (
              <div key={d.key} style={{ width: `${seg}%`, background: d.color, transition: 'width .7s cubic-bezier(.16,1,.3,1)' }} />
            )
          })}
        </div>

        {/* Per-discipline cards */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${disc.length}, 1fr)`, gap: 8 }}>
          {disc.map(d => {
            const p = pct(module[d.doneKey], module[d.totalKey])
            return (
              <div key={d.key} style={{ background: d.bg, borderRadius: 8, padding: '9px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: d.fg, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
                  {d.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: d.fg, lineHeight: 1, letterSpacing: '-.04em', fontVariantNumeric: 'tabular-nums' }}>
                  {p}%
                </div>
                <div style={{ fontSize: 12, color: d.fg, opacity: .75, marginTop: 3, fontWeight: 600 }}>
                  {module[d.doneKey]}/{module[d.totalKey]}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
