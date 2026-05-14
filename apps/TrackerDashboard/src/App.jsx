import { useState, useCallback, useEffect } from 'react'
import { fetchDashboardData } from './api.js'
import { processData } from './dataProcessor.js'
import { autoDetectMode, getDateRange } from './utils/dateUtils.js'
import Header from './components/Header.jsx'
import StatCards from './components/StatCards.jsx'
import DoneThisWeek from './components/DoneThisWeek.jsx'
import ModuleRollup from './components/ModuleRollup.jsx'
import FlowDetail from './components/FlowDetail.jsx'
import ModuleHealthChart from './components/ModuleHealthChart.jsx'
import OverallProgress from './components/OverallProgress.jsx'
import DemoReadiness from './components/DemoReadiness.jsx'
import StatusBriefing, { StatusBriefingModules } from './components/StatusBriefing.jsx'

export default function App() {
  const [data, setData] = useState(null)
  const [rawSubtasks, setRawSubtasks] = useState(null)
  const [rawFlows, setRawFlows] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const [dateMode] = useState(autoDetectMode)

  // Collapse states (all expanded by default)
  const [flowBreakdownCollapsed, setFlowBreakdownCollapsed] = useState(
    () => localStorage.getItem('flowBreakdownCollapsed') !== 'false'
  )
  const [moduleHealthCollapsed, setModuleHealthCollapsed] = useState(
    () => localStorage.getItem('moduleHealthCollapsed') === 'true'
  )
  const [doneThisWeekCollapsed, setDoneThisWeekCollapsed] = useState(
    () => localStorage.getItem('doneThisWeekCollapsed') === 'true'
  )

  const dateRange = getDateRange(dateMode, '', '')

  const load = useCallback(async (startDate) => {
    setLoading(true)
    setError(null)
    try {
      const raw = await fetchDashboardData(startDate)
      const processed = processData(raw.subtasks, raw.rawFlows, raw.doneWeek)
      setRawSubtasks(raw.subtasks)
      setRawFlows(raw.rawFlows)
      setData(processed)
      setLastRefreshed(new Date())
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Could not reach the Jira proxy. Make sure "npm run dev" is running.')
      } else {
        setError(`API error ${err.status ?? ''}: ${err.message}${err.body ? ` — ${err.body}` : ''}`)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Re-fetch when date range start changes
  useEffect(() => {
    load(dateRange.start)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.start?.toISOString()])

  function handleRefresh() {
    load(dateRange.start)
  }

  function toggleFlowBreakdown() {
    setFlowBreakdownCollapsed(c => {
      const next = !c
      localStorage.setItem('flowBreakdownCollapsed', String(next))
      return next
    })
  }

  function toggleModuleHealth() {
    setModuleHealthCollapsed(c => {
      const next = !c
      localStorage.setItem('moduleHealthCollapsed', String(next))
      return next
    })
  }

  function toggleDoneThisWeek() {
    setDoneThisWeekCollapsed(c => {
      const next = !c
      localStorage.setItem('doneThisWeekCollapsed', String(next))
      return next
    })
  }

  return (
    <>
      <Header
        lastRefreshed={lastRefreshed}
        loading={loading}
        onRefresh={handleRefresh}
      />

      <main className="main">
        {error && (
          <div className="err-banner">
            <span>{error}</span>
            <button
              className="btn btn-ghost"
              onClick={handleRefresh}
              style={{ fontSize: 12, padding: '4px 10px', marginLeft: 'auto' }}
            >
              Retry
            </button>
          </div>
        )}

        {loading && !data && (
          <div className="spinner-wrap">
            <div className="spinner" />
            <div className="spinner-label">Fetching Jira data…</div>
          </div>
        )}

        {data && (
          <div className="dashboard-single">
            {/* Hero row — 2 columns: stacked pair (overall + demo) · cadence */}
            <div className="hero-three">
              <div className="hero-stacked-pair">
                <OverallProgress stats={data.stats} />
                <DemoReadiness stats={data.stats} flows={data.flows} modules={data.modules} rawFlows={rawFlows} />
              </div>
              <StatusBriefing
                stats={data.stats}
                modules={data.modules}
                subtasks={rawSubtasks}
                doneWeek={data.doneWeek}
                flows={data.flows}
                rawFlows={rawFlows}
                dateRange={dateRange}
              />
            </div> {/* end .hero-three */}

            {/* Journey Health chart — full width, below summary */}
            <ModuleHealthChart modules={data.modules} />

            {/* Module accordions — full width, below chart */}
            <StatusBriefingModules modules={data.modules} />

            {/* Discipline Breakdown — collapsible, full width */}
            <div className="card">
              <div className="card-header clickable" onClick={toggleModuleHealth}>
                <span className="card-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(57% 0.19 258)" strokeWidth="2.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M3 15h18M9 3v18"/>
                  </svg>
                  Discipline Breakdown
                  <span className={`chevron ${moduleHealthCollapsed ? 'collapsed' : ''}`}>▼</span>
                </span>
              </div>
              {!moduleHealthCollapsed && (
                <div style={{ padding: '16px 20px 20px' }}>
                  <StatCards stats={data.stats} />
                </div>
              )}
            </div>

            {/* Flow Detail Breakdown — collapsed by default */}
            <div className="card flow-breakdown-card">
              <div className="card-header clickable" onClick={toggleFlowBreakdown}>
                <span className="card-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(67% 0.17 155)" strokeWidth="2.5">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  Flow Detail Breakdown
                  <span className={`chevron ${flowBreakdownCollapsed ? 'collapsed' : ''}`}>▼</span>
                </span>
              </div>
              {!flowBreakdownCollapsed && (
                <div className="flow-breakdown-content">
                  <ModuleRollup modules={data.modules} />
                  <FlowDetail flows={data.flows} />
                </div>
              )}
            </div>

            {/* Done This Week — collapsible */}
            <div className="card">
              <div className="card-header clickable" onClick={toggleDoneThisWeek}>
                <span className="card-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(67% 0.17 155)" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Done This Week
                  <span className={`chevron ${doneThisWeekCollapsed ? 'collapsed' : ''}`}>▼</span>
                </span>
              </div>
              {!doneThisWeekCollapsed && <DoneThisWeek issues={data.doneWeek} />}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
