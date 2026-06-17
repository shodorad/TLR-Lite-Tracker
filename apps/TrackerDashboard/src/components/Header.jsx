import { useState, useRef, useEffect } from 'react'

function RefreshIcon({ spinning }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ animation: spinning ? 'spin .7s linear infinite' : 'none' }}
    >
      <path d="M1 4v6h6M23 20v-6h-6"/>
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"/>
    </svg>
  )
}

const PAGES = [
  { id: 'mobile',  label: 'Mobile App', desc: 'Tracklynk Lite New' },
  { id: 'portals', label: 'Portals',     desc: 'Admin & Vendor' },
]

function PageSwitcher({ page, onPageChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = PAGES.find(p => p.id === page) ?? PAGES[0]

  useEffect(() => {
    if (!open) return
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    function onKey(e) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function pick(id) {
    onPageChange(id)
    setOpen(false)
  }

  return (
    <div className="page-switcher" ref={ref}>
      <button
        className="page-switcher-btn"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="page-switcher-current">{current.label}</span>
        <svg
          className={`page-switcher-caret${open ? ' open' : ''}`}
          width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <ul className="page-switcher-menu" role="listbox" aria-label="Switch dashboard">
          {PAGES.map(p => (
            <li
              key={p.id}
              role="option"
              aria-selected={p.id === page}
              tabIndex={0}
              className={`page-switcher-item${p.id === page ? ' active' : ''}`}
              onClick={() => pick(p.id)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(p.id) } }}
            >
              <span className="page-switcher-item-label">{p.label}</span>
              <span className="page-switcher-item-desc">{p.desc}</span>
              {p.id === page && (
                <svg className="page-switcher-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Header({ lastRefreshed, loading, onRefresh, page = 'mobile', onPageChange }) {
  return (
    <header className="hdr">
      <div className="hdr-left">
        <div className="hdr-logo">TL</div>
        <span className="hdr-title">TLN Dashboard</span>
        <span className="hdr-divider" aria-hidden="true" />
        <PageSwitcher page={page} onPageChange={onPageChange} />
      </div>
      <div className="hdr-right">
        {lastRefreshed && (
          <span className="hdr-ts">
            Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        <button className="btn btn-ghost" onClick={onRefresh} disabled={loading}>
          <RefreshIcon spinning={loading} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
        <a
          href="https://radiantexp.atlassian.net/jira/software/projects/TLN/boards"
          target="_blank"
          rel="noreferrer"
          className="btn btn-dark"
        >
          Open in Jira ↗
        </a>
      </div>
    </header>
  )
}
