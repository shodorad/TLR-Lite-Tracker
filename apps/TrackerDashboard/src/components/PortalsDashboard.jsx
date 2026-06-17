import { useState } from 'react'
import OverallProgress from './OverallProgress.jsx'
import ModuleHealthChart from './ModuleHealthChart.jsx'
import { StatusBriefingModules } from './StatusBriefing.jsx'
import ModuleRollup from './ModuleRollup.jsx'
import FlowDetail from './FlowDetail.jsx'
import PortalSummary from './PortalSummary.jsx'
import { SURFACES } from '../dataProcessor.js'

const TABS = [
  { id: 'admin',  label: 'Admin Portal' },
  { id: 'vendor', label: 'Vendor Portal' },
]

export default function PortalsDashboard({ datasets }) {
  const [portal, setPortal] = useState(() => {
    const saved = localStorage.getItem('activePortal')
    return saved === 'vendor' ? 'vendor' : 'admin'
  })
  const [flowBreakdownCollapsed, setFlowBreakdownCollapsed] = useState(
    () => localStorage.getItem('portalFlowBreakdownCollapsed') !== 'false'
  )

  const data    = datasets[portal]
  const surface = SURFACES[portal]
  const moduleColorMap = Object.fromEntries(data.modules.map(m => [m.name, m.color]))

  function pick(id) {
    setPortal(id)
    localStorage.setItem('activePortal', id)
  }

  function toggleFlowBreakdown() {
    setFlowBreakdownCollapsed(c => {
      const next = !c
      localStorage.setItem('portalFlowBreakdownCollapsed', String(next))
      return next
    })
  }

  return (
    <div className="dashboard-single">
      <div className="portal-tabs" role="tablist" aria-label="Select portal">
        {TABS.map(t => {
          const d = datasets[t.id]
          const flows = d.totalFlows
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={portal === t.id}
              className={`portal-tab${portal === t.id ? ' active' : ''}`}
              onClick={() => pick(t.id)}
            >
              <span className="portal-tab-label">{t.label}</span>
              <span className="portal-tab-meta">
                {d.modules.length} module{d.modules.length === 1 ? '' : 's'}
                {flows > 0 ? ` · ${flows} flows` : ''}
              </span>
            </button>
          )
        })}
      </div>

      <div className="portal-hero">
        <OverallProgress
          key={`overall-${portal}`}
          stats={data.stats}
          totalFlows={data.totalFlows}
          journeyCount={data.modules.length}
          journeyNoun={surface.journeyNoun}
        />
        <PortalSummary data={data} surface={surface} />
      </div>

      <ModuleHealthChart key={`chart-${portal}`} modules={data.modules} title="Module Health" />

      <StatusBriefingModules modules={data.modules} title="Module Breakdown" />

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
            <ModuleRollup modules={data.modules} noun="Module" />
            <FlowDetail flows={data.flows} noun="Module" moduleColorMap={moduleColorMap} />
          </div>
        )}
      </div>
    </div>
  )
}
