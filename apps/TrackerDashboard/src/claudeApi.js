// Calls /api/claude/summarize (the Vite proxy route that forwards to Anthropic).
// Results are cached in localStorage keyed by workstream + date range hash.
// Cache format is versioned (v2) so old string-format entries are ignored.

const CACHE_VERSION = 'v3'

function cacheKey(workstream, startDate, endDate) {
  try {
    return `summary_${CACHE_VERSION}_${workstream}_${btoa(startDate.toISOString() + endDate.toISOString())}`
  } catch {
    return `summary_${CACHE_VERSION}_${workstream}_${Date.now()}`
  }
}

export function getCachedSummary(workstream, startDate, endDate) {
  try {
    const raw = localStorage.getItem(cacheKey(workstream, startDate, endDate))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearCachedSummary(workstream, startDate, endDate) {
  try {
    localStorage.removeItem(cacheKey(workstream, startDate, endDate))
  } catch { /* ignore */ }
}

// Returns an object: { focus, completed, inProgress } or throws on error.
export async function generateSummary(workstream, startDate, endDate, tickets) {
  const key = cacheKey(workstream, startDate, endDate)

  const cached = getCachedSummary(workstream, startDate, endDate)
  if (cached) return cached

  const res = await fetch('/api/claude/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      workstream,
      startDate: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      endDate: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tickets,
    }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const err = new Error(data.error ?? `HTTP ${res.status}`)
    err.code = data.error ?? 'http_error'
    throw err
  }

  const data = await res.json()

  // Parse the JSON that Claude returns inside data.summary
  let parsed
  try {
    parsed = typeof data.summary === 'object' ? data.summary : JSON.parse(data.summary)
  } catch {
    parsed = { focus: data.summary ?? '', completed: null, inProgress: null }
  }

  try { localStorage.setItem(key, JSON.stringify(parsed)) } catch { /* storage full */ }

  return parsed
}
