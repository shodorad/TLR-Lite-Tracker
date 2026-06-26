import { useState, useCallback, useEffect, useMemo } from 'react'
import { fetchDashboardData } from './api.js'
import { processData, SURFACES } from './dataProcessor.js'
import { autoDetectMode, getDateRange } from './utils/dateUtils.js'
import Header from './components/Header.jsx'
import DoneThisWeek from './components/DoneThisWeek.jsx'
import ModuleRollup from './components/ModuleRollup.jsx'
import FlowDetail from './components/FlowDetail.jsx'
import ModuleHealthChart from './components/ModuleHealthChart.jsx'
import OverallProgress from './components/OverallProgress.jsx'
import DemoReadiness from './components/DemoReadiness.jsx'
import StatusBriefing, { StatusBriefingModules } from './components/StatusBriefing.jsx'
import FeatureComparison from './components/FeatureComparison.jsx'
import PortalsDashboard from './components/PortalsDashboard.jsx'

export default function App() {
  const [data, setData] = useState(null)
  const [rawSubtasks, setRawSubtasks] = useState(null)
  const [rawFlows, setRawFlows] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const [page, setPage] = useState(() => (
    localStorage.getItem('activePage') === 'portals' ? 'portals' : 'mobile'
  ))

  const [dateMode] = useState(autoDetectMode)

  // Portal datasets reprocess the same Jira payload against each portal's epic set.
  const portalDatasets = useMemo(() => {
    if (!rawSubtasks || !rawFlows) return null
    return {
      admin:  processData(rawSubtasks, rawFlows, [], { surfacePrefix: SURFACES.admin.prefix,  moduleColors: SURFACES.admin.moduleColors }),
      vendor: processData(rawSubtasks, rawFlows, [], { surfacePrefix: SURFACES.vendor.prefix, moduleColors: SURFACES.vendor.moduleColors }),
    }
  }, [rawSubtasks, rawFlows])

  function handlePageChange(next) {
    setPage(next)
    localStorage.setItem('activePage', next)
  }

  // Collapse states (all expanded by default)
  const [flowBreakdownCollapsed, setFlowBreakdownCollapsed] = useState(
    () => localStorage.getItem('flowBreakdownCollapsed') !== 'false'
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
        page={page}
        onPageChange={handlePageChange}
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

        {data && page === 'portals' && portalDatasets && (
          <PortalsDashboard datasets={portalDatasets} />
        )}

        {data && page === 'mobile' && (
          <div className="dashboard-single">
            {/* Hero row — 2 columns: stacked pair (overall + demo) · cadence */}
            <div className="hero-three">
              <div className="hero-stacked-pair">
                <OverallProgress stats={data.stats} totalFlows={data.totalFlows} journeyCount={data.modules.length} />
                <DemoReadiness stats={data.stats} flows={data.flows} modules={data.modules} rawFlows={rawFlows} totalFlows={data.totalFlows} />
              </div>
              <StatusBriefing stats={data.stats} />
            </div> {/* end .hero-three */}

            {/* Journey Health chart — full width, below summary */}
            <ModuleHealthChart modules={data.modules} />

            {/* Module accordions — full width, below chart */}
            <StatusBriefingModules modules={data.modules} />

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
                  <FlowDetail flows={data.flows} moduleColorMap={Object.fromEntries(data.modules.map(m => [m.name, m.color]))} />
                </div>
              )}
            </div>

            {/* Feature Comparison — Bouncie vs. Tracklynk Lite — collapsed by default */}
            <FeatureComparison />

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
