export const DATE_MODES = {
  MONDAY: 'MONDAY',
  WEDNESDAY: 'WEDNESDAY',
  FRIDAY: 'FRIDAY',
  CUSTOM: 'CUSTOM',
}

export function getMostRecentMonday(from = new Date()) {
  const d = new Date(from)
  const day = d.getDay() // 0=Sun, 1=Mon, ..., 6=Sat
  const daysBack = day === 0 ? 6 : day - 1
  d.setDate(d.getDate() - daysBack)
  d.setHours(0, 0, 0, 0)
  return d
}

export function autoDetectMode() {
  const day = new Date().getDay()
  if (day === 1) return DATE_MODES.MONDAY
  if (day === 2 || day === 3) return DATE_MODES.WEDNESDAY
  return DATE_MODES.FRIDAY
}

export function getDateRange(mode, customStart, customEnd) {
  const now = new Date()
  const monday = getMostRecentMonday(now)

  if (mode === DATE_MODES.MONDAY) {
    return {
      start: monday,
      end: now,
      label: 'Targeting This Week',
      sublabel: "What we're prioritizing Monday → Friday",
    }
  }

  if (mode === DATE_MODES.WEDNESDAY) {
    return {
      start: monday,
      end: now,
      label: 'Midweek Progress',
      sublabel: "What's been completed so far this week",
    }
  }

  if (mode === DATE_MODES.FRIDAY) {
    const dayOfWeek = now.getDay()
    // If today is Friday (5), Saturday (6), or Sunday (0), use current week
    if (dayOfWeek >= 5 || dayOfWeek === 0) {
      const endOfToday = new Date(now)
      endOfToday.setHours(23, 59, 59, 999)
      return {
        start: monday,
        end: endOfToday,
        label: 'Weekly Recap',
        sublabel: 'Full week summary — what we shipped',
      }
    }
    // Before Friday — use previous week (prev Monday → prev Friday)
    const prevMonday = new Date(monday)
    prevMonday.setDate(monday.getDate() - 7)
    const prevFriday = new Date(prevMonday)
    prevFriday.setDate(prevMonday.getDate() + 4)
    prevFriday.setHours(23, 59, 59, 999)
    return {
      start: prevMonday,
      end: prevFriday,
      label: 'Weekly Recap',
      sublabel: 'Full week summary — what we shipped',
    }
  }

  // CUSTOM
  return {
    start: customStart ? new Date(customStart) : monday,
    end: customEnd ? new Date(customEnd) : now,
    label: 'Custom Range',
    sublabel: '',
  }
}

export function formatDisplayDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
