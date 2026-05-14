export const MODULE_ORDER = [
  'Authentication & Authorization',
  'Registration & Onboarding Flow',
  'Live Tracking & Map',
  'Trip History & Replay',
  'Vehicle Health & Diagnostics',
  'Alerts & Notifications',
  'Driver Safety & Scoring',
  'Safety & Security',
  'Fleet & Business Management',
  'Settings & Profile',
]

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
]

export const TOTAL_FLOWS = 51

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

export function processData(subtasks, rawFlows = [], doneWeek = []) {
  // Build flowKey → module name from the Jira hierarchy (flow's parent epic)
  // This is authoritative — only flows whose parent epic is a known Phase 1 module get counted.
  const flowModuleMap = {}
  const phase2FlowKeys = new Set()
  for (const flow of rawFlows) {
    const parentSummary = flow.fields?.parent?.fields?.summary ?? ''
    if (/phase\s*2/i.test(parentSummary)) {
      phase2FlowKeys.add(flow.key)
    } else if (MODULE_ORDER.includes(parentSummary)) {
      flowModuleMap[flow.key] = parentSummary
    }
  }
  // Module buckets
  const modMap = {}
  MODULE_ORDER.forEach((name, i) => {
    modMap[name] = {
      name,
      color: MODULE_COLORS[i],
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

  for (const iss of subtasks) {
    const disc = (iss.fields.summary ?? '').trim()        // "UX" | "Backend" | "Integration"
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

    if (disc === 'UX') { if (isDone) uxDone++ }
    else if (disc === 'Backend') { if (isDone) beDone++ }
    else if (disc === 'Integration') { if (isDone) intDone++ }
    else if (disc === 'Frontend') { if (isDone) feDone++ }

    const m = modMap[comp]
    if (m) {
      m.flowKeys.add(pk)
      if (disc === 'UX') { m.uxT++; if (isDone) m.uxD++ }
      else if (disc === 'Backend') { m.beT++; if (isDone) m.beD++ }
      else if (disc === 'Integration') { m.inT++; if (isDone) m.inD++ }
      else if (disc === 'Frontend') { m.feT++; if (isDone) m.feD++ }
    }
  }

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

  return {
    stats: { uxDone, beDone, intDone, feDone },
    modules: MODULE_ORDER.map(n => modMap[n]).filter(Boolean),
    flows,
    doneWeek: filteredDoneWeek,
  }
}
