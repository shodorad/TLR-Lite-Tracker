import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Shield, MapPin } from 'lucide-react'
import ProgressBar from './ProgressBar'
import { glassCard } from '../styles/glass'
import { screenBase, headingStyle, subStyle, PrimaryButton } from './SignUp'
import { useUserContext } from '../context/UserContext'

const features = [
  { icon: MapPin, text: 'Real-time GPS tracking' },
  { icon: Zap,    text: 'Instant speed & trip alerts' },
  { icon: Shield, text: 'Geofence zones (polygons & circles)' },
  { icon: Check,  text: 'Unlimited trip history' },
  { icon: Check,  text: 'Multi-vehicle dashboard' },
]

interface ChoosePlanProps {
  next: () => void
  back: () => void
  step: number
  total: number
}

export default function ChoosePlan({ next, back, step, total }: ChoosePlanProps) {
  const { setPlan } = useUserContext()
  const [annual, setAnnual] = useState(false)

  const monthly   = 9.65
  const annualPer = 7.99
  const price     = annual ? annualPer : monthly
  const saving    = annual ? Math.round(monthly * 12 - annualPer * 12) : 0

  const handleNext = () => {
    setPlan({ type: annual ? 'annual' : 'monthly', price })
    next()
  }

  return (
    <div style={screenBase}>
      <ProgressBar current={step} total={total} onBack={back} title="Choose Your Plan" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 0' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 style={headingStyle}>Simple, transparent pricing</h2>
          <p style={subStyle}>No hidden fees. Cancel any time.</p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: 4,
            marginBottom: 20,
            position: 'relative',
          }}
        >
          <motion.div
            animate={{ x: annual ? '100%' : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'absolute',
              top: 4,
              bottom: 4,
              width: 'calc(50% - 4px)',
              background: 'rgba(200,255,0,0.14)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: 10,
              border: '1px solid rgba(200,255,0,0.28)',
              boxShadow: '0 0 12px rgba(200,255,0,0.1)',
            }}
          />
          {['Monthly', 'Annual'].map((label, i) => (
            <button
              key={label}
              onClick={() => setAnnual(i === 1)}
              style={{
                flex: 1,
                padding: '9px 0',
                background: 'none',
                border: 'none',
                color: (i === 1) === annual ? '#C8FF00' : 'rgba(255,255,255,0.42)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1,
                fontFamily: 'Inter, sans-serif',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              {label}
              {i === 1 && (
                <span style={{
                  fontSize: 10,
                  background: 'rgba(74,222,128,0.15)',
                  color: '#4ade80',
                  padding: '2px 7px',
                  borderRadius: 99,
                  fontWeight: 700,
                  border: '1px solid rgba(74,222,128,0.2)',
                }}>
                  Save $21
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Price card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            ...glassCard,
            padding: '24px',
            marginBottom: 16,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background gradient */}
          <div style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            background: 'radial-gradient(circle, rgba(200,255,0,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 4, position: 'relative' }}>
            <motion.span
              key={price}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 46, fontWeight: 900, color: '#fff', lineHeight: 1, fontFamily: 'Inter, sans-serif', letterSpacing: '-2px' }}
            >
              ${price.toFixed(2)}
            </motion.span>
            <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>
              /mo{annual && ', billed yearly'}
            </span>
          </div>

          {annual && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 16,
                padding: '5px 12px',
                background: 'rgba(74,222,128,0.1)',
                borderRadius: 99,
                border: '1px solid rgba(74,222,128,0.2)',
              }}
            >
              <span style={{ color: '#4ade80', fontSize: 12.5, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                You save ${saving}/year vs monthly
              </span>
            </motion.div>
          )}

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '16px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {features.map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: 99,
                  background: 'rgba(200,255,0,0.12)',
                  border: '1px solid rgba(200,255,0,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={12} color="#C8FF00" />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11, textAlign: 'center', lineHeight: 1.7, marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>
          Your card won't be charged until setup is complete.{'\n'}Cancel any time from settings.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ padding: '14px 24px 48px' }}
      >
        <PrimaryButton onClick={handleNext} label={`Start for $${price.toFixed(2)}/mo`} />
      </motion.div>
    </div>
  )
}
