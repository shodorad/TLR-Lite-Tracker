import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PricingOverview from './PricingOverview.jsx'
import {
  ChevronRight, Car, CreditCard, Zap, MapPin, Route,
  Users, Truck, Building2,
  Activity, Lock, Fingerprint, LifeBuoy, FileText,
  Plus, XCircle, Trash2, ArrowLeftRight, ArrowLeft,
  Camera, Check, Wifi, WifiOff, RotateCcw, ScanLine,
  PauseCircle, Calendar, X, BadgeCheck,
  Eye, EyeOff, Shield, Smartphone, KeyRound, ShieldCheck,
  Monitor, Globe, BarChart3, Download, AlertTriangle, LogOut,
  MessageSquare, QrCode, Copy, RefreshCw,
  Star, Share2, HelpCircle, ChevronDown, Send, Sparkles,
  CheckCircle2, ExternalLink, Link, Mail, Phone as PhoneIcon,
} from 'lucide-react'

/* ─────────────────────────────────────────
   Animation constants
───────────────────────────────────────── */
const slideIn         = { x: '100%', opacity: 0 }
const slideOut        = { x: '100%', opacity: 0 }
const center          = { x: 0, opacity: 1 }
const slideTransition = { type: 'spring', stiffness: 380, damping: 38, mass: 0.8 }

/* ─────────────────────────────────────────
   Shared primitives
───────────────────────────────────────── */
function Toggle({ on, onToggle }) {
  return (
    <motion.button
      onClick={e => { e.stopPropagation(); onToggle() }}
      style={{
        width: 44, height: 26, borderRadius: 13,
        background: on ? '#C8FF00' : 'rgba(255,255,255,0.12)',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: on ? 21 : 3 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{
          position: 'absolute', top: 3, width: 20, height: 20,
          borderRadius: 10, background: on ? '#000' : 'rgba(255,255,255,0.55)',
        }}
      />
    </motion.button>
  )
}

function Row({ icon: Icon, iconBg, label, sublabel, value, onPress, toggle, danger, last }) {
  const interactive = !!onPress || !!toggle
  return (
    <motion.div
      whileTap={interactive ? { scale: 0.985 } : {}}
      onClick={toggle ? toggle.onToggle : onPress}
      style={{
        display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px',
        cursor: interactive ? 'pointer' : 'default',
        borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {Icon && (
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: danger ? 'rgba(232,101,106,0.15)' : (iconBg || 'rgba(200,255,0,0.10)'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={15} color={danger ? '#E8656A' : '#C8FF00'} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: danger ? '#E8656A' : '#fff', fontSize: 14.5, fontWeight: 500, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.1px', margin: 0 }}>
          {label}
        </p>
        {sublabel && (
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: '2px 0 0' }}>
            {sublabel}
          </p>
        )}
      </div>
      {toggle ? (
        <Toggle on={toggle.on} onToggle={toggle.onToggle} />
      ) : value ? (
        <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>{value}</span>
      ) : onPress ? (
        <ChevronRight size={15} color="rgba(255,255,255,0.22)" style={{ flexShrink: 0 }} />
      ) : null}
    </motion.div>
  )
}

function Section({ title, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 320, damping: 28 }}
      style={{ marginBottom: 22 }}
    >
      {title && (
        <p style={{
          color: 'rgba(255,255,255,0.32)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.6px', textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif', marginBottom: 8, paddingLeft: 4,
        }}>
          {title}
        </p>
      )}
      <div style={{
        background: 'rgba(255,255,255,0.055)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 18, overflow: 'hidden',
      }}>
        {children}
      </div>
    </motion.div>
  )
}

function SubNav({ title, onBack, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px 12px', flexShrink: 0 }}>
      <motion.button
        whileTap={{ scale: 0.88 }} onClick={onBack}
        style={{
          width: 36, height: 36, borderRadius: 12,
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}
      >
        <ArrowLeft size={16} color="rgba(255,255,255,0.8)" />
      </motion.button>
      <p style={{ flex: 1, color: '#fff', fontSize: 17, fontWeight: 700, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.3px', margin: 0 }}>
        {title}
      </p>
      {right}
    </div>
  )
}

function EditField({ label, value, onChange, type = 'text', placeholder, disabled }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', margin: '0 0 7px' }}>
        {label}
      </p>
      <input
        type={type} value={value} placeholder={placeholder} disabled={disabled}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: 50, borderRadius: 14, boxSizing: 'border-box',
          background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: `1.5px solid ${focused ? 'rgba(200,255,0,0.55)' : 'rgba(255,255,255,0.09)'}`,
          boxShadow: focused ? '0 0 0 3px rgba(200,255,0,0.09)' : 'none',
          color: disabled ? 'rgba(255,255,255,0.3)' : '#fff',
          fontSize: 15, padding: '0 16px', fontFamily: 'Inter, sans-serif',
          transition: 'border-color 0.18s, box-shadow 0.18s', outline: 'none',
        }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────
   License plate field
   • Auto-uppercases silently (no alert)
   • Strips non-alphanumeric characters
   • Hard cap at 8 chars
   • Character counter + validity glow
───────────────────────────────────────── */
const PLATE_MAX = 8

function PlateField({ value, onChange, optional }) {
  const [focused, setFocused] = useState(false)

  const handleChange = raw => {
    const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, PLATE_MAX)
    onChange(cleaned)
  }

  const isValid   = value.length >= 2
  const remaining = PLATE_MAX - value.length

  // Border colour: green when valid & blurred, lime when focused, dim otherwise
  const borderColor = focused
    ? 'rgba(200,255,0,0.55)'
    : isValid
      ? 'rgba(74,222,128,0.45)'
      : 'rgba(255,255,255,0.09)'

  const boxShadow = focused
    ? '0 0 0 3px rgba(200,255,0,0.09)'
    : isValid
      ? '0 0 0 3px rgba(74,222,128,0.08)'
      : 'none'

  return (
    <div style={{ marginBottom: 14 }}>
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', margin: 0 }}>
          License Plate{optional ? ' (optional)' : ''}
        </p>
        {/* Character counter — only show when approaching the limit */}
        <AnimatePresence>
          {value.length > 0 && (
            <motion.span
              key="counter"
              initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }}
              style={{
                fontSize: 11, fontFamily: 'Inter, sans-serif',
                color: remaining <= 2 ? '#E8656A' : 'rgba(255,255,255,0.28)',
                fontWeight: 600,
              }}
            >
              {value.length}/{PLATE_MAX}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Input row */}
      <div style={{ position: 'relative' }}>
        <input
          value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="e.g. 8ABC123"
          autoCapitalize="characters"
          style={{
            width: '100%', height: 50, borderRadius: 14, boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: `1.5px solid ${borderColor}`,
            boxShadow,
            color: '#fff', fontSize: 16, fontWeight: 600,
            padding: '0 44px 0 16px',
            fontFamily: 'Inter, sans-serif', letterSpacing: '1.5px',
            transition: 'border-color 0.18s, box-shadow 0.18s', outline: 'none',
          }}
        />
        {/* Validity checkmark */}
        <AnimatePresence>
          {isValid && !focused && (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                width: 20, height: 20, borderRadius: 10,
                background: 'rgba(74,222,128,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Check size={11} color="#4ade80" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hint */}
      <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11.5, fontFamily: 'Inter, sans-serif', margin: '6px 0 0' }}>
        Letters & numbers only · auto-uppercased
      </p>
    </div>
  )
}

function Avatar({ initial, size = 72 }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        width: size, height: size, borderRadius: size / 2,
        background: 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 3px rgba(200,255,0,0.2)',
      }}>
        <span style={{ color: '#000', fontSize: size * 0.34, fontWeight: 800, fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>
          {initial}
        </span>
      </div>
      <motion.div whileTap={{ scale: 0.9 }} style={{
        position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14,
        background: 'rgba(18,22,32,0.95)', border: '1.5px solid rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <Camera size={13} color="rgba(255,255,255,0.7)" />
      </motion.div>
    </div>
  )
}

function Spinner({ color = '#000', size = 18 }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
      style={{
        width: size, height: size, borderRadius: size / 2,
        border: `2.5px solid ${color === '#000' ? 'rgba(0,0,0,0.2)' : 'rgba(200,255,0,0.2)'}`,
        borderTopColor: color,
      }}
    />
  )
}

function PrimaryBtn({ label, onClick, disabled, loading, done, icon: Icon }) {
  return (
    <motion.button
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      onClick={onClick}
      style={{
        width: '100%', height: 54, borderRadius: 18,
        background: done
          ? 'linear-gradient(135deg, #4ade80, #22c55e)'
          : !disabled && !loading
            ? 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)'
            : 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: done ? '#fff' : !disabled && !loading ? '#000' : 'rgba(255,255,255,0.25)',
        fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.2px',
        cursor: !disabled && !loading ? 'pointer' : 'default',
        boxShadow: !disabled && !loading && !done ? '0 8px 28px rgba(200,255,0,0.25), inset 0 1px 0 rgba(255,255,255,0.22)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'background 0.25s, color 0.25s, box-shadow 0.25s',
      }}
    >
      {done ? <><Check size={18} /> Saved</> : loading ? <Spinner /> : label}
    </motion.button>
  )
}

/* ─────────────────────────────────────────
   Signal bars
───────────────────────────────────────── */
function SignalBars({ level, max = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          width: 4, height: 5 + i * 3, borderRadius: 2,
          background: i < level ? '#C8FF00' : 'rgba(255,255,255,0.15)',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   Profile Edit view
───────────────────────────────────────── */
function ProfileEditView({ profile, onSave, onBack }) {
  const [form, setForm] = useState({ ...profile })
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const set = key => val => setForm(f => ({ ...f, [key]: val }))
  const hasChanges = form.first !== profile.first || form.last !== profile.last || form.email !== profile.email || form.phone !== profile.phone

  const handleSave = () => {
    if (!hasChanges || saving) return
    setSaving(true)
    setTimeout(() => { setDone(true); onSave(form); setTimeout(onBack, 600) }, 700)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#04050d', paddingTop: 44 }}>
      <SubNav title="Edit Profile" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px', paddingBottom: 96 }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}
        >
          <Avatar initial={form.first[0]?.toUpperCase() || 'J'} size={80} />
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter, sans-serif', marginTop: 10 }}>
            Tap to change photo
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}><EditField label="First name" value={form.first} onChange={set('first')} placeholder="Jane" /></div>
            <div style={{ flex: 1 }}><EditField label="Last name"  value={form.last}  onChange={set('last')}  placeholder="Smith" /></div>
          </div>
          <EditField label="Email address" value={form.email} onChange={set('email')} type="email" placeholder="jane@email.com" />
          <EditField label="Mobile number" value={form.phone} onChange={set('phone')} type="tel"   placeholder="+1 (555) 000-0000" />
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        style={{ padding: '12px 20px 36px', flexShrink: 0 }}
      >
        <PrimaryBtn label="Save Changes" onClick={handleSave} disabled={!hasChanges} loading={saving && !done} done={done} />
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Vehicle Detail view
───────────────────────────────────────── */
function VehicleDetailView({ vehicle, onSave, onRemove, onBack }) {
  const [form, setForm]         = useState({ nickname: vehicle.nickname, plate: vehicle.plate })
  const [saving, setSaving]     = useState(false)
  const [done, setDone]         = useState(false)
  const [removeState, setRemoveState] = useState('idle') // 'idle' | 'confirm'
  const [repairing, setRepairing] = useState(false)

  const hasChanges = form.nickname !== vehicle.nickname || form.plate !== vehicle.plate

  const handleSave = () => {
    if (!hasChanges || saving) return
    setSaving(true)
    setTimeout(() => {
      setDone(true)
      onSave({ ...vehicle, ...form })
      setTimeout(onBack, 600)
    }, 700)
  }

  const handleRepair = () => {
    setRepairing(true)
    setTimeout(() => setRepairing(false), 2000)
  }

  const connected = vehicle.device.connected

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#04050d', paddingTop: 44 }}>
      <SubNav title={vehicle.nickname} onBack={onBack} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px', paddingBottom: 96 }}>

        {/* Vehicle hero card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          style={{
            background: 'rgba(255,255,255,0.055)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 18, padding: '18px 16px', marginBottom: 22,
            display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            background: 'rgba(200,255,0,0.10)',
            border: '1px solid rgba(200,255,0,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Car size={24} color="#C8FF00" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.2px', margin: '0 0 4px' }}>
              {form.nickname}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 13, fontFamily: 'Inter, sans-serif', margin: 0 }}>
              {vehicle.year} {vehicle.make} {vehicle.model} · {vehicle.trim}
            </p>
          </div>
          {form.plate ? (
            <div style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '5px 10px', flexShrink: 0,
            }}>
              <p style={{ color: '#fff', fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: 0, letterSpacing: '0.5px' }}>
                {form.plate}
              </p>
            </div>
          ) : null}
        </motion.div>

        {/* Device status card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
          style={{ marginBottom: 22 }}
        >
          <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 8, paddingLeft: 4 }}>
            OBD-II Device
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.055)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 18, padding: '16px',
          }}>
            {/* Status row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative', width: 10, height: 10 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: 5,
                    background: connected ? '#4ade80' : '#E8656A',
                  }} />
                  {connected && (
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 5,
                        background: '#4ade80',
                      }}
                    />
                  )}
                </div>
                <span style={{ color: connected ? '#4ade80' : '#E8656A', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <SignalBars level={connected ? vehicle.device.signal : 0} />
            </div>

            {/* Device info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 500, fontFamily: 'Inter, sans-serif', margin: '0 0 3px' }}>
                  TrackLynk OBD-II
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                  Last seen {vehicle.device.lastSeen}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleRepair}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '7px 11px', cursor: 'pointer',
                }}
              >
                {repairing ? (
                  <Spinner color="#C8FF00" size={13} />
                ) : (
                  <RotateCcw size={13} color="rgba(255,255,255,0.6)" />
                )}
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                  {repairing ? 'Pairing…' : 'Re-pair'}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Edit details */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}>
          <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 8, paddingLeft: 4 }}>
            Details
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.055)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 18, padding: '16px',
          }}>
            <EditField
              label="Nickname"
              value={form.nickname}
              onChange={v => setForm(f => ({ ...f, nickname: v }))}
              placeholder="e.g. My Tesla"
            />
            <PlateField value={form.plate} onChange={v => setForm(f => ({ ...f, plate: v }))} />
          </div>
        </motion.div>

        {/* Save button */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              key="save-btn"
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 8, height: 0 }}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              style={{ overflow: 'hidden', marginTop: 14 }}
            >
              <PrimaryBtn label="Save Changes" onClick={handleSave} disabled={false} loading={saving && !done} done={done} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Remove vehicle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }} style={{ marginTop: 24 }}>
          <AnimatePresence mode="wait">
            {removeState === 'idle' ? (
              <motion.button
                key="remove-idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRemoveState('confirm')}
                style={{
                  width: '100%', height: 50, borderRadius: 16,
                  background: 'rgba(232,101,106,0.1)', border: '1px solid rgba(232,101,106,0.22)',
                  color: '#E8656A', fontSize: 15, fontWeight: 600,
                  fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Trash2 size={15} /> Remove Vehicle
              </motion.button>
            ) : (
              <motion.div
                key="remove-confirm"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              >
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', fontFamily: 'Inter, sans-serif', marginBottom: 10 }}>
                  Remove {vehicle.nickname}? This can't be undone.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setRemoveState('idle')}
                    style={{
                      flex: 1, height: 50, borderRadius: 16,
                      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', fontSize: 15, fontWeight: 600,
                      fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onRemove(vehicle.id)}
                    style={{
                      flex: 1, height: 50, borderRadius: 16,
                      background: '#E8656A', border: 'none',
                      color: '#fff', fontSize: 15, fontWeight: 700,
                      fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                    }}
                  >
                    Yes, Remove
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Add Vehicle view  (2-step flow)
───────────────────────────────────────── */
const FAKE_VIN      = '1HGBH41JXMN109186'
const DETECTED_CAR  = { year: '2023', make: 'Honda', model: 'Civic', trim: 'Sport' }

function StepDots({ current, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i === current - 1 ? 18 : 6, background: i < current ? '#C8FF00' : 'rgba(255,255,255,0.18)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          style={{ height: 6, borderRadius: 99 }}
        />
      ))}
    </div>
  )
}

function AddVehicleView({ onAdd, onBack }) {
  const [step,      setStep]      = useState(1)
  const [vin,       setVin]       = useState('')
  const [scanning,  setScanning]  = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [detected,  setDetected]  = useState(null)
  const [nickname,  setNickname]  = useState('')
  const [plate,     setPlate]     = useState('')
  const [adding,    setAdding]    = useState(false)
  const [addDone,   setAddDone]   = useState(false)

  const handleScan = () => {
    if (scanning) return
    setScanning(true)
    setTimeout(() => { setVin(FAKE_VIN); setScanning(false) }, 1600)
  }

  const handleContinue = () => {
    if (!vin.trim() || verifying) return
    setVerifying(true)
    setTimeout(() => {
      setDetected(DETECTED_CAR)
      setNickname(`My ${DETECTED_CAR.make} ${DETECTED_CAR.model}`)
      setVerifying(false)
      setTimeout(() => setStep(2), 350)
    }, 1000)
  }

  const handleAdd = () => {
    if (!nickname.trim() || adding) return
    setAdding(true)
    setTimeout(() => {
      setAddDone(true)
      onAdd({ nickname, plate, ...DETECTED_CAR, device: { connected: false, lastSeen: 'Not paired yet', signal: 0 } })
      setTimeout(onBack, 700)
    }, 700)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#04050d', paddingTop: 44 }}>
      <SubNav
        title="Add Vehicle"
        onBack={onBack}
        right={<StepDots current={step} total={2} />}
      />

      <AnimatePresence mode="wait">

        {/* ── Step 1: VIN ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 20px', paddingBottom: 96, overflowY: 'auto' }}
          >
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <p style={{ color: '#fff', fontSize: 22, fontWeight: 800, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px', margin: '4px 0 6px' }}>
                Enter your VIN
              </p>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, fontFamily: 'Inter, sans-serif', margin: '0 0 28px' }}>
                Found on your dashboard, door jamb, or registration.
              </p>
            </motion.div>

            {/* VIN field + scan button */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', margin: '0 0 7px' }}>
                VIN (17 characters)
              </p>
              <div style={{ position: 'relative' }}>
                <input
                  value={vin}
                  onChange={e => setVin(e.target.value.toUpperCase().slice(0, 17))}
                  placeholder="e.g. 1HGBH41JXMN109186"
                  maxLength={17}
                  style={{
                    width: '100%', height: 50, borderRadius: 14, boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                    border: `1.5px solid ${vin.length === 17 ? 'rgba(200,255,0,0.5)' : 'rgba(255,255,255,0.09)'}`,
                    color: '#fff', fontSize: 14, padding: '0 52px 0 16px',
                    fontFamily: 'Inter, sans-serif', letterSpacing: '0.5px',
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={handleScan}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    width: 32, height: 32, borderRadius: 9,
                    background: 'rgba(200,255,0,0.12)', border: '1px solid rgba(200,255,0,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {scanning ? <Spinner color="#C8FF00" size={14} /> : <ScanLine size={15} color="#C8FF00" />}
                </motion.button>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: '8px 0 0', textAlign: 'center' }}>
                Or tap <span style={{ color: '#C8FF00' }}>scan</span> to read the barcode
              </p>
            </motion.div>

            {/* Detected chip (appears after verifying) */}
            <AnimatePresence>
              {detected && (
                <motion.div
                  key="detected"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  style={{
                    marginTop: 20, display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)',
                    borderRadius: 12, padding: '10px 14px',
                  }}
                >
                  <Check size={15} color="#4ade80" style={{ flexShrink: 0 }} />
                  <p style={{ color: '#4ade80', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                    Found: {detected.year} {detected.make} {detected.model} · {detected.trim}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ flex: 1 }} />

            <motion.button
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              whileTap={vin.length > 0 && !verifying ? { scale: 0.97 } : {}}
              onClick={handleContinue}
              style={{
                width: '100%', height: 54, borderRadius: 18,
                background: vin.length > 0 && !verifying
                  ? 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)'
                  : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: vin.length > 0 && !verifying ? '#000' : 'rgba(255,255,255,0.25)',
                fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                cursor: vin.length > 0 && !verifying ? 'pointer' : 'default',
                boxShadow: vin.length > 0 && !verifying ? '0 8px 28px rgba(200,255,0,0.25)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
              }}
            >
              {verifying ? <><Spinner />&nbsp;Verifying VIN…</> : 'Continue'}
            </motion.button>
          </motion.div>
        )}

        {/* ── Step 2: Name it ── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 20px', paddingBottom: 96, overflowY: 'auto' }}
          >
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
              <p style={{ color: '#fff', fontSize: 22, fontWeight: 800, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px', margin: '4px 0 6px' }}>
                Name your vehicle
              </p>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, fontFamily: 'Inter, sans-serif', margin: '0 0 20px' }}>
                Give it a nickname you'll recognize.
              </p>
            </motion.div>

            {/* Detected vehicle chip */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
                background: 'rgba(200,255,0,0.08)', border: '1px solid rgba(200,255,0,0.2)',
                borderRadius: 14, padding: '11px 14px',
              }}
            >
              <Car size={16} color="#C8FF00" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: '#C8FF00', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                  {detected?.year} {detected?.make} {detected?.model}
                </p>
                <p style={{ color: 'rgba(200,255,0,0.6)', fontSize: 11, fontFamily: 'Inter, sans-serif', margin: '2px 0 0' }}>
                  {detected?.trim} · VIN confirmed
                </p>
              </div>
              <Check size={14} color="rgba(200,255,0,0.7)" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}>
              <EditField label="Nickname" value={nickname} onChange={setNickname} placeholder={`My ${detected?.make} ${detected?.model}`} />
              <PlateField value={plate} onChange={setPlate} optional />
            </motion.div>

            <div style={{ flex: 1 }} />

            <motion.button
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
              whileTap={!adding ? { scale: 0.97 } : {}}
              onClick={handleAdd}
              style={{
                width: '100%', height: 54, borderRadius: 18,
                background: addDone
                  ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                  : 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: addDone ? '#fff' : '#000',
                fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                cursor: adding ? 'default' : 'pointer',
                boxShadow: addDone ? 'none' : '0 8px 28px rgba(200,255,0,0.25), inset 0 1px 0 rgba(255,255,255,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.25s',
              }}
            >
              {addDone ? <><Check size={18} /> Vehicle Added</> : adding ? <Spinner /> : 'Add Vehicle'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────
   Subscription — data & slide variants
───────────────────────────────────────── */
const PLAN_DATA = {
  annual:  { id: 'annual',  label: 'Annual',  monthly: '7.99',  yearly: '$95.88', billedLabel: 'Billed $95.88/year', savings: 'Save $21/year',   commitment: 'Billed once a year'   },
  monthly: { id: 'monthly', label: 'Monthly', monthly: '9.65',  yearly: null,     billedLabel: 'Billed monthly',     savings: 'No commitment',    commitment: 'Billed every month'   },
}
const TIER_DISPLAY = {
  personal: { name: 'Personal', Icon: Users,     color: '#60a5fa', colorBg: 'rgba(96,165,250,0.12)',  colorBorder: 'rgba(96,165,250,0.26)'  },
  fleet:    { name: 'Fleet',    Icon: Truck,     color: '#C8FF00', colorBg: 'rgba(200,255,0,0.12)',   colorBorder: 'rgba(200,255,0,0.28)'   },
  business: { name: 'Business', Icon: Building2, color: '#a78bfa', colorBg: 'rgba(167,139,250,0.12)', colorBorder: 'rgba(167,139,250,0.28)' },
}
const FEATURES = [
  { Icon: MapPin,   text: 'Real-time GPS tracking'   },
  { Icon: Zap,      text: 'Speed & trip alerts'      },
  { Icon: Route,    text: 'Geofence zones'           },
  { Icon: Activity, text: 'Unlimited trip history'   },
  { Icon: Car,      text: 'Multi-vehicle dashboard'  },
]
const subVariants = {
  enter: d => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center:    { x: 0, opacity: 1 },
  exit:  d => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
}

/* ─────────────────────────────────────────
   Subscription — Plan overview (main)
───────────────────────────────────────── */
function SubscriptionMain({ subscription, onSwitch, onCancel, onPayment, onUpgrade, onBack }) {
  const plan      = PLAN_DATA[subscription.plan]
  const tier      = TIER_DISPLAY[subscription.tier] || TIER_DISPLAY.personal
  const active    = subscription.status === 'active'
  const paused    = subscription.status === 'paused'
  const cancelled = subscription.status === 'cancelled'

  const statusColor = active ? '#4ade80' : paused ? '#facc15' : 'rgba(255,255,255,0.35)'
  const statusLabel = active ? 'Active' : paused ? 'Paused' : 'Cancelled'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 44 }}>
      <SubNav title="Subscription" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px', paddingBottom: 96 }}>

        {/* ── Plan hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          style={{
            background: cancelled
              ? 'rgba(232,101,106,0.07)'
              : 'linear-gradient(145deg, rgba(200,255,0,0.08) 0%, rgba(255,255,255,0.04) 100%)',
            border: `1px solid ${cancelled ? 'rgba(232,101,106,0.2)' : 'rgba(200,255,0,0.18)'}`,
            borderRadius: 20, padding: '20px 18px', marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            {/* Tier badge */}
            <div style={{
              background: cancelled ? 'rgba(232,101,106,0.15)' : tier.colorBg,
              border: `1px solid ${cancelled ? 'rgba(232,101,106,0.3)' : tier.colorBorder}`,
              borderRadius: 10, padding: '5px 12px',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {!cancelled && <tier.Icon size={12} color={tier.color} />}
              <span style={{
                color: cancelled ? '#E8656A' : tier.color, fontSize: 12, fontWeight: 800,
                letterSpacing: '0.4px', fontFamily: 'Inter, sans-serif',
              }}>
                {cancelled ? 'Cancelled' : tier.name}
              </span>
              {!cancelled && (
                <span style={{
                  color: 'rgba(255,255,255,0.3)', fontSize: 11,
                  fontFamily: 'Inter, sans-serif', fontWeight: 500,
                }}>
                  · {plan.label}
                </span>
              )}
            </div>
            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: 4, background: statusColor }} />
              <span style={{ color: statusColor, fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Price */}
          {!cancelled && (
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 22, fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>$</span>
                <span style={{ color: '#fff', fontSize: 42, fontWeight: 800, fontFamily: 'Inter, sans-serif', letterSpacing: '-2px', lineHeight: 1 }}>
                  {plan.monthly}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Inter, sans-serif', marginLeft: 2 }}>/mo</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, fontFamily: 'Inter, sans-serif', margin: '6px 0 0' }}>
                {plan.billedLabel} · <span style={{ color: '#C8FF00' }}>{plan.savings}</span>
              </p>
            </div>
          )}
          {cancelled && (
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'Inter, sans-serif', margin: '4px 0 0' }}>
              Access ends {subscription.nextDate}
            </p>
          )}
        </motion.div>

        {/* ── Billing card ── */}
        {!cancelled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
            style={{
              background: 'rgba(255,255,255,0.055)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 18, overflow: 'hidden', marginBottom: 14,
            }}
          >
            {/* Next charge */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(200,255,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={15} color="#C8FF00" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', fontFamily: 'Inter, sans-serif', margin: '0 0 3px' }}>
                  {paused ? 'Resumes' : 'Next charge'}
                </p>
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                  {paused ? subscription.nextDate : `${subscription.nextAmount} · ${subscription.nextDate}`}
                </p>
              </div>
            </div>
            {/* Payment method — tappable */}
            <motion.div
              whileTap={{ scale: 0.985 }} onClick={onPayment}
              style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(200,255,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CreditCard size={15} color="#C8FF00" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', fontFamily: 'Inter, sans-serif', margin: '0 0 3px' }}>
                  Payment method
                </p>
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                  {subscription.payment.type === 'visa' ? 'Visa' : subscription.payment.type === 'mastercard' ? 'Mastercard' : subscription.payment.type === 'amex' ? 'Amex' : 'Card'}
                  &nbsp;···· {subscription.payment.last4}
                </p>
              </div>
              <ChevronRight size={15} color="rgba(255,255,255,0.22)" />
            </motion.div>
          </motion.div>
        )}

        {/* ── What's included ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }} style={{ marginBottom: 14 }}>
          <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 8, paddingLeft: 4 }}>
            {cancelled ? 'What you had' : "What's included"}
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.055)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 18, overflow: 'hidden',
          }}>
            {FEATURES.map(({ Icon, text }, i) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                opacity: cancelled ? 0.35 : 1,
              }}>
                <Icon size={14} color={cancelled ? 'rgba(255,255,255,0.4)' : '#C8FF00'} style={{ flexShrink: 0 }} />
                <p style={{ color: cancelled ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.78)', fontSize: 13.5, fontFamily: 'Inter, sans-serif', margin: 0, textDecoration: cancelled ? 'line-through' : 'none' }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Actions ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cancelled ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', height: 54, borderRadius: 18,
                background: 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
                border: 'none', color: '#000', fontSize: 16, fontWeight: 700,
                fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(200,255,0,0.25)',
              }}
            >
              Resubscribe
            </motion.button>
          ) : (
            <>
              {/* Change tier */}
              <motion.button
                whileTap={{ scale: 0.97 }} onClick={onUpgrade}
                style={{
                  width: '100%', height: 54, borderRadius: 18,
                  background: `linear-gradient(135deg, ${tier.colorBg}, rgba(255,255,255,0.04))`,
                  border: `1px solid ${tier.colorBorder}`,
                  color: tier.color, fontSize: 15, fontWeight: 700,
                  fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: `0 4px 20px ${tier.colorBg}`,
                }}
              >
                <tier.Icon size={16} />
                Change Plan
                <ChevronRight size={15} style={{ marginLeft: 2 }} />
              </motion.button>

              {/* Switch billing cadence */}
              <motion.button
                whileTap={{ scale: 0.97 }} onClick={onSwitch}
                style={{
                  width: '100%', height: 50, borderRadius: 16,
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff', fontSize: 15, fontWeight: 600,
                  fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <ArrowLeftRight size={15} />
                Switch to {subscription.plan === 'annual' ? 'Monthly' : 'Annual'}
              </motion.button>

              {!paused && (
                <motion.button
                  whileTap={{ scale: 0.97 }} onClick={onCancel}
                  style={{
                    width: '100%', height: 44, borderRadius: 14,
                    background: 'none', border: 'none',
                    color: '#E8656A', fontSize: 14, fontWeight: 500,
                    fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  }}
                >
                  Cancel subscription
                </motion.button>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Subscription — Switch plan
───────────────────────────────────────── */
function SwitchPlanView({ subscription, onConfirm, onBack }) {
  const currentId  = subscription.plan
  const otherId    = currentId === 'annual' ? 'monthly' : 'annual'
  const [selected, setSelected] = useState(null)   // null | otherId
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)

  const prorationNote = currentId === 'annual'
    ? `Your annual plan runs until ${subscription.nextDate}. Monthly billing starts then — no extra charge.`
    : `You'll be charged $95.88 today. Unused days from this month are credited automatically.`

  const handleConfirm = () => {
    if (!selected || confirming) return
    setConfirming(true)
    setTimeout(() => { setDone(true); setTimeout(() => onConfirm(selected), 600) }, 800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 44 }}>
      <SubNav title="Switch Plan" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px', paddingBottom: 96 }}>

        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          style={{ color: 'rgba(255,255,255,0.42)', fontSize: 14, fontFamily: 'Inter, sans-serif', margin: '0 0 20px' }}
        >
          Choose a plan. You can switch again any time.
        </motion.p>

        {/* Plan cards */}
        {[currentId, otherId].map((planId, i) => {
          const plan      = PLAN_DATA[planId]
          const isCurrent = planId === currentId

          // Fix: highlight follows the EXPLICIT selection; if nothing chosen yet,
          // default falls to the current plan — so only ONE card is ever highlighted.
          const effectiveChoice = selected ?? currentId
          const isActive        = planId === effectiveChoice
          // Dim the current card once the user has actively chosen the other one
          const isDimmed        = selected !== null && isCurrent

          return (
            <motion.div
              key={planId}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + i * 0.04 }}
              whileTap={!isCurrent ? { scale: 0.985 } : {}}
              onClick={() => !isCurrent && setSelected(planId)}
              style={{
                background: isActive ? 'rgba(200,255,0,0.07)' : 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${isActive ? 'rgba(200,255,0,0.35)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 18, padding: '16px', marginBottom: 12,
                cursor: isCurrent ? 'default' : 'pointer',
                opacity: isDimmed ? 0.45 : 1,
                transition: 'border-color 0.22s, background 0.22s, opacity 0.22s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                  {plan.label}
                </p>
                {/* Badge stays tied to account fact (current plan), not selection state */}
                {isCurrent ? (
                  <span style={{
                    background: isActive ? 'rgba(200,255,0,0.15)' : 'rgba(255,255,255,0.07)',
                    border: `1px solid ${isActive ? 'rgba(200,255,0,0.3)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 6, padding: '3px 8px',
                    color: isActive ? '#C8FF00' : 'rgba(255,255,255,0.4)',
                    fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif', letterSpacing: '0.3px',
                    transition: 'all 0.22s',
                  }}>
                    Current
                  </span>
                ) : isActive ? (
                  <motion.div
                    initial={{ scale: 0.7 }} animate={{ scale: 1 }}
                    style={{ width: 22, height: 22, borderRadius: 11, background: '#C8FF00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Check size={13} color="#000" />
                  </motion.div>
                ) : (
                  <div style={{ width: 22, height: 22, borderRadius: 11, border: '1.5px solid rgba(255,255,255,0.2)' }} />
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 1, marginBottom: 4 }}>
                <span style={{ color: isActive ? '#C8FF00' : 'rgba(255,255,255,0.45)', fontSize: 28, fontWeight: 800, fontFamily: 'Inter, sans-serif', letterSpacing: '-1px', transition: 'color 0.22s' }}>
                  ${plan.monthly}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'Inter, sans-serif', marginLeft: 2 }}>/mo</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                {plan.billedLabel} · <span style={{ color: isActive ? 'rgba(200,255,0,0.8)' : 'rgba(255,255,255,0.28)', transition: 'color 0.22s' }}>{plan.savings}</span>
              </p>
            </motion.div>
          )
        })}

        {/* Proration note */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key="proration"
              initial={{ opacity: 0, y: 8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: 20 }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 14, padding: '12px 14px',
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <BadgeCheck size={15} color="rgba(200,255,0,0.7)" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5, fontFamily: 'Inter, sans-serif', margin: 0, lineHeight: 1.5 }}>
                  {prorationNote}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={selected && !confirming ? { scale: 0.97 } : {}}
          onClick={handleConfirm}
          style={{
            width: '100%', height: 54, borderRadius: 18,
            background: done
              ? 'linear-gradient(135deg, #4ade80, #22c55e)'
              : selected && !confirming
                ? 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)'
                : 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: done ? '#fff' : selected && !confirming ? '#000' : 'rgba(255,255,255,0.25)',
            fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif',
            cursor: selected && !confirming ? 'pointer' : 'default',
            boxShadow: selected && !confirming && !done ? '0 8px 28px rgba(200,255,0,0.25)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
          }}
        >
          {done ? <><Check size={18} /> Plan updated</> : confirming ? <Spinner /> : 'Confirm Switch'}
        </motion.button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Subscription — Cancel flow  (3 steps)
───────────────────────────────────────── */
function CancelFlowView({ subscription, onPause, onCancel, onKeep, onBack }) {
  const [step, setStep] = useState(1)
  const [pausing, setPausing] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const handlePause = () => {
    setPausing(true)
    setTimeout(() => { onPause() }, 900)
  }
  const handleCancel = () => {
    setCancelling(true)
    setTimeout(() => { onCancel() }, 900)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 44 }}>
      <SubNav
        title={step === 1 ? 'Before you go…' : step === 2 ? "What you'll lose" : 'Cancel subscription'}
        onBack={step === 1 ? onBack : () => setStep(s => s - 1)}
        right={
          <div style={{ display: 'flex', gap: 5 }}>
            {[1,2,3].map(n => (
              <motion.div key={n} animate={{ background: n <= step ? '#C8FF00' : 'rgba(255,255,255,0.18)', width: n === step ? 18 : 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                style={{ height: 6, borderRadius: 99 }}
              />
            ))}
          </div>
        }
      />

      <AnimatePresence mode="wait">

        {/* ── Step 1: Pause offer ── */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 20px', paddingBottom: 40 }}
          >
            {/* Pause icon */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 20 }}>
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.08, type: 'spring', stiffness: 300, damping: 22 }}
                style={{
                  width: 80, height: 80, borderRadius: 40,
                  background: 'rgba(200,255,0,0.1)', border: '1px solid rgba(200,255,0,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <PauseCircle size={36} color="#C8FF00" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} style={{ textAlign: 'center' }}>
                <p style={{ color: '#fff', fontSize: 22, fontWeight: 800, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px', margin: '0 0 10px' }}>
                  Need a break?
                </p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: 'Inter, sans-serif', margin: 0, lineHeight: 1.6, maxWidth: 280 }}>
                  Pause for 30 days — your data stays safe and we'll remind you before it automatically resumes.
                </p>
              </motion.div>
            </div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <motion.button
                whileTap={{ scale: 0.97 }} onClick={handlePause}
                style={{
                  width: '100%', height: 54, borderRadius: 18,
                  background: pausing ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
                  border: 'none', color: pausing ? 'rgba(255,255,255,0.3)' : '#000',
                  fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  boxShadow: pausing ? 'none' : '0 8px 28px rgba(200,255,0,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {pausing ? <Spinner /> : <><PauseCircle size={17} /> Pause my subscription</>}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }} onClick={() => setStep(2)}
                style={{
                  width: '100%', height: 44, borderRadius: 14,
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                }}
              >
                No thanks, continue cancelling →
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Step 2: What you'll lose ── */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 16px', paddingBottom: 40, overflowY: 'auto' }}
          >
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
              style={{ color: 'rgba(255,255,255,0.42)', fontSize: 14, fontFamily: 'Inter, sans-serif', margin: '0 0 16px 4px' }}
            >
              Cancelling means losing access to everything below.
            </motion.p>

            {/* Loss list */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
              style={{
                background: 'rgba(232,101,106,0.06)', border: '1px solid rgba(232,101,106,0.15)',
                borderRadius: 18, overflow: 'hidden', marginBottom: 14,
              }}
            >
              {FEATURES.map(({ Icon, text }, i) => (
                <div key={text} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
                  borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(232,101,106,0.1)' : 'none',
                }}>
                  <div style={{ width: 24, height: 24, borderRadius: 12, background: 'rgba(232,101,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <X size={12} color="#E8656A" />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13.5, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                    {text}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Access-until banner */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 14, padding: '12px 14px', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <Calendar size={14} color="rgba(255,255,255,0.45)" style={{ flexShrink: 0 }} />
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                You'll keep access until <span style={{ color: '#fff', fontWeight: 600 }}>{subscription.nextDate}</span>
              </p>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <motion.button whileTap={{ scale: 0.97 }} onClick={onKeep}
                style={{
                  width: '100%', height: 54, borderRadius: 18,
                  background: 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
                  border: 'none', color: '#000', fontSize: 16, fontWeight: 700,
                  fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  boxShadow: '0 8px 28px rgba(200,255,0,0.25)',
                }}
              >
                Keep my plan
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(3)}
                style={{
                  width: '100%', height: 44, borderRadius: 14,
                  background: 'none', border: 'none',
                  color: '#E8656A', fontSize: 14, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                }}
              >
                Still want to cancel →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Final confirm ── */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 20px', paddingBottom: 40 }}
          >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, paddingBottom: 24 }}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <p style={{ color: '#fff', fontSize: 22, fontWeight: 800, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px', margin: '0 0 12px' }}>
                  One last thing
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'Inter, sans-serif', margin: '0 0 10px', lineHeight: 1.6 }}>
                  Your <strong style={{ color: '#fff' }}>{PLAN_DATA[subscription.plan].label} Plan</strong> stays fully active until{' '}
                  <strong style={{ color: '#fff' }}>{subscription.nextDate}</strong>. After that, all tracking stops.
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                  No refund is issued for unused time on annual plans.
                </p>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <motion.button whileTap={{ scale: 0.97 }} onClick={onKeep}
                style={{
                  width: '100%', height: 54, borderRadius: 18,
                  background: 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
                  border: 'none', color: '#000', fontSize: 16, fontWeight: 700,
                  fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  boxShadow: '0 8px 28px rgba(200,255,0,0.25)',
                }}
              >
                Keep my plan
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }} onClick={handleCancel}
                style={{
                  width: '100%', height: 50, borderRadius: 16,
                  background: 'rgba(232,101,106,0.1)', border: '1px solid rgba(232,101,106,0.3)',
                  color: cancelling ? 'rgba(232,101,106,0.4)' : '#E8656A',
                  fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {cancelling ? <Spinner color="#E8656A" size={16} /> : 'Cancel subscription'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────
   Subscription — Payment method
───────────────────────────────────────── */
const detectCardType = digits => {
  if (/^4/.test(digits))          return 'visa'
  if (/^5[1-5]|^2[2-7]/.test(digits)) return 'mastercard'
  if (/^3[47]/.test(digits))      return 'amex'
  return digits.length ? 'card' : null
}
const CARD_TYPE_LABELS = { visa: 'VISA', mastercard: 'MC', amex: 'AMEX', card: 'CARD' }
const CARD_TYPE_COLORS = { visa: '#1A72E8', mastercard: '#EB5C28', amex: '#2E77BC', card: 'rgba(255,255,255,0.4)' }

function CardField({ label, value, onChange, placeholder, type = 'text', right, monospace }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ flex: 1 }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', margin: '0 0 7px' }}>
        {label}
      </p>
      <div style={{ position: 'relative' }}>
        <input
          type={type} value={value} placeholder={placeholder}
          inputMode={monospace ? 'numeric' : 'text'}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', height: 50, borderRadius: 14, boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: `1.5px solid ${focused ? 'rgba(200,255,0,0.55)' : 'rgba(255,255,255,0.09)'}`,
            boxShadow: focused ? '0 0 0 3px rgba(200,255,0,0.09)' : 'none',
            color: '#fff', fontSize: monospace ? 15 : 15,
            padding: `0 ${right ? 52 : 16}px 0 16px`,
            fontFamily: monospace ? 'monospace' : 'Inter, sans-serif',
            letterSpacing: monospace ? '2px' : 'normal',
            transition: 'border-color 0.18s, box-shadow 0.18s', outline: 'none',
          }}
        />
        {right && (
          <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            {right}
          </div>
        )}
      </div>
    </div>
  )
}

function PaymentMethodView({ subscription, onSave, onBack }) {
  const [number,  setNumber]  = useState('')
  const [expiry,  setExpiry]  = useState('')
  const [cvv,     setCvv]     = useState('')
  const [name,    setName]    = useState('')
  const [saving,  setSaving]  = useState(false)
  const [done,    setDone]    = useState(false)

  const rawDigits  = number.replace(/\s/g, '')
  const cardType   = detectCardType(rawDigits)
  const maxDigits  = cardType === 'amex' ? 15 : 16
  const maxCvv     = cardType === 'amex' ? 4 : 3
  const isValid    = rawDigits.length === maxDigits && expiry.length === 5 && cvv.length === maxCvv && name.trim().length > 1

  // Auto-format card number into groups
  const handleNumber = raw => {
    const digits = raw.replace(/\D/g, '').slice(0, maxDigits)
    const spaced = cardType === 'amex'
      ? digits.replace(/^(\d{4})(\d{6})(\d{0,5}).*/, '$1 $2 $3').trim()
      : digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
    setNumber(spaced)
  }

  // Auto-insert slash after 2-digit month
  const handleExpiry = raw => {
    const digits = raw.replace(/\D/g, '').slice(0, 4)
    setExpiry(digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits)
  }

  const handleCvv = raw => setCvv(raw.replace(/\D/g, '').slice(0, maxCvv))

  const handleSave = () => {
    if (!isValid || saving) return
    setSaving(true)
    setTimeout(() => {
      setDone(true)
      onSave({ ...subscription, payment: { type: cardType ?? 'card', last4: rawDigits.slice(-4) } })
      setTimeout(onBack, 700)
    }, 900)
  }

  const cardTypeLabel = cardType ? CARD_TYPE_LABELS[cardType] : null
  const cardTypeColor = cardType ? CARD_TYPE_COLORS[cardType] : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 44 }}>
      <SubNav title="Payment Method" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px', paddingBottom: 96 }}>

        {/* Current card on file */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          style={{ marginBottom: 22 }}
        >
          <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 8, paddingLeft: 4 }}>
            On file
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.055)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(200,255,0,0.2)',
            borderRadius: 16, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 36, height: 24, borderRadius: 5, background: CARD_TYPE_COLORS[subscription.payment.type] || '#1A72E8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 8, fontWeight: 800, letterSpacing: '0.3px' }}>
                {CARD_TYPE_LABELS[subscription.payment.type] || 'CARD'}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                ···· ···· ···· {subscription.payment.last4}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: 4, background: '#4ade80' }} />
              <span style={{ color: '#4ade80', fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>In use</span>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.07 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>or add a new card</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </motion.div>

        {/* Card form */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}>

          {/* Card number */}
          <div style={{ marginBottom: 14 }}>
            <CardField
              label="Card number"
              value={number}
              onChange={handleNumber}
              placeholder="1234 5678 9012 3456"
              monospace
              right={cardTypeLabel && (
                <span style={{ color: cardTypeColor, fontSize: 11, fontWeight: 800, letterSpacing: '0.5px' }}>
                  {cardTypeLabel}
                </span>
              )}
            />
          </div>

          {/* Expiry + CVV row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <CardField label="Expiry" value={expiry} onChange={handleExpiry} placeholder="MM/YY" monospace />
            <CardField
              label={`CVV${maxCvv === 4 ? ' (4 digits)' : ''}`}
              value={cvv}
              onChange={handleCvv}
              placeholder={'•'.repeat(maxCvv)}
              type="password"
              monospace
            />
          </div>

          {/* Name on card */}
          <div style={{ marginBottom: 4 }}>
            <CardField label="Name on card" value={name} onChange={setName} placeholder="Jane Smith" />
          </div>

          {/* Security note */}
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11.5, fontFamily: 'Inter, sans-serif', margin: '8px 0 24px', textAlign: 'center' }}>
            🔒 Secured with 256-bit encryption
          </p>

          {/* Save button */}
          <motion.button
            whileTap={isValid && !saving ? { scale: 0.97 } : {}}
            onClick={handleSave}
            style={{
              width: '100%', height: 54, borderRadius: 18,
              background: done
                ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                : isValid && !saving
                  ? 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)'
                  : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: done ? '#fff' : isValid && !saving ? '#000' : 'rgba(255,255,255,0.2)',
              fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif',
              cursor: isValid && !saving ? 'pointer' : 'default',
              boxShadow: isValid && !saving && !done ? '0 8px 28px rgba(200,255,0,0.25)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.22s',
            }}
          >
            {done ? <><Check size={18} /> Card saved</> : saving ? <Spinner /> : 'Save & use this card'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Subscription — container (manages inner nav)
───────────────────────────────────────── */
function SubscriptionView({ subscription, onUpdate, onBack, initialView = 'main' }) {
  const [view, setView] = useState(initialView)
  const [dir,  setDir]  = useState(1)

  const go   = v => { setDir(1);  setView(v) }
  const back = () => { setDir(-1); setView('main') }

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#04050d', overflow: 'hidden' }}>
      <AnimatePresence custom={dir} mode="popLayout" initial={false}>
        {view === 'main' && (
          <motion.div key="sub-main" custom={dir} variants={subVariants} initial="enter" animate="center" exit="exit" transition={slideTransition}
            style={{ position: 'absolute', inset: 0 }}
          >
            <SubscriptionMain
              subscription={subscription}
              onSwitch={() => go('switch')}
              onCancel={() => go('cancel')}
              onPayment={() => go('payment')}
              onUpgrade={() => go('upgrade')}
              onBack={onBack}
            />
          </motion.div>
        )}
        {view === 'upgrade' && (
          <motion.div key="sub-upgrade" custom={dir} variants={subVariants} initial="enter" animate="center" exit="exit" transition={slideTransition}
            style={{ position: 'absolute', inset: 0 }}
          >
            <PricingOverview
              context="settings"
              currentPlanId={subscription.tier || 'personal'}
              back={back}
              onSelectPlan={plan => {
                onUpdate({ ...subscription, tier: plan.id })
                back()
              }}
            />
          </motion.div>
        )}
        {view === 'payment' && (
          <motion.div key="sub-payment" custom={dir} variants={subVariants} initial="enter" animate="center" exit="exit" transition={slideTransition}
            style={{ position: 'absolute', inset: 0 }}
          >
            <PaymentMethodView
              subscription={subscription}
              onSave={updated => { onUpdate(updated); back() }}
              onBack={back}
            />
          </motion.div>
        )}
        {view === 'switch' && (
          <motion.div key="sub-switch" custom={dir} variants={subVariants} initial="enter" animate="center" exit="exit" transition={slideTransition}
            style={{ position: 'absolute', inset: 0 }}
          >
            <SwitchPlanView subscription={subscription} onConfirm={plan => { onUpdate({ ...subscription, plan }); back() }} onBack={back} />
          </motion.div>
        )}
        {view === 'cancel' && (
          <motion.div key="sub-cancel" custom={dir} variants={subVariants} initial="enter" animate="center" exit="exit" transition={slideTransition}
            style={{ position: 'absolute', inset: 0 }}
          >
            <CancelFlowView
              subscription={subscription}
              onPause={() => { onUpdate({ ...subscription, status: 'paused' }); onBack() }}
              onCancel={() => { onUpdate({ ...subscription, status: 'cancelled' }); onBack() }}
              onKeep={back}
              onBack={back}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────
   Password strength helper
───────────────────────────────────────── */
function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: 'transparent' }
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: 'Weak',   color: '#E8656A' }
  if (score <= 3) return { score, label: 'Fair',   color: '#f59e0b' }
  if (score === 4) return { score, label: 'Good',  color: '#C8FF00' }
  return { score, label: 'Strong', color: '#4ade80' }
}

function PasswordStrengthBar({ password }) {
  const { score, label, color } = getPasswordStrength(password)
  if (!password) return null
  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: -6, marginBottom: 14 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= score ? color : 'rgba(255,255,255,0.1)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <p style={{ color, fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: 0 }}>{label}</p>
    </motion.div>
  )
}

function PasswordField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', margin: '0 0 7px' }}>
        {label}
      </p>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', height: 50, borderRadius: 14, boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: `1.5px solid ${focused ? 'rgba(200,255,0,0.55)' : 'rgba(255,255,255,0.09)'}`,
            boxShadow: focused ? '0 0 0 3px rgba(200,255,0,0.09)' : 'none',
            color: '#fff', fontSize: 15, padding: '0 48px 0 16px',
            fontFamily: 'Inter, sans-serif', transition: 'border-color 0.18s, box-shadow 0.18s', outline: 'none',
          }}
        />
        <button
          onClick={() => setShow(s => !s)}
          style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center',
          }}
        >
          {show
            ? <EyeOff size={17} color="rgba(255,255,255,0.35)" />
            : <Eye    size={17} color="rgba(255,255,255,0.35)" />
          }
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Change Password view
───────────────────────────────────────── */
function ChangePasswordView({ onBack }) {
  const [current, setCurrent]   = useState('')
  const [next, setNext]         = useState('')
  const [confirm, setConfirm]   = useState('')
  const [saving, setSaving]     = useState(false)
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState('')

  const strength = getPasswordStrength(next)
  const mismatch = confirm.length > 0 && next !== confirm
  const canSave  = current.length > 0 && next.length >= 8 && next === confirm && strength.score >= 2

  const handleSave = () => {
    if (!canSave || saving) return
    setError('')
    setSaving(true)
    setTimeout(() => { setDone(true); setTimeout(onBack, 900) }, 900)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#04050d', paddingTop: 44 }}>
      <SubNav title="Change Password" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px', paddingBottom: 96 }}>

        {/* Icon hero */}
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.04, type: 'spring', stiffness: 280, damping: 26 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, marginTop: 8 }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'rgba(200,255,0,0.10)', border: '1px solid rgba(200,255,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
          }}>
            <KeyRound size={28} color="#C8FF00" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: 'Inter, sans-serif', textAlign: 'center', maxWidth: 240, lineHeight: 1.5, margin: 0 }}>
            Choose a strong password with at least 8 characters, including numbers and symbols.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <PasswordField label="Current Password" value={current} onChange={setCurrent} placeholder="Enter current password" />
          <PasswordField label="New Password"     value={next}    onChange={setNext}    placeholder="At least 8 characters" />
          <PasswordStrengthBar password={next} />
          <PasswordField label="Confirm New Password" value={confirm} onChange={setConfirm} placeholder="Repeat new password" />
          {mismatch && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ color: '#E8656A', fontSize: 12, fontFamily: 'Inter, sans-serif', marginTop: -8, marginBottom: 12 }}
            >
              Passwords don't match
            </motion.p>
          )}
        </motion.div>

        {/* Security tips */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '14px 16px', marginTop: 4,
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: '0 0 8px' }}>Tips for a strong password</p>
          {['Use 12+ characters', 'Mix uppercase & lowercase', 'Include numbers & symbols', 'Avoid personal information'].map(tip => (
            <div key={tip} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <div style={{ width: 4, height: 4, borderRadius: 2, background: '#C8FF00', flexShrink: 0 }} />
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: 0 }}>{tip}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        style={{ padding: '12px 20px 36px', flexShrink: 0 }}
      >
        <PrimaryBtn label="Save Password" onClick={handleSave} disabled={!canSave} loading={saving && !done} done={done} />
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Two-Factor Authentication view
───────────────────────────────────────── */
const TFA_BACKUP_CODES = ['8A3K-X2MN', '7PLQ-9WRZ', 'C4TY-5BNF', 'M6HJ-1VKS', '3XDE-0QPG', 'R9UW-4CAL']

function TwoFactorView({ twoFactor, onUpdate, onBack }) {
  const [step, setStep]         = useState('main')   // 'main' | 'method' | 'sms-verify' | 'app-setup' | 'backup'
  const [method, setMethod]     = useState(twoFactor.method || 'sms')
  const [code, setCode]         = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [copied, setCopied]     = useState(false)

  const sendCode = () => {
    setCodeSent(true)
    setTimeout(() => setCodeSent(false), 30000)
  }

  const verify = () => {
    if (code.length < 6 || verifying) return
    setVerifying(true)
    setTimeout(() => {
      setVerified(true)
      onUpdate({ enabled: true, method })
      setTimeout(() => setStep('backup'), 700)
    }, 900)
  }

  const disable2FA = () => {
    onUpdate({ enabled: false, method: null })
    onBack()
  }

  const copyBackups = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const backTitle = step === 'main' ? 'Two-Factor Auth' : step === 'method' ? 'Choose Method' : step === 'backup' ? 'Backup Codes' : 'Verify'

  const handleBack = () => {
    if (step === 'main') return onBack()
    if (step === 'method') return setStep('main')
    if (step === 'sms-verify' || step === 'app-setup') return setStep('method')
    if (step === 'backup') return setStep('main')
    setStep('main')
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#04050d', paddingTop: 44 }}>
      <SubNav title={backTitle} onBack={handleBack} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px', paddingBottom: 96 }}>
        <AnimatePresence mode="wait">

          {/* ── Main ── */}
          {step === 'main' && (
            <motion.div key="tfa-main" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, marginTop: 8 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: twoFactor.enabled ? 'rgba(74,222,128,0.12)' : 'rgba(200,255,0,0.10)',
                  border: `1px solid ${twoFactor.enabled ? 'rgba(74,222,128,0.28)' : 'rgba(200,255,0,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                }}>
                  <ShieldCheck size={28} color={twoFactor.enabled ? '#4ade80' : '#C8FF00'} />
                </div>
                <p style={{ color: '#fff', fontSize: 17, fontWeight: 700, fontFamily: 'Inter, sans-serif', margin: '0 0 6px', letterSpacing: '-0.2px' }}>
                  {twoFactor.enabled ? '2FA is Active' : 'Add Extra Security'}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'Inter, sans-serif', textAlign: 'center', maxWidth: 260, lineHeight: 1.5, margin: 0 }}>
                  {twoFactor.enabled
                    ? `Protected via ${twoFactor.method === 'sms' ? 'SMS text message' : 'Authenticator app'}`
                    : 'Protect your account with a second verification step each time you sign in.'}
                </p>
              </div>

              {twoFactor.enabled ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 18, overflow: 'hidden',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {twoFactor.method === 'sms' ? <MessageSquare size={15} color="#C8FF00" /> : <QrCode size={15} color="#C8FF00" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#fff', fontSize: 14.5, fontWeight: 500, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                          {twoFactor.method === 'sms' ? 'SMS Text Message' : 'Authenticator App'}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: '2px 0 0' }}>Active method</p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', fontFamily: 'Inter, sans-serif', background: 'rgba(74,222,128,0.12)', padding: '3px 8px', borderRadius: 6 }}>ON</span>
                    </div>
                    <motion.div whileTap={{ scale: 0.985 }} onClick={() => setStep('backup')}
                      style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', cursor: 'pointer' }}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Copy size={15} color="rgba(255,255,255,0.6)" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#fff', fontSize: 14.5, fontWeight: 500, fontFamily: 'Inter, sans-serif', margin: 0 }}>View Backup Codes</p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: '2px 0 0' }}>6 codes remaining</p>
                      </div>
                      <ChevronRight size={15} color="rgba(255,255,255,0.22)" />
                    </motion.div>
                  </div>

                  <motion.button whileTap={{ scale: 0.97 }} onClick={disable2FA}
                    style={{
                      width: '100%', height: 50, borderRadius: 16,
                      background: 'rgba(232,101,106,0.08)', border: '1px solid rgba(232,101,106,0.2)',
                      color: '#E8656A', fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                      cursor: 'pointer',
                    }}
                  >
                    Disable Two-Factor Auth
                  </motion.button>
                </div>
              ) : (
                <PrimaryBtn label="Enable Two-Factor Auth" onClick={() => setStep('method')} />
              )}
            </motion.div>
          )}

          {/* ── Method selection ── */}
          {step === 'method' && (
            <motion.div key="tfa-method" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: 'Inter, sans-serif', marginBottom: 20, lineHeight: 1.55 }}>
                Choose how you'd like to receive your verification codes.
              </p>
              {[
                { id: 'sms', Icon: MessageSquare, label: 'SMS Text Message', sub: 'Codes sent to your phone number on file' },
                { id: 'app', Icon: QrCode,        label: 'Authenticator App', sub: 'Use Google Authenticator, Authy, or similar' },
              ].map(opt => (
                <motion.div key={opt.id} whileTap={{ scale: 0.985 }} onClick={() => setMethod(opt.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '16px',
                    background: method === opt.id ? 'rgba(200,255,0,0.07)' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${method === opt.id ? 'rgba(200,255,0,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 16, marginBottom: 12, cursor: 'pointer',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: method === opt.id ? 'rgba(200,255,0,0.12)' : 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <opt.Icon size={18} color={method === opt.id ? '#C8FF00' : 'rgba(255,255,255,0.5)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: 0 }}>{opt.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: '3px 0 0' }}>{opt.sub}</p>
                  </div>
                  <div style={{
                    width: 20, height: 20, borderRadius: 10,
                    border: `2px solid ${method === opt.id ? '#C8FF00' : 'rgba(255,255,255,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: method === opt.id ? '#C8FF00' : 'transparent',
                  }}>
                    {method === opt.id && <div style={{ width: 8, height: 8, borderRadius: 4, background: '#000' }} />}
                  </div>
                </motion.div>
              ))}
              <div style={{ marginTop: 8 }}>
                <PrimaryBtn label="Continue" onClick={() => setStep(method === 'sms' ? 'sms-verify' : 'app-setup')} />
              </div>
            </motion.div>
          )}

          {/* ── SMS verify ── */}
          {step === 'sms-verify' && (
            <motion.div key="tfa-sms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: 'Inter, sans-serif', marginBottom: 24, lineHeight: 1.55 }}>
                We'll send a 6-digit code to <span style={{ color: '#fff', fontWeight: 600 }}>+1 (555) 000-0000</span>
              </p>

              <div style={{ marginBottom: 20 }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', margin: '0 0 7px' }}>
                  Verification Code
                </p>
                <input
                  value={code} onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))}
                  placeholder="• • • • • •" maxLength={6}
                  style={{
                    width: '100%', height: 56, borderRadius: 14, boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.09)',
                    color: verified ? '#4ade80' : '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '8px',
                    textAlign: 'center', fontFamily: 'Inter, sans-serif', outline: 'none',
                    transition: 'border-color 0.2s',
                    borderColor: verified ? 'rgba(74,222,128,0.5)' : code.length === 6 ? 'rgba(200,255,0,0.45)' : 'rgba(255,255,255,0.09)',
                  }}
                />
              </div>

              {!codeSent ? (
                <motion.button whileTap={{ scale: 0.97 }} onClick={sendCode}
                  style={{ background: 'none', border: 'none', color: '#C8FF00', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer', padding: '0 0 20px' }}
                >
                  Send Code
                </motion.button>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>Code sent — resend in 30s</p>
              )}

              <PrimaryBtn
                label="Verify & Enable"
                onClick={verify}
                disabled={code.length < 6}
                loading={verifying && !verified}
                done={verified}
              />
            </motion.div>
          )}

          {/* ── Authenticator App setup ── */}
          {step === 'app-setup' && (
            <motion.div key="tfa-app" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: 'Inter, sans-serif', marginBottom: 20, lineHeight: 1.55 }}>
                Scan this QR code with your authenticator app or enter the key manually.
              </p>

              {/* Mock QR code */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 160, height: 160, borderRadius: 16,
                  background: '#fff', padding: 12,
                  display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 2,
                }}>
                  {Array.from({ length: 64 }).map((_, i) => {
                    const isOn = [0,1,2,3,4,5,6,8,14,16,22,24,30,32,38,48,49,50,51,52,53,54,56,62,63,7,15,23,31,39,47,9,17,25,33,41,11,19,43,21,29,37,45,55,57,58,59,60,61].includes(i)
                    return <div key={i} style={{ background: isOn ? '#000' : '#fff', borderRadius: 1 }} />
                  })}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', margin: '0 0 6px' }}>Manual Key</p>
                <p style={{ color: '#C8FF00', fontSize: 14, fontWeight: 600, letterSpacing: '2px', fontFamily: 'monospace', margin: 0 }}>JBSW Y3DP EBZG K3LN</p>
              </div>

              <div style={{ marginBottom: 20 }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', margin: '0 0 7px' }}>
                  Enter 6-Digit Code from App
                </p>
                <input
                  value={code} onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))}
                  placeholder="• • • • • •" maxLength={6}
                  style={{
                    width: '100%', height: 56, borderRadius: 14, boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.09)',
                    color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '8px',
                    textAlign: 'center', fontFamily: 'Inter, sans-serif', outline: 'none',
                  }}
                />
              </div>

              <PrimaryBtn
                label="Verify & Enable"
                onClick={verify}
                disabled={code.length < 6}
                loading={verifying && !verified}
                done={verified}
              />
            </motion.div>
          )}

          {/* ── Backup Codes ── */}
          {step === 'backup' && (
            <motion.div key="tfa-backup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                <p style={{ color: '#fff', fontSize: 17, fontWeight: 700, fontFamily: 'Inter, sans-serif', margin: '0 0 8px', letterSpacing: '-0.2px' }}>Save Your Backup Codes</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'Inter, sans-serif', textAlign: 'center', maxWidth: 280, lineHeight: 1.5, margin: 0 }}>
                  Store these in a safe place. Each code can only be used once if you lose access to your authenticator.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {TFA_BACKUP_CODES.map((c, i) => (
                  <motion.div key={c} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    style={{
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 10, padding: '10px 14px', textAlign: 'center',
                    }}
                  >
                    <span style={{ color: '#C8FF00', fontSize: 13, fontWeight: 600, fontFamily: 'monospace', letterSpacing: '1px' }}>{c}</span>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={copyBackups}
                  style={{
                    flex: 1, height: 48, borderRadius: 14,
                    background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.07)',
                    border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.09)'}`,
                    color: copied ? '#4ade80' : 'rgba(255,255,255,0.7)',
                    fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  }}
                >
                  {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy Codes</>}
                </motion.button>
              </div>
              <PrimaryBtn label="Done" onClick={onBack} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Active Sessions view
───────────────────────────────────────── */
const MOCK_SESSIONS = [
  { id: 1, device: 'iPhone 15 Pro', os: 'iOS 17.4', location: 'San Francisco, CA', lastActive: 'Now', current: true, icon: Smartphone },
  { id: 2, device: 'MacBook Pro',   os: 'macOS 14.3', location: 'San Francisco, CA', lastActive: '2 hours ago', current: false, icon: Monitor },
  { id: 3, device: 'Chrome Browser', os: 'Windows 11', location: 'New York, NY', lastActive: '3 days ago', current: false, icon: Globe },
]

function ActiveSessionsView({ onBack }) {
  const [sessions, setSessions]       = useState(MOCK_SESSIONS)
  const [revoking, setRevoking]       = useState(null)
  const [signOutAll, setSignOutAll]   = useState(false)
  const [allRevoked, setAllRevoked]   = useState(false)

  const revokeSession = id => {
    setRevoking(id)
    setTimeout(() => {
      setSessions(s => s.filter(sess => sess.id !== id))
      setRevoking(null)
    }, 700)
  }

  const revokeAll = () => {
    setSignOutAll(true)
    setTimeout(() => {
      setSessions(s => s.filter(sess => sess.current))
      setAllRevoked(true)
    }, 900)
  }

  const otherSessions = sessions.filter(s => !s.current)

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#04050d', paddingTop: 44 }}>
      <SubNav title="Active Sessions" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', paddingBottom: 96 }}>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 }}
          style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, fontFamily: 'Inter, sans-serif', marginBottom: 16, lineHeight: 1.55 }}
        >
          These devices are signed into your account. Remove any sessions you don't recognize.
        </motion.p>

        {/* Current device */}
        <Section title="This Device" delay={0.06}>
          {sessions.filter(s => s.current).map(sess => (
            <div key={sess.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px' }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <sess.icon size={16} color="#4ade80" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#fff', fontSize: 14.5, fontWeight: 500, fontFamily: 'Inter, sans-serif', margin: 0 }}>{sess.device}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: '2px 0 0' }}>{sess.os} · {sess.location}</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', fontFamily: 'Inter, sans-serif', background: 'rgba(74,222,128,0.12)', padding: '3px 8px', borderRadius: 6 }}>Active</span>
            </div>
          ))}
        </Section>

        {/* Other sessions */}
        {otherSessions.length > 0 && (
          <Section title="Other Sessions" delay={0.10}>
            {otherSessions.map((sess, i) => (
              <motion.div key={sess.id}
                animate={{ opacity: revoking === sess.id ? 0.4 : 1, x: revoking === sess.id ? 20 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px', borderBottom: i < otherSessions.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <sess.icon size={16} color="rgba(255,255,255,0.5)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#fff', fontSize: 14.5, fontWeight: 500, fontFamily: 'Inter, sans-serif', margin: 0 }}>{sess.device}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: '2px 0 0' }}>{sess.location} · {sess.lastActive}</p>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => revokeSession(sess.id)}
                  disabled={!!revoking}
                  style={{
                    background: 'rgba(232,101,106,0.08)', border: '1px solid rgba(232,101,106,0.2)',
                    borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
                    color: '#E8656A', fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                    display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
                  }}
                >
                  {revoking === sess.id ? <Spinner color="#E8656A" size={14} /> : 'Revoke'}
                </motion.button>
              </motion.div>
            ))}
          </Section>
        )}

        {otherSessions.length === 0 && allRevoked && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '24px 0' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 24, background: 'rgba(74,222,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={22} color="#4ade80" />
            </div>
            <p style={{ color: '#4ade80', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: 0 }}>All other sessions removed</p>
          </motion.div>
        )}

        {otherSessions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} style={{ marginTop: 8 }}>
            <motion.button whileTap={{ scale: 0.97 }} onClick={revokeAll} disabled={signOutAll}
              style={{
                width: '100%', height: 50, borderRadius: 16,
                background: 'rgba(232,101,106,0.07)', border: '1px solid rgba(232,101,106,0.18)',
                color: signOutAll ? 'rgba(232,101,106,0.4)' : '#E8656A',
                fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                cursor: signOutAll ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {signOutAll ? <><Spinner color="#E8656A" size={16} /> Revoking...</> : <><LogOut size={16} /> Sign Out All Other Devices</>}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Privacy & Data view
───────────────────────────────────────── */
function PrivacyDataView({ privacy, onUpdate, onBack }) {
  const [exporting, setExporting] = useState(false)
  const [exported, setExported]   = useState(false)
  const set = key => () => onUpdate({ ...privacy, [key]: !privacy[key] })

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => { setExported(true); setTimeout(() => setExported(false), 3000) }, 1200)
    setTimeout(() => setExporting(false), 1200)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#04050d', paddingTop: 44 }}>
      <SubNav title="Privacy & Data" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', paddingBottom: 96 }}>

        <Section title="Location" delay={0.04}>
          <Row icon={MapPin}   label="Precise Location" sublabel="Required for live tracking"         toggle={{ on: privacy.location,    onToggle: set('location')    }} />
          <Row icon={Activity} label="Background Access" sublabel="Track trips when app is closed"    toggle={{ on: privacy.background,  onToggle: set('background')  }} last />
        </Section>

        <Section title="Sharing" delay={0.08}>
          <Row icon={BarChart3}   label="Analytics & Diagnostics" sublabel="Help us improve the app"              toggle={{ on: privacy.analytics, onToggle: set('analytics') }} />
          <Row icon={Globe}       label="Anonymous Driving Data"  sublabel="Share with vehicle manufacturers"     toggle={{ on: privacy.shareData, onToggle: set('shareData') }} last />
        </Section>

        {/* What we collect card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px', marginBottom: 22 }}
        >
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: '0 0 10px' }}>Data we collect</p>
          {[
            'GPS location during active trips',
            'Vehicle speed & acceleration events',
            'OBD-II diagnostic codes',
            'App usage & crash reports (if enabled)',
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
              <div style={{ width: 4, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)', flexShrink: 0, marginTop: 5 }} />
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12.5, fontFamily: 'Inter, sans-serif', lineHeight: 1.5, margin: 0 }}>{item}</p>
            </div>
          ))}
        </motion.div>

        <Section title="Your Data" delay={0.16}>
          <motion.div whileTap={{ scale: 0.985 }} onClick={handleExport}
            style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', cursor: 'pointer' }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {exporting ? <Spinner color="#C8FF00" size={15} /> : exported ? <Check size={15} color="#4ade80" /> : <Download size={15} color="#C8FF00" />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: exported ? '#4ade80' : '#fff', fontSize: 14.5, fontWeight: 500, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                {exported ? 'Export Requested' : 'Export My Data'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: '2px 0 0' }}>
                {exported ? 'You\'ll receive an email within 24 hours' : 'Download a copy of your Tracklynk data'}
              </p>
            </div>
            {!exporting && !exported && <ChevronRight size={15} color="rgba(255,255,255,0.22)" />}
          </motion.div>
        </Section>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12, fontFamily: 'Inter, sans-serif', textAlign: 'center', lineHeight: 1.6, padding: '0 12px' }}
        >
          We never sell your personal data. Read our full{' '}
          <span style={{ color: 'rgba(200,255,0,0.7)', textDecoration: 'underline' }}>Privacy Policy</span>{' '}
          for details.
        </motion.p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Delete Account view  (3-step flow)
   step: 'warning' → 'confirm' → 'deleting'
───────────────────────────────────────── */
function DeleteAccountView({ profile, onBack }) {
  const [step, setStep]       = useState('warning')
  const [typed, setTyped]     = useState('')
  const [deleting, setDeleting] = useState(false)
  const [focused, setFocused] = useState(false)

  const targetEmail = profile.email
  const confirmed   = typed.trim().toLowerCase() === targetEmail.toLowerCase()

  const handleDelete = () => {
    if (!confirmed || deleting) return
    setDeleting(true)
    setStep('deleting')
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#04050d', paddingTop: 44 }}>
      <SubNav
        title={step === 'warning' ? 'Delete Account' : step === 'confirm' ? 'Confirm Deletion' : 'Deleting Account'}
        onBack={step === 'warning' ? onBack : () => setStep('warning')}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px', paddingBottom: 96, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">

          {/* ── Warning ── */}
          {step === 'warning' && (
            <motion.div key="del-warning" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.22 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, marginTop: 8 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 22,
                  background: 'rgba(232,101,106,0.10)', border: '1px solid rgba(232,101,106,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                }}>
                  <AlertTriangle size={32} color="#E8656A" />
                </div>
                <p style={{ color: '#fff', fontSize: 19, fontWeight: 800, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.4px', margin: '0 0 8px' }}>
                  This can't be undone
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13.5, fontFamily: 'Inter, sans-serif', textAlign: 'center', maxWidth: 270, lineHeight: 1.6, margin: 0 }}>
                  Deleting your account will permanently remove all your data from Tracklynk.
                </p>
              </div>

              <div style={{ background: 'rgba(232,101,106,0.06)', border: '1px solid rgba(232,101,106,0.14)', borderRadius: 16, padding: '16px', marginBottom: 28 }}>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12.5, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: '0 0 10px' }}>What will be deleted:</p>
                {[
                  'Your profile and account credentials',
                  'All trip history and routes',
                  'Vehicle and OBD device data',
                  'Active subscription (no refund)',
                  'Saved geofences and alerts',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                    <X size={13} color="#E8656A" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, fontFamily: 'Inter, sans-serif', lineHeight: 1.5, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep('confirm')}
                  style={{
                    width: '100%', height: 52, borderRadius: 16,
                    background: 'rgba(232,101,106,0.10)', border: '1.5px solid rgba(232,101,106,0.3)',
                    color: '#E8656A', fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                  }}
                >
                  Continue to Delete
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={onBack}
                  style={{
                    width: '100%', height: 52, borderRadius: 16,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
                    color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                  }}
                >
                  Keep My Account
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Confirm ── */}
          {step === 'confirm' && (
            <motion.div key="del-confirm" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.22 }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'Inter, sans-serif', marginBottom: 28, lineHeight: 1.6 }}>
                To confirm, type your email address{' '}
                <span style={{ color: '#fff', fontWeight: 600 }}>{targetEmail}</span>{' '}
                below.
              </p>

              <div style={{ marginBottom: 28 }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', margin: '0 0 7px' }}>
                  Email Address
                </p>
                <input
                  type="email" value={typed} placeholder={targetEmail}
                  onChange={e => setTyped(e.target.value)}
                  onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  style={{
                    width: '100%', height: 52, borderRadius: 14, boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                    border: `1.5px solid ${confirmed ? 'rgba(232,101,106,0.5)' : focused ? 'rgba(200,255,0,0.45)' : 'rgba(255,255,255,0.09)'}`,
                    boxShadow: focused ? '0 0 0 3px rgba(200,255,0,0.08)' : 'none',
                    color: confirmed ? '#E8656A' : '#fff', fontSize: 15,
                    padding: '0 16px', fontFamily: 'Inter, sans-serif',
                    transition: 'border-color 0.18s, box-shadow 0.18s', outline: 'none',
                  }}
                />
              </div>

              <motion.button whileTap={confirmed ? { scale: 0.97 } : {}} onClick={handleDelete}
                style={{
                  width: '100%', height: 54, borderRadius: 16,
                  background: confirmed ? 'rgba(232,101,106,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${confirmed ? 'rgba(232,101,106,0.45)' : 'rgba(255,255,255,0.06)'}`,
                  color: confirmed ? '#E8656A' : 'rgba(255,255,255,0.2)',
                  fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                  cursor: confirmed ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                }}
              >
                Permanently Delete Account
              </motion.button>
            </motion.div>
          )}

          {/* ── Deleting ── */}
          {step === 'deleting' && (
            <motion.div key="del-deleting" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                style={{ width: 48, height: 48, borderRadius: 24, border: '3px solid rgba(232,101,106,0.15)', borderTopColor: '#E8656A', marginBottom: 20 }}
              />
              <p style={{ color: '#E8656A', fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', margin: '0 0 8px' }}>Deleting your account…</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'Inter, sans-serif', margin: 0 }}>This may take a moment</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Help & Support view
   • System status banner
   • FAQ accordion
   • Contact Support form
───────────────────────────────────────── */
const FAQS = [
  {
    q: "Why isn't my OBD-II device connecting?",
    a: 'Make sure the device is firmly plugged into your vehicle\'s OBD-II port (usually under the dashboard on the driver\'s side). Try toggling Bluetooth off and on, then tap "Repair Device" in Vehicle Settings.',
  },
  {
    q: 'How do I add a second vehicle?',
    a: 'Go to Settings → Vehicles & Devices and tap "Add Vehicle". You\'ll be guided through scanning or entering your VIN, then pairing a new OBD-II device.',
  },
  {
    q: 'My trips aren\'t being recorded automatically.',
    a: 'Ensure Background Location is enabled under Settings → Privacy & Data. Also confirm your OBD-II device shows a strong signal in Vehicle Settings.',
  },
  {
    q: 'How do geofence alerts work?',
    a: 'Geofences are virtual boundaries you draw on the map. When your vehicle enters or exits a zone, you receive a push notification. Set them up from the Home screen by tapping the geofence icon.',
  },
  {
    q: 'Can I share my vehicle\'s location with family?',
    a: 'Family sharing is coming in a future update. For now you can export trip history as a CSV from the Trips screen.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Go to Settings → Subscription → Cancel Subscription. You\'ll keep access until the end of your current billing period.',
  },
]

function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <motion.div whileTap={{ scale: 0.99 }} onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }}
      >
        <HelpCircle size={15} color="rgba(200,255,0,0.7)" style={{ flexShrink: 0 }} />
        <p style={{ flex: 1, color: '#fff', fontSize: 14, fontWeight: 500, fontFamily: 'Inter, sans-serif', margin: 0, lineHeight: 1.4 }}>{q}</p>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
          <ChevronDown size={15} color="rgba(255,255,255,0.3)" />
        </motion.div>
      </motion.div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: 'Inter, sans-serif', lineHeight: 1.65, margin: 0, padding: '0 16px 16px 43px' }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function HelpSupportView({ onBack }) {
  const [tab, setTab]         = useState('faq')   // 'faq' | 'contact'
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [msgFocused, setMsgFocused] = useState(false)

  const canSend = subject.trim().length > 0 && message.trim().length > 10
  const handleSend = () => {
    if (!canSend || sending) return
    setSending(true)
    setTimeout(() => { setSent(true); setSending(false) }, 1000)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#04050d', paddingTop: 44 }}>
      <SubNav title="Help & Support" onBack={onBack} />

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, padding: '4px 16px 12px', flexShrink: 0 }}>
        {[{ id: 'faq', label: 'FAQs' }, { id: 'contact', label: 'Contact Us' }].map(t => (
          <motion.button key={t.id} whileTap={{ scale: 0.95 }} onClick={() => setTab(t.id)}
            style={{
              flex: 1, height: 38, borderRadius: 12,
              background: tab === t.id ? 'rgba(200,255,0,0.10)' : 'rgba(255,255,255,0.05)',
              border: `1.5px solid ${tab === t.id ? 'rgba(200,255,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: tab === t.id ? '#C8FF00' : 'rgba(255,255,255,0.45)',
              fontSize: 13.5, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              cursor: 'pointer', transition: 'all 0.18s',
            }}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px', paddingBottom: 40 }}>
        <AnimatePresence mode="wait">

          {/* ── FAQ tab ── */}
          {tab === 'faq' && (
            <motion.div key="faq" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>

              {/* System status */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                  background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.18)',
                  borderRadius: 14, marginBottom: 16,
                }}
              >
                <CheckCircle2 size={16} color="#4ade80" />
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#4ade80', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: 0 }}>All systems operational</p>
                  <p style={{ color: 'rgba(74,222,128,0.6)', fontSize: 11.5, fontFamily: 'Inter, sans-serif', margin: '1px 0 0' }}>Live tracking · OBD sync · Notifications</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                  style={{ width: 8, height: 8, borderRadius: 4, background: '#4ade80', flexShrink: 0 }}
                />
              </motion.div>

              <Section title="Frequently Asked" delay={0.06}>
                {FAQS.map((faq, i) => (
                  <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
                ))}
                <div style={{ padding: '14px 16px' }}>
                  <motion.div whileTap={{ scale: 0.97 }} onClick={() => setTab('contact')}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                  >
                    <MessageSquare size={15} color="#C8FF00" />
                    <p style={{ color: '#C8FF00', fontSize: 13.5, fontWeight: 600, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                      Didn't find your answer? Contact us →
                    </p>
                  </motion.div>
                </div>
              </Section>

              {/* Quick contact options */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: 4 }}>
                <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 8, paddingLeft: 4 }}>
                  Reach Us Directly
                </p>
                <div style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, overflow: 'hidden' }}>
                  {[
                    { Icon: Mail,      label: 'support@tracklynk.com', sub: 'Response within 24 hours' },
                    { Icon: PhoneIcon, label: '+1 (800) 555-0199',      sub: 'Mon–Fri, 9am–6pm PST', last: true },
                  ].map(({ Icon, label, sub, last }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={15} color="#C8FF00" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#fff', fontSize: 14, fontWeight: 500, fontFamily: 'Inter, sans-serif', margin: 0 }}>{label}</p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: '2px 0 0' }}>{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ── Contact tab ── */}
          {tab === 'contact' && (
            <motion.div key="contact" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 48, gap: 14 }}
                >
                  <div style={{ width: 72, height: 72, borderRadius: 22, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={30} color="#4ade80" />
                  </div>
                  <p style={{ color: '#fff', fontSize: 19, fontWeight: 800, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.4px', margin: 0 }}>Message Sent!</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13.5, fontFamily: 'Inter, sans-serif', textAlign: 'center', maxWidth: 260, lineHeight: 1.6, margin: 0 }}>
                    Our support team will get back to you at your registered email within 24 hours.
                  </p>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setSent(false); setSubject(''); setMessage('') }}
                    style={{
                      marginTop: 8, padding: '12px 28px', borderRadius: 14,
                      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                      cursor: 'pointer',
                    }}
                  >
                    Send Another
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 }}
                    style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'Inter, sans-serif', lineHeight: 1.6, marginBottom: 20 }}
                  >
                    Describe your issue and we'll respond to your registered email.
                  </motion.p>

                  {/* Subject picker */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} style={{ marginBottom: 14 }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', margin: '0 0 9px' }}>Topic</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {['Device Setup', 'Billing', 'Trips & Data', 'Account', 'App Bug', 'Other'].map(s => (
                        <motion.button key={s} whileTap={{ scale: 0.94 }} onClick={() => setSubject(s)}
                          style={{
                            padding: '8px 14px', borderRadius: 10,
                            background: subject === s ? 'rgba(200,255,0,0.10)' : 'rgba(255,255,255,0.06)',
                            border: `1.5px solid ${subject === s ? 'rgba(200,255,0,0.35)' : 'rgba(255,255,255,0.09)'}`,
                            color: subject === s ? '#C8FF00' : 'rgba(255,255,255,0.5)',
                            fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Message textarea */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }} style={{ marginBottom: 20 }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', margin: '0 0 7px' }}>Message</p>
                    <textarea
                      value={message}
                      placeholder="Describe your issue in detail…"
                      onChange={e => setMessage(e.target.value)}
                      onFocus={() => setMsgFocused(true)}
                      onBlur={() => setMsgFocused(false)}
                      rows={5}
                      style={{
                        width: '100%', borderRadius: 14, boxSizing: 'border-box',
                        background: 'rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                        border: `1.5px solid ${msgFocused ? 'rgba(200,255,0,0.5)' : 'rgba(255,255,255,0.09)'}`,
                        boxShadow: msgFocused ? '0 0 0 3px rgba(200,255,0,0.08)' : 'none',
                        color: '#fff', fontSize: 14, padding: '14px 16px',
                        fontFamily: 'Inter, sans-serif', lineHeight: 1.6,
                        resize: 'none', outline: 'none',
                        transition: 'border-color 0.18s, box-shadow 0.18s',
                      }}
                    />
                    <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11.5, fontFamily: 'Inter, sans-serif', margin: '5px 0 0', textAlign: 'right' }}>{message.length} chars</p>
                  </motion.div>

                  <PrimaryBtn
                    label="Send Message"
                    onClick={handleSend}
                    disabled={!canSend}
                    loading={sending}
                    icon={Send}
                  />
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   What's New view  (version changelog)
───────────────────────────────────────── */
const CHANGELOG = [
  {
    version: '1.0.0', date: 'April 2026', current: true,
    changes: [
      'Live GPS tracking with real-time map',
      'OBD-II device pairing & diagnostics',
      'Trip history with route replay',
      'Speed & geofence alerts',
      'Face ID / biometric login',
      'Annual & monthly subscription plans',
    ],
  },
  {
    version: '0.9.2', date: 'March 2026', current: false,
    changes: [
      'Improved OBD-II connection stability',
      'Faster trip sync on app launch',
      'Fixed geofence notification delay',
    ],
  },
  {
    version: '0.9.0', date: 'February 2026', current: false,
    changes: [
      'Subscription management in Settings',
      'Vehicle nickname & plate editing',
      'Notification preferences',
      'Performance improvements',
    ],
  },
  {
    version: '0.8.0', date: 'January 2026', current: false,
    changes: [
      'Initial beta release',
      'Vehicle onboarding flow',
      'Basic trip recording',
    ],
  },
]

function WhatsNewView({ onBack }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#04050d', paddingTop: 44 }}>
      <SubNav title="What's New" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px', paddingBottom: 40 }}>
        {CHANGELOG.map((release, ri) => (
          <motion.div key={release.version}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ri * 0.07, type: 'spring', stiffness: 280, damping: 26 }}
            style={{ marginBottom: 20 }}
          >
            {/* Version header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                padding: '4px 10px', borderRadius: 8,
                background: release.current ? 'rgba(200,255,0,0.12)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${release.current ? 'rgba(200,255,0,0.3)' : 'rgba(255,255,255,0.09)'}`,
              }}>
                <span style={{
                  color: release.current ? '#C8FF00' : 'rgba(255,255,255,0.5)',
                  fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif', letterSpacing: '0.2px',
                }}>
                  v{release.version}
                </span>
              </div>
              {release.current && (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', fontFamily: 'Inter, sans-serif', background: 'rgba(74,222,128,0.10)', padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(74,222,128,0.2)' }}>
                  Current
                </span>
              )}
              <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, fontFamily: 'Inter, sans-serif', marginLeft: 'auto' }}>{release.date}</span>
            </div>

            {/* Changes card */}
            <div style={{
              background: release.current ? 'rgba(200,255,0,0.04)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${release.current ? 'rgba(200,255,0,0.12)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 16, padding: '14px 16px',
            }}>
              {release.changes.map((c, ci) => (
                <motion.div key={c}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: ri * 0.07 + ci * 0.03 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: ci < release.changes.length - 1 ? 10 : 0 }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: 2.5, background: release.current ? '#C8FF00' : 'rgba(255,255,255,0.25)', flexShrink: 0, marginTop: 5 }} />
                  <p style={{ color: release.current ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.38)', fontSize: 13.5, fontFamily: 'Inter, sans-serif', lineHeight: 1.5, margin: 0 }}>{c}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ color: 'rgba(255,255,255,0.18)', fontSize: 12, fontFamily: 'Inter, sans-serif', textAlign: 'center', paddingBottom: 8 }}
        >
          Tracklynk · Built with ♥ in San Francisco
        </motion.p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Terms & Privacy view  (tabbed)
───────────────────────────────────────── */
const TERMS_TEXT = [
  { heading: '1. Acceptance of Terms', body: 'By downloading or using Tracklynk you agree to be bound by these Terms of Service. If you do not agree, please uninstall the app and cancel your subscription.' },
  { heading: '2. Description of Service', body: 'Tracklynk provides real-time vehicle tracking, trip logging, OBD-II diagnostics, and related services via a mobile application and connected hardware device.' },
  { heading: '3. Account Responsibilities', body: 'You are responsible for maintaining the confidentiality of your credentials. Any activity under your account is your responsibility. Notify us immediately of any unauthorized access.' },
  { heading: '4. Subscription & Billing', body: 'Paid plans are billed in advance on a monthly or annual basis. Fees are non-refundable except as required by law. We reserve the right to change pricing with 30 days\' notice.' },
  { heading: '5. Acceptable Use', body: 'You agree not to use Tracklynk for illegal surveillance, tracking individuals without consent, or any activity that violates applicable law. Commercial resale of data is prohibited.' },
  { heading: '6. Limitation of Liability', body: 'Tracklynk is not liable for indirect, incidental, or consequential damages arising from use of the service. Our total liability shall not exceed the fees paid in the preceding 12 months.' },
  { heading: '7. Termination', body: 'We may suspend or terminate your account for violation of these terms. You may delete your account at any time from Settings. Termination does not entitle you to a refund.' },
  { heading: '8. Governing Law', body: 'These terms are governed by the laws of the State of California, without regard to conflict of law provisions.' },
]

const PRIVACY_TEXT = [
  { heading: 'What We Collect', body: 'We collect GPS location data during active trips, vehicle OBD-II telemetry, device identifiers, and usage analytics. You control analytics sharing in Settings → Privacy & Data.' },
  { heading: 'How We Use Your Data', body: 'Your data powers trip history, speed alerts, geofence notifications, and vehicle health reports. Aggregated, anonymized data may be used to improve our services.' },
  { heading: 'Data Sharing', body: 'We do not sell your personal data. We share data only with service providers necessary to operate Tracklynk (cloud hosting, push notifications) under strict confidentiality agreements.' },
  { heading: 'Data Retention', body: 'Trip data is retained for 24 months by default. You may export or delete your data at any time from Settings → Privacy & Data.' },
  { heading: 'Location Data', body: 'Precise location is used only while a trip is active or background tracking is enabled. You can disable background location in Settings → Privacy & Data.' },
  { heading: 'Security', body: 'We use 256-bit AES encryption in transit and at rest. Two-factor authentication and biometric login are available to further protect your account.' },
  { heading: 'Children\'s Privacy', body: 'Tracklynk is not directed to children under 13. We do not knowingly collect personal information from minors.' },
  { heading: 'Contact', body: 'For privacy questions or data requests, contact privacy@tracklynk.com. For EU/GDPR requests, include "GDPR" in the subject line.' },
]

function TermsPrivacyView({ onBack }) {
  const [tab, setTab] = useState('terms')

  const content = tab === 'terms' ? TERMS_TEXT : PRIVACY_TEXT
  const updated  = tab === 'terms' ? 'Last updated April 1, 2026' : 'Last updated April 1, 2026'

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#04050d', paddingTop: 44 }}>
      <SubNav title="Terms & Privacy" onBack={onBack} />

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, padding: '4px 16px 12px', flexShrink: 0 }}>
        {[{ id: 'terms', label: 'Terms of Service' }, { id: 'privacy', label: 'Privacy Policy' }].map(t => (
          <motion.button key={t.id} whileTap={{ scale: 0.95 }} onClick={() => setTab(t.id)}
            style={{
              flex: 1, height: 38, borderRadius: 12,
              background: tab === t.id ? 'rgba(200,255,0,0.10)' : 'rgba(255,255,255,0.05)',
              border: `1.5px solid ${tab === t.id ? 'rgba(200,255,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: tab === t.id ? '#C8FF00' : 'rgba(255,255,255,0.45)',
              fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              cursor: 'pointer', transition: 'all 0.18s',
            }}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px', paddingBottom: 40 }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.18 }}>

            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'Inter, sans-serif', marginBottom: 18, paddingLeft: 2 }}>{updated}</p>

            {content.map((section, i) => (
              <motion.div key={section.heading}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{ marginBottom: 20 }}
              >
                <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 700, fontFamily: 'Inter, sans-serif', margin: '0 0 6px', letterSpacing: '-0.1px' }}>{section.heading}</p>
                <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 13, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, margin: 0 }}>{section.body}</p>
              </motion.div>
            ))}

            <div style={{ marginTop: 8, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'Inter, sans-serif', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
                Questions? Email{' '}
                <span style={{ color: 'rgba(200,255,0,0.65)' }}>legal@tracklynk.com</span>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main Settings screen
───────────────────────────────────────── */
export default function Settings() {
  const [activeView,        setActiveView]        = useState(null)
  const [selectedVehicleId, setSelectedVehicleId] = useState(null)
  const [profile, setProfile] = useState({ first: 'Jane', last: 'Smith', email: 'jane@email.com', phone: '+1 (555) 000-0000' })
  const [vehicles, setVehicles] = useState([
    { id: 1, nickname: 'My Tesla Model 3', plate: '8ABC123', year: '2021', make: 'Tesla', model: 'Model 3', trim: 'Long Range', device: { connected: true, lastSeen: '2 min ago', signal: 4 } },
  ])
  const [subscription, setSubscription] = useState({
    plan: 'annual', status: 'active', tier: 'personal',
    nextDate: 'Jan 15, 2026', nextAmount: '$95.88',
    payment: { type: 'visa', last4: '4242' },
  })
  const [subInitialView, setSubInitialView] = useState('main')
  const [notifs, setNotifs] = useState({ speed: true, geofence: true, trips: false, health: true })
  const [faceId, setFaceId] = useState(true)
  const [twoFactor, setTwoFactor] = useState({ enabled: false, method: null })
  const [privacy, setPrivacy] = useState({ location: true, background: true, analytics: true, shareData: false })
  const [rating, setRating]   = useState(0)
  const [rated, setRated]     = useState(false)
  const [copied, setCopied]   = useState(false)

  const handleRate = star => { setRating(star); setRated(true) }
  const handleCopyLink = () => { setCopied(true); setTimeout(() => setCopied(false), 2500) }

  const toggle = key => setNotifs(n => ({ ...n, [key]: !n[key] }))

  const openSubscription = (view = 'main') => { setSubInitialView(view); setActiveView('subscription') }

  const openVehicle = id => { setSelectedVehicleId(id); setActiveView('vehicle-detail') }
  const handleSaveVehicle = updated => {
    setVehicles(vs => vs.map(v => v.id === updated.id ? updated : v))
    setActiveView(null)
  }
  const handleRemoveVehicle = id => {
    setVehicles(vs => vs.filter(v => v.id !== id))
    setActiveView(null)
  }
  const handleAddVehicle = newVehicle => {
    setVehicles(vs => [...vs, { ...newVehicle, id: Date.now() }])
    setActiveView(null)
  }

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId)
  const displayName = `${profile.first} ${profile.last}`

  return (
    <div style={{ height: '100%', position: 'relative', background: '#04050d', overflow: 'hidden' }}>

      {/* ── Main list ── */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', paddingTop: 44 }}>
        <div style={{ padding: '14px 20px 10px', flexShrink: 0 }}>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px', margin: 0 }}>
            Settings
          </h1>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 16px', paddingBottom: 96 }}>

          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04, type: 'spring', stiffness: 320, damping: 28 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => setActiveView('profile')}
            style={{
              background: 'rgba(255,255,255,0.055)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 18, padding: '14px 16px', marginBottom: 22,
              display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
            }}
          >
            <div style={{
              width: 50, height: 50, borderRadius: 25, flexShrink: 0,
              background: 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#000', fontSize: 20, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>
                {profile.first[0]?.toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.2px', margin: 0 }}>{displayName}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'Inter, sans-serif', margin: '2px 0 0' }}>{profile.email}</p>
            </div>
            <ChevronRight size={15} color="rgba(255,255,255,0.22)" />
          </motion.div>

          {/* Vehicles & Devices */}
          <Section title="Vehicles & Devices" delay={0.07}>
            {vehicles.map((v, i) => (
              <Row
                key={v.id}
                icon={Car}
                label={v.nickname}
                sublabel={v.device.connected ? `OBD-II paired · ${v.device.lastSeen}` : 'Device not paired'}
                onPress={() => openVehicle(v.id)}
              />
            ))}
            <Row
              icon={Plus} iconBg="rgba(255,255,255,0.08)"
              label="Add Vehicle"
              onPress={() => setActiveView('add-vehicle')}
              last
            />
          </Section>

          {/* Subscription */}
          <Section title="Subscription" delay={0.10}>
            {subscription.status === 'cancelled' ? (
              <Row
                icon={CreditCard}
                label="Subscription Cancelled"
                sublabel={`Access until ${subscription.nextDate}`}
                onPress={() => openSubscription('main')}
                last
              />
            ) : subscription.status === 'paused' ? (
              <>
                <Row icon={CreditCard} label={`${PLAN_DATA[subscription.plan].label} Plan · Paused`} sublabel={`Resumes ${subscription.nextDate}`} onPress={() => openSubscription('main')} />
                <Row icon={ArrowLeftRight} label={`Switch to ${subscription.plan === 'annual' ? 'Monthly' : 'Annual'}`} onPress={() => openSubscription('switch')} last />
              </>
            ) : (
              <>
                <Row icon={CreditCard}     label={`${PLAN_DATA[subscription.plan].label} Plan`}           sublabel={`Renews ${subscription.nextDate}`} value={`$${PLAN_DATA[subscription.plan].monthly}/mo`} onPress={() => openSubscription('main')} />
                <Row icon={ArrowLeftRight} label={`Switch to ${subscription.plan === 'annual' ? 'Monthly' : 'Annual'}`} sublabel={subscription.plan === 'annual' ? '$9.65/month · cancel anytime' : '$7.99/mo · save $21/year'} onPress={() => openSubscription('switch')} />
                <Row icon={XCircle}        label="Cancel Subscription" danger onPress={() => openSubscription('cancel')} last />
              </>
            )}
          </Section>

          {/* Notifications */}
          <Section title="Notifications" delay={0.13}>
            <Row icon={Zap}      label="Speed Alerts"     toggle={{ on: notifs.speed,    onToggle: () => toggle('speed')    }} />
            <Row icon={MapPin}   label="Geofence Alerts"  toggle={{ on: notifs.geofence, onToggle: () => toggle('geofence') }} />
            <Row icon={Route}    label="Trip Start / End" toggle={{ on: notifs.trips,    onToggle: () => toggle('trips')    }} />
            <Row icon={Activity} label="Vehicle Health"   toggle={{ on: notifs.health,   onToggle: () => toggle('health')   }} last />
          </Section>

          {/* Account & Security */}
          <Section title="Account & Security" delay={0.16}>
            <Row icon={KeyRound}    label="Change Password"         onPress={() => setActiveView('change-password')} />
            <Row icon={Fingerprint} label="Face ID / Biometrics"    toggle={{ on: faceId, onToggle: () => setFaceId(f => !f) }} />
            <Row icon={ShieldCheck} label="Two-Factor Auth"
              sublabel={twoFactor.enabled ? (twoFactor.method === 'sms' ? 'SMS' : 'Authenticator App') : 'Off'}
              onPress={() => setActiveView('two-factor')}
            />
            <Row icon={Monitor}     label="Active Sessions"         sublabel="3 devices"  onPress={() => setActiveView('active-sessions')} />
            <Row icon={Shield}      label="Privacy & Data"          onPress={() => setActiveView('privacy-data')} />
            <Row icon={Trash2}      label="Delete Account"          danger onPress={() => setActiveView('delete-account')} last />
          </Section>

          {/* More */}
          <Section title="More" delay={0.19}>
            <Row icon={LifeBuoy}  label="Help & Support"  onPress={() => setActiveView('help-support')} />
            <Row icon={Sparkles}  label="What's New"      sublabel="Version 1.0.0" onPress={() => setActiveView('whats-new')} />
            <Row icon={FileText}  label="Terms & Privacy" onPress={() => setActiveView('terms-privacy')} />

            {/* Rate the App — inline stars */}
            <div style={{ padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Star size={15} color="#C8FF00" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontSize: 14.5, fontWeight: 500, fontFamily: 'Inter, sans-serif', margin: 0 }}>Rate the App</p>
                  {rated && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: '2px 0 0' }}>Thanks for your feedback!</p>}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5].map(s => (
                    <motion.button key={s} whileTap={{ scale: 0.8 }} onClick={() => handleRate(s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                    >
                      <Star size={18}
                        color={s <= rating ? '#C8FF00' : 'rgba(255,255,255,0.2)'}
                        fill={s <= rating ? '#C8FF00' : 'none'}
                        style={{ transition: 'color 0.15s, fill 0.15s' }}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Share Tracklynk — inline copy link */}
            <div style={{ padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Share2 size={15} color="#C8FF00" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontSize: 14.5, fontWeight: 500, fontFamily: 'Inter, sans-serif', margin: 0 }}>Share Tracklynk</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: '2px 0 0' }}>Invite friends & family</p>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={handleCopyLink}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 9,
                    background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(200,255,0,0.10)',
                    border: `1px solid ${copied ? 'rgba(74,222,128,0.28)' : 'rgba(200,255,0,0.25)'}`,
                    color: copied ? '#4ade80' : '#C8FF00',
                    fontSize: 12.5, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
                  }}
                >
                  {copied ? <><Check size={13} /> Copied</> : <><Link size={13} /> Copy Link</>}
                </motion.button>
              </div>
            </div>

            <Row label="Version" value="1.0.0 (build 42)" last />
          </Section>

        </div>
      </div>

      {/* ── Sub-screen layer ── */}
      <AnimatePresence>
        {activeView === 'profile' && (
          <motion.div key="profile" initial={slideIn} animate={center} exit={slideOut} transition={slideTransition}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <ProfileEditView profile={profile} onSave={setProfile} onBack={() => setActiveView(null)} />
          </motion.div>
        )}

        {activeView === 'vehicle-detail' && selectedVehicle && (
          <motion.div key="vehicle-detail" initial={slideIn} animate={center} exit={slideOut} transition={slideTransition}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <VehicleDetailView
              vehicle={selectedVehicle}
              onSave={handleSaveVehicle}
              onRemove={handleRemoveVehicle}
              onBack={() => setActiveView(null)}
            />
          </motion.div>
        )}

        {activeView === 'add-vehicle' && (
          <motion.div key="add-vehicle" initial={slideIn} animate={center} exit={slideOut} transition={slideTransition}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <AddVehicleView onAdd={handleAddVehicle} onBack={() => setActiveView(null)} />
          </motion.div>
        )}

        {activeView === 'subscription' && (
          <motion.div key="subscription" initial={slideIn} animate={center} exit={slideOut} transition={slideTransition}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <SubscriptionView
              subscription={subscription}
              onUpdate={setSubscription}
              onBack={() => setActiveView(null)}
              initialView={subInitialView}
            />
          </motion.div>
        )}

        {activeView === 'change-password' && (
          <motion.div key="change-password" initial={slideIn} animate={center} exit={slideOut} transition={slideTransition}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <ChangePasswordView onBack={() => setActiveView(null)} />
          </motion.div>
        )}

        {activeView === 'two-factor' && (
          <motion.div key="two-factor" initial={slideIn} animate={center} exit={slideOut} transition={slideTransition}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <TwoFactorView twoFactor={twoFactor} onUpdate={setTwoFactor} onBack={() => setActiveView(null)} />
          </motion.div>
        )}

        {activeView === 'active-sessions' && (
          <motion.div key="active-sessions" initial={slideIn} animate={center} exit={slideOut} transition={slideTransition}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <ActiveSessionsView onBack={() => setActiveView(null)} />
          </motion.div>
        )}

        {activeView === 'privacy-data' && (
          <motion.div key="privacy-data" initial={slideIn} animate={center} exit={slideOut} transition={slideTransition}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <PrivacyDataView privacy={privacy} onUpdate={setPrivacy} onBack={() => setActiveView(null)} />
          </motion.div>
        )}

        {activeView === 'delete-account' && (
          <motion.div key="delete-account" initial={slideIn} animate={center} exit={slideOut} transition={slideTransition}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <DeleteAccountView profile={profile} onBack={() => setActiveView(null)} />
          </motion.div>
        )}

        {activeView === 'help-support' && (
          <motion.div key="help-support" initial={slideIn} animate={center} exit={slideOut} transition={slideTransition}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <HelpSupportView onBack={() => setActiveView(null)} />
          </motion.div>
        )}

        {activeView === 'whats-new' && (
          <motion.div key="whats-new" initial={slideIn} animate={center} exit={slideOut} transition={slideTransition}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <WhatsNewView onBack={() => setActiveView(null)} />
          </motion.div>
        )}

        {activeView === 'terms-privacy' && (
          <motion.div key="terms-privacy" initial={slideIn} animate={center} exit={slideOut} transition={slideTransition}
            style={{ position: 'absolute', inset: 0, zIndex: 100 }}
          >
            <TermsPrivacyView onBack={() => setActiveView(null)} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
