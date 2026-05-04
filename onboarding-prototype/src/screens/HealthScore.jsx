import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Shield, Activity, Car,
  Navigation2, Zap, Clock, MapPin, Gauge,
  BatteryMedium, Thermometer, Fuel, Wrench, AlertCircle,
  Info, AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, Circle
} from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const DRIVER_SCORE  = 78
const VEHICLE_SCORE = 84

const DRIVER_FACTORS = [
  {
    key: 'speeding', label: 'Speeding Events', weight: 25, score: 80,
    Icon: Navigation2, detail: '2 events this week',
    severity: { label: '1 event at 82 mph — high severity', level: 'high' },
    tip: 'Staying under 8 mph over the limit would raise this sub-score.', impact: null,
  },
  {
    key: 'braking', label: 'Hard Braking', weight: 20, score: 68,
    Icon: Activity, detail: '5 hard stops detected',
    severity: { label: '1 hard stop at 61 mph — high severity', level: 'high' },
    tip: 'More following distance reduces hard-braking events.', impact: '+6 pts',
  },
  {
    key: 'acceleration', label: 'Rapid Acceleration', weight: 15, score: 85,
    Icon: Zap, detail: '1 event this week',
    severity: null, tip: null, impact: null,
  },
  {
    key: 'cornering', label: 'Harsh Cornering', weight: 15, score: 72,
    Icon: Navigation2, detail: '3 sharp turns detected',
    severity: null, tip: 'Slowing before turns improves your cornering score.', impact: '+4 pts',
  },
  {
    key: 'timeOfDay', label: 'Time of Day', weight: 10, score: 90,
    Icon: Clock, detail: 'No late-night driving',
    severity: null, tip: null, impact: null,
  },
  {
    key: 'miles', label: 'Miles Driven', weight: 10, score: 76,
    Icon: MapPin, detail: '312 mi this week',
    severity: null, tip: null, impact: null,
  },
  {
    key: 'idle', label: 'Idle Time', weight: 5, score: 88,
    Icon: Gauge, detail: '4 min avg idle per trip',
    severity: null, tip: null, impact: null,
  },
]

const DTC_HISTORY = [
  { code: 'P0420', label: 'Catalyst Efficiency Below Threshold', system: 'Emissions', status: 'cleared', when: 'Cleared 12 days ago' },
]

const VEHICLE_FACTORS = [
  {
    key: 'dtc', label: 'Active Fault Codes', weight: 30, score: 95,
    Icon: AlertCircle, detail: 'No active codes · 1 recently cleared',
    severity: null, tip: null, impact: null,
  },
  {
    key: 'battery', label: 'Battery Health', weight: 20, score: 88,
    Icon: BatteryMedium, detail: '12.7V at rest — Good',
    severity: null, tip: null, impact: null,
  },
  {
    key: 'engine', label: 'Engine Temperature', weight: 15, score: 82,
    Icon: Thermometer, detail: 'Running in normal range',
    severity: null, tip: null, impact: null,
  },
  {
    key: 'fuel', label: 'Fuel System Health', weight: 15, score: 74,
    Icon: Fuel, detail: 'O2 sensor reading lean',
    severity: null,
    tip: 'A lean fuel trim may indicate a small vacuum leak. Consider scheduling a check.',
    impact: '+5 pts',
  },
  {
    key: 'maintenance', label: 'Maintenance Compliance', weight: 10, score: 62,
    Icon: Wrench, detail: 'Oil change due in ~200 mi',
    severity: null,
    tip: 'Staying current on oil changes protects your engine and your score.',
    impact: '+8 pts',
  },
  {
    key: 'mileage', label: 'Overall Mileage', weight: 10, score: 85,
    Icon: Car, detail: '47,320 mi odometer',
    severity: null, tip: null, impact: null,
  },
]

const MAINTENANCE_ITEMS = [
  { label: 'Oil Change',      due: '~200 mi',    urgency: 'urgent',   impact: '+8 pts' },
  { label: 'Tire Rotation',   due: '~1,200 mi',  urgency: 'upcoming', impact: null },
  { label: 'Air Filter',      due: '~4,800 mi',  urgency: 'ok',       impact: null },
  { label: 'Brake Fluid',     due: '~8,100 mi',  urgency: 'ok',       impact: null },
]

const WEEKLY_DRIVER  = [72, 74, 73, 76, 75, 77, 78]
const WEEKLY_VEHICLE = [81, 82, 80, 83, 84, 83, 84]

const PEER = {
  driver:  { percentile: 68, monthDelta: +4 },
  vehicle: { percentile: 72, monthDelta: +2 },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreGrade(s) {
  if (s >= 90) return 'A'
  if (s >= 80) return 'B+'
  if (s >= 70) return 'B'
  if (s >= 60) return 'C+'
  return 'C'
}
function scoreLabel(s) {
  if (s >= 90) return 'Excellent'
  if (s >= 75) return 'Good'
  if (s >= 60) return 'Fair'
  return 'Needs Attention'
}
function scoreColor(s) {
  if (s >= 85) return '#4ade80'
  if (s >= 70) return '#C8FF00'
  if (s >= 55) return '#facc15'
  return '#f87171'
}

// ─── Illustrations ────────────────────────────────────────────────────────────

function SteeringWheel({ color, size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="18" stroke={color} strokeWidth="2.8" />
      <circle cx="22" cy="22" r="4.5" fill={color} />
      <line x1="22" y1="17.5" x2="22" y2="4"    stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <line x1="17.5" y1="24.5" x2="6.2" y2="31"  stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <line x1="26.5" y1="24.5" x2="37.8" y2="31" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

function CarSide({ color, size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <path d="M4 28 L4 22 Q4 20 6 20 L10 20 L16 13 Q17.5 11.5 20 11.5 L28 11.5 Q30.5 11.5 32 13 L36 20 L39 20 Q41 20 41 22 L41 28 Q41 30 39 30 L36.5 30"
        stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <line x1="4" y1="30" x2="11.5" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="13" cy="30" r="4" stroke={color} strokeWidth="2.5" />
      <circle cx="33" cy="30" r="4" stroke={color} strokeWidth="2.5" />
      <path d="M17 19.5 L21 14 Q22 13 23.5 13 L27 13 Q29 13 30 14.5 L33 19.5 Z" fill={color} opacity="0.35" />
    </svg>
  )
}

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 130, stroke = 11, color }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.3, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
      />
    </svg>
  )
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ data, color }) {
  const w = 140, h = 32
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h * 0.75) - h * 0.1,
  ])
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => i === pts.length - 1
        ? <circle key={i} cx={x} cy={y} r={3} fill={color} />
        : null
      )}
    </svg>
  )
}

// ─── DTC expandable row ───────────────────────────────────────────────────────

function DTCRow({ factor, delay, tabColor }) {
  const [open, setOpen] = useState(false)
  const { label, weight, score, Icon, detail } = factor
  const color = scoreColor(score)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
      style={{ paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginTop: 1, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={13} color={color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 650, color: '#fff', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.40)' }}>{detail}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 500, marginTop: 3 }}>{weight}% wt.</div>
        </div>
      </div>

      <div style={{ marginTop: 10, marginLeft: 38, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: delay + 0.1 }}
          style={{ height: '100%', borderRadius: 2, background: `${color}55` }}
        />
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          marginTop: 10, marginLeft: 38,
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: tabColor }}>View code history</span>
        {open
          ? <ChevronUp size={11} color={tabColor} />
          : <ChevronDown size={11} color={tabColor} />
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden', marginLeft: 38, marginTop: 8 }}
          >
            {DTC_HISTORY.map(dtc => (
              <div key={dtc.code} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '10px 12px',
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <div style={{
                  background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.20)',
                  borderRadius: 6, padding: '2px 7px', flexShrink: 0, marginTop: 1,
                }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#4ade80', fontFamily: 'monospace' }}>{dtc.code}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.80)', marginBottom: 2 }}>{dtc.label}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)' }}>{dtc.system}</span>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.20)', flexShrink: 0 }} />
                    <span style={{ fontSize: 10.5, color: '#4ade80' }}>{dtc.when}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Factor row ───────────────────────────────────────────────────────────────

function FactorRow({ factor, delay, tabColor }) {
  const { label, weight, score, Icon, detail, severity, tip, impact } = factor
  const color = scoreColor(score)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
      style={{ paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginTop: 1, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={13} color={color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 650, color: '#fff', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.40)' }}>{detail}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 500, marginTop: 3 }}>{weight}% wt.</div>
        </div>
      </div>

      <div style={{ marginTop: 10, marginLeft: 38, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: delay + 0.1 }}
          style={{ height: '100%', borderRadius: 2, background: `${color}55` }}
        />
      </div>

      {/* Severity flag */}
      {severity && (
        <div style={{
          marginTop: 9, marginLeft: 38,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.18)',
          borderRadius: 8, padding: '5px 9px',
        }}>
          <AlertTriangle size={11} color="#f87171" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: '#f87171', fontWeight: 600 }}>{severity.label}</span>
        </div>
      )}

      {/* Tip + score impact */}
      {tip && (
        <div style={{ marginTop: 9, marginLeft: 38, display: 'flex', alignItems: 'flex-start', gap: 7 }}>
          <Info size={11} color={tabColor} style={{ marginTop: 1, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.50)', lineHeight: 1.5 }}>{tip}</span>
            {impact && (
              <span style={{
                marginLeft: 6,
                fontSize: 11, fontWeight: 700, color: tabColor,
                background: `${tabColor}12`, borderRadius: 5,
                padding: '1px 6px', whiteSpace: 'nowrap',
              }}>
                {impact} potential
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── Maintenance timeline ─────────────────────────────────────────────────────

function MaintenanceTimeline({ tabColor }) {
  const urgencyColor = (u) => u === 'urgent' ? '#f87171' : u === 'upcoming' ? '#facc15' : '#4ade80'
  const urgencyLabel = (u) => u === 'urgent' ? 'Due soon' : u === 'upcoming' ? 'Upcoming' : 'On track'

  return (
    <div style={{ padding: '0 20px 20px' }}>
      <div style={{ height: 1, background: `${tabColor}18`, marginBottom: 18 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: 'rgba(255,255,255,0.70)' }}>Maintenance Schedule</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Next 4 items</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {MAINTENANCE_ITEMS.map((item, i) => {
          const uc = urgencyColor(item.urgency)
          const isLast = i === MAINTENANCE_ITEMS.length - 1
          return (
            <div key={item.label} style={{ display: 'flex', gap: 12 }}>
              {/* Timeline spine */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: uc, flexShrink: 0, marginTop: 4, boxShadow: item.urgency === 'urgent' ? `0 0 8px ${uc}` : 'none' }} />
                {!isLast && <div style={{ width: 1.5, flex: 1, background: 'rgba(255,255,255,0.07)', marginTop: 3, marginBottom: 3 }} />}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingBottom: isLast ? 0 : 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: item.urgency === 'urgent' ? '#fff' : 'rgba(255,255,255,0.70)' }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: uc }}>{urgencyLabel(item.urgency)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Due in {item.due}</span>
                  {item.impact && (
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, color: tabColor,
                      background: `${tabColor}12`, borderRadius: 5, padding: '1px 6px',
                    }}>
                      {item.impact} potential
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function HealthScore() {
  const [tab, setTab] = useState('driver')
  const isDriver  = tab === 'driver'
  const score     = isDriver ? DRIVER_SCORE  : VEHICLE_SCORE
  const factors   = isDriver ? DRIVER_FACTORS : VEHICLE_FACTORS
  const sparkData = isDriver ? WEEKLY_DRIVER  : WEEKLY_VEHICLE
  const tabColor  = isDriver ? '#C8FF00' : '#4ade80'
  const ringColor = tabColor
  const delta     = sparkData[sparkData.length - 1] - sparkData[0]
  const peer      = PEER[tab]
  const topTip    = factors.find(f => f.tip && f.score < 80)

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#04050d',
      overflowY: 'auto', overflowX: 'hidden',
      paddingTop: 52, paddingBottom: 90,
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* ── Header ── */}
      <div style={{ padding: '0 22px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>Health Score</h1>
            <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', margin: '4px 0 0', fontWeight: 500 }}>
              Updated today · Model v1.0
            </p>
          </div>
          <div style={{ background: 'rgba(200,255,0,0.10)', border: '1px solid rgba(200,255,0,0.20)', borderRadius: 10, padding: '5px 11px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Shield size={12} color="#C8FF00" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C8FF00' }}>Active</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ padding: '0 22px 24px', display: 'flex', gap: 10 }}>

        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setTab('driver')} style={{
          flex: isDriver ? 1.7 : 1,
          background: isDriver ? 'rgba(200,255,0,0.08)' : 'rgba(255,255,255,0.04)',
          border: `1.5px solid ${isDriver ? 'rgba(200,255,0,0.32)' : 'rgba(255,255,255,0.10)'}`,
          borderRadius: 18, padding: '18px 12px 14px',
          cursor: 'pointer', transition: 'all 0.2s ease',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
          <SteeringWheel color={isDriver ? '#C8FF00' : 'rgba(255,255,255,0.40)'} size={42} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 28, fontWeight: 900, lineHeight: 1, color: isDriver ? '#fff' : 'rgba(255,255,255,0.65)' }}>{DRIVER_SCORE}</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.3px', color: isDriver ? '#C8FF00' : 'rgba(255,255,255,0.45)' }}>Driver</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: isDriver ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '3px 8px' }}>
            <TrendingUp size={9} color={isDriver ? '#4ade80' : 'rgba(255,255,255,0.30)'} />
            <span style={{ fontSize: 10, fontWeight: 700, color: isDriver ? '#4ade80' : 'rgba(255,255,255,0.35)' }}>+3 pts</span>
          </div>
        </motion.button>

        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setTab('vehicle')} style={{
          flex: !isDriver ? 1.7 : 1,
          background: !isDriver ? 'rgba(74,222,128,0.07)' : 'rgba(255,255,255,0.04)',
          border: `1.5px solid ${!isDriver ? 'rgba(74,222,128,0.28)' : 'rgba(255,255,255,0.10)'}`,
          borderRadius: 18, padding: '18px 12px 14px',
          cursor: 'pointer', transition: 'all 0.2s ease',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
          <CarSide color={!isDriver ? '#4ade80' : 'rgba(255,255,255,0.40)'} size={42} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 28, fontWeight: 900, lineHeight: 1, color: !isDriver ? '#fff' : 'rgba(255,255,255,0.65)' }}>{VEHICLE_SCORE}</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.3px', color: !isDriver ? '#4ade80' : 'rgba(255,255,255,0.45)' }}>Vehicle</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: !isDriver ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '3px 8px' }}>
            <TrendingUp size={9} color={!isDriver ? '#4ade80' : 'rgba(255,255,255,0.30)'} />
            <span style={{ fontSize: 10, fontWeight: 700, color: !isDriver ? '#4ade80' : 'rgba(255,255,255,0.35)' }}>+1 pt</span>
          </div>
        </motion.button>
      </div>

      {/* ── Contextual content ── */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
          <div style={{
            margin: '0 22px',
            background: 'rgba(255,255,255,0.03)',
            border: `1.5px solid ${ringColor}30`,
            borderRadius: 24, overflow: 'hidden',
            boxShadow: `0 0 28px ${ringColor}10`,
          }}>

            {/* ① Score ring + grade + peer benchmark + trend */}
            <div style={{ padding: '20px 20px 18px', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
                <ScoreRing score={score} size={130} stroke={11} color={ringColor} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <motion.span key={score} initial={{ scale: 0.75, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25, type: 'spring', stiffness: 400 }}
                    style={{ fontSize: 34, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                    {score}
                  </motion.span>
                  <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', marginTop: 2, fontWeight: 500 }}>/ 100</span>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 26, fontWeight: 900, color: ringColor }}>{scoreGrade(score)}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>{scoreLabel(score)}</span>
                </div>

                {/* ① Peer benchmark */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap', rowGap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${ringColor}10`, border: `1px solid ${ringColor}22`, borderRadius: 8, padding: '3px 8px' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: ringColor }}>Top {100 - peer.percentile}%</span>
                    <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.40)' }}>of {isDriver ? 'drivers' : 'vehicles'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <TrendingUp size={10} color="#4ade80" />
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: '#4ade80' }}>+{peer.monthDelta} pts vs last month</span>
                  </div>
                </div>

                {/* 7-day trend */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>7-day</span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: delta >= 0 ? '#4ade80' : '#f87171' }}>
                      {delta >= 0 ? '+' : ''}{delta} pts
                    </span>
                  </div>
                  <Sparkline data={sparkData} color={ringColor} />
                </div>
              </div>
            </div>

            {/* ② Top improvement tip with score impact */}
            {topTip && (
              <div style={{ margin: '0 20px 18px' }}>
                <div style={{ background: `${ringColor}08`, border: `1px solid ${ringColor}20`, borderRadius: 14, padding: '12px 14px', display: 'flex', gap: 10 }}>
                  <TrendingUp size={14} color={ringColor} style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: ringColor }}>Top Improvement Tip</span>
                      {topTip.impact && (
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: ringColor, background: `${ringColor}18`, borderRadius: 5, padding: '1px 7px' }}>
                          {topTip.impact} potential
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.58)', lineHeight: 1.5 }}>{topTip.tip}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: `${ringColor}18`, margin: '0 20px 18px' }} />

            {/* ③④⑤ Factor list */}
            <div style={{ padding: '0 20px 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'rgba(255,255,255,0.70)' }}>
                  {isDriver ? 'Driving Factors' : 'Vehicle Diagnostics'}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>{factors.length} factors</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {factors.map((f, i) =>
                  f.key === 'dtc'
                    ? <DTCRow key={f.key} factor={f} delay={i * 0.05} tabColor={tabColor} />
                    : <FactorRow key={f.key} factor={f} delay={i * 0.05} tabColor={tabColor} />
                )}
              </div>
            </div>

            {/* ④ Maintenance timeline — vehicle only */}
            {!isDriver && <MaintenanceTimeline tabColor={tabColor} />}

          </div>

          <p style={{ margin: '16px 22px 0', fontSize: 10.5, color: 'rgba(255,255,255,0.20)', lineHeight: 1.55, textAlign: 'center' }}>
            Scores use initial model weights, subject to calibration. Not an insurance rate determination.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
