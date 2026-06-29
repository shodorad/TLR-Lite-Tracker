// All requests go to Vite's dev-server proxy at /api/*.
// Credentials live in .env.local — the proxy injects Authorization server-side.
// The browser sends no credentials whatsoever.

const MAX_PER_PAGE = 100

async function jiraPost(jql, fields) {
  const issues = []
  let nextPageToken = undefined

  while (true) {
    const body = { jql, maxResults: MAX_PER_PAGE, fields }
    if (nextPageToken) body.nextPageToken = nextPageToken

    const res = await fetch('/api/search/jql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      const err = new Error(`HTTP ${res.status}`)
      err.status = res.status
      err.body = text.slice(0, 400)
      throw err
    }

    const data = await res.json()
    issues.push(...(data.issues ?? []))
    if (data.isLast || !data.nextPageToken) break
    nextPageToken = data.nextPageToken
  }

  return issues
}

// Formats a Date as "YYYY-MM-DD HH:mm" for Jira JQL
function formatJiraDate(date) {
  const pad = n => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const SUBTASK_FIELDS = [
  'summary', 'status', 'components', 'parent',
  'assignee', 'statuscategorychangedate', 'resolutiondate', 'duedate',
  // Effort fields — drive the estimate-coverage bridge meter. Currently null
  // across TLN (nobody estimates), so coverage reads 0%; it climbs automatically
  // if/when the team starts populating either field. No code change needed then.
  'timeoriginalestimate', 'timeestimate',
]

// How far back the velocity chart looks. Eight weeks gives ~6 full trailing
// weeks for the rolling average plus the current (partial) week for display.
const VELOCITY_WINDOW_DAYS = 56

// Flow-level (parent) issues — fetched for their due dates.
// `issuetype` lets us tell Epics (the modules) from Tasks (the flows).
const FLOW_FIELDS = ['summary', 'duedate', 'customfield_10015', 'status', 'components', 'parent', 'issuetype']

export async function fetchDashboardData(startDate) {
  const afterClause = startDate
    ? ` AND status changed TO "Done" AFTER "${formatJiraDate(startDate)}"`
    : ' AND status changed TO "Done" AFTER -7d'

  const [subtasks, doneWeek, rawFlows, doneTrailing] = await Promise.all([
    jiraPost('project = TLN AND issuetype = Subtask ORDER BY key ASC', SUBTASK_FIELDS),
    jiraPost(
      'project = TLN AND issuetype = Subtask AND status = "Done"' +
        afterClause +
        ' ORDER BY statuscategorychangedate DESC',
      SUBTASK_FIELDS,
    ),
    jiraPost('project = TLN AND issuetype != Subtask ORDER BY key ASC', FLOW_FIELDS),
    // Fixed trailing window (independent of the date-mode selector) — the velocity
    // chart always reflects the last VELOCITY_WINDOW_DAYS regardless of the "Done
    // this week" range the user is viewing.
    jiraPost(
      'project = TLN AND issuetype = Subtask AND status = "Done"' +
        ` AND status changed TO "Done" AFTER -${VELOCITY_WINDOW_DAYS}d` +
        ' ORDER BY statuscategorychangedate DESC',
      SUBTASK_FIELDS,
    ),
  ])
  return { subtasks, doneWeek, rawFlows, doneTrailing }
}
