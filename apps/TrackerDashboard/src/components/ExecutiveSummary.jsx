import { useState, useEffect, useRef } from 'react'
import { generateSummary, getCachedSummary, clearCachedSummary } from '../claudeApi.js'

const WORKSTREAMS = [
  { key: 'UX',          label: 'UX',          discField: 'UX' },
  { key: 'Backend',     label: 'Back-End',     discField: 'Backend' },
  { key: 'Integration', label: 'Integration',  discField: 'Integration' },
]

function buildTicketList(subtasks, doneWeek, discField) {
  const tickets = []
  doneWeek
    .filter(iss => (iss.fields.summary ?? '').trim() === discField)
    .forEach(iss => {
      tickets.push({
        status: 'Done',
        flowName: iss.fields.parent?.fields?.summary ?? iss.fields.parent?.key ?? '—',
        discipline: discField,
        assignee: iss.fields.assignee?.displayName ?? 'Unassigned',
      })
    })
  subtasks
    .filter(iss => {
      const disc = (iss.fields.summary ?? '').trim()
      const statusName = iss.fields.status?.name ?? ''
      return disc === discField && statusName.toLowerCase().includes('progress')
    })
    .forEach(iss => {
      tickets.push({
        status: iss.fields.status?.name ?? 'In Progress',
        flowName: iss.fields.parent?.fields?.summary ?? iss.fields.parent?.key ?? '—',
        discipline: discField,
        assignee: iss.fields.assignee?.displayName ?? 'Unassigned',
      })
    })
  return tickets
}

function Field({ icon, label, value, color }) {
  if (!value) return null
  return (
    <div className="exec-field">
      <span className="exec-field-icon">{icon}</span>
      <div className="exec-field-body">
        <span className="exec-field-label">{label}</span>
        <span className={`exec-field-value ${color ?? ''}`}>{value}</span>
      </div>
    </div>
  )
}

function SummaryRow({ ws, subtasks, doneWeek, dateRange, refreshSignal }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [noKey, setNoKey] = useState(false)
  const prevSignalRef = useRef(refreshSignal)

  async function fetchSummary(forceRefresh = false) {
    if (!dateRange) return
    const { start, end } = dateRange
    const tickets = buildTicketList(subtasks, doneWeek, ws.discField)

    if (tickets.length === 0) {
      setData({ focus: null, completed: null, inProgress: null, empty: true })
      return
    }

    if (forceRefresh) {
      clearCachedSummary(ws.key, start, end)
    } else {
      const cached = getCachedSummary(ws.key, start, end)
      if (cached) { setData(cached); return }
    }

    setLoading(true)
    setData(null)
    setNoKey(false)
    try {
      const result = await generateSummary(ws.key, start, end, tickets)
      setData(result)
    } catch (err) {
      if (err.code === 'no_key') setNoKey(true)
      else setData({ focus: null, completed: null, inProgress: null, error: true })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (subtasks && doneWeek && dateRange) fetchSummary(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange?.start?.toISOString(), dateRange?.end?.toISOString(), subtasks?.length, doneWeek?.length])

  useEffect(() => {
    if (refreshSignal !== prevSignalRef.current) {
      prevSignalRef.current = refreshSignal
      if (subtasks && doneWeek && dateRange) fetchSummary(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal])

  return (
    <div className="exec-row">
      <div className="exec-ws-label">
        <span className={`exec-ws-badge exec-ws-${ws.key.toLowerCase()}`}>{ws.label}</span>
      </div>

      <div className="exec-fields-wrap">
        {loading && (
          <div className="exec-skeleton">
            <div className="skeleton-line" style={{ width: '40%' }} />
            <div className="skeleton-line" style={{ width: '55%' }} />
            <div className="skeleton-line" style={{ width: '35%' }} />
          </div>
        )}

        {noKey && (
          <span className="exec-no-key">
            Add <code>ANTHROPIC_API_KEY</code> to .env.local to enable summaries
          </span>
        )}

        {!loading && !noKey && data?.empty && (
          <span className="exec-no-activity">No activity in selected range</span>
        )}

        {!loading && !noKey && data?.error && (
          <span className="exec-no-activity">Could not generate summary</span>
        )}

        {!loading && !noKey && data && !data.empty && !data.error && (
          <div className="exec-fields">
            <Field icon="🎯" label="Focus"       value={data.focus}      color="exec-val-focus" />
            <Field icon="✓"  label="Completed"   value={data.completed}  color="exec-val-done" />
            <Field icon="⟳"  label="In Progress" value={data.inProgress} color="exec-val-prog" />
          </div>
        )}
      </div>

      <button
        className="exec-refresh-btn"
        title="Regenerate summary"
        onClick={() => fetchSummary(true)}
        disabled={loading}
      >↻</button>
    </div>
  )
}

export default function ExecutiveSummary({ subtasks, doneWeek, dateRange, refreshSignal }) {
  return (
    <div className="card exec-summary-card">
      <div className="card-header">
        <span className="card-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(67% 0.17 250)" strokeWidth="2.5">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          Executive Summary
        </span>
        <span className="badge badge-blue" style={{ fontSize: 11 }}>AI Generated</span>
      </div>
      <div className="exec-rows">
        {WORKSTREAMS.map(ws => (
          <SummaryRow
            key={ws.key}
            ws={ws}
            subtasks={subtasks}
            doneWeek={doneWeek}
            dateRange={dateRange}
            refreshSignal={refreshSignal}
          />
        ))}
      </div>
    </div>
  )
}
