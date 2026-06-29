// Mobile journey color palette. The journeys themselves are NOT hard-coded — they're
// derived live from Jira (every non-portal, non-Phase-2 epic, see processData); this
// palette is just cycled across them in order, exactly as PORTAL_COLORS is for portals.
export const MODULE_COLORS = [
  '#3B6FD4',
  '#3D9E52',
  '#7B5EA7',
  '#D4920A',
  '#E05252',
  '#2196A8',
  '#C07830',
  '#C0487A',
  '#5566D4',
  '#3A9688',
  '#6B7A99',
]

// ── Portal surfaces ─────────────────────────────────────────────────────────
// The portal epics live in the same TLN project, prefixed "Admin …" / "Vendor …".
// We never hard-code the module list: each surface is derived live from Jira by
// matching the epic-summary prefix, so adding or renaming a portal epic in Jira
// flows straight through. The prefix is stripped for display.
function stripPortalPrefix(summary) {
  return (summary ?? '').replace(/^(Admin|Vendor)\b\s*[-–]?\s*/i, '').trim()
}

function matchesSurface(summary, prefix) {
  return new RegExp(`^${prefix}\\b`, 'i').test(summary ?? '')
}

const PORTAL_COLORS = [
  '#3B6FD4',
  '#3D9E52',
  '#7B5EA7',
  '#D4920A',
  '#2196A8',
  '#C0487A',
  '#C07830',
  '#5566D4',
  '#3A9688',
  '#E05252',
]

// Surface registry — the source of truth for which epics belong to each page.
// `prefix` is matched against Jira epic summaries to pull each portal's modules.
export const SURFACES = {
  admin:  { id: 'admin',  label: 'Admin Portal',  prefix: 'Admin',  moduleColors: PORTAL_COLORS, journeyNoun: 'journeys' },
  vendor: { id: 'vendor', label: 'Vendor Portal', prefix: 'Vendor', moduleColors: PORTAL_COLORS, journeyNoun: 'journeys' },
}

// A summary belongs to a portal surface when it starts with any registered portal
// prefix. The mobile surface is the complement — every epic that is NOT a portal epic.
function isPortalSummary(summary) {
  return Object.values(SURFACES).some(s => matchesSurface(summary, s.prefix))
}

// "Global UI Refinements" is a cross-cutting polish epic, not a real user journey, so it's
// surfaced in its own widget rather than mixed into Journey Health. Matched liberally
// ("global … refinement") so Jira wording variants ("Global Refinements", "Global UI
// Refinement", …) still route here.
export function isGlobalRefinements(module) {
  return /global\b.*\brefinement/i.test(module?.name ?? '')
}

export function pct(done, total) {
  return total === 0 ? 0 : Math.round((done / total) * 100)
}

export function colorForPct(p) {
  if (p > 75) return 'green'
  if (p >= 25) return 'yellow'
  if (p > 0)  return 'red'
  return 'neutral'   /* 0% = not started, not alarming */
}

export const PCT_HEX = {
  green:   '#3D9E52',
  yellow:  '#D4920A',
  red:     '#E05252',
  neutral: '#CCCCCC',
}

// A subtask's summary names its discipline, but some were created in Jira with the
// short aliases "FE"/"BE" instead of "Frontend"/"Backend". Map them to the canonical
// names so those tasks aren't silently dropped from every total, due-date bucket, and
// module breakdown (the discipline checks below all match on the exact canonical name).
const DISCIPLINE_ALIASES = { FE: 'Frontend', BE: 'Backend' }
function normDiscipline(summary) {
  const d = (summary ?? '').trim()
  return DISCIPLINE_ALIASES[d] ?? d
}

export function processData(subtasks, rawFlows = [], doneWeek = [], opts = {}) {
  const moduleColors = opts.moduleColors ?? MODULE_COLORS
  const prefix       = opts.surfacePrefix ?? null

  // Determine this surface's ordered journey (module) list — always derived live
  // from Jira in Jira key order, never hard-coded, so adding or renaming an epic in
  // Jira flows straight through with no code change.
  //   • Portals: every Epic whose summary starts with the surface prefix
  //     ("Admin"/"Vendor"), prefix stripped for display.
  //   • Mobile:  every Epic that is NOT a portal epic and NOT Phase 2.
  //   • Fallback (no flow hierarchy fetched): the distinct component tags on the
  //     subtasks themselves — still nothing hard-coded.
  const seen = new Set()
  let moduleOrder = []
  if (rawFlows.length > 0) {
    for (const flow of rawFlows) {
      if (flow.fields?.issuetype?.name !== 'Epic') continue
      const summary = (flow.fields?.summary ?? '').trim()
      if (!summary) continue
      let name
      if (prefix) {
        if (!matchesSurface(summary, prefix)) continue
        name = stripPortalPrefix(summary)
      } else {
        if (isPortalSummary(summary) || /phase\s*2/i.test(summary)) continue
        name = summary
      }
      if (name && !seen.has(name)) { seen.add(name); moduleOrder.push(name) }
    }
  } else {
    for (const iss of subtasks) {
      const name = iss.fields.components?.[0]?.name ?? ''
      if (name && !seen.has(name)) { seen.add(name); moduleOrder.push(name) }
    }
  }
  const moduleSet = new Set(moduleOrder)

  // Build flowKey → module name from the Jira hierarchy (flow's parent epic).
  // This is authoritative — only flows whose parent epic belongs to THIS surface
  // get counted, so portal epics never leak into the mobile totals (or vice versa).
  // Portal parent summaries are matched on prefix and stripped to the display name.
  const flowModuleMap = {}
  const phase2FlowKeys = new Set()
  for (const flow of rawFlows) {
    const parentSummary = flow.fields?.parent?.fields?.summary ?? ''
    if (/phase\s*2/i.test(parentSummary)) {
      phase2FlowKeys.add(flow.key)
      continue
    }
    if (prefix) {
      if (!matchesSurface(parentSummary, prefix)) continue
      const name = stripPortalPrefix(parentSummary)
      if (moduleSet.has(name)) flowModuleMap[flow.key] = name
    } else if (moduleSet.has(parentSummary)) {
      flowModuleMap[flow.key] = parentSummary
    }
  }
  // Module buckets
  const modMap = {}
  moduleOrder.forEach((name, i) => {
    modMap[name] = {
      name,
      color: moduleColors[i % moduleColors.length],
      flowKeys: new Set(),
      flowsDone: 0,
      uxD: 0, uxT: 0,
      beD: 0, beT: 0,
      inD: 0, inT: 0,
      feD: 0, feT: 0,
    }
  })

  // Flow map: Task key → { code, name, module, ux, backend, integration }
  const flowMap = {}
  let uxDone = 0, beDone = 0, intDone = 0, feDone = 0
  let uxTotal = 0, beTotal = 0, intTotal = 0, feTotal = 0
  // Per-discipline in-progress / blocked, counted on the SAME surface-scoped
  // population as the totals above so done + inProg + blocked + notStarted == total.
  let uxProg = 0, beProg = 0, intProg = 0, feProg = 0
  let uxBlocked = 0, beBlocked = 0, intBlocked = 0, feBlocked = 0
  // Estimate coverage on OPEN work — drives the bridge meter. Counts every
  // mobile-scoped not-done subtask and how many carry any effort estimate.
  let estOpenTotal = 0, estOpenWithEst = 0

  // Per-discipline due-date status, tracked from each subtask's OWN duedate (not the
  // module epic's). Counts cover OPEN (not-done) subtasks only — a finished task is
  // never "overdue" or "due today". Buckets are mutually exclusive. Jira's duedate is
  // "YYYY-MM-DD", so a plain string compare against today's local date orders correctly.
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const DISC_DUE_KEY = { UX: 'ux', Frontend: 'frontend', Backend: 'backend', Integration: 'integration' }
  // `nearest` = the earliest due date among this discipline's OPEN subtasks
  // ("YYYY-MM-DD", or null when none of them carry a due date). Drives the
  // discipline card's pill, which shows the next deadline rather than a tally.
  const due = {
    ux:          { overdue: 0, today: 0, upcoming: 0, noDate: 0, nearest: null },
    frontend:    { overdue: 0, today: 0, upcoming: 0, noDate: 0, nearest: null },
    backend:     { overdue: 0, today: 0, upcoming: 0, noDate: 0, nearest: null },
    integration: { overdue: 0, today: 0, upcoming: 0, noDate: 0, nearest: null },
  }

  // Recap collections, both scoped to this surface (the per-surface skip below
  // runs before we collect): subtasks moved to Done within the last day, and
  // everything currently in progress.
  const recentCutoff = Date.now() - 24 * 60 * 60 * 1000
  const doneRecently = []
  const inProgress = []

  for (const iss of subtasks) {
    const disc = normDiscipline(iss.fields.summary)        // "UX" | "Frontend" | "Backend" | "Integration" (FE→Frontend, BE→Backend)
    const isDone = iss.fields.status?.statusCategory?.key === 'done'
    const statusName = iss.fields.status?.name ?? ''
    const pk = iss.fields.parent?.key ?? ''
    const ps = iss.fields.parent?.fields?.summary ?? ''
    // Use hierarchy when available; fall back to component tag only when rawFlows is empty
    const comp = rawFlows.length > 0
      ? (flowModuleMap[pk] ?? '')
      : (iss.fields.components?.[0]?.name ?? '')

    // Exclude Phase 2 subtasks
    if (phase2FlowKeys.has(pk)) continue
    // Skip subtasks whose flow belongs to a different surface (mobile vs portals).
    // When rawFlows is present, flowModuleMap is the authoritative surface filter;
    // the fallback (no rawFlows) keeps every subtask via the component-tag path.
    if (rawFlows.length > 0 && !comp) continue

    // Estimate coverage (open work only): a finished ticket needs no estimate.
    if (!isDone) {
      estOpenTotal++
      if (iss.fields.timeoriginalestimate != null || iss.fields.timeestimate != null) estOpenWithEst++
    }

    if (pk && !flowMap[pk]) {
      flowMap[pk] = {
        key: pk,
        name: ps,
        code: (ps.match(/^(F-\d+)/) ?? [])[1] ?? pk,
        module: comp,
        ux: null,        uxDone: false,
        backend: null,   beDone: false,
        integration: null, intDone: false,
        frontend: null,  feDone: false,
      }
    }
    if (pk) {
      if (disc === 'UX') { flowMap[pk].ux = statusName; if (isDone) flowMap[pk].uxDone = true }
      else if (disc === 'Backend') { flowMap[pk].backend = statusName; if (isDone) flowMap[pk].beDone = true }
      else if (disc === 'Integration') { flowMap[pk].integration = statusName; if (isDone) flowMap[pk].intDone = true }
      else if (disc === 'Frontend') { flowMap[pk].frontend = statusName; if (isDone) flowMap[pk].feDone = true }
    }

    // Per-discipline totals/done count the same population as the denominator —
    // every non-Phase-2 subtask of this discipline — so "all done" reads as 100%
    // even when a discipline isn't broken out on every flow.
    const lower     = statusName.toLowerCase()
    const isBlocked = !isDone && lower.includes('block')
    const isProg    = !isDone && !isBlocked && lower.includes('progress')
    if (disc === 'UX') { uxTotal++; if (isDone) uxDone++; else if (isBlocked) uxBlocked++; else if (isProg) uxProg++ }
    else if (disc === 'Backend') { beTotal++; if (isDone) beDone++; else if (isBlocked) beBlocked++; else if (isProg) beProg++ }
    else if (disc === 'Integration') { intTotal++; if (isDone) intDone++; else if (isBlocked) intBlocked++; else if (isProg) intProg++ }
    else if (disc === 'Frontend') { feTotal++; if (isDone) feDone++; else if (isBlocked) feBlocked++; else if (isProg) feProg++ }

    // Due-date bucket for this open subtask, keyed by its own duedate.
    if (!isDone) {
      const dk = DISC_DUE_KEY[disc]
      if (dk) {
        const dd = iss.fields.duedate ?? null
        const bucket = !dd ? 'noDate'
          : dd < todayStr ? 'overdue'
          : dd === todayStr ? 'today'
          : 'upcoming'
        due[dk][bucket]++
        // Track the soonest open due date ("YYYY-MM-DD" sorts chronologically).
        if (dd && (due[dk].nearest === null || dd < due[dk].nearest)) due[dk].nearest = dd
      }
    }

    const m = modMap[comp]
    if (m) {
      m.flowKeys.add(pk)
      if (disc === 'UX') { m.uxT++; if (isDone) m.uxD++ }
      else if (disc === 'Backend') { m.beT++; if (isDone) m.beD++ }
      else if (disc === 'Integration') { m.inT++; if (isDone) m.inD++ }
      else if (disc === 'Frontend') { m.feT++; if (isDone) m.feD++ }
    }

    // Recap rows — shared shape for the "done"/"in progress" lists.
    const recapRow = () => ({
      key: iss.key,
      discipline: disc,
      flowKey: pk,
      flowName: ps.replace(/^F-\d+\s*/, '').trim() || ps,
      flowCode: (ps.match(/^(F-\d+)/) ?? [])[1] ?? '',
      status: statusName,
    })

    // Collect anything completed in the last day for the recap panel.
    if (isDone) {
      const when = iss.fields.statuscategorychangedate ?? iss.fields.resolutiondate ?? null
      if (when && new Date(when).getTime() >= recentCutoff) {
        doneRecently.push({ ...recapRow(), when })
      }
    } else if (iss.fields.status?.statusCategory?.key === 'indeterminate') {
      // Jira's "indeterminate" category = actively in progress.
      inProgress.push(recapRow())
    }
  }

  doneRecently.sort((a, b) => new Date(b.when) - new Date(a.when))

  // Count fully-done flows per module
  for (const flow of Object.values(flowMap)) {
    const m = modMap[flow.module]
    if (!m) continue
    const uxOk  = flow.ux          === null || flow.uxDone
    const beOk  = flow.backend     === null || flow.beDone
    const intOk = flow.integration === null || flow.intDone
    const feOk  = flow.frontend    === null || flow.feDone
    const hasAny = flow.ux !== null || flow.backend !== null || flow.integration !== null || flow.frontend !== null
    if (hasAny && uxOk && beOk && intOk && feOk) m.flowsDone++
  }

  const flows = Object.values(flowMap).sort((a, b) => {
    const na = parseInt((a.code.match(/\d+/) ?? ['9999'])[0])
    const nb = parseInt((b.code.match(/\d+/) ?? ['9999'])[0])
    return na - nb
  })

  // Exclude Phase 2 from doneWeek
  const filteredDoneWeek = doneWeek.filter(s => {
    const pk = s.fields?.parent?.key ?? ''
    return !phase2FlowKeys.has(pk)
  })

  // Total flows = Phase 1 flow issues fetched from Jira (every flow whose parent
  // epic is a known Phase 1 module). Computed each fetch so it tracks Jira — never
  // hard-coded. Falls back to the distinct flows seen in subtasks when rawFlows is
  // empty (e.g. the component-tag code path).
  const totalFlows = Object.keys(flowModuleMap).length || Object.keys(flowMap).length

  // ── Velocity & forecast (Path B, mobile-scoped) ───────────────────────────
  // Weekly throughput from the trailing-window completions, a rolling average
  // over the last ROLLING_WEEKS FULL weeks (the current partial week is excluded
  // so a mid-week batch-close can't distort it), and a projected finish band
  // from remaining open work ÷ velocity.
  const doneTrailing = opts.doneTrailing ?? []
  const isMobileDone = (s) => {
    const pk = s.fields?.parent?.key ?? ''
    if (phase2FlowKeys.has(pk)) return false
    return rawFlows.length > 0 ? !!flowModuleMap[pk] : true
  }
  const mondayOf = (d) => {
    const x = new Date(d); x.setHours(0, 0, 0, 0)
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7))
    return x
  }
  const dateFmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const weekCounts = new Map()   // monday-ms → completions
  for (const s of doneTrailing) {
    if (!isMobileDone(s)) continue
    const when = s.fields?.statuscategorychangedate ?? s.fields?.resolutiondate
    if (!when) continue
    const k = mondayOf(when).getTime()
    weekCounts.set(k, (weekCounts.get(k) ?? 0) + 1)
  }

  const curMon = mondayOf(now)
  const DISPLAY_WEEKS = 6
  const ROLLING_WEEKS = 4
  const weeks = []
  for (let i = DISPLAY_WEEKS - 1; i >= 0; i--) {
    const m = new Date(curMon); m.setDate(m.getDate() - i * 7)
    weeks.push({ label: dateFmt(m), count: weekCounts.get(m.getTime()) ?? 0, isCurrent: i === 0 })
  }
  const fullWeekCounts = []
  for (let i = 1; i <= ROLLING_WEEKS; i++) {
    const m = new Date(curMon); m.setDate(m.getDate() - i * 7)
    fullWeekCounts.push(weekCounts.get(m.getTime()) ?? 0)
  }
  const velAvg = fullWeekCounts.reduce((a, b) => a + b, 0) / ROLLING_WEEKS
  const velMin = Math.min(...fullWeekCounts)
  const velMax = Math.max(...fullWeekCounts)

  const openTotal = Math.max(0,
    (uxTotal - uxDone) + (feTotal - feDone) + (beTotal - beDone) + (intTotal - intDone))
  const addDays = (days) => {
    const d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + Math.round(days)); return d
  }
  let forecast
  if (velAvg > 0 && openTotal > 0) {
    const proj = addDays((openTotal / velAvg) * 7)
    // Forecast band: ±25% around the rolling pace. Deliberately NOT the raw weekly
    // min/max — a single reconciliation-gap week would otherwise throw the slow
    // bound out by months. The true weekly spread still shows on the chart caption.
    const low  = addDays((openTotal / (velAvg * 1.25)) * 7)   // ~25% faster → earliest
    const high = addDays((openTotal / (velAvg * 0.75)) * 7)   // ~25% slower → latest
    forecast = {
      open: openTotal,
      weeksToGo: openTotal / velAvg,
      projDate: proj.toISOString(),
      projLabel: dateFmt(proj),
      rangeLabel: `${dateFmt(low)} – ${dateFmt(high)}`,
    }
  } else {
    forecast = { open: openTotal, weeksToGo: null, projDate: null, projLabel: '—', rangeLabel: 'not enough recent throughput' }
  }
  const velocity = { weeks, avg: velAvg, min: velMin, max: velMax, rollingWeeks: ROLLING_WEEKS }
  const estimate = {
    openTotal: estOpenTotal,
    openWithEst: estOpenWithEst,
    coveragePct: estOpenTotal === 0 ? 0 : Math.round((estOpenWithEst / estOpenTotal) * 100),
  }

  return {
    velocity,
    forecast,
    estimate,
    stats: {
      uxDone, beDone, intDone, feDone,
      uxTotal, beTotal, intTotal, feTotal,
      uxProg, beProg, intProg, feProg,
      uxBlocked, beBlocked, intBlocked, feBlocked,
      due,
    },
    modules: moduleOrder.map(n => modMap[n]).filter(Boolean),
    flows,
    doneWeek: filteredDoneWeek,
    doneRecently,
    inProgress,
    totalFlows,
  }
}
