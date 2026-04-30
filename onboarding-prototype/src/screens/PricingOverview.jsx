import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, ChevronLeft, ChevronRight, Users, Truck, Building2,
  MapPin, Zap, Shield, BarChart3, Headphones, UserCheck,
  Fuel, Wrench, Download, Bell, Phone, Star, Globe,
  LayoutDashboard, Route, Clock, AlertTriangle,
} from 'lucide-react'
import ProgressBar from './ProgressBar.jsx'
import { screenBase, PrimaryButton, glassCard } from './SignUp.jsx'

/* ─── Plan Data ─────────────────────────────────────────────────────────── */

const PLANS = [
  {
    id: 'personal',
    name: 'Personal',
    tagline: 'For families & personal use',
    Icon: Users,
    color: '#60a5fa',
    colorBg: 'rgba(96,165,250,0.12)',
    colorBorder: 'rgba(96,165,250,0.26)',
    colorGlow: 'rgba(96,165,250,0.08)',
    vehicles: 'Up to 3 vehicles',
    drivers: '1 driver profile',
    price: { monthly: 9.65, annual: 7.99 },
    annualSaving: 20,
    highlights: [
      'Real-time GPS tracking',
      'Speed & geofence alerts',
      '30-day trip history',
    ],
    forProfiles: ['Families tracking teen drivers', 'Personal vehicle security', 'Monitoring elderly relatives'],
    features: {
      tracking: [
        { Icon: MapPin,       text: 'Real-time GPS tracking' },
        { Icon: Zap,          text: 'Speed & trip alerts' },
        { Icon: Shield,       text: 'Geofence zones (up to 5)' },
        { Icon: Route,        text: '30-day trip history' },
        { Icon: Clock,        text: 'Live map view' },
      ],
      fleet: [
        { Icon: Users,        text: 'Up to 3 vehicles' },
        { Icon: UserCheck,    text: 'Single driver profile' },
        { Icon: AlertTriangle,text: 'Vehicle health status' },
      ],
      reporting: [
        { Icon: BarChart3,    text: 'Monthly mileage report' },
        { Icon: Route,        text: 'Trip summary export' },
      ],
      support: [
        { Icon: Headphones,   text: 'In-app help centre' },
        { Icon: Bell,         text: 'Email support (48 h)' },
      ],
    },
    includedFrom: null,
    recommended: false,
  },
  {
    id: 'fleet',
    name: 'Fleet',
    tagline: 'For small businesses & growing teams',
    Icon: Truck,
    color: '#C8FF00',
    colorBg: 'rgba(200,255,0,0.1)',
    colorBorder: 'rgba(200,255,0,0.28)',
    colorGlow: 'rgba(200,255,0,0.08)',
    vehicles: 'Up to 20 vehicles',
    drivers: 'Up to 10 drivers',
    price: { monthly: 29, annual: 23.99 },
    annualSaving: 60,
    highlights: [
      'Driver behaviour scoring',
      'Fuel tracking & maintenance',
      'Advanced reports + CSV export',
    ],
    forProfiles: ['Small delivery fleets', 'Field service & repair crews', 'Construction & equipment teams'],
    features: {
      tracking: [
        { Icon: MapPin,       text: 'Idle time & stopover alerts' },
        { Icon: Shield,       text: 'Custom geofence rules (up to 50)' },
        { Icon: Zap,          text: 'Live driver status board' },
        { Icon: Bell,         text: 'Arrival / departure notifications' },
      ],
      fleet: [
        { Icon: Users,        text: 'Up to 20 vehicles' },
        { Icon: UserCheck,    text: 'Up to 10 driver profiles' },
        { Icon: Star,         text: 'Driver behaviour scoring' },
        { Icon: Fuel,         text: 'Fuel tracking & expense log' },
        { Icon: Wrench,       text: 'Maintenance reminders & service alerts' },
        { Icon: Route,        text: 'Route replay (90 days)' },
        { Icon: LayoutDashboard, text: 'Fleet operations dashboard' },
      ],
      reporting: [
        { Icon: BarChart3,    text: 'Advanced trip reports' },
        { Icon: Download,     text: 'CSV & PDF export' },
        { Icon: UserCheck,    text: 'Driver scorecards' },
        { Icon: Route,        text: '90-day trip history' },
        { Icon: Bell,         text: 'Slack & email alerts' },
      ],
      support: [
        { Icon: Headphones,   text: 'Priority email support (24 h)' },
        { Icon: Phone,        text: 'Onboarding setup call' },
      ],
    },
    includedFrom: 'Personal',
    recommended: true,
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For mid-size companies & operations',
    Icon: Building2,
    color: '#a78bfa',
    colorBg: 'rgba(167,139,250,0.1)',
    colorBorder: 'rgba(167,139,250,0.26)',
    colorGlow: 'rgba(167,139,250,0.06)',
    vehicles: 'Unlimited vehicles',
    drivers: 'Unlimited drivers',
    price: { monthly: 79, annual: 65 },
    annualSaving: 168,
    highlights: [
      'API access & white-label reports',
      'Dedicated account manager',
      'Custom KPI dashboards',
    ],
    forProfiles: ['Regional logistics companies', 'Franchise & multi-site ops', 'Government & enterprise fleets'],
    features: {
      tracking: [
        { Icon: MapPin,       text: 'Custom alert thresholds' },
        { Icon: Shield,       text: 'Multi-location zone management' },
        { Icon: Zap,          text: 'Real-time traffic overlays' },
        { Icon: Globe,        text: 'Cross-region fleet visibility' },
      ],
      fleet: [
        { Icon: Users,        text: 'Unlimited vehicles' },
        { Icon: UserCheck,    text: 'Unlimited driver profiles' },
        { Icon: LayoutDashboard, text: 'Multi-admin accounts' },
        { Icon: Truck,        text: 'Sub-fleet grouping & tagging' },
        { Icon: Globe,        text: 'API access (REST + webhooks)' },
        { Icon: Download,     text: 'White-label report branding' },
      ],
      reporting: [
        { Icon: Route,        text: '1-year trip history archive' },
        { Icon: BarChart3,    text: 'Custom report builder' },
        { Icon: LayoutDashboard, text: 'KPI dashboards' },
        { Icon: Bell,         text: 'Automated scheduled reports' },
        { Icon: Shield,       text: 'Audit trail & compliance logs' },
      ],
      support: [
        { Icon: UserCheck,    text: 'Dedicated account manager' },
        { Icon: Phone,        text: 'Phone support + 4 h SLA' },
        { Icon: Star,         text: 'Custom onboarding programme' },
        { Icon: Headphones,   text: 'Priority bug escalation' },
      ],
    },
    includedFrom: 'Fleet',
    recommended: false,
  },
]

const CATEGORY_META = {
  tracking:  { label: 'Tracking & Alerts',   Icon: MapPin },
  fleet:     { label: 'Fleet Management',     Icon: Truck },
  reporting: { label: 'Reporting & Analytics',Icon: BarChart3 },
  support:   { label: 'Support',              Icon: Headphones },
}

/* ─── Billing Toggle ────────────────────────────────────────────────────── */

function BillingToggle({ annual, onChange }) {
  return (
    <div style={{
      display: 'flex',
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      padding: 4,
      position: 'relative',
    }}>
      <motion.div
        animate={{ x: annual ? '100%' : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          position: 'absolute',
          top: 4, bottom: 4,
          width: 'calc(50% - 4px)',
          background: 'rgba(200,255,0,0.12)',
          borderRadius: 10,
          border: '1px solid rgba(200,255,0,0.25)',
          boxShadow: '0 0 12px rgba(200,255,0,0.08)',
        }}
      />
      {['Monthly', 'Annual'].map((label, i) => (
        <button
          key={label}
          onClick={() => onChange(i === 1)}
          style={{
            flex: 1, padding: '9px 0',
            background: 'none', border: 'none',
            color: (i === 1) === annual ? '#C8FF00' : 'rgba(255,255,255,0.42)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            position: 'relative', zIndex: 1,
            fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'color 0.2s',
          }}
        >
          {label}
          {i === 1 && (
            <span style={{
              fontSize: 10,
              background: 'rgba(74,222,128,0.14)',
              color: '#4ade80',
              padding: '2px 7px', borderRadius: 99,
              fontWeight: 700,
              border: '1px solid rgba(74,222,128,0.2)',
            }}>
              Save up to 17%
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

/* ─── Plan Card ─────────────────────────────────────────────────────────── */

function PlanCard({ plan, annual, onSelect, onViewDetail }) {
  const price = annual ? plan.price.annual : plan.price.monthly
  const { Icon } = plan

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        ...glassCard,
        padding: '20px',
        marginBottom: 12,
        position: 'relative',
        overflow: 'hidden',
        border: plan.recommended
          ? `1px solid ${plan.colorBorder}`
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: plan.recommended
          ? `0 0 40px ${plan.colorGlow}, 0 4px 24px rgba(0,0,0,0.3)`
          : '0 4px 24px rgba(0,0,0,0.2)',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -50, right: -50,
        width: 180, height: 180,
        background: `radial-gradient(circle, ${plan.colorBg} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Recommended badge */}
      {plan.recommended && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: plan.colorBg,
          border: `1px solid ${plan.colorBorder}`,
          borderRadius: 99,
          padding: '3px 10px',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Star size={9} fill={plan.color} color={plan.color} />
          <span style={{ color: plan.color, fontSize: 10.5, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
            Most Popular
          </span>
        </div>
      )}

      {/* Plan header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: plan.colorBg,
          border: `1px solid ${plan.colorBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={18} color={plan.color} />
        </div>
        <div>
          <div style={{ color: '#fff', fontSize: 17, fontWeight: 800, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.3px' }}>
            {plan.name}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11.5, fontFamily: 'Inter, sans-serif' }}>
            {plan.vehicles}
          </div>
        </div>
      </div>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: annual ? 8 : 14 }}>
        <motion.span
          key={price}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 34, fontWeight: 900, color: '#fff', lineHeight: 1, fontFamily: 'Inter, sans-serif', letterSpacing: '-1.5px' }}
        >
          ${price % 1 === 0 ? price : price.toFixed(2)}
        </motion.span>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>
          /mo{annual ? ', billed yearly' : ''}
        </span>
      </div>

      {/* Annual saving */}
      {annual && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            display: 'inline-flex', alignItems: 'center',
            gap: 4, marginBottom: 14,
            padding: '3px 10px',
            background: 'rgba(74,222,128,0.1)', borderRadius: 99,
            border: '1px solid rgba(74,222,128,0.18)',
          }}
        >
          <span style={{ color: '#4ade80', fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
            Save ${plan.annualSaving}/year
          </span>
        </motion.div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 14 }} />

      {/* Highlights */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {plan.highlights.map(h => (
          <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 99,
              background: plan.colorBg,
              border: `1px solid ${plan.colorBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Check size={10} color={plan.color} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12.5, fontFamily: 'Inter, sans-serif' }}>{h}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onViewDetail}
          style={{
            flex: 1, height: 40, borderRadius: 12,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}
        >
          Details <ChevronRight size={13} />
        </button>
        <button
          onClick={onSelect}
          style={{
            flex: 2, height: 40, borderRadius: 12,
            background: plan.recommended
              ? `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}cc 100%)`
              : plan.colorBg,
            border: `1px solid ${plan.colorBorder}`,
            color: plan.recommended ? '#000' : plan.color,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            boxShadow: plan.recommended ? `0 4px 16px ${plan.colorGlow}` : 'none',
          }}
        >
          Choose {plan.name}
        </button>
      </div>
    </motion.div>
  )
}

/* ─── Plan Detail View ──────────────────────────────────────────────────── */

function FeatureRow({ Icon, text, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 26, height: 26, borderRadius: 8, flexShrink: 0,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={13} color={color} />
      </div>
      <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>{text}</span>
    </div>
  )
}

function CategorySection({ categoryKey, features, planColor, initialDelay }) {
  const meta = CATEGORY_META[categoryKey]
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: initialDelay }}
      style={{ marginBottom: 20 }}
    >
      {/* Category header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <meta.Icon size={13} color={planColor} />
        <span style={{
          color: 'rgba(255,255,255,0.38)',
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif',
        }}>
          {meta.label}
        </span>
      </div>
      <div style={{
        ...glassCard,
        padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: 12,
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        {features.map(f => (
          <FeatureRow key={f.text} Icon={f.Icon} text={f.text} color={planColor} />
        ))}
      </div>
    </motion.div>
  )
}

function PlanDetailView({ plan, annual, onToggleBilling, onSelect, onBack }) {
  const price = annual ? plan.price.annual : plan.price.monthly
  const { Icon } = plan

  return (
    <div style={{ ...screenBase, paddingTop: 44 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 20px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button
          onClick={onBack}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff', flexShrink: 0,
          }}
        >
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.3px' }}>
            {plan.name} Plan
          </div>
          <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11.5, fontFamily: 'Inter, sans-serif' }}>
            {plan.vehicles} · {plan.drivers}
          </div>
        </div>
        {plan.recommended && (
          <div style={{
            background: plan.colorBg,
            border: `1px solid ${plan.colorBorder}`,
            borderRadius: 99, padding: '3px 10px',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Star size={9} fill={plan.color} color={plan.color} />
            <span style={{ color: plan.color, fontSize: 10, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>Popular</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0' }}>
        {/* Hero price card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            ...glassCard,
            padding: '20px',
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${plan.colorBorder}`,
            boxShadow: `0 0 40px ${plan.colorGlow}`,
          }}
        >
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 200, height: 200,
            background: `radial-gradient(circle, ${plan.colorBg} 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: plan.colorBg,
              border: `1px solid ${plan.colorBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={22} color={plan.color} />
            </div>
            <div>
              <div style={{ color: plan.color, fontSize: 13, fontWeight: 700, fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>
                Tracklynk {plan.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.48)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
                {plan.tagline}
              </div>
            </div>
          </div>

          {/* Billing toggle */}
          <BillingToggle annual={annual} onChange={onToggleBilling} />

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
            <motion.span
              key={price}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 46, fontWeight: 900, color: '#fff', lineHeight: 1, fontFamily: 'Inter, sans-serif', letterSpacing: '-2px' }}
            >
              ${price % 1 === 0 ? price : price.toFixed(2)}
            </motion.span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>
              /mo{annual ? ', billed yearly' : ''}
            </span>
          </div>

          {annual && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                marginTop: 8, padding: '4px 12px',
                background: 'rgba(74,222,128,0.1)', borderRadius: 99,
                border: '1px solid rgba(74,222,128,0.18)',
              }}
            >
              <span style={{ color: '#4ade80', fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                You save ${plan.annualSaving} vs monthly billing
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* "Perfect for" section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 20 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Star size={13} color={plan.color} />
            <span style={{
              color: 'rgba(255,255,255,0.38)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif',
            }}>
              Perfect For
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {plan.forProfiles.map((profile, i) => (
              <div
                key={profile}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                }}
              >
                <div style={{
                  width: 6, height: 6, borderRadius: 99,
                  background: plan.color, flexShrink: 0,
                }} />
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
                  {profile}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* "Everything in X, plus:" note */}
        {plan.includedFrom && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 14px', marginBottom: 20,
              background: `${plan.colorBg}`,
              border: `1px solid ${plan.colorBorder}`,
              borderRadius: 12,
            }}
          >
            <Check size={14} color={plan.color} />
            <span style={{ color: plan.color, fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              Everything in {plan.includedFrom}, plus:
            </span>
          </motion.div>
        )}

        {/* Feature categories */}
        {Object.entries(plan.features).map(([key, features], i) => (
          <CategorySection
            key={key}
            categoryKey={key}
            features={features}
            planColor={plan.color}
            initialDelay={0.2 + i * 0.06}
          />
        ))}

        {/* Fine print */}
        <p style={{
          color: 'rgba(255,255,255,0.2)',
          fontSize: 11, textAlign: 'center',
          lineHeight: 1.7, marginBottom: 8,
          fontFamily: 'Inter, sans-serif',
          padding: '0 8px',
        }}>
          No contract required. Cancel or change plan any time from Settings.
          Prices in USD, exclusive of applicable taxes.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ padding: '14px 20px 48px' }}
      >
        <PrimaryButton
          onClick={onSelect}
          label={`Start ${plan.name} — $${price % 1 === 0 ? price : price.toFixed(2)}/mo`}
        />
      </motion.div>
    </div>
  )
}

/* ─── Main Export ───────────────────────────────────────────────────────── */

export default function PricingOverview({ next, back, step, total }) {
  const [annual, setAnnual] = useState(false)
  const [detailPlan, setDetailPlan] = useState(null)

  const handleSelect = (plan) => {
    next()
  }

  return (
    <AnimatePresence mode="popLayout">
      {detailPlan ? (
        <motion.div
          key="detail"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          style={{ position: 'absolute', inset: 0, zIndex: 10 }}
        >
          <PlanDetailView
            plan={detailPlan}
            annual={annual}
            onToggleBilling={setAnnual}
            onSelect={() => handleSelect(detailPlan)}
            onBack={() => setDetailPlan(null)}
          />
        </motion.div>
      ) : (
        <motion.div
          key="overview"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <div style={{ ...screenBase }}>
            <ProgressBar current={step} total={total} onBack={back} title="Choose Your Plan" />

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 0' }}>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                style={{ marginBottom: 20 }}
              >
                <h2 style={{
                  fontSize: 24, fontWeight: 800, color: '#fff',
                  marginBottom: 4, letterSpacing: '-0.5px',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  Simple, transparent pricing
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
                  No hidden fees. Upgrade or cancel any time.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12 }}
                style={{ marginBottom: 20 }}
              >
                <BillingToggle annual={annual} onChange={setAnnual} />
              </motion.div>

              {PLANS.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 + i * 0.07 }}
                >
                  <PlanCard
                    plan={plan}
                    annual={annual}
                    onSelect={() => handleSelect(plan)}
                    onViewDetail={() => setDetailPlan(plan)}
                  />
                </motion.div>
              ))}

              <p style={{
                color: 'rgba(255,255,255,0.2)',
                fontSize: 11, textAlign: 'center',
                lineHeight: 1.7, paddingBottom: 16,
                fontFamily: 'Inter, sans-serif',
              }}>
                Your card won't be charged until setup is complete.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
