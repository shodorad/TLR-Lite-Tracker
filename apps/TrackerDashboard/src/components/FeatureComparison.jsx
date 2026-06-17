import { useState, useMemo } from 'react'
import { COMPARISON } from '../comparisonData.js'

/* Presence badge per platform.
   yes = built/present · partial = limited/weaker · no = absent · planned = roadmap (V2) */
const PRESENCE = {
  yes:     { cls: 'pr-yes',     label: 'Yes',     mark: '✓' },
  partial: { cls: 'pr-partial', label: 'Partial', mark: '~' },
  no:      { cls: 'pr-no',      label: 'No',      mark: '✕' },
  planned: { cls: 'pr-planned', label: 'Planned', mark: '◇' },
}

const FILTERS = [
  { key: 'all',   label: 'All' },
  { key: 'v1',    label: 'V1 — committed' },
  { key: 'v2',    label: 'V2 — roadmap' },
  { key: 'other', label: 'Other' },
]

/* Per-section rollup of code-verified build status. "built" = inTracklynk yes. */
function sectionStats(rows) {
  const s = { total: rows.length, yes: 0, partial: 0, no: 0 }
  rows.forEach(r => {
    if (r.inTracklynk === 'yes') s.yes++
    else if (r.inTracklynk === 'partial') s.partial++
    else s.no++
  })
  s.pct = s.total ? Math.round((s.yes / s.total) * 100) : 0
  return s
}

function Presence({ state, text }) {
  const p = PRESENCE[state] || PRESENCE.no
  return (
    <td className="cmp-cell">
      <span className={`pr ${p.cls}`}><span className="pr-mark">{p.mark}</span>{p.label}</span>
      <span className="cmp-cell-text">{text || '—'}</span>
    </td>
  )
}

/* Tracklynk column = code-verified. Badge + audit note + the source file
   that backs the verdict. */
function TracklynkCell({ state, note, evidence }) {
  const p = PRESENCE[state] || PRESENCE.no
  return (
    <td className="cmp-cell">
      <span className={`pr ${p.cls}`}><span className="pr-mark">{p.mark}</span>{p.label}</span>
      {note && <span className="cmp-cell-text">{note}</span>}
      {evidence
        ? <code className="cmp-evidence">{evidence}</code>
        : <span className="cmp-evidence cmp-evidence-none">no code found</span>}
    </td>
  )
}

export default function FeatureComparison() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('featureComparisonCollapsed') !== 'false'
  )
  const [filter, setFilter] = useState('all')
  const [openSections, setOpenSections] = useState(
    () => JSON.parse(localStorage.getItem('cmpOpenSections') || '{}')
  )

  function toggleSection(name) {
    setOpenSections(s => {
      const next = { ...s, [name]: s[name] === false ? true : false }
      localStorage.setItem('cmpOpenSections', JSON.stringify(next))
      return next
    })
  }

  function toggle() {
    setCollapsed(c => {
      const next = !c
      localStorage.setItem('featureComparisonCollapsed', String(next))
      return next
    })
  }

  const { categories, total } = useMemo(() => {
    let total = 0
    const categories = COMPARISON.map(cat => {
      const rows = cat.rows.filter(r => filter === 'all' || r.scope === filter)
      total += rows.length
      return { category: cat.category, rows }
    }).filter(cat => cat.rows.length > 0)
    return { categories, total }
  }, [filter])

  const counts = useMemo(() => {
    const c = { all: 0, v1: 0, v2: 0, other: 0 }
    COMPARISON.forEach(cat => cat.rows.forEach(r => { c.all++; c[r.scope]++ }))
    return c
  }, [])

  return (
    <div className="card cmp-card">
      <div className="card-header clickable" onClick={toggle}>
        <span className="card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(67% 0.17 155)" strokeWidth="2.5">
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
          Feature Comparison — Bouncie vs. Tracklynk Lite
          <span className={`chevron ${collapsed ? 'collapsed' : ''}`}>▼</span>
        </span>
        <span className="badge badge-blue">
          {counts.v1} V1 · {counts.v2} V2 · {counts.all} total
        </span>
      </div>

      {!collapsed && (
        <div className="cmp-body">
          <div className="cmp-toolbar">
            <div className="cmp-filters" role="tablist">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  className={`cmp-filter ${filter === f.key ? 'active' : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  <span className="cmp-filter-n">{counts[f.key]}</span>
                </button>
              ))}
            </div>
            <span className="cmp-count">{total} shown</span>
          </div>
          <p className="cmp-caption">
            <strong>Present in Tracklynk</strong> is verified against the prototype codebase
            (tl-lite-progressive-web-app, audited 2026-06-10) — not the spec sheet.
            V1/V2 are the planned scope from the feature workbook.
          </p>

          {categories.map(cat => {
            const st = sectionStats(cat.rows)
            const open = openSections[cat.category] !== false
            return (
            <div key={cat.category} className="cmp-section">
              <div className="cmp-section-head clickable" onClick={() => toggleSection(cat.category)}>
                <span className={`chevron ${open ? '' : 'collapsed'}`}>▼</span>
                <span className="cmp-section-title">{cat.category}</span>
                <span className="cmp-section-count">{st.total}</span>
                <span className="cmp-section-built">{st.yes}/{st.total} built</span>
                <div className="cmp-section-bar" title={`${st.pct}% built`}>
                  <div className="cmp-section-bar-fill" style={{ width: `${st.pct}%` }} />
                </div>
              </div>

              {!open && (
                <div className="cmp-overview">
                  <span className="cmp-ov-chip ov-yes">{st.yes} built</span>
                  <span className="cmp-ov-chip ov-partial">{st.partial} partial</span>
                  <span className="cmp-ov-chip ov-no">{st.no} not built</span>
                  <span className="cmp-ov-total">{st.total} features · {st.pct}% built</span>
                </div>
              )}

              {open && (
              <div className="table-wrap">
                <table className="cmp-table">
                  <thead>
                    <tr>
                      <th className="cmp-th-feature">Feature</th>
                      <th>Present in Bouncie</th>
                      <th>Present in Tracklynk <span className="cmp-th-tag">code-verified</span></th>
                      <th className="cmp-th-mark">V1</th>
                      <th className="cmp-th-mark">V2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.rows.map(row => (
                      <tr key={row.feature}>
                        <td className="cmp-feature">
                          <strong>{row.feature}</strong>
                        </td>
                        <Presence state={row.inBouncie} text={row.bouncie} />
                        <TracklynkCell state={row.inTracklynk} note={row.tlNote} evidence={row.tlEvidence} />
                        <td className="cmp-mark">
                          {row.scope === 'v1'
                            ? <span className="mark mark-v1">✓</span>
                            : <span className="mark-off">—</span>}
                        </td>
                        <td className="cmp-mark">
                          {row.scope === 'v2'
                            ? <span className="mark mark-v2">✓</span>
                            : <span className="mark-off">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
