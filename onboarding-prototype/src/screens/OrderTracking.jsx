import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Truck, Check, ChevronLeft } from 'lucide-react'
import { glassCard, PrimaryButton, screenBase } from './SignUp.jsx'

const STAGES = [
  { id: 'ordered',    label: 'Order Placed',   sub: 'May 5, 9:41 AM',    done: true,  active: false },
  { id: 'processing', label: 'Processing',      sub: 'Confirmed 9:43 AM', done: true,  active: false },
  { id: 'shipped',    label: 'Shipped',         sub: 'Est. May 6',        done: false, active: true  },
  { id: 'delivered',  label: 'Delivered',       sub: 'Est. May 7–8',      done: false, active: false },
]

export default function OrderTracking({ next, back }) {
  const [variant, setVariant] = useState('dual')

  return (
    <div style={screenBase}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 24px 0', marginTop: 4, position: 'relative' }}>
        <button
          onClick={back}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', padding: 0 }}
        >
          <ChevronLeft size={22} />
        </button>
        <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
          Order Status
        </span>
        {/* Demo variant toggle */}
        <button
          onClick={() => setVariant(v => v === 'dual' ? 'single' : 'dual')}
          style={{
            marginLeft: 'auto', background: 'rgba(200,255,0,0.08)',
            border: '1px solid rgba(200,255,0,0.22)', borderRadius: 8,
            cursor: 'pointer', padding: '4px 10px',
          }}
        >
          <span style={{ color: '#C8FF00', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
            {variant === 'dual' ? 'DUAL' : 'SINGLE'}
          </span>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px 0' }}>

        {/* Confirmation hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          style={{ textAlign: 'center', marginBottom: 22 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.15 }}
            style={{
              width: 66, height: 66, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(200,255,0,0.16) 0%, rgba(143,184,0,0.1) 100%)',
              border: '1.5px solid rgba(200,255,0,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 0 32px rgba(200,255,0,0.14)',
            }}
          >
            <Package size={28} color="#C8FF00" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
            style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: 4, fontFamily: 'Inter, sans-serif' }}
          >
            Order Confirmed!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
            style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}
          >
            Order #TL-48291 · TrackLynk OBD Pro
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
          style={{ ...glassCard, padding: '18px 18px 14px', marginBottom: 14 }}
        >
          {STAGES.map((stage, i) => (
            <div key={stage.id} style={{ display: 'flex', gap: 14, position: 'relative' }}>
              {i < STAGES.length - 1 && (
                <div style={{
                  position: 'absolute', left: 13, top: 28, width: 2, height: 34,
                  background: stage.done ? 'rgba(200,255,0,0.32)' : 'rgba(255,255,255,0.09)',
                  borderRadius: 1,
                }} />
              )}
              {/* Status dot */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                background: stage.done
                  ? 'linear-gradient(135deg, #C8FF00, #8FB800)'
                  : stage.active ? 'rgba(200,255,0,0.1)' : 'rgba(255,255,255,0.06)',
                border: stage.active ? '2px solid rgba(200,255,0,0.45)' : stage.done ? 'none' : '1.5px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: stage.done ? '0 0 10px rgba(200,255,0,0.22)' : stage.active ? '0 0 8px rgba(200,255,0,0.14)' : 'none',
              }}>
                {stage.done ? (
                  <Check size={13} color="#000" strokeWidth={3} />
                ) : stage.active ? (
                  <motion.div
                    animate={{ scale: [1, 1.35, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8FF00' }}
                  />
                ) : (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />
                )}
              </div>
              {/* Label */}
              <div style={{ flex: 1, paddingBottom: i < STAGES.length - 1 ? 26 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <p style={{
                    color: stage.done || stage.active ? '#fff' : 'rgba(255,255,255,0.3)',
                    fontSize: 13.5, fontWeight: stage.active ? 700 : 600,
                    fontFamily: 'Inter, sans-serif', margin: 0,
                  }}>
                    {stage.label}
                  </p>
                  {stage.active && (
                    <span style={{ color: '#C8FF00', fontSize: 10, fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                      IN PROGRESS
                    </span>
                  )}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                  {stage.sub}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Delivery info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          style={{ ...glassCard, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'center', marginBottom: 8 }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 13,
            background: 'rgba(200,255,0,0.09)', border: '1px solid rgba(200,255,0,0.16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Truck size={20} color="#C8FF00" />
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 600, marginBottom: 3, fontFamily: 'Inter, sans-serif' }}>
              Est. Delivery: May 7–8
            </p>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
              FedEx Ground · TL48291XFDX
            </p>
          </div>
        </motion.div>
      </div>

      {/* CTA area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ padding: '16px 24px 48px', display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <PrimaryButton onClick={next} label="Track Shipment" />

        <AnimatePresence>
          {variant === 'dual' && (
            <motion.button
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={next}
              style={{
                width: '100%', height: 50, borderRadius: 18, cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.11)',
                color: 'rgba(255,255,255,0.72)', fontSize: 15, fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Set Up Device Now
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
