import React, { useState, useContext } from 'react'
import { useUserContext } from '../../context/UserContext'
import { motion, AnimatePresence } from 'framer-motion'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { GlassCard } from '../../components/GlassCard'
import { glassCard } from '../../styles/glass'
import {
  ChevronRight, Car, CreditCard, Zap, MapPin, Route,
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

import { styled } from '@mui/material/styles'

/* ─────────────────────────────────────────
   Styled components
───────────────────────────────────────── */

/** Full-screen absolute root used by every sub-screen */
const ScreenRoot = styled(Box)({
  position: 'absolute', inset: 0,
  display: 'flex', flexDirection: 'column',
  background: '#04050d', paddingTop: '16px',
})

/** Toggle track (the pill button background) */
const ToggleTrack = styled('button', {
  shouldForwardProp: p => p !== 'on',
})<{ on: boolean }>(({ on }) => ({
  width: 44, height: 26, borderRadius: 13,
  background: on ? '#C8FF00' : 'rgba(255,255,255,0.12)',
  border: 'none', cursor: 'pointer', position: 'relative',
  transition: 'background 0.2s', flexShrink: 0,
}))

/** Toggle knob (the sliding circle) */
const ToggleKnob = styled('div', {
  shouldForwardProp: p => p !== 'on',
})<{ on: boolean }>(({ on }) => ({
  position: 'absolute', top: 3, width: 20, height: 20,
  borderRadius: 10, background: on ? '#000' : 'rgba(255,255,255,0.55)',
}))

/** Row container */
const RowShell = styled('div', {
  shouldForwardProp: p => p !== 'interactive' && p !== 'last',
})<{ interactive?: boolean; last?: boolean }>(
  ({ interactive, last }) => ({
    display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px',
    cursor: interactive ? 'pointer' : 'default',
    borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.06)',
  })
)

/** Row icon box */
const RowIconBox = styled(Box, {
  shouldForwardProp: p => p !== 'danger' && p !== 'iconBg',
})<{ danger?: boolean; iconBg?: string }>(({ danger, iconBg }) => ({
  width: 34, height: 34, borderRadius: '10px', flexShrink: 0,
  background: danger ? 'rgba(232,101,106,0.15)' : (iconBg || 'rgba(200,255,0,0.10)'),
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}))

/** Row text content wrapper */
const RowContent = styled(Box)({ flex: 1, minWidth: 0 })

/** Row primary label */
const RowLabel = styled(Typography, {
  shouldForwardProp: p => p !== 'danger',
})<{ danger?: boolean }>(({ danger }) => ({
  color: danger ? '#E8656A' : '#fff',
  fontSize: 14.5, fontWeight: 500, letterSpacing: '-0.1px', margin: 0,
}))

/** Row secondary sublabel */
const RowSublabel = styled(Typography)({
  color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: '2px',
})

/** Row trailing value */
const RowValue = styled(Typography)({
  color: 'rgba(255,255,255,0.38)', fontSize: 13, flexShrink: 0,
}) as typeof Typography

/** Section title typography */
const SectionTitle = styled(Typography)({
  color: 'rgba(255,255,255,0.32)', fontSize: 11, fontWeight: 700,
  letterSpacing: '0.6px', textTransform: 'uppercase',
  marginBottom: 8, paddingLeft: '4px',
})

/** SubNav bar container */
const SubNavBar = styled(Box)({
  display: 'flex', alignItems: 'center', gap: '12px',
  padding: '10px 16px 12px', flexShrink: 0,
})

/** SubNav back button */
const SubNavBackBtn = styled(Button)({
  minWidth: 0, width: 36, height: 36, borderRadius: '12px',
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', flexShrink: 0, padding: 0,
})

/** SubNav title */
const SubNavTitle = styled(Typography)({
  flex: 1, color: '#fff', fontSize: 17, fontWeight: 700,
  letterSpacing: '-0.3px', margin: 0,
})

/** EditField wrapper box */
const FieldBox = styled(Box)({ marginBottom: '14px' })

/** EditField label */
const FieldLabel = styled(Typography)({
  color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700,
  letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 7px',
})

const MotionButton = motion(Button)

/* ─────────────────────────────────────────
   Shared primitives
───────────────────────────────────────── */
interface ToggleProps {
  on: boolean
  onToggle: () => void
}

function Toggle({ on, onToggle }: ToggleProps) {
  return (
    <ToggleTrack
      on={on}
      onClick={e => { e.stopPropagation(); onToggle() }}
    >
      <motion.div
        animate={{ x: on ? 21 : 3 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      >
        <ToggleKnob on={on} />
      </motion.div>
    </ToggleTrack>
  )
}

interface RowProps {
  icon?: React.ElementType
  iconBg?: string
  label: string
  sublabel?: string
  value?: string
  onPress?: () => void
  toggle?: { on: boolean; onToggle: () => void }
  danger?: boolean
  last?: boolean
}

function Row({ icon: Icon, iconBg, label, sublabel, value, onPress, toggle, danger, last }: RowProps) {
  const interactive = !!onPress || !!toggle
  return (
    <motion.div
      whileTap={interactive ? { scale: 0.985 } : {}}
      onClick={toggle ? toggle.onToggle : onPress}
    >
      <RowShell interactive={interactive} last={last}>
        {Icon && (
          <RowIconBox danger={danger} iconBg={iconBg}>
            <Icon size={15} color={danger ? '#E8656A' : '#C8FF00'} />
          </RowIconBox>
        )}
        <RowContent>
          <RowLabel danger={danger}>{label}</RowLabel>
          {sublabel && <RowSublabel>{sublabel}</RowSublabel>}
        </RowContent>
        {toggle ? (
          <Toggle on={toggle.on} onToggle={toggle.onToggle} />
        ) : value ? (
          <RowValue component="span">{value}</RowValue>
        ) : onPress ? (
          <ChevronRight size={15} color="rgba(255,255,255,0.22)" style={{ flexShrink: 0 }} />
        ) : null}
      </RowShell>
    </motion.div>
  )
}

interface SectionProps {
  title?: string
  delay?: number
  children: React.ReactNode
}

function Section({ title, delay = 0, children }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 320, damping: 28 }}
      style={{ marginBottom: 22 }}
    >
      {title && <SectionTitle>{title}</SectionTitle>}
      <GlassCard sx={{ borderRadius: '18px', overflow: 'hidden' }}>
        {children}
      </GlassCard>
    </motion.div>
  )
}

interface SubNavProps {
  title: string
  onBack: () => void
  right?: React.ReactNode
}

function SubNav({ title, onBack, right }: SubNavProps) {
  return (
    <SubNavBar>
      <motion.div whileTap={{ scale: 0.88 }}>
        <SubNavBackBtn
          onClick={onBack}
          disableRipple
          disableTouchRipple
        >
          <ArrowLeft size={16} color="rgba(255,255,255,0.8)" />
        </SubNavBackBtn>
      </motion.div>
      <SubNavTitle>{title}</SubNavTitle>
      {right}
    </SubNavBar>
  )
}

interface EditFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  disabled?: boolean
}

function EditField({ label, value, onChange, type = 'text', placeholder, disabled }: EditFieldProps) {
  return (
    <FieldBox>
      <FieldLabel>{label}</FieldLabel>
      <TextField
        type={type} value={value} placeholder={placeholder} disabled={disabled}
        onChange={e => onChange(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            height: 50, borderRadius: '14px',
            background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.09)', borderWidth: '1.5px' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
            '&.Mui-focused fieldset': { borderColor: 'rgba(200,255,0,0.55)', boxShadow: '0 0 0 3px rgba(200,255,0,0.09)' },
            '& input': { color: disabled ? 'rgba(255,255,255,0.3)' : '#fff', fontSize: 15, padding: '0 16px' },
          },
        }}
      />
    </FieldBox>
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

interface PlateFieldProps {
  value: string
  onChange: (v: string) => void
  optional?: boolean
}

function PlateField({ value, onChange, optional }: PlateFieldProps) {
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
    <Box sx={{ mb: '14px' }}>
      {/* Label row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '7px' }}>
        <FieldLabel sx={{ m: 0 }}>License Plate{optional ? ' (optional)' : ''}</FieldLabel>
        {/* Character counter — only show when approaching the limit */}
        <AnimatePresence>
          {value.length > 0 && (
            <motion.span
              key="counter"
              initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }}
              style={{
                fontSize: 11,
                color: remaining <= 2 ? '#E8656A' : 'rgba(255,255,255,0.28)',
                fontWeight: 600,
              }}
            >
              {value.length}/{PLATE_MAX}
            </motion.span>
          )}
        </AnimatePresence>
      </Box>

      {/* Input row */}
      <Box sx={{ position: 'relative' }}>
        <TextField
          value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="e.g. 8ABC123"
          slotProps={{ htmlInput: { autoCapitalize: 'characters' } }}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 50, borderRadius: '14px',
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
              '& fieldset': { borderColor: borderColor, borderWidth: '1.5px', boxShadow },
              '&:hover fieldset': { borderColor: borderColor },
              '&.Mui-focused fieldset': { borderColor: borderColor, boxShadow },
              '& input': { color: '#fff', fontSize: 16, fontWeight: 600, padding: '0 44px 0 16px', letterSpacing: '1.5px' },
            },
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
      </Box>

      {/* Hint */}
      <Typography sx={{ color: 'rgba(255,255,255,0.22)', fontSize: 11.5, mt: '6px' }}>
        Letters & numbers only · auto-uppercased
      </Typography>
    </Box>
  )
}

interface AvatarProps {
  initial: string
  size?: number
}

function Avatar({ initial, size = 72 }: AvatarProps) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Box sx={{
        width: size, height: size, borderRadius: `${size / 2}px`,
        background: 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 3px rgba(200,255,0,0.2)',
      }}>
        <Typography component="span" sx={{ color: '#000', fontSize: size * 0.34, fontWeight: 800, lineHeight: 1 }}>
          {initial}
        </Typography>
      </Box>
      <motion.div whileTap={{ scale: 0.9 }} style={{
        position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: 14,
        background: 'rgba(18,22,32,0.95)', border: '1.5px solid rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <Camera size={13} color="rgba(255,255,255,0.7)" />
      </motion.div>
    </Box>
  )
}

interface SpinnerProps {
  color?: string
  size?: number
}

function Spinner({ color = '#000', size = 18 }: SpinnerProps) {
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

interface PrimaryBtnProps {
  label: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  done?: boolean
  icon?: React.ElementType
}

function PrimaryBtn({ label, onClick, disabled, loading, done, icon: Icon }: PrimaryBtnProps) {
  return (
    <MotionButton
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      onClick={onClick}
      disableRipple disableTouchRipple
      sx={{
        width: '100%', height: 54, borderRadius: '18px',
        background: done
          ? 'linear-gradient(135deg, #4ade80, #22c55e)'
          : !disabled && !loading
            ? 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)'
            : 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: done ? '#fff' : !disabled && !loading ? '#000' : 'rgba(255,255,255,0.25)',
        fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px',
        cursor: !disabled && !loading ? 'pointer' : 'default',
        boxShadow: !disabled && !loading && !done ? '0 8px 28px rgba(200,255,0,0.25), inset 0 1px 0 rgba(255,255,255,0.22)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        transition: 'background 0.25s, color 0.25s, box-shadow 0.25s',
        minWidth: 0, textTransform: 'none',
        '&:hover': { background: done ? 'linear-gradient(135deg, #4ade80, #22c55e)' : !disabled && !loading ? 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)' : 'rgba(255,255,255,0.06)' },
      }}
    >
      {done ? <><Check size={18} /> Saved</> : loading ? <Spinner /> : label}
    </MotionButton>
  )
}

/* ─────────────────────────────────────────
   Signal bars
───────────────────────────────────────── */
interface SignalBarsProps {
  level: number
  max?: number
}

function SignalBars({ level, max = 5 }: SignalBarsProps) {
  return (
    <Box sx={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
      {Array.from({ length: max }).map((_, i) => (
        <Box key={i} sx={{
          width: 4, height: 5 + i * 3, borderRadius: '2px',
          background: i < level ? '#C8FF00' : 'rgba(255,255,255,0.15)',
          transition: 'background 0.3s',
        }} />
      ))}
    </Box>
  )
}

/* ─────────────────────────────────────────
   Profile Edit view
───────────────────────────────────────── */
interface ProfileData {
  first: string
  last: string
  email: string
  phone: string
}

interface ProfileEditViewProps {
  profile: ProfileData
  onSave: (updated: ProfileData) => void
  onBack: () => void
}

function ProfileEditView({ profile, onSave, onBack }: ProfileEditViewProps) {
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
    <ScreenRoot>
      <SubNav title="Edit Profile" onBack={onBack} />
      <Box sx={{ flex: 1, overflowY: 'auto', padding: '8px 20px', paddingBottom: '96px' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}
        >
          <Avatar initial={form.first[0]?.toUpperCase() || 'J'} size={80} />
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, mt: '10px' }}>
            Tap to change photo
          </Typography>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Box sx={{ flex: 1 }}><EditField label="First name" value={form.first} onChange={set('first')} placeholder="Jane" /></Box>
            <Box sx={{ flex: 1 }}><EditField label="Last name"  value={form.last}  onChange={set('last')}  placeholder="Smith" /></Box>
          </Box>
          <EditField label="Email address" value={form.email} onChange={set('email')} type="email" placeholder="jane@email.com" />
          <EditField label="Mobile number" value={form.phone} onChange={set('phone')} type="tel"   placeholder="+1 (555) 000-0000" />
        </motion.div>
      </Box>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        style={{ padding: '12px 20px 36px', flexShrink: 0 }}
      >
        <PrimaryBtn label="Save Changes" onClick={handleSave} disabled={!hasChanges} loading={saving && !done} done={done} />
      </motion.div>
    </ScreenRoot>
  )
}

/* ─────────────────────────────────────────
   Vehicle Detail view
───────────────────────────────────────── */
interface VehicleDevice {
  connected: boolean
  lastSeen: string
  signal: number
}

interface Vehicle {
  id: number
  nickname: string
  plate: string
  year: string
  make: string
  model: string
  trim: string
  device: VehicleDevice
}

interface VehicleDetailViewProps {
  vehicle: Vehicle
  onSave: (updated: Vehicle) => void
  onRemove: (id: number) => void
  onBack: () => void
}

function VehicleDetailView({ vehicle, onSave, onRemove, onBack }: VehicleDetailViewProps) {
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
    <ScreenRoot>
      <SubNav title={vehicle.nickname} onBack={onBack} />

      <Box sx={{ flex: 1, overflowY: 'auto', padding: '4px 16px', paddingBottom: '96px' }}>

        {/* Vehicle hero card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          style={{ ...glassCard, borderRadius: 18, padding: '18px 16px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 14 }}
        >
          <Box sx={{
            width: 52, height: 52, borderRadius: '16px', flexShrink: 0,
            background: 'rgba(200,255,0,0.10)',
            border: '1px solid rgba(200,255,0,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Car size={24} color="#C8FF00" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px', m: '0 0 4px' }}>
              {form.nickname}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.42)', fontSize: 13, m: 0 }}>
              {vehicle.year} {vehicle.make} {vehicle.model} · {vehicle.trim}
            </Typography>
          </Box>
          {form.plate ? (
            <Box sx={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px', padding: '5px 10px', flexShrink: 0,
            }}>
              <Typography sx={{ color: '#fff', fontSize: 12, fontWeight: 600, m: 0, letterSpacing: '0.5px' }}>
                {form.plate}
              </Typography>
            </Box>
          ) : null}
        </motion.div>

        {/* Device status card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
          style={{ marginBottom: 22 }}
        >
          <SectionTitle>OBD-II Device</SectionTitle>
          <GlassCard sx={{ borderRadius: '18px', padding: '16px' }}>
            {/* Status row */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box sx={{ position: 'relative', width: 10, height: 10 }}>
                  <Box sx={{
                    width: 10, height: 10, borderRadius: '5px',
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
                </Box>
                <Typography component="span" sx={{ color: connected ? '#4ade80' : '#E8656A', fontSize: 13, fontWeight: 600 }}>
                  {connected ? 'Connected' : 'Disconnected'}
                </Typography>
              </Box>
              <SignalBars level={connected ? vehicle.device.signal : 0} />
            </Box>

            {/* Device info */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 500, m: '0 0 3px' }}>
                  TrackLynk OBD-II
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, m: 0 }}>
                  Last seen {vehicle.device.lastSeen}
                </Typography>
              </Box>
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
                <Typography component="span" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 500 }}>
                  {repairing ? 'Pairing…' : 'Re-pair'}
                </Typography>
              </motion.button>
            </Box>
          </GlassCard>
        </motion.div>

        {/* Edit details */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}>
          <SectionTitle>Details</SectionTitle>
          <GlassCard sx={{ borderRadius: '18px', padding: '16px' }}>
            <EditField
              label="Nickname"
              value={form.nickname}
              onChange={v => setForm(f => ({ ...f, nickname: v }))}
              placeholder="e.g. My Tesla"
            />
            <PlateField value={form.plate} onChange={v => setForm(f => ({ ...f, plate: v }))} />
          </GlassCard>
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
              <MotionButton
                key="remove-idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRemoveState('confirm')}
                disableRipple disableTouchRipple
                sx={{
                  width: '100%', height: 50, borderRadius: '16px',
                  background: 'rgba(232,101,106,0.1)', border: '1px solid rgba(232,101,106,0.22)',
                  color: '#E8656A', fontSize: 15, fontWeight: 600,
                  cursor: 'pointer', textTransform: 'none', minWidth: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  '&:hover': { background: 'rgba(232,101,106,0.15)' },
                }}
              >
                <Trash2 size={15} /> Remove Vehicle
              </MotionButton>
            ) : (
              <motion.div
                key="remove-confirm"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              >
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', mb: '10px' }}>
                  Remove {vehicle.nickname}? This can't be undone.
                </Typography>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  <MotionButton
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setRemoveState('idle')}
                    disableRipple disableTouchRipple
                    sx={{
                      flex: 1, height: 50, borderRadius: '16px',
                      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', fontSize: 15, fontWeight: 600,
                      cursor: 'pointer', textTransform: 'none', minWidth: 0,
                      '&:hover': { background: 'rgba(255,255,255,0.10)' },
                    }}
                  >
                    Cancel
                  </MotionButton>
                  <MotionButton
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onRemove(vehicle.id)}
                    disableRipple disableTouchRipple
                    sx={{
                      flex: 1, height: 50, borderRadius: '16px',
                      background: '#E8656A', border: 'none',
                      color: '#fff', fontSize: 15, fontWeight: 700,
                      cursor: 'pointer', textTransform: 'none', minWidth: 0,
                      '&:hover': { background: '#d95a5f' },
                    }}
                  >
                    Yes, Remove
                  </MotionButton>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </Box>
    </ScreenRoot>
  )
}

/* ─────────────────────────────────────────
   Add Vehicle view  (2-step flow)
───────────────────────────────────────── */
const FAKE_VIN      = '1HGBH41JXMN109186'
const DETECTED_CAR  = { year: '2023', make: 'Honda', model: 'Civic', trim: 'Sport' }

interface StepDotsProps {
  current: number
  total: number
}

function StepDots({ current, total }: StepDotsProps) {
  return (
    <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i === current - 1 ? 18 : 6, background: i < current ? '#C8FF00' : 'rgba(255,255,255,0.18)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          style={{ height: 6, borderRadius: 99 }}
        />
      ))}
    </Box>
  )
}

interface AddVehicleViewProps {
  onAdd: (vehicle: Omit<Vehicle, 'id'>) => void
  onBack: () => void
}

function AddVehicleView({ onAdd, onBack }: AddVehicleViewProps) {
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
    <ScreenRoot>
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
              <Typography sx={{ color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', m: '4px 0 6px' }}>
                Enter your VIN
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, m: '0 0 28px' }}>
                Found on your dashboard, door jamb, or registration.
              </Typography>
            </motion.div>

            {/* VIN field + scan button */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <FieldLabel>VIN (17 characters)</FieldLabel>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  value={vin}
                  onChange={e => setVin(e.target.value.toUpperCase().slice(0, 17))}
                  placeholder="e.g. 1HGBH41JXMN109186"
                  slotProps={{ htmlInput: { maxLength: 17 } }}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 50, borderRadius: '14px',
                      background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)',
                      '& fieldset': { borderColor: vin.length === 17 ? 'rgba(200,255,0,0.5)' : 'rgba(255,255,255,0.09)', borderWidth: '1.5px' },
                      '&:hover fieldset': { borderColor: vin.length === 17 ? 'rgba(200,255,0,0.5)' : 'rgba(255,255,255,0.18)' },
                      '&.Mui-focused fieldset': { borderColor: 'rgba(200,255,0,0.55)' },
                      '& input': { color: '#fff', fontSize: 14, padding: '0 52px 0 16px', letterSpacing: '0.5px' },
                    },
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
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, mt: '8px', textAlign: 'center' }}>
                Or tap <Typography component="span" sx={{ color: '#C8FF00' }}>scan</Typography> to read the barcode
              </Typography>
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
                  <Typography sx={{ color: '#4ade80', fontSize: 13, fontWeight: 600, m: 0 }}>
                    Found: {detected.year} {detected.make} {detected.model} · {detected.trim}
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>

            <Box sx={{ flex: 1 }} />

            <MotionButton
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              whileTap={vin.length > 0 && !verifying ? { scale: 0.97 } : {}}
              onClick={handleContinue}
              disableRipple disableTouchRipple
              sx={{
                width: '100%', height: 54, borderRadius: '18px',
                background: vin.length > 0 && !verifying
                  ? 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)'
                  : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: vin.length > 0 && !verifying ? '#000' : 'rgba(255,255,255,0.25)',
                fontSize: 16, fontWeight: 700, textTransform: 'none', minWidth: 0,
                cursor: vin.length > 0 && !verifying ? 'pointer' : 'default',
                boxShadow: vin.length > 0 && !verifying ? '0 8px 28px rgba(200,255,0,0.25)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s',
                '&:hover': { background: vin.length > 0 && !verifying ? 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)' : 'rgba(255,255,255,0.06)' },
              }}
            >
              {verifying ? <><Spinner />&nbsp;Verifying VIN…</> : 'Continue'}
            </MotionButton>
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
              <Typography sx={{ color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', m: '4px 0 6px' }}>
                Name your vehicle
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, m: '0 0 20px' }}>
                Give it a nickname you'll recognize.
              </Typography>
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
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#C8FF00', fontSize: 13, fontWeight: 600, m: 0 }}>
                  {detected?.year} {detected?.make} {detected?.model}
                </Typography>
                <Typography sx={{ color: 'rgba(200,255,0,0.6)', fontSize: 11, m: '2px 0 0' }}>
                  {detected?.trim} · VIN confirmed
                </Typography>
              </Box>
              <Check size={14} color="rgba(200,255,0,0.7)" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}>
              <EditField label="Nickname" value={nickname} onChange={setNickname} placeholder={`My ${detected?.make} ${detected?.model}`} />
              <PlateField value={plate} onChange={setPlate} optional />
            </motion.div>

            <Box sx={{ flex: 1 }} />

            <MotionButton
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
              whileTap={!adding ? { scale: 0.97 } : {}}
              onClick={handleAdd}
              disableRipple disableTouchRipple
              sx={{
                width: '100%', height: 54, borderRadius: '18px',
                background: addDone
                  ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                  : 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: addDone ? '#fff' : '#000',
                fontSize: 16, fontWeight: 700, textTransform: 'none', minWidth: 0,
                cursor: adding ? 'default' : 'pointer',
                boxShadow: addDone ? 'none' : '0 8px 28px rgba(200,255,0,0.25), inset 0 1px 0 rgba(255,255,255,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'background 0.25s',
                '&:hover': { background: addDone ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)' },
              }}
            >
              {addDone ? <><Check size={18} /> Vehicle Added</> : adding ? <Spinner /> : 'Add Vehicle'}
            </MotionButton>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenRoot>
  )
}

/* ─────────────────────────────────────────
   Subscription — data & slide variants
───────────────────────────────────────── */
const PLAN_DATA = {
  annual:  { id: 'annual',  label: 'Annual',  monthly: '7.99',  yearly: '$95.88', billedLabel: 'Billed $95.88/year', savings: 'Save $21/year',   commitment: 'Billed once a year'   },
  monthly: { id: 'monthly', label: 'Monthly', monthly: '9.65',  yearly: null,     billedLabel: 'Billed monthly',     savings: 'No commitment',    commitment: 'Billed every month'   },
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
interface PaymentInfo {
  type: string
  last4: string
}

interface SubscriptionData {
  plan: 'annual' | 'monthly'
  status: string
  nextDate: string
  nextAmount: string
  payment: PaymentInfo
}

interface SubscriptionMainProps {
  subscription: SubscriptionData
  onSwitch: () => void
  onCancel: () => void
  onPayment: () => void
  onBack: () => void
}

function SubscriptionMain({ subscription, onSwitch, onCancel, onPayment, onBack }: SubscriptionMainProps) {
  const plan      = PLAN_DATA[subscription.plan]
  const active    = subscription.status === 'active'
  const paused    = subscription.status === 'paused'
  const cancelled = subscription.status === 'cancelled'

  const statusColor = active ? '#4ade80' : paused ? '#facc15' : 'rgba(255,255,255,0.35)'
  const statusLabel = active ? 'Active' : paused ? 'Paused' : 'Cancelled'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: '16px' }}>
      <SubNav title="Subscription" onBack={onBack} />
      <Box sx={{ flex: 1, overflowY: 'auto', padding: '4px 16px', paddingBottom: '96px' }}>

        {/* ── Plan hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          style={{
            background: cancelled ? 'rgba(232,101,106,0.07)' : 'linear-gradient(145deg, rgba(200,255,0,0.08) 0%, rgba(255,255,255,0.04) 100%)',
            border: `1px solid ${cancelled ? 'rgba(232,101,106,0.2)' : 'rgba(200,255,0,0.18)'}`,
            borderRadius: 20, padding: '20px 18px', marginBottom: 14,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: '16px' }}>
            {/* Plan badge */}
            <Box sx={{
              background: cancelled ? 'rgba(232,101,106,0.15)' : 'rgba(200,255,0,0.15)',
              border: `1px solid ${cancelled ? 'rgba(232,101,106,0.3)' : 'rgba(200,255,0,0.3)'}`,
              borderRadius: '8px', padding: '4px 10px',
            }}>
              <Typography component="span" sx={{
                color: cancelled ? '#E8656A' : '#C8FF00', fontSize: 11, fontWeight: 800,
                letterSpacing: '0.8px', textTransform: 'uppercase',
              }}>
                {plan.label}
              </Typography>
            </Box>
            {/* Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '4px', background: statusColor }} />
              <Typography component="span" sx={{ color: statusColor, fontSize: 12, fontWeight: 600 }}>
                {statusLabel}
              </Typography>
            </Box>
          </Box>

          {/* Price */}
          {!cancelled && (
            <Box sx={{ mb: '6px' }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <Typography component="span" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 22, fontWeight: 400 }}>$</Typography>
                <Typography component="span" sx={{ color: '#fff', fontSize: 42, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1 }}>
                  {plan.monthly}
                </Typography>
                <Typography component="span" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, ml: '2px' }}>/mo</Typography>
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, m: '6px 0 0' }}>
                {plan.billedLabel} · <Typography component="span" sx={{ color: '#C8FF00' }}>{plan.savings}</Typography>
              </Typography>
            </Box>
          )}
          {cancelled && (
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, m: '4px 0 0' }}>
              Access ends {subscription.nextDate}
            </Typography>
          )}
        </motion.div>

        {/* ── Billing card ── */}
        {!cancelled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
            style={{ ...glassCard, borderRadius: 18, overflow: 'hidden', marginBottom: 14 }}
          >
            {/* Next charge */}
            <Box sx={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(200,255,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={15} color="#C8FF00" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', m: '0 0 3px' }}>
                  {paused ? 'Resumes' : 'Next charge'}
                </Typography>
                <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 600, m: 0 }}>
                  {paused ? subscription.nextDate : `${subscription.nextAmount} · ${subscription.nextDate}`}
                </Typography>
              </Box>
            </Box>
            {/* Payment method — tappable */}
            <motion.div
              whileTap={{ scale: 0.985 }} onClick={onPayment}
              style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            >
              <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(200,255,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CreditCard size={15} color="#C8FF00" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', m: '0 0 3px' }}>
                  Payment method
                </Typography>
                <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 600, m: 0 }}>
                  {subscription.payment.type === 'visa' ? 'Visa' : subscription.payment.type === 'mastercard' ? 'Mastercard' : subscription.payment.type === 'amex' ? 'Amex' : 'Card'}
                  &nbsp;···· {subscription.payment.last4}
                </Typography>
              </Box>
              <ChevronRight size={15} color="rgba(255,255,255,0.22)" />
            </motion.div>
          </motion.div>
        )}

        {/* ── What's included ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }} style={{ marginBottom: 14 }}>
          <SectionTitle>{cancelled ? 'What you had' : "What's included"}</SectionTitle>
          <GlassCard sx={{ borderRadius: '18px', overflow: 'hidden' }}>
            {FEATURES.map(({ Icon, text }, i) => (
              <Box key={text} sx={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                opacity: cancelled ? 0.35 : 1,
              }}>
                <Icon size={14} color={cancelled ? 'rgba(255,255,255,0.4)' : '#C8FF00'} style={{ flexShrink: 0 }} />
                <Typography sx={{ color: cancelled ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.78)', fontSize: 13.5, m: 0, textDecoration: cancelled ? 'line-through' : 'none' }}>
                  {text}
                </Typography>
              </Box>
            ))}
          </GlassCard>
        </motion.div>

        {/* ── Actions ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cancelled ? (
            <MotionButton
              whileTap={{ scale: 0.97 }}
              disableRipple disableTouchRipple
              sx={{
                width: '100%', height: 54, borderRadius: '18px',
                background: 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
                border: 'none', color: '#000', fontSize: 16, fontWeight: 700,
                textTransform: 'none', minWidth: 0, cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(200,255,0,0.25)',
                '&:hover': { background: 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)' },
              }}
            >
              Resubscribe
            </MotionButton>
          ) : (
            <>
              <MotionButton
                whileTap={{ scale: 0.97 }} onClick={onSwitch}
                disableRipple disableTouchRipple
                sx={{
                  width: '100%', height: 50, borderRadius: '16px',
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff', fontSize: 15, fontWeight: 600,
                  textTransform: 'none', minWidth: 0, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  '&:hover': { background: 'rgba(255,255,255,0.10)' },
                }}
              >
                <ArrowLeftRight size={15} />
                Switch to {subscription.plan === 'annual' ? 'Monthly' : 'Annual'}
              </MotionButton>

              {!paused && (
                <MotionButton
                  whileTap={{ scale: 0.97 }} onClick={onCancel}
                  disableRipple disableTouchRipple
                  sx={{
                    width: '100%', height: 44, borderRadius: '14px',
                    background: 'none', border: 'none',
                    color: '#E8656A', fontSize: 14, fontWeight: 500,
                    textTransform: 'none', minWidth: 0, cursor: 'pointer',
                    '&:hover': { background: 'rgba(232,101,106,0.06)' },
                  }}
                >
                  Cancel subscription
                </MotionButton>
              )}
            </>
          )}
        </motion.div>
      </Box>
    </Box>
  )
}

/* ─────────────────────────────────────────
   Subscription — Switch plan
───────────────────────────────────────── */
interface SwitchPlanViewProps {
  subscription: SubscriptionData
  onConfirm: (plan: string) => void
  onBack: () => void
}

function SwitchPlanView({ subscription, onConfirm, onBack }: SwitchPlanViewProps) {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: '16px' }}>
      <SubNav title="Switch Plan" onBack={onBack} />
      <Box sx={{ flex: 1, overflowY: 'auto', padding: '4px 16px', paddingBottom: '96px' }}>

        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.42)', fontSize: 14, m: '0 0 20px' }}>
            Choose a plan. You can switch again any time.
          </Typography>
        </motion.div>

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
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: '10px' }}>
                <Typography sx={{ color: '#fff', fontSize: 16, fontWeight: 700, m: 0 }}>
                  {plan.label}
                </Typography>
                {/* Badge stays tied to account fact (current plan), not selection state */}
                {isCurrent ? (
                  <Typography component="span" sx={{
                    background: isActive ? 'rgba(200,255,0,0.15)' : 'rgba(255,255,255,0.07)',
                    border: `1px solid ${isActive ? 'rgba(200,255,0,0.3)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '6px', padding: '3px 8px',
                    color: isActive ? '#C8FF00' : 'rgba(255,255,255,0.4)',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.3px',
                    transition: 'all 0.22s',
                  }}>
                    Current
                  </Typography>
                ) : isActive ? (
                  <motion.div
                    initial={{ scale: 0.7 }} animate={{ scale: 1 }}
                    style={{ width: 22, height: 22, borderRadius: 11, background: '#C8FF00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Check size={13} color="#000" />
                  </motion.div>
                ) : (
                  <Box sx={{ width: 22, height: 22, borderRadius: '11px', border: '1.5px solid rgba(255,255,255,0.2)' }} />
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '1px', mb: '4px' }}>
                <Typography component="span" sx={{ color: isActive ? '#C8FF00' : 'rgba(255,255,255,0.45)', fontSize: 28, fontWeight: 800, letterSpacing: '-1px', transition: 'color 0.22s' }}>
                  ${plan.monthly}
                </Typography>
                <Typography component="span" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, ml: '2px' }}>/mo</Typography>
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, m: 0 }}>
                {plan.billedLabel} · <Typography component="span" sx={{ color: isActive ? 'rgba(200,255,0,0.8)' : 'rgba(255,255,255,0.28)', transition: 'color 0.22s' }}>{plan.savings}</Typography>
              </Typography>
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
              <Box sx={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '14px', padding: '12px 14px',
                display: 'flex', alignItems: 'flex-start', gap: '10px',
              }}>
                <BadgeCheck size={15} color="rgba(200,255,0,0.7)" style={{ flexShrink: 0, marginTop: 1 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5, m: 0, lineHeight: 1.5 }}>
                  {prorationNote}
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <MotionButton
          whileTap={selected && !confirming ? { scale: 0.97 } : {}}
          onClick={handleConfirm}
          disableRipple disableTouchRipple
          sx={{
            width: '100%', height: 54, borderRadius: '18px',
            background: done
              ? 'linear-gradient(135deg, #4ade80, #22c55e)'
              : selected && !confirming
                ? 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)'
                : 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: done ? '#fff' : selected && !confirming ? '#000' : 'rgba(255,255,255,0.25)',
            fontSize: 16, fontWeight: 700, textTransform: 'none', minWidth: 0,
            cursor: selected && !confirming ? 'pointer' : 'default',
            boxShadow: selected && !confirming && !done ? '0 8px 28px rgba(200,255,0,0.25)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s',
            '&:hover': { background: done ? 'linear-gradient(135deg, #4ade80, #22c55e)' : selected && !confirming ? 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)' : 'rgba(255,255,255,0.06)' },
          }}
        >
          {done ? <><Check size={18} /> Plan updated</> : confirming ? <Spinner /> : 'Confirm Switch'}
        </MotionButton>
      </Box>
    </Box>
  )
}

/* ─────────────────────────────────────────
   Subscription — Cancel flow  (3 steps)
───────────────────────────────────────── */
interface CancelFlowViewProps {
  subscription: SubscriptionData
  onPause: () => void
  onCancel: () => void
  onKeep: () => void
  onBack: () => void
}

function CancelFlowView({ subscription, onPause, onCancel, onKeep, onBack }: CancelFlowViewProps) {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: '16px' }}>
      <SubNav
        title={step === 1 ? 'Before you go…' : step === 2 ? "What you'll lose" : 'Cancel subscription'}
        onBack={step === 1 ? onBack : () => setStep(s => s - 1)}
        right={
          <Box sx={{ display: 'flex', gap: '5px' }}>
            {[1,2,3].map(n => (
              <motion.div key={n} animate={{ background: n <= step ? '#C8FF00' : 'rgba(255,255,255,0.18)', width: n === step ? 18 : 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                style={{ height: 6, borderRadius: 99 }}
              />
            ))}
          </Box>
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
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', pb: '20px' }}>
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
                <Typography sx={{ color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', m: '0 0 10px' }}>
                  Need a break?
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, m: 0, lineHeight: 1.6, maxWidth: 280 }}>
                  Pause for 30 days — your data stays safe and we'll remind you before it automatically resumes.
                </Typography>
              </motion.div>
            </Box>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <MotionButton
                whileTap={{ scale: 0.97 }} onClick={handlePause}
                disableRipple disableTouchRipple
                sx={{
                  width: '100%', height: 54, borderRadius: '18px',
                  background: pausing ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
                  border: 'none', color: pausing ? 'rgba(255,255,255,0.3)' : '#000',
                  fontSize: 16, fontWeight: 700, textTransform: 'none', minWidth: 0, cursor: 'pointer',
                  boxShadow: pausing ? 'none' : '0 8px 28px rgba(200,255,0,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  '&:hover': { background: pausing ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)' },
                }}
              >
                {pausing ? <Spinner /> : <><PauseCircle size={17} /> Pause my subscription</>}
              </MotionButton>
              <MotionButton
                whileTap={{ scale: 0.97 }} onClick={() => setStep(2)}
                disableRipple disableTouchRipple
                sx={{
                  width: '100%', height: 44, borderRadius: '14px',
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.35)', fontSize: 14, textTransform: 'none', minWidth: 0,
                  cursor: 'pointer',
                  '&:hover': { background: 'rgba(255,255,255,0.04)' },
                }}
              >
                No thanks, continue cancelling →
              </MotionButton>
            </motion.div>
          </motion.div>
        )}

        {/* ── Step 2: What you'll lose ── */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 16px', paddingBottom: 40, overflowY: 'auto' }}
          >
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.42)', fontSize: 14, m: '0 0 16px 4px' }}>
                Cancelling means losing access to everything below.
              </Typography>
            </motion.div>

            {/* Loss list */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
              style={{
                background: 'rgba(232,101,106,0.06)', border: '1px solid rgba(232,101,106,0.15)',
                borderRadius: 18, overflow: 'hidden', marginBottom: 14,
              }}
            >
              {FEATURES.map(({ Icon, text }, i) => (
                <Box key={text} sx={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px',
                  borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(232,101,106,0.1)' : 'none',
                }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: '12px', background: 'rgba(232,101,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <X size={12} color="#E8656A" />
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 13.5, m: 0 }}>
                    {text}
                  </Typography>
                </Box>
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
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, m: 0 }}>
                You'll keep access until <Typography component="span" sx={{ color: '#fff', fontWeight: 600 }}>{subscription.nextDate}</Typography>
              </Typography>
            </motion.div>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <MotionButton whileTap={{ scale: 0.97 }} onClick={onKeep}
                disableRipple disableTouchRipple
                sx={{
                  width: '100%', height: 54, borderRadius: '18px',
                  background: 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
                  border: 'none', color: '#000', fontSize: 16, fontWeight: 700,
                  textTransform: 'none', minWidth: 0, cursor: 'pointer',
                  boxShadow: '0 8px 28px rgba(200,255,0,0.25)',
                  '&:hover': { background: 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)' },
                }}
              >
                Keep my plan
              </MotionButton>
              <MotionButton whileTap={{ scale: 0.97 }} onClick={() => setStep(3)}
                disableRipple disableTouchRipple
                sx={{
                  width: '100%', height: 44, borderRadius: '14px',
                  background: 'none', border: 'none',
                  color: '#E8656A', fontSize: 14, textTransform: 'none', minWidth: 0, cursor: 'pointer',
                  '&:hover': { background: 'rgba(232,101,106,0.06)' },
                }}
              >
                Still want to cancel →
              </MotionButton>
            </Box>
          </motion.div>
        )}

        {/* ── Step 3: Final confirm ── */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 20px', paddingBottom: 40 }}
          >
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px', pb: '24px' }}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Typography sx={{ color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', m: '0 0 12px' }}>
                  One last thing
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, m: '0 0 10px', lineHeight: 1.6 }}>
                  Your <strong style={{ color: '#fff' }}>{PLAN_DATA[subscription.plan].label} Plan</strong> stays fully active until{' '}
                  <strong style={{ color: '#fff' }}>{subscription.nextDate}</strong>. After that, all tracking stops.
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, m: 0 }}>
                  No refund is issued for unused time on annual plans.
                </Typography>
              </motion.div>
            </Box>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <MotionButton whileTap={{ scale: 0.97 }} onClick={onKeep}
                disableRipple disableTouchRipple
                sx={{
                  width: '100%', height: 54, borderRadius: '18px',
                  background: 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
                  border: 'none', color: '#000', fontSize: 16, fontWeight: 700,
                  textTransform: 'none', minWidth: 0, cursor: 'pointer',
                  boxShadow: '0 8px 28px rgba(200,255,0,0.25)',
                  '&:hover': { background: 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)' },
                }}
              >
                Keep my plan
              </MotionButton>
              <MotionButton
                whileTap={{ scale: 0.97 }} onClick={handleCancel}
                disableRipple disableTouchRipple
                sx={{
                  width: '100%', height: 50, borderRadius: '16px',
                  background: 'rgba(232,101,106,0.1)', border: '1px solid rgba(232,101,106,0.3)',
                  color: cancelling ? 'rgba(232,101,106,0.4)' : '#E8656A',
                  fontSize: 15, fontWeight: 600, textTransform: 'none', minWidth: 0, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  '&:hover': { background: 'rgba(232,101,106,0.15)' },
                }}
              >
                {cancelling ? <Spinner color="#E8656A" size={16} /> : 'Cancel subscription'}
              </MotionButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
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

interface CardFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  right?: React.ReactNode
  monospace?: boolean
}

function CardField({ label, value, onChange, placeholder, type = 'text', right, monospace }: CardFieldProps) {
  return (
    <Box sx={{ flex: 1 }}>
      <FieldLabel>{label}</FieldLabel>
      <Box sx={{ position: 'relative' }}>
        <TextField
          type={type} value={value} placeholder={placeholder}
          slotProps={{ htmlInput: { inputMode: monospace ? 'numeric' : 'text' } }}
          onChange={e => onChange(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 50, borderRadius: '14px',
              background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.09)', borderWidth: '1.5px' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
              '&.Mui-focused fieldset': { borderColor: 'rgba(200,255,0,0.55)', boxShadow: '0 0 0 3px rgba(200,255,0,0.09)' },
              '& input': {
                color: '#fff', fontSize: 15,
                padding: `0 ${right ? 52 : 16}px 0 16px`,
                fontFamily: monospace ? 'monospace' : 'inherit',
                letterSpacing: monospace ? '2px' : 'normal',
              },
            },
          }}
        />
        {right && (
          <Box sx={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            {right}
          </Box>
        )}
      </Box>
    </Box>
  )
}

interface PaymentMethodViewProps {
  subscription: SubscriptionData
  onSave: (updated: SubscriptionData) => void
  onBack: () => void
}

function PaymentMethodView({ subscription, onSave, onBack }: PaymentMethodViewProps) {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: '16px' }}>
      <SubNav title="Payment Method" onBack={onBack} />
      <Box sx={{ flex: 1, overflowY: 'auto', padding: '4px 16px', paddingBottom: '96px' }}>

        {/* Current card on file */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          style={{ marginBottom: 22 }}
        >
          <SectionTitle>On file</SectionTitle>
          <GlassCard sx={{ borderRadius: '16px', padding: '14px 16px', border: '1px solid rgba(200,255,0,0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Box sx={{ width: 36, height: 24, borderRadius: '5px', background: CARD_TYPE_COLORS[subscription.payment.type] || '#1A72E8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography component="span" sx={{ color: '#fff', fontSize: 8, fontWeight: 800, letterSpacing: '0.3px' }}>
                {CARD_TYPE_LABELS[subscription.payment.type] || 'CARD'}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 600, m: 0 }}>
                ···· ···· ···· {subscription.payment.last4}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '4px', background: '#4ade80' }} />
              <Typography component="span" sx={{ color: '#4ade80', fontSize: 11, fontWeight: 600 }}>In use</Typography>
            </Box>
          </GlassCard>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.07 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}
        >
          <Box sx={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <Typography component="span" sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>or add a new card</Typography>
          <Box sx={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </motion.div>

        {/* Card form */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}>

          {/* Card number */}
          <Box sx={{ mb: '14px' }}>
            <CardField
              label="Card number"
              value={number}
              onChange={handleNumber}
              placeholder="1234 5678 9012 3456"
              monospace
              right={cardTypeLabel && (
                <Typography component="span" sx={{ color: cardTypeColor, fontSize: 11, fontWeight: 800, letterSpacing: '0.5px' }}>
                  {cardTypeLabel}
                </Typography>
              )}
            />
          </Box>

          {/* Expiry + CVV row */}
          <Box sx={{ display: 'flex', gap: '10px', mb: '14px' }}>
            <CardField label="Expiry" value={expiry} onChange={handleExpiry} placeholder="MM/YY" monospace />
            <CardField
              label={`CVV${maxCvv === 4 ? ' (4 digits)' : ''}`}
              value={cvv}
              onChange={handleCvv}
              placeholder={'•'.repeat(maxCvv)}
              type="password"
              monospace
            />
          </Box>

          {/* Name on card */}
          <Box sx={{ mb: '4px' }}>
            <CardField label="Name on card" value={name} onChange={setName} placeholder="Jane Smith" />
          </Box>

          {/* Security note */}
          <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 11.5, m: '8px 0 24px', textAlign: 'center' }}>
            🔒 Secured with 256-bit encryption
          </Typography>

          {/* Save button */}
          <MotionButton
            whileTap={isValid && !saving ? { scale: 0.97 } : {}}
            onClick={handleSave}
            disableRipple disableTouchRipple
            sx={{
              width: '100%', height: 54, borderRadius: '18px',
              background: done
                ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                : isValid && !saving
                  ? 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)'
                  : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: done ? '#fff' : isValid && !saving ? '#000' : 'rgba(255,255,255,0.2)',
              fontSize: 16, fontWeight: 700, textTransform: 'none', minWidth: 0,
              cursor: isValid && !saving ? 'pointer' : 'default',
              boxShadow: isValid && !saving && !done ? '0 8px 28px rgba(200,255,0,0.25)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.22s',
              '&:hover': { background: done ? 'linear-gradient(135deg, #4ade80, #22c55e)' : isValid && !saving ? 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)' : 'rgba(255,255,255,0.06)' },
            }}
          >
            {done ? <><Check size={18} /> Card saved</> : saving ? <Spinner /> : 'Save & use this card'}
          </MotionButton>
        </motion.div>
      </Box>
    </Box>
  )
}

/* ─────────────────────────────────────────
   Subscription — container (manages inner nav)
───────────────────────────────────────── */
interface SubscriptionViewProps {
  subscription: SubscriptionData
  onUpdate: (updated: SubscriptionData) => void
  onBack: () => void
  initialView?: string
}

function SubscriptionView({ subscription, onUpdate, onBack, initialView = 'main' }: SubscriptionViewProps) {
  const [view, setView] = useState(initialView)
  const [dir,  setDir]  = useState(1)

  const go   = v => { setDir(1);  setView(v) }
  const back = () => { setDir(-1); setView('main') }

  return (
    <Box sx={{ position: 'absolute', inset: 0, background: '#04050d', overflow: 'hidden' }}>
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
              onBack={onBack}
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
            <SwitchPlanView subscription={subscription} onConfirm={plan => { onUpdate({ ...subscription, plan: plan as 'annual' | 'monthly' }); back() }} onBack={back} />
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
    </Box>
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

interface PasswordStrengthBarProps {
  password: string
}

function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const { score, label, color } = getPasswordStrength(password)
  if (!password) return null
  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: -6, marginBottom: 14 }}>
      <Box sx={{ display: 'flex', gap: '4px', mb: '5px' }}>
        {[1,2,3,4,5].map(i => (
          <Box key={i} sx={{
            flex: 1, height: 3, borderRadius: '2px',
            background: i <= score ? color : 'rgba(255,255,255,0.1)',
            transition: 'background 0.3s',
          }} />
        ))}
      </Box>
      <Typography sx={{ color, fontSize: 11, fontWeight: 600, m: 0 }}>{label}</Typography>
    </motion.div>
  )
}

interface PasswordFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

function PasswordField({ label, value, onChange, placeholder }: PasswordFieldProps) {
  const [show, setShow] = useState(false)
  return (
    <FieldBox>
      <FieldLabel>{label}</FieldLabel>
      <TextField
        type={show ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        fullWidth
        variant="outlined"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow(s => !s)} edge="end" sx={{ color: 'rgba(255,255,255,0.35)', p: '6px' }}>
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: 50, borderRadius: '14px',
            background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.09)', borderWidth: '1.5px' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
            '&.Mui-focused fieldset': { borderColor: 'rgba(200,255,0,0.55)', boxShadow: '0 0 0 3px rgba(200,255,0,0.09)' },
            '& input': { color: '#fff', fontSize: 15, padding: '0 0 0 16px' },
          },
        }}
      />
    </FieldBox>
  )
}

/* ─────────────────────────────────────────
   Change Password view
───────────────────────────────────────── */
interface ChangePasswordViewProps {
  onBack: () => void
}

function ChangePasswordView({ onBack }: ChangePasswordViewProps) {
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
    <ScreenRoot>
      <SubNav title="Change Password" onBack={onBack} />
      <Box sx={{ flex: 1, overflowY: 'auto', padding: '12px 20px', paddingBottom: '96px' }}>

        {/* Icon hero */}
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.04, type: 'spring', stiffness: 280, damping: 26 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, marginTop: 8 }}
        >
          <Box sx={{
            width: 64, height: 64, borderRadius: '20px',
            background: 'rgba(200,255,0,0.10)', border: '1px solid rgba(200,255,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mb: '12px',
          }}>
            <KeyRound size={28} color="#C8FF00" />
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, textAlign: 'center', maxWidth: 240, lineHeight: 1.5, m: 0 }}>
            Choose a strong password with at least 8 characters, including numbers and symbols.
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <PasswordField label="Current Password" value={current} onChange={setCurrent} placeholder="Enter current password" />
          <PasswordField label="New Password"     value={next}    onChange={setNext}    placeholder="At least 8 characters" />
          <PasswordStrengthBar password={next} />
          <PasswordField label="Confirm New Password" value={confirm} onChange={setConfirm} placeholder="Repeat new password" />
          {mismatch && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography sx={{ color: '#E8656A', fontSize: 12, mt: '-8px', mb: '12px' }}>
                Passwords don't match
              </Typography>
            </motion.div>
          )}
        </motion.div>

        {/* Security tips */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '14px 16px', marginTop: 4,
          }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600, m: '0 0 8px' }}>Tips for a strong password</Typography>
          {['Use 12+ characters', 'Mix uppercase & lowercase', 'Include numbers & symbols', 'Avoid personal information'].map(tip => (
            <Box key={tip} sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '5px' }}>
              <Box sx={{ width: 4, height: 4, borderRadius: '2px', background: '#C8FF00', flexShrink: 0 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, m: 0 }}>{tip}</Typography>
            </Box>
          ))}
        </motion.div>
      </Box>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        style={{ padding: '12px 20px 36px', flexShrink: 0 }}
      >
        <PrimaryBtn label="Save Password" onClick={handleSave} disabled={!canSave} loading={saving && !done} done={done} />
      </motion.div>
    </ScreenRoot>
  )
}

/* ─────────────────────────────────────────
   Two-Factor Authentication view
───────────────────────────────────────── */
const TFA_BACKUP_CODES = ['8A3K-X2MN', '7PLQ-9WRZ', 'C4TY-5BNF', 'M6HJ-1VKS', '3XDE-0QPG', 'R9UW-4CAL']

interface TwoFactorData {
  enabled: boolean
  method: string | null
}

interface TwoFactorViewProps {
  twoFactor: TwoFactorData
  onUpdate: (updated: TwoFactorData) => void
  onBack: () => void
}

function TwoFactorView({ twoFactor, onUpdate, onBack }: TwoFactorViewProps) {
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
    <ScreenRoot>
      <SubNav title={backTitle} onBack={handleBack} />

      <Box sx={{ flex: 1, overflowY: 'auto', padding: '12px 20px', paddingBottom: '96px' }}>
        <AnimatePresence mode="wait">

          {/* ── Main ── */}
          {step === 'main' && (
            <motion.div key="tfa-main" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '32px', mt: '8px' }}>
                <Box sx={{
                  width: 64, height: 64, borderRadius: '20px',
                  background: twoFactor.enabled ? 'rgba(74,222,128,0.12)' : 'rgba(200,255,0,0.10)',
                  border: `1px solid ${twoFactor.enabled ? 'rgba(74,222,128,0.28)' : 'rgba(200,255,0,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mb: '12px',
                }}>
                  <ShieldCheck size={28} color={twoFactor.enabled ? '#4ade80' : '#C8FF00'} />
                </Box>
                <Typography sx={{ color: '#fff', fontSize: 17, fontWeight: 700, m: '0 0 6px', letterSpacing: '-0.2px' }}>
                  {twoFactor.enabled ? '2FA is Active' : 'Add Extra Security'}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', maxWidth: 260, lineHeight: 1.5, m: 0 }}>
                  {twoFactor.enabled
                    ? `Protected via ${twoFactor.method === 'sms' ? 'SMS text message' : 'Authenticator app'}`
                    : 'Protect your account with a second verification step each time you sign in.'}
                </Typography>
              </Box>

              {twoFactor.enabled ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <GlassCard sx={{ borderRadius: '18px', overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '13px', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {twoFactor.method === 'sms' ? <MessageSquare size={15} color="#C8FF00" /> : <QrCode size={15} color="#C8FF00" />}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: '#fff', fontSize: 14.5, fontWeight: 500, m: 0 }}>
                          {twoFactor.method === 'sms' ? 'SMS Text Message' : 'Authenticator App'}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, m: '2px 0 0' }}>Active method</Typography>
                      </Box>
                      <Typography component="span" sx={{ fontSize: 11, fontWeight: 700, color: '#4ade80', background: 'rgba(74,222,128,0.12)', padding: '3px 8px', borderRadius: '6px' }}>ON</Typography>
                    </Box>
                    <motion.div whileTap={{ scale: 0.985 }} onClick={() => setStep('backup')}
                      style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', cursor: 'pointer' }}
                    >
                      <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Copy size={15} color="rgba(255,255,255,0.6)" />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: '#fff', fontSize: 14.5, fontWeight: 500, m: 0 }}>View Backup Codes</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, m: '2px 0 0' }}>6 codes remaining</Typography>
                      </Box>
                      <ChevronRight size={15} color="rgba(255,255,255,0.22)" />
                    </motion.div>
                  </GlassCard>

                  <MotionButton whileTap={{ scale: 0.97 }} onClick={disable2FA}
                    disableRipple disableTouchRipple
                    sx={{
                      width: '100%', height: 50, borderRadius: '16px',
                      background: 'rgba(232,101,106,0.08)', border: '1px solid rgba(232,101,106,0.2)',
                      color: '#E8656A', fontSize: 15, fontWeight: 600, textTransform: 'none', minWidth: 0,
                      cursor: 'pointer',
                      '&:hover': { background: 'rgba(232,101,106,0.12)' },
                    }}
                  >
                    Disable Two-Factor Auth
                  </MotionButton>
                </Box>
              ) : (
                <PrimaryBtn label="Enable Two-Factor Auth" onClick={() => setStep('method')} />
              )}
            </motion.div>
          )}

          {/* ── Method selection ── */}
          {step === 'method' && (
            <motion.div key="tfa-method" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, mb: '20px', lineHeight: 1.55 }}>
                Choose how you'd like to receive your verification codes.
              </Typography>
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
                  <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: method === opt.id ? 'rgba(200,255,0,0.12)' : 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <opt.Icon size={18} color={method === opt.id ? '#C8FF00' : 'rgba(255,255,255,0.5)'} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: 15, fontWeight: 600, m: 0 }}>{opt.label}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, m: '3px 0 0' }}>{opt.sub}</Typography>
                  </Box>
                  <Box sx={{
                    width: 20, height: 20, borderRadius: '10px',
                    border: `2px solid ${method === opt.id ? '#C8FF00' : 'rgba(255,255,255,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: method === opt.id ? '#C8FF00' : 'transparent',
                  }}>
                    {method === opt.id && <Box sx={{ width: 8, height: 8, borderRadius: '4px', background: '#000' }} />}
                  </Box>
                </motion.div>
              ))}
              <Box sx={{ mt: '8px' }}>
                <PrimaryBtn label="Continue" onClick={() => setStep(method === 'sms' ? 'sms-verify' : 'app-setup')} />
              </Box>
            </motion.div>
          )}

          {/* ── SMS verify ── */}
          {step === 'sms-verify' && (
            <motion.div key="tfa-sms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, mb: '24px', lineHeight: 1.55 }}>
                We'll send a 6-digit code to <Typography component="span" sx={{ color: '#fff', fontWeight: 600 }}>+1 (555) 000-0000</Typography>
              </Typography>

              <Box sx={{ mb: '20px' }}>
                <FieldLabel>Verification Code</FieldLabel>
                <TextField
                  value={code} onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))}
                  placeholder="• • • • • •" slotProps={{ htmlInput: { maxLength: 6 } }}
                  fullWidth variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 56, borderRadius: '14px',
                      background: 'rgba(255,255,255,0.07)',
                      '& fieldset': {
                        borderWidth: '1.5px',
                        borderColor: verified ? 'rgba(74,222,128,0.5)' : code.length === 6 ? 'rgba(200,255,0,0.45)' : 'rgba(255,255,255,0.09)',
                      },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
                      '&.Mui-focused fieldset': { borderColor: 'rgba(200,255,0,0.55)' },
                      '& input': {
                        color: verified ? '#4ade80' : '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '8px',
                        textAlign: 'center', padding: '0',
                      },
                    },
                  }}
                />
              </Box>

              {!codeSent ? (
                <MotionButton whileTap={{ scale: 0.97 }} onClick={sendCode}
                  disableRipple disableTouchRipple
                  sx={{ background: 'none', border: 'none', color: '#C8FF00', fontSize: 14, fontWeight: 600, textTransform: 'none', minWidth: 0, cursor: 'pointer', padding: '0 0 20px', '&:hover': { background: 'none' } }}
                >
                  Send Code
                </MotionButton>
              ) : (
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, mb: '20px' }}>Code sent — resend in 30s</Typography>
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
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, mb: '20px', lineHeight: 1.55 }}>
                Scan this QR code with your authenticator app or enter the key manually.
              </Typography>

              {/* Mock QR code */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: '20px' }}>
                <Box sx={{
                  width: 160, height: 160, borderRadius: '16px',
                  background: '#fff', padding: '12px',
                  display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: '2px',
                }}>
                  {Array.from({ length: 64 }).map((_, i) => {
                    const isOn = [0,1,2,3,4,5,6,8,14,16,22,24,30,32,38,48,49,50,51,52,53,54,56,62,63,7,15,23,31,39,47,9,17,25,33,41,11,19,43,21,29,37,45,55,57,58,59,60,61].includes(i)
                    return <Box key={i} sx={{ background: isOn ? '#000' : '#fff', borderRadius: '1px' }} />
                  })}
                </Box>
              </Box>

              <Box sx={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 16px', mb: '20px' }}>
                <FieldLabel sx={{ m: '0 0 6px' }}>Manual Key</FieldLabel>
                <Typography sx={{ color: '#C8FF00', fontSize: 14, fontWeight: 600, letterSpacing: '2px', fontFamily: 'monospace', m: 0 }}>JBSW Y3DP EBZG K3LN</Typography>
              </Box>

              <Box sx={{ mb: '20px' }}>
                <FieldLabel>Enter 6-Digit Code from App</FieldLabel>
                <TextField
                  value={code} onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))}
                  placeholder="• • • • • •" slotProps={{ htmlInput: { maxLength: 6 } }}
                  fullWidth variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 56, borderRadius: '14px',
                      background: 'rgba(255,255,255,0.07)',
                      '& fieldset': { borderWidth: '1.5px', borderColor: 'rgba(255,255,255,0.09)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
                      '&.Mui-focused fieldset': { borderColor: 'rgba(200,255,0,0.55)' },
                      '& input': { color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '8px', textAlign: 'center', padding: '0' },
                    },
                  }}
                />
              </Box>

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
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '24px' }}>
                <Typography sx={{ color: '#fff', fontSize: 17, fontWeight: 700, m: '0 0 8px', letterSpacing: '-0.2px' }}>Save Your Backup Codes</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', maxWidth: 280, lineHeight: 1.5, m: 0 }}>
                  Store these in a safe place. Each code can only be used once if you lose access to your authenticator.
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', mb: '20px' }}>
                {TFA_BACKUP_CODES.map((c, i) => (
                  <motion.div key={c} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    style={{
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 10, padding: '10px 14px', textAlign: 'center',
                    }}
                  >
                    <Typography component="span" sx={{ color: '#C8FF00', fontSize: 13, fontWeight: 600, fontFamily: 'monospace', letterSpacing: '1px' }}>{c}</Typography>
                  </motion.div>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: '10px', mb: '12px' }}>
                <MotionButton whileTap={{ scale: 0.97 }} onClick={copyBackups}
                  disableRipple disableTouchRipple
                  sx={{
                    flex: 1, height: 48, borderRadius: '14px',
                    background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.07)',
                    border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.09)'}`,
                    color: copied ? '#4ade80' : 'rgba(255,255,255,0.7)',
                    fontSize: 14, fontWeight: 600, textTransform: 'none', minWidth: 0,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                    '&:hover': { background: copied ? 'rgba(74,222,128,0.14)' : 'rgba(255,255,255,0.10)' },
                  }}
                >
                  {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy Codes</>}
                </MotionButton>
              </Box>
              <PrimaryBtn label="Done" onClick={onBack} />
            </motion.div>
          )}

        </AnimatePresence>
      </Box>
    </ScreenRoot>
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

interface ActiveSessionsViewProps {
  onBack: () => void
}

function ActiveSessionsView({ onBack }: ActiveSessionsViewProps) {
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
    <ScreenRoot>
      <SubNav title="Active Sessions" onBack={onBack} />
      <Box sx={{ flex: 1, overflowY: 'auto', padding: '12px 16px', paddingBottom: '96px' }}>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, mb: '16px', lineHeight: 1.55 }}>
            These devices are signed into your account. Remove any sessions you don't recognize.
          </Typography>
        </motion.div>

        {/* Current device */}
        <Section title="This Device" delay={0.06}>
          {sessions.filter(s => s.current).map(sess => (
            <Box key={sess.id} sx={{ display: 'flex', alignItems: 'center', gap: '13px', padding: '14px 16px' }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '11px', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <sess.icon size={16} color="#4ade80" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#fff', fontSize: 14.5, fontWeight: 500, m: 0 }}>{sess.device}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, m: '2px 0 0' }}>{sess.os} · {sess.location}</Typography>
              </Box>
              <Typography component="span" sx={{ fontSize: 11, fontWeight: 700, color: '#4ade80', background: 'rgba(74,222,128,0.12)', padding: '3px 8px', borderRadius: '6px' }}>Active</Typography>
            </Box>
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
                <Box sx={{ width: 36, height: 36, borderRadius: '11px', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <sess.icon size={16} color="rgba(255,255,255,0.5)" />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ color: '#fff', fontSize: 14.5, fontWeight: 500, m: 0 }}>{sess.device}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, m: '2px 0 0' }}>{sess.location} · {sess.lastActive}</Typography>
                </Box>
                <MotionButton whileTap={{ scale: 0.9 }} onClick={() => revokeSession(sess.id)}
                  disabled={!!revoking}
                  disableRipple disableTouchRipple
                  sx={{
                    background: 'rgba(232,101,106,0.08)', border: '1px solid rgba(232,101,106,0.2)',
                    borderRadius: '8px', padding: '5px 10px', cursor: 'pointer',
                    color: '#E8656A', fontSize: 12, fontWeight: 600, textTransform: 'none', minWidth: 0,
                    display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0,
                    '&:hover': { background: 'rgba(232,101,106,0.12)' },
                  }}
                >
                  {revoking === sess.id ? <Spinner color="#E8656A" size={14} /> : 'Revoke'}
                </MotionButton>
              </motion.div>
            ))}
          </Section>
        )}

        {otherSessions.length === 0 && allRevoked && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '24px 0' }}
          >
            <Box sx={{ width: 48, height: 48, borderRadius: '24px', background: 'rgba(74,222,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={22} color="#4ade80" />
            </Box>
            <Typography sx={{ color: '#4ade80', fontSize: 14, fontWeight: 600, m: 0 }}>All other sessions removed</Typography>
          </motion.div>
        )}

        {otherSessions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} style={{ marginTop: 8 }}>
            <MotionButton whileTap={{ scale: 0.97 }} onClick={revokeAll} disabled={signOutAll}
              disableRipple disableTouchRipple
              sx={{
                width: '100%', height: 50, borderRadius: '16px',
                background: 'rgba(232,101,106,0.07)', border: '1px solid rgba(232,101,106,0.18)',
                color: signOutAll ? 'rgba(232,101,106,0.4)' : '#E8656A',
                fontSize: 15, fontWeight: 600, textTransform: 'none', minWidth: 0,
                cursor: signOutAll ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                '&:hover': { background: 'rgba(232,101,106,0.10)' },
              }}
            >
              {signOutAll ? <><Spinner color="#E8656A" size={16} /> Revoking...</> : <><LogOut size={16} /> Sign Out All Other Devices</>}
            </MotionButton>
          </motion.div>
        )}
      </Box>
    </ScreenRoot>
  )
}

/* ─────────────────────────────────────────
   Privacy & Data view
───────────────────────────────────────── */
interface PrivacySettings {
  location: boolean
  background: boolean
  analytics: boolean
  shareData: boolean
}

interface PrivacyDataViewProps {
  privacy: PrivacySettings
  onUpdate: (updated: PrivacySettings) => void
  onBack: () => void
}

function PrivacyDataView({ privacy, onUpdate, onBack }: PrivacyDataViewProps) {
  const [exporting, setExporting] = useState(false)
  const [exported, setExported]   = useState(false)
  const set = key => () => onUpdate({ ...privacy, [key]: !privacy[key] })

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => { setExported(true); setTimeout(() => setExported(false), 3000) }, 1200)
    setTimeout(() => setExporting(false), 1200)
  }

  return (
    <ScreenRoot>
      <SubNav title="Privacy & Data" onBack={onBack} />
      <Box sx={{ flex: 1, overflowY: 'auto', padding: '12px 16px', paddingBottom: '96px' }}>

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
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, m: '0 0 10px' }}>Data we collect</Typography>
          {[
            'GPS location during active trips',
            'Vehicle speed & acceleration events',
            'OBD-II diagnostic codes',
            'App usage & crash reports (if enabled)',
          ].map(item => (
            <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', mb: '7px' }}>
              <Box sx={{ width: 4, height: 4, borderRadius: '2px', background: 'rgba(255,255,255,0.3)', flexShrink: 0, mt: '5px' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12.5, lineHeight: 1.5, m: 0 }}>{item}</Typography>
            </Box>
          ))}
        </motion.div>

        <Section title="Your Data" delay={0.16}>
          <motion.div whileTap={{ scale: 0.985 }} onClick={handleExport}
            style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', cursor: 'pointer' }}
          >
            <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {exporting ? <Spinner color="#C8FF00" size={15} /> : exported ? <Check size={15} color="#4ade80" /> : <Download size={15} color="#C8FF00" />}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: exported ? '#4ade80' : '#fff', fontSize: 14.5, fontWeight: 500, m: 0 }}>
                {exported ? 'Export Requested' : 'Export My Data'}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, m: '2px 0 0' }}>
                {exported ? "You'll receive an email within 24 hours" : 'Download a copy of your Tracklynk data'}
              </Typography>
            </Box>
            {!exporting && !exported && <ChevronRight size={15} color="rgba(255,255,255,0.22)" />}
          </motion.div>
        </Section>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.22)', fontSize: 12, textAlign: 'center', lineHeight: 1.6, padding: '0 12px' }}>
            We never sell your personal data. Read our full{' '}
            <Typography component="span" sx={{ color: 'rgba(200,255,0,0.7)', textDecoration: 'underline' }}>Privacy Policy</Typography>{' '}
            for details.
          </Typography>
        </motion.div>
      </Box>
    </ScreenRoot>
  )
}

/* ─────────────────────────────────────────
   Delete Account view  (3-step flow)
   step: 'warning' → 'confirm' → 'deleting'
───────────────────────────────────────── */
interface DeleteAccountViewProps {
  profile: ProfileData
  onBack: () => void
}

function DeleteAccountView({ profile, onBack }: DeleteAccountViewProps) {
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
    <ScreenRoot>
      <SubNav
        title={step === 'warning' ? 'Delete Account' : step === 'confirm' ? 'Confirm Deletion' : 'Deleting Account'}
        onBack={step === 'warning' ? onBack : () => setStep('warning')}
      />

      <Box sx={{ flex: 1, overflowY: 'auto', padding: '20px 20px', paddingBottom: '96px', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">

          {/* ── Warning ── */}
          {step === 'warning' && (
            <motion.div key="del-warning" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.22 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '32px', mt: '8px' }}>
                <Box sx={{
                  width: 72, height: 72, borderRadius: '22px',
                  background: 'rgba(232,101,106,0.10)', border: '1px solid rgba(232,101,106,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mb: '14px',
                }}>
                  <AlertTriangle size={32} color="#E8656A" />
                </Box>
                <Typography sx={{ color: '#fff', fontSize: 19, fontWeight: 800, letterSpacing: '-0.4px', m: '0 0 8px' }}>
                  This can't be undone
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13.5, textAlign: 'center', maxWidth: 270, lineHeight: 1.6, m: 0 }}>
                  Deleting your account will permanently remove all your data from Tracklynk.
                </Typography>
              </Box>

              <Box sx={{ background: 'rgba(232,101,106,0.06)', border: '1px solid rgba(232,101,106,0.14)', borderRadius: '16px', padding: '16px', mb: '28px' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 12.5, fontWeight: 600, m: '0 0 10px' }}>What will be deleted:</Typography>
                {[
                  'Your profile and account credentials',
                  'All trip history and routes',
                  'Vehicle and OBD device data',
                  'Active subscription (no refund)',
                  'Saved geofences and alerts',
                ].map(item => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', mb: '8px' }}>
                    <X size={13} color="#E8656A" style={{ flexShrink: 0, marginTop: 2 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, lineHeight: 1.5, m: 0 }}>{item}</Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <MotionButton whileTap={{ scale: 0.97 }} onClick={() => setStep('confirm')}
                  disableRipple disableTouchRipple
                  sx={{
                    width: '100%', height: 52, borderRadius: '16px',
                    background: 'rgba(232,101,106,0.10)', border: '1.5px solid rgba(232,101,106,0.3)',
                    color: '#E8656A', fontSize: 15, fontWeight: 700, textTransform: 'none', minWidth: 0,
                    cursor: 'pointer',
                    '&:hover': { background: 'rgba(232,101,106,0.15)' },
                  }}
                >
                  Continue to Delete
                </MotionButton>
                <MotionButton whileTap={{ scale: 0.97 }} onClick={onBack}
                  disableRipple disableTouchRipple
                  sx={{
                    width: '100%', height: 52, borderRadius: '16px',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
                    color: '#fff', fontSize: 15, fontWeight: 600, textTransform: 'none', minWidth: 0,
                    cursor: 'pointer',
                    '&:hover': { background: 'rgba(255,255,255,0.09)' },
                  }}
                >
                  Keep My Account
                </MotionButton>
              </Box>
            </motion.div>
          )}

          {/* ── Confirm ── */}
          {step === 'confirm' && (
            <motion.div key="del-confirm" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.22 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, mb: '28px', lineHeight: 1.6 }}>
                To confirm, type your email address{' '}
                <Typography component="span" sx={{ color: '#fff', fontWeight: 600 }}>{targetEmail}</Typography>{' '}
                below.
              </Typography>

              <Box sx={{ mb: '28px' }}>
                <FieldLabel>Email Address</FieldLabel>
                <TextField
                  type="email" value={typed} placeholder={targetEmail}
                  onChange={e => setTyped(e.target.value)}
                  fullWidth variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 52, borderRadius: '14px',
                      background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)',
                      '& fieldset': {
                        borderWidth: '1.5px',
                        borderColor: confirmed ? 'rgba(232,101,106,0.5)' : 'rgba(255,255,255,0.09)',
                      },
                      '&:hover fieldset': { borderColor: confirmed ? 'rgba(232,101,106,0.5)' : 'rgba(255,255,255,0.18)' },
                      '&.Mui-focused fieldset': { borderColor: confirmed ? 'rgba(232,101,106,0.5)' : 'rgba(200,255,0,0.45)', boxShadow: '0 0 0 3px rgba(200,255,0,0.08)' },
                      '& input': { color: confirmed ? '#E8656A' : '#fff', fontSize: 15, padding: '0 16px' },
                    },
                  }}
                />
              </Box>

              <MotionButton whileTap={confirmed ? { scale: 0.97 } : {}} onClick={handleDelete}
                disableRipple disableTouchRipple
                sx={{
                  width: '100%', height: 54, borderRadius: '16px',
                  background: confirmed ? 'rgba(232,101,106,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${confirmed ? 'rgba(232,101,106,0.45)' : 'rgba(255,255,255,0.06)'}`,
                  color: confirmed ? '#E8656A' : 'rgba(255,255,255,0.2)',
                  fontSize: 15, fontWeight: 700, textTransform: 'none', minWidth: 0,
                  cursor: confirmed ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  '&:hover': { background: confirmed ? 'rgba(232,101,106,0.20)' : 'rgba(255,255,255,0.04)' },
                }}
              >
                Permanently Delete Account
              </MotionButton>
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
              <Typography sx={{ color: '#E8656A', fontSize: 16, fontWeight: 700, m: '0 0 8px' }}>Deleting your account…</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, m: 0 }}>This may take a moment</Typography>
            </motion.div>
          )}

        </AnimatePresence>
      </Box>
    </ScreenRoot>
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

interface FaqItemProps {
  q: string
  a: string
  index: number
}

function FaqItem({ q, a, index }: FaqItemProps) {
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
        <Typography sx={{ flex: 1, color: '#fff', fontSize: 14, fontWeight: 500, m: 0, lineHeight: 1.4 }}>{q}</Typography>
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
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.65, m: 0, padding: '0 16px 16px 43px' }}>
              {a}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface HelpSupportViewProps {
  onBack: () => void
}

function HelpSupportView({ onBack }: HelpSupportViewProps) {
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
    <ScreenRoot>
      <SubNav title="Help & Support" onBack={onBack} />

      {/* Tab switcher */}
      <Box sx={{ display: 'flex', gap: '8px', padding: '4px 16px 12px', flexShrink: 0 }}>
        {[{ id: 'faq', label: 'FAQs' }, { id: 'contact', label: 'Contact Us' }].map(t => (
          <MotionButton key={t.id} whileTap={{ scale: 0.95 }} onClick={() => setTab(t.id)}
            disableRipple disableTouchRipple
            sx={{
              flex: 1, height: 38, borderRadius: '12px',
              background: tab === t.id ? 'rgba(200,255,0,0.10)' : 'rgba(255,255,255,0.05)',
              border: `1.5px solid ${tab === t.id ? 'rgba(200,255,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: tab === t.id ? '#C8FF00' : 'rgba(255,255,255,0.45)',
              fontSize: 13.5, fontWeight: 600, textTransform: 'none', minWidth: 0,
              cursor: 'pointer', transition: 'all 0.18s',
              '&:hover': { background: tab === t.id ? 'rgba(200,255,0,0.14)' : 'rgba(255,255,255,0.08)' },
            }}
          >
            {t.label}
          </MotionButton>
        ))}
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', padding: '0 16px', paddingBottom: '40px' }}>
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
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#4ade80', fontSize: 13, fontWeight: 600, m: 0 }}>All systems operational</Typography>
                  <Typography sx={{ color: 'rgba(74,222,128,0.6)', fontSize: 11.5, m: '1px 0 0' }}>Live tracking · OBD sync · Notifications</Typography>
                </Box>
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
                <Box sx={{ padding: '14px 16px' }}>
                  <motion.div whileTap={{ scale: 0.97 }} onClick={() => setTab('contact')}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                  >
                    <MessageSquare size={15} color="#C8FF00" />
                    <Typography sx={{ color: '#C8FF00', fontSize: 13.5, fontWeight: 600, m: 0 }}>
                      Didn't find your answer? Contact us →
                    </Typography>
                  </motion.div>
                </Box>
              </Section>

              {/* Quick contact options */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: 4 }}>
                <SectionTitle>Reach Us Directly</SectionTitle>
                <GlassCard sx={{ borderRadius: '18px', overflow: 'hidden' }}>
                  {[
                    { Icon: Mail,      label: 'support@tracklynk.com', sub: 'Response within 24 hours' },
                    { Icon: PhoneIcon, label: '+1 (800) 555-0199',      sub: 'Mon–Fri, 9am–6pm PST', last: true },
                  ].map(({ Icon, label, sub, last }) => (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: '13px', padding: '14px 16px', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
                      <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={15} color="#C8FF00" />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 500, m: 0 }}>{label}</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, m: '2px 0 0' }}>{sub}</Typography>
                      </Box>
                    </Box>
                  ))}
                </GlassCard>
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
                  <Box sx={{ width: 72, height: 72, borderRadius: '22px', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={30} color="#4ade80" />
                  </Box>
                  <Typography sx={{ color: '#fff', fontSize: 19, fontWeight: 800, letterSpacing: '-0.4px', m: 0 }}>Message Sent!</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13.5, textAlign: 'center', maxWidth: 260, lineHeight: 1.6, m: 0 }}>
                    Our support team will get back to you at your registered email within 24 hours.
                  </Typography>
                  <MotionButton whileTap={{ scale: 0.97 }} onClick={() => { setSent(false); setSubject(''); setMessage('') }}
                    disableRipple disableTouchRipple
                    sx={{
                      mt: '8px', padding: '12px 28px', borderRadius: '14px',
                      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, textTransform: 'none', minWidth: 0,
                      cursor: 'pointer',
                      '&:hover': { background: 'rgba(255,255,255,0.10)' },
                    }}
                  >
                    Send Another
                  </MotionButton>
                </motion.div>
              ) : (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6, mb: '20px' }}>
                      Describe your issue and we'll respond to your registered email.
                    </Typography>
                  </motion.div>

                  {/* Subject picker */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} style={{ marginBottom: 14 }}>
                    <FieldLabel sx={{ m: '0 0 9px' }}>Topic</FieldLabel>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {['Device Setup', 'Billing', 'Trips & Data', 'Account', 'App Bug', 'Other'].map(s => (
                        <MotionButton key={s} whileTap={{ scale: 0.94 }} onClick={() => setSubject(s)}
                          disableRipple disableTouchRipple
                          sx={{
                            padding: '8px 14px', borderRadius: '10px',
                            background: subject === s ? 'rgba(200,255,0,0.10)' : 'rgba(255,255,255,0.06)',
                            border: `1.5px solid ${subject === s ? 'rgba(200,255,0,0.35)' : 'rgba(255,255,255,0.09)'}`,
                            color: subject === s ? '#C8FF00' : 'rgba(255,255,255,0.5)',
                            fontSize: 13, fontWeight: 600, textTransform: 'none', minWidth: 0,
                            cursor: 'pointer', transition: 'all 0.15s',
                            '&:hover': { background: subject === s ? 'rgba(200,255,0,0.14)' : 'rgba(255,255,255,0.09)' },
                          }}
                        >
                          {s}
                        </MotionButton>
                      ))}
                    </Box>
                  </motion.div>

                  {/* Message textarea */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }} style={{ marginBottom: 20 }}>
                    <FieldLabel>Message</FieldLabel>
                    <TextField
                      value={message}
                      placeholder="Describe your issue in detail…"
                      onChange={e => setMessage(e.target.value)}
                      multiline rows={5}
                      fullWidth variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '14px',
                          background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.09)', borderWidth: '1.5px' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
                          '&.Mui-focused fieldset': { borderColor: 'rgba(200,255,0,0.5)', boxShadow: '0 0 0 3px rgba(200,255,0,0.08)' },
                          '& textarea': { color: '#fff', fontSize: 14, lineHeight: 1.6, padding: '14px 16px' },
                        },
                      }}
                    />
                    <Typography sx={{ color: 'rgba(255,255,255,0.22)', fontSize: 11.5, m: '5px 0 0', textAlign: 'right' }}>{message.length} chars</Typography>
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
      </Box>
    </ScreenRoot>
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

interface WhatsNewViewProps {
  onBack: () => void
}

function WhatsNewView({ onBack }: WhatsNewViewProps) {
  return (
    <ScreenRoot>
      <SubNav title="What's New" onBack={onBack} />
      <Box sx={{ flex: 1, overflowY: 'auto', padding: '8px 16px', paddingBottom: '40px' }}>
        {CHANGELOG.map((release, ri) => (
          <motion.div key={release.version}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ri * 0.07, type: 'spring', stiffness: 280, damping: 26 }}
            style={{ marginBottom: 20 }}
          >
            {/* Version header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '10px' }}>
              <Box sx={{
                padding: '4px 10px', borderRadius: '8px',
                background: release.current ? 'rgba(200,255,0,0.12)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${release.current ? 'rgba(200,255,0,0.3)' : 'rgba(255,255,255,0.09)'}`,
              }}>
                <Typography component="span" sx={{
                  color: release.current ? '#C8FF00' : 'rgba(255,255,255,0.5)',
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.2px',
                }}>
                  v{release.version}
                </Typography>
              </Box>
              {release.current && (
                <Typography component="span" sx={{ fontSize: 11, fontWeight: 700, color: '#4ade80', background: 'rgba(74,222,128,0.10)', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(74,222,128,0.2)' }}>
                  Current
                </Typography>
              )}
              <Typography component="span" sx={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, ml: 'auto' }}>{release.date}</Typography>
            </Box>

            {/* Changes card */}
            <Box sx={{
              background: release.current ? 'rgba(200,255,0,0.04)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${release.current ? 'rgba(200,255,0,0.12)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: '16px', padding: '14px 16px',
            }}>
              {release.changes.map((c, ci) => (
                <motion.div key={c}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: ri * 0.07 + ci * 0.03 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: ci < release.changes.length - 1 ? 10 : 0 }}
                >
                  <Box sx={{ width: 5, height: 5, borderRadius: '2.5px', background: release.current ? '#C8FF00' : 'rgba(255,255,255,0.25)', flexShrink: 0, mt: '5px' }} />
                  <Typography sx={{ color: release.current ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.38)', fontSize: 13.5, lineHeight: 1.5, m: 0 }}>{c}</Typography>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        ))}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.18)', fontSize: 12, textAlign: 'center', pb: '8px' }}>
            Tracklynk · Built with ♥ in San Francisco
          </Typography>
        </motion.div>
      </Box>
    </ScreenRoot>
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

interface TermsPrivacyViewProps {
  onBack: () => void
}

function TermsPrivacyView({ onBack }: TermsPrivacyViewProps) {
  const [tab, setTab] = useState('terms')

  const content = tab === 'terms' ? TERMS_TEXT : PRIVACY_TEXT
  const updated  = tab === 'terms' ? 'Last updated April 1, 2026' : 'Last updated April 1, 2026'

  return (
    <ScreenRoot>
      <SubNav title="Terms & Privacy" onBack={onBack} />

      {/* Tab bar */}
      <Box sx={{ display: 'flex', gap: '8px', padding: '4px 16px 12px', flexShrink: 0 }}>
        {[{ id: 'terms', label: 'Terms of Service' }, { id: 'privacy', label: 'Privacy Policy' }].map(t => (
          <MotionButton key={t.id} whileTap={{ scale: 0.95 }} onClick={() => setTab(t.id)}
            disableRipple disableTouchRipple
            sx={{
              flex: 1, height: 38, borderRadius: '12px',
              background: tab === t.id ? 'rgba(200,255,0,0.10)' : 'rgba(255,255,255,0.05)',
              border: `1.5px solid ${tab === t.id ? 'rgba(200,255,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: tab === t.id ? '#C8FF00' : 'rgba(255,255,255,0.45)',
              fontSize: 13, fontWeight: 600, textTransform: 'none', minWidth: 0,
              cursor: 'pointer', transition: 'all 0.18s',
              '&:hover': { background: tab === t.id ? 'rgba(200,255,0,0.14)' : 'rgba(255,255,255,0.08)' },
            }}
          >
            {t.label}
          </MotionButton>
        ))}
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', padding: '0 16px', paddingBottom: '40px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.18 }}>

            <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, mb: '18px', pl: '2px' }}>{updated}</Typography>

            {content.map((section, i) => (
              <motion.div key={section.heading}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{ marginBottom: 20 }}
              >
                <Typography sx={{ color: '#fff', fontSize: 13.5, fontWeight: 700, m: '0 0 6px', letterSpacing: '-0.1px' }}>{section.heading}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.42)', fontSize: 13, lineHeight: 1.7, m: 0 }}>{section.body}</Typography>
              </motion.div>
            ))}

            <Box sx={{ mt: '8px', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, textAlign: 'center', lineHeight: 1.6, m: 0 }}>
                Questions? Email{' '}
                <Typography component="span" sx={{ color: 'rgba(200,255,0,0.65)' }}>legal@tracklynk.com</Typography>
              </Typography>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </ScreenRoot>
  )
}

/* ─────────────────────────────────────────
   Main Settings screen
───────────────────────────────────────── */
export default function Settings() {
  const { user: ctxUser, vehicle: ctxVehicle, plan: ctxPlan } = useUserContext()

  const [activeView,        setActiveView]        = useState(null)
  const [selectedVehicleId, setSelectedVehicleId] = useState(null)
  const [profile, setProfile] = useState({
    first: ctxUser.firstName || '',
    last:  ctxUser.lastName  || '',
    email: ctxUser.email     || '',
    phone: ctxUser.phone     || '',
  })

  const initVehicle = (ctxVehicle.model || ctxVehicle.vin)
    ? [{
        id: 1,
        nickname: ctxVehicle.nickname || ctxVehicle.model || 'My Vehicle',
        plate: ctxVehicle.plate || '',
        year: '2024', make: 'Toyota', model: ctxVehicle.model || 'Tacoma', trim: 'TRD Off-Road',
        device: { connected: false, lastSeen: 'Not yet paired', signal: 0 },
      }]
    : []
  const [vehicles, setVehicles] = useState(initVehicle)

  const initPlan = ctxPlan
    ? ctxPlan.type
    : 'monthly'
  const [subscription, setSubscription] = useState({
    plan: initPlan, status: ctxPlan ? 'active' : 'cancelled',
    nextDate: 'Jan 15, 2027', nextAmount: initPlan === 'annual' ? '$95.88' : '$9.65',
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
    <Box sx={{ height: '100%', position: 'relative', background: '#04050d', overflow: 'hidden' }}>

      {/* ── Main list ── */}
      <ScreenRoot>
        <Box sx={{ padding: '14px 20px 10px', flexShrink: 0 }}>
          <Typography sx={{ color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', m: 0 }}>
            Settings
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', padding: '6px 16px', paddingBottom: '96px' }}>

          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04, type: 'spring', stiffness: 320, damping: 28 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => setActiveView('profile')}
            style={{ ...glassCard, borderRadius: 18, padding: '14px 16px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
          >
            <Box sx={{
              width: 50, height: 50, borderRadius: '25px', flexShrink: 0,
              background: 'linear-gradient(135deg, #C8FF00 0%, #8FB800 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Typography component="span" sx={{ color: '#000', fontSize: 20, fontWeight: 800 }}>
                {profile.first[0]?.toUpperCase()}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px', m: 0 }}>{displayName}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, m: '2px 0 0' }}>{profile.email}</Typography>
            </Box>
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
            <Box sx={{ padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Star size={15} color="#C8FF00" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#fff', fontSize: 14.5, fontWeight: 500, m: 0 }}>Rate the App</Typography>
                  {rated && <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, m: '2px 0 0' }}>Thanks for your feedback!</Typography>}
                </Box>
                <Box sx={{ display: 'flex', gap: '4px' }}>
                  {[1,2,3,4,5].map(s => (
                    <MotionButton key={s} whileTap={{ scale: 0.8 }} onClick={() => handleRate(s)}
                      disableRipple disableTouchRipple
                      sx={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', minWidth: 0 }}
                    >
                      <Star size={18}
                        color={s <= rating ? '#C8FF00' : 'rgba(255,255,255,0.2)'}
                        fill={s <= rating ? '#C8FF00' : 'none'}
                        style={{ transition: 'color 0.15s, fill 0.15s' }}
                      />
                    </MotionButton>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Share Tracklynk — inline copy link */}
            <Box sx={{ padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Share2 size={15} color="#C8FF00" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#fff', fontSize: 14.5, fontWeight: 500, m: 0 }}>Share TrackLynk</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, m: '2px 0 0' }}>Invite friends & family</Typography>
                </Box>
                <MotionButton whileTap={{ scale: 0.9 }} onClick={handleCopyLink}
                  disableRipple disableTouchRipple
                  sx={{
                    display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '9px',
                    background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(200,255,0,0.10)',
                    border: `1px solid ${copied ? 'rgba(74,222,128,0.28)' : 'rgba(200,255,0,0.25)'}`,
                    color: copied ? '#4ade80' : '#C8FF00',
                    fontSize: 12.5, fontWeight: 600, textTransform: 'none', minWidth: 0,
                    cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
                    '&:hover': { background: copied ? 'rgba(74,222,128,0.14)' : 'rgba(200,255,0,0.14)' },
                  }}
                >
                  {copied ? <><Check size={13} /> Copied</> : <><Link size={13} /> Copy Link</>}
                </MotionButton>
              </Box>
            </Box>

            <Row label="Version" value="1.0.0 (build 42)" last />
          </Section>

        </Box>
      </ScreenRoot>

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

    </Box>
  )
}
