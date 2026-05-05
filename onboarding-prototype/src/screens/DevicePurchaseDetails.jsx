import { motion } from 'framer-motion'
import { ChevronLeft, Cpu, Calendar, CreditCard, Check, Zap, ExternalLink } from 'lucide-react'
import { glassCard, PrimaryButton, screenBase } from './SignUp.jsx'

const INFO = {
  device: {
    name: 'TrackLynk OBD Pro',
    model: 'TL-OBD2-2024',
    serial: 'SN-48291-XF7K',
    status: 'Awaiting Activation',
  },
  order: {
    number: '#TL-48291',
    date: 'May 5, 2026',
    device: '$49.00',
    plan: '$29.00/mo',
    tax: '$6.24',
    total: '$78.00',
    payMethod: 'Visa ending 4242',
  },
  subscription: {
    plan: 'Fleet Plan',
    vehicles: 'Up to 20 vehicles',
    nextBilling: 'Jun 5, 2026',
  },
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.18 } } }
const item      = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 28 } } }

export default function DevicePurchaseDetails({ next, back }) {
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
          Purchase Details
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px 0' }}>
        <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Device card */}
          <motion.div
            variants={item}
            style={{
              ...glassCard,
              padding: 18,
              background: 'rgba(200,255,0,0.04)',
              border: '1px solid rgba(200,255,0,0.18)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 15, flexShrink: 0,
                background: 'rgba(200,255,0,0.1)', border: '1px solid rgba(200,255,0,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(200,255,0,0.1)',
              }}>
                <Cpu size={23} color="#C8FF00" />
              </div>
              <div>
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 3, fontFamily: 'Inter, sans-serif' }}>
                  {INFO.device.name}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
                  Model: {INFO.device.model}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 0, justifyContent: 'space-between' }}>
              {[
                { label: 'Serial No.', value: INFO.device.serial, highlight: false },
                { label: 'Status',     value: INFO.device.status, highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label}>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'Inter, sans-serif' }}>
                    {label}
                  </p>
                  <p style={{ color: highlight ? '#C8FF00' : 'rgba(255,255,255,0.7)', fontSize: 12.5, fontWeight: highlight ? 600 : 400, fontFamily: 'Inter, sans-serif' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order receipt */}
          <motion.div variants={item} style={{ ...glassCard, padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Calendar size={14} color="rgba(255,255,255,0.38)" />
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.7px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                Order Receipt
              </span>
              <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.38)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
                {INFO.order.number}
              </span>
            </div>

            {[
              { label: 'Date',       value: INFO.order.date   },
              { label: 'OBD Device', value: INFO.order.device },
              { label: 'Fleet Plan', value: INFO.order.plan   },
              { label: 'Tax',        value: INFO.order.tax    },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
                <span style={{ color: 'rgba(255,255,255,0.48)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>{label}</span>
                <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>{value}</span>
              </div>
            ))}

            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0 12px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>Total Charged</span>
              <span style={{ color: '#C8FF00', fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px', fontFamily: 'Inter, sans-serif' }}>{INFO.order.total}</span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px',
              background: 'rgba(255,255,255,0.04)', borderRadius: 11,
            }}>
              <CreditCard size={14} color="rgba(255,255,255,0.35)" />
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
                {INFO.order.payMethod}
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(74,222,128,0.18)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={9} color="#4ade80" strokeWidth={3} />
                </div>
                <span style={{ color: '#4ade80', fontSize: 11.5, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Paid</span>
              </div>
            </div>
          </motion.div>

          {/* Subscription summary */}
          <motion.div variants={item} style={{ ...glassCard, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Zap size={14} color="#C8FF00" />
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.7px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                Subscription
              </span>
            </div>
            {[
              { label: 'Plan',         value: INFO.subscription.plan        },
              { label: 'Vehicles',     value: INFO.subscription.vehicles    },
              { label: 'Next Billing', value: INFO.subscription.nextBilling },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>{label}</span>
                <span style={{ color: 'rgba(255,255,255,0.78)', fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>{value}</span>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}
        style={{ padding: '16px 24px 48px', display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <PrimaryButton onClick={next} label="Activate My Device" />
        <button
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.38)', fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 0', fontFamily: 'Inter, sans-serif',
          }}
        >
          <ExternalLink size={13} />
          View Receipt Email
        </button>
      </motion.div>
    </div>
  )
}
