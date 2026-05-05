import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Lock, Shield, Tag } from 'lucide-react'
import ProgressBar from './ProgressBar.jsx'
import { screenBase, glassCard, inputStyle, labelStyle, headingStyle, subStyle, PrimaryButton } from './SignUp.jsx'

const PLAN_SUMMARY = {
  planName: 'Fleet Plan',
  planPrice: '$29.00',
  billing: '/month',
  device: 'TrackLynk OBD Pro · ×1',
  devicePrice: '$49.00',
  total: '$78.00',
}

export default function Payment({ next, back, step, total }) {
  const [payMethod, setPayMethod] = useState('card')
  const [card, setCard]           = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [focused, setFocused]     = useState(null)
  const [promoOpen, setPromoOpen] = useState(false)
  const [promo, setPromo]         = useState('')

  const fmtCard   = v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const fmtExpiry = v => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d }

  const fieldBorder = key => focused === key ? 'rgba(200,255,0,0.6)' : 'rgba(255,255,255,0.09)'
  const fieldShadow = key => focused === key ? '0 0 0 3px rgba(200,255,0,0.1)' : 'none'

  return (
    <div style={screenBase}>
      <ProgressBar current={step} total={total} onBack={back} title="Payment" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 0' }}>

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 style={headingStyle}>Complete your order</h2>
          <p style={subStyle}>Secure checkout · Cancel anytime</p>
        </motion.div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ ...glassCard, padding: '16px 18px', marginBottom: 20 }}
        >
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.7px', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>
            Order Summary
          </p>
          {[
            { label: PLAN_SUMMARY.planName, value: PLAN_SUMMARY.planPrice + PLAN_SUMMARY.billing },
            { label: PLAN_SUMMARY.device,   value: PLAN_SUMMARY.devicePrice },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: 'rgba(255,255,255,0.68)', fontSize: 13.5, fontFamily: 'Inter, sans-serif' }}>{label}</span>
              <span style={{ color: '#fff', fontSize: 13.5, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{value}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0 12px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontSize: 14.5, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>Total today</span>
            <span style={{ color: '#C8FF00', fontSize: 18, fontWeight: 800, letterSpacing: '-0.4px', fontFamily: 'Inter, sans-serif' }}>{PLAN_SUMMARY.total}</span>
          </div>
        </motion.div>

        {/* Payment method tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          style={{ display: 'flex', gap: 8, marginBottom: 18 }}
        >
          {[
            { id: 'card',  label: '💳  Card' },
            { id: 'apple', label: '  Apple Pay' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPayMethod(id)}
              style={{
                flex: 1, height: 44, borderRadius: 14, cursor: 'pointer',
                background: payMethod === id ? 'rgba(200,255,0,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${payMethod === id ? 'rgba(200,255,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: payMethod === id ? '#C8FF00' : 'rgba(255,255,255,0.45)',
                fontSize: 13.5, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {payMethod === 'card' ? (
            <motion.div
              key="card-form"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              {/* Card number */}
              <div>
                <label style={labelStyle}>Card Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text" inputMode="numeric" placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={e => setCard(c => ({ ...c, number: fmtCard(e.target.value) }))}
                    onFocus={() => setFocused('number')} onBlur={() => setFocused(null)}
                    style={{ ...inputStyle, paddingRight: 48, border: `1.5px solid ${fieldBorder('number')}`, boxShadow: fieldShadow('number') }}
                  />
                  <CreditCard size={17} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Expiry + CVV */}
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Expiry</label>
                  <input
                    type="text" inputMode="numeric" placeholder="MM / YY"
                    value={card.expiry}
                    onChange={e => setCard(c => ({ ...c, expiry: fmtExpiry(e.target.value) }))}
                    onFocus={() => setFocused('expiry')} onBlur={() => setFocused(null)}
                    style={{ ...inputStyle, border: `1.5px solid ${fieldBorder('expiry')}`, boxShadow: fieldShadow('expiry') }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>CVV</label>
                  <input
                    type="text" inputMode="numeric" placeholder="123" maxLength={4}
                    value={card.cvv}
                    onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    onFocus={() => setFocused('cvv')} onBlur={() => setFocused(null)}
                    style={{ ...inputStyle, border: `1.5px solid ${fieldBorder('cvv')}`, boxShadow: fieldShadow('cvv') }}
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={labelStyle}>Name on Card</label>
                <input
                  type="text" placeholder="Jane Smith"
                  value={card.name}
                  onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                  style={{ ...inputStyle, border: `1.5px solid ${fieldBorder('name')}`, boxShadow: fieldShadow('name') }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="apple-pay"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              style={{ ...glassCard, padding: '24px 20px', textAlign: 'center' }}
            >
              <div style={{ fontSize: 40, marginBottom: 10 }}></div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13.5, lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>
                Use Touch ID or Face ID to pay{' '}
                <span style={{ color: '#fff', fontWeight: 600 }}>{PLAN_SUMMARY.total}</span>{' '}
                with Apple Pay
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Promo code */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}
          style={{ marginTop: 18 }}
        >
          <button
            onClick={() => setPromoOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, padding: 0 }}
          >
            <Tag size={14} color="#C8FF00" />
            <span style={{ color: '#C8FF00', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              {promoOpen ? 'Hide promo code' : 'Have a promo code?'}
            </span>
          </button>
          <AnimatePresence>
            {promoOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ marginTop: 10, display: 'flex', gap: 8, overflow: 'hidden' }}
              >
                <input
                  type="text" placeholder="PROMO CODE"
                  value={promo}
                  onChange={e => setPromo(e.target.value.toUpperCase())}
                  style={{ ...inputStyle, flex: 1, height: 44 }}
                />
                <button style={{
                  height: 44, padding: '0 18px', borderRadius: 14, cursor: 'pointer',
                  background: 'rgba(200,255,0,0.12)', border: '1.5px solid rgba(200,255,0,0.3)',
                  color: '#C8FF00', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                }}>
                  Apply
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Security badges */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
          style={{ display: 'flex', gap: 18, justifyContent: 'center', padding: '14px 0 6px' }}
        >
          {[{ Icon: Lock, label: '256-bit SSL' }, { Icon: Shield, label: 'PCI DSS' }].map(({ Icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon size={12} color="rgba(255,255,255,0.28)" />
              <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
        style={{ padding: '16px 24px 48px' }}
      >
        <PrimaryButton onClick={next} label={`Pay ${PLAN_SUMMARY.total}`} />
        <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11.5, textAlign: 'center', marginTop: 10, fontFamily: 'Inter, sans-serif' }}>
          Cancel within 14 days for a full refund
        </p>
      </motion.div>
    </div>
  )
}
