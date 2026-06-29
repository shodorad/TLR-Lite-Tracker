// Path B — count-based delivery forecast (mobile surface).
// Everything here is derived live from Jira: a projected finish date from
// remaining open subtasks ÷ trailing velocity, the weekly throughput that feeds
// it, remaining work split per discipline, and the estimate-coverage bridge
// meter that stays honest about this being a count-based (not effort-based) view.

const DISC = [
  { key: 'ux',  label: 'UX',          done: 'uxDone',  total: 'uxTotal',  prog: 'uxProg',  blocked: 'uxBlocked',  color: '#3D9E52', fg: '#267339' },
  { key: 'fe',  label: 'Frontend',    done: 'feDone',  total: 'feTotal',  prog: 'feProg',  blocked: 'feBlocked',  color: '#7C3AED', fg: '#5B21B6' },
  { key: 'be',  label: 'Backend',     done: 'beDone',  total: 'beTotal',  prog: 'beProg',  blocked: 'beBlocked',  color: '#2B6CB0', fg: '#1A4F8A' },
  { key: 'int', label: 'Integration', done: 'intDone', total: 'intTotal', prog: 'intProg', blocked: 'intBlocked', color: '#D4920A', fg: '#8C5E00' },
]

const card = { background: 'var(--surface)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }

function Kpi({ value, sub, unit }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-.03em', fontVariantNumeric: 'tabular-nums' }}>
        {value}{unit && <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>{unit}</span>}
      </span>
      <span style={{ fontSize: 10, color: 'var(--quiet)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginTop: 4 }}>{sub}</span>
    </div>
  )
}

export default function ForecastPanel({ stats, velocity, forecast, estimate }) {
  if (!velocity || !forecast) return null

  const discAll   = DISC.filter(d => (stats[d.total] ?? 0) > 0)
  const totalDone = discAll.reduce((s, d) => s + (stats[d.done] ?? 0), 0)
  const totalAll  = discAll.reduce((s, d) => s + (stats[d.total] ?? 0), 0)
  const completePct = totalAll ? Math.round((totalDone / totalAll) * 100) : 0

  // Remaining per discipline (open = total − done; split to-do vs in-progress).
  const rows = discAll.map(d => {
    const open    = Math.max(0, (stats[d.total] ?? 0) - (stats[d.done] ?? 0))
    const prog    = stats[d.prog] ?? 0
    const blocked = stats[d.blocked] ?? 0
    const todo    = Math.max(0, open - prog - blocked)
    return { ...d, open, prog, blocked, todo }
  }).sort((a, b) => b.open - a.open)
  const maxOpen   = Math.max(1, ...rows.map(r => r.open))
  const totalOpen = rows.reduce((s, r) => s + r.open, 0)

  // Long-pole callout: the smallest set of top disciplines holding ≥60% of open work.
  const longPoles = []
  let acc = 0
  for (const r of rows) { if (acc >= totalOpen * 0.6) break; longPoles.push(r); acc += r.open }
  const poleNote = longPoles.length && longPoles.length < rows.length
    ? `${longPoles.map(r => r.label).join(' & ')} hold ${acc} of ${totalOpen} — the long poles driving the date`
    : null

  // Velocity bar scale — headroom above the tallest bar / the average line.
  const scale = Math.max(1, ...velocity.weeks.map(w => w.count), velocity.avg) * 1.18
  const avgPct = Math.min(100, (velocity.avg / scale) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Band label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.015em' }}>Delivery Forecast</span>
        <span className="badge badge-blue" style={{ fontSize: 10 }}>live · mobile · count-based</span>
      </div>

      {/* Hero — projected finish */}
      <div style={card}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '18px 22px' }}>
          <div style={{ minWidth: 220 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Projected finish
            </div>
            <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-.04em', fontVariantNumeric: 'tabular-nums' }}>
              {forecast.projLabel}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 7 }}>
              likely window&nbsp; <strong style={{ color: '#333', fontWeight: 700 }}>{forecast.rangeLabel}</strong>
            </div>
            <div style={{ fontSize: 11, color: 'var(--quiet)', marginTop: 8 }}>
              derived from live Jira throughput — not a verbal estimate
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Kpi value={forecast.open} sub="tickets left" />
            <Kpi value={Math.round(velocity.avg)} unit="/wk" sub="trailing velocity" />
            <Kpi value={completePct} unit="%" sub="complete" />
          </div>
        </div>
      </div>

      {/* Two columns: throughput | remaining */}
      <div className="forecast-cols">

        {/* Throughput */}
        <div style={card}>
          <div className="card-header">
            <span className="card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth="2.5"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></svg>
              Throughput
            </span>
            <span style={{ fontSize: 11, color: 'var(--quiet)' }}>subtasks done / week</span>
          </div>
          <div style={{ padding: '16px 22px' }}>
            <div style={{ position: 'relative', height: 118 }}>
              {/* rolling-average line */}
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${avgPct}%`, borderTop: '1px dashed #888' }}>
                <span style={{ position: 'absolute', right: 0, top: -8, fontSize: 10, color: 'var(--muted)', background: 'var(--surface)', padding: '0 4px' }}>avg {Math.round(velocity.avg)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: 8 }}>
                {velocity.weeks.map((w, i) => (
                  <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: 'var(--quiet)', marginBottom: 2, fontVariantNumeric: 'tabular-nums' }}>{w.count}</span>
                    <div
                      title={w.isCurrent ? 'current week (partial — excluded from average)' : `week of ${w.label}`}
                      style={{
                        width: '100%', maxWidth: 34,
                        height: `${Math.max(2, (w.count / scale) * 100)}%`,
                        background: w.isCurrent ? 'repeating-linear-gradient(45deg,#CBD5E1,#CBD5E1 4px,#E2E8F0 4px,#E2E8F0 8px)' : '#7C8694',
                        borderRadius: '4px 4px 0 0',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {velocity.weeks.map((w, i) => (
                <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--quiet)' }}>{w.label}</span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--quiet)', marginTop: 10 }}>
              {velocity.rollingWeeks}-wk avg <strong style={{ color: 'var(--muted)', fontWeight: 700 }}>{Math.round(velocity.avg)}</strong> · range {velocity.min}–{velocity.max} · current week (hatched) excluded as partial
            </div>
          </div>
        </div>

        {/* Remaining by discipline */}
        <div style={card}>
          <div className="card-header">
            <span className="card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth="2.5"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
              Remaining by discipline
            </span>
            <span style={{ fontSize: 11, color: 'var(--quiet)' }}>to do · in progress</span>
          </div>
          <div style={{ padding: '16px 22px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {rows.map(r => (
                <div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 78, flexShrink: 0, fontSize: 12, color: r.fg, fontWeight: 700 }}>{r.label}</span>
                  <div style={{ flex: 1, height: 14, background: 'rgba(0,0,0,.06)', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${(r.todo / maxOpen) * 100}%`, background: r.color, opacity: .5 }} />
                    <div style={{ width: `${((r.prog + r.blocked) / maxOpen) * 100}%`, background: r.color }} />
                  </div>
                  <span style={{ width: 88, flexShrink: 0, textAlign: 'right', fontSize: 13, fontWeight: 800, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                    {r.open}<span style={{ fontWeight: 400, color: 'var(--quiet)', fontSize: 10 }}> · {r.prog} in prog</span>
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, fontSize: 10, color: 'var(--quiet)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#888', opacity: .5 }} /> to do</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#888' }} /> in progress</span>
            </div>
            {poleNote && (
              <div style={{ marginTop: 12, fontSize: 12, color: '#8C5E00', background: 'rgba(212,146,10,.09)', border: '1px solid rgba(212,146,10,.25)', borderRadius: 8, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D4920A" strokeWidth="2.5"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>
                {poleNote}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bridge meter — estimate coverage */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 240 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Estimate coverage</span>
            <span style={{ fontSize: 11, color: 'var(--quiet)' }}>
              count-based forecast · {estimate.openWithEst}/{estimate.openTotal} open tickets estimated — enable estimation to unlock the effort-weighted view (Path A)
            </span>
          </div>
          <div style={{ width: 150, height: 8, background: 'rgba(0,0,0,.07)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${estimate.coveragePct}%`, height: '100%', background: 'var(--green)' }} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--quiet)', width: 48, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {estimate.coveragePct}%
          </span>
        </div>
      </div>
    </div>
  )
}
