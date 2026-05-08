import { useState } from 'react'

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

export default function Header({ lastRefreshed, loading, onRefresh }) {
  return (
    <header className="hdr">
      <div className="hdr-left">
        <div className="hdr-logo">TL</div>
        <span className="hdr-title">TLN Dashboard</span>
        <span className="hdr-sub">Tracklynk Lite New</span>
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
