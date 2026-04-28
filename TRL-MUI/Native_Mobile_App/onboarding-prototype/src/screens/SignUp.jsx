import { useState } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material'
import { Eye, EyeOff } from 'lucide-react'
import ProgressBar from './ProgressBar.jsx'
import { useUserContext } from '../context/UserContext.jsx'

const MotionButton = motion(Button)

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignUp({ next, back, step, total }) {
  const { setUser } = useUserContext()
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ first: '', last: '', phone: '', email: '', password: '' })
  const [touched, setTouched] = useState({})

  const errors = {
    first:    !form.first.trim()         ? 'Required' : null,
    last:     !form.last.trim()          ? 'Required' : null,
    email:    !emailRe.test(form.email)  ? 'Enter a valid email' : null,
    password: form.password.length < 8  ? 'Min. 8 characters' : null,
  }
  const isValid = Object.values(errors).every(e => e === null)

  const handleNext = () => {
    if (!isValid) return
    setUser({ firstName: form.first, lastName: form.last, phone: form.phone, email: form.email })
    next()
  }

  const touch = key => setTouched(t => ({ ...t, [key]: true }))

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', pt: '44px', position: 'relative' }}>
      <ProgressBar current={step} total={total} onBack={back} title="Create Account" />

      <Box sx={{ flex: 1, overflowY: 'auto', p: '20px 24px 0' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Typography sx={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px', mb: '6px' }}>
            Let's get you set up
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, mb: '24px' }}>
            Takes under 3 minutes. We'll protect your data.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Field
              label="First name" value={form.first} placeholder="Jane"
              onChange={v => setForm(f => ({...f, first: v}))}
              onBlur={() => touch('first')}
              error={touched.first ? errors.first : null}
            />
            <Field
              label="Last name" value={form.last} placeholder="Smith"
              onChange={v => setForm(f => ({...f, last: v}))}
              onBlur={() => touch('last')}
              error={touched.last ? errors.last : null}
            />
          </Box>
          <Field
            label="Mobile number" value={form.phone} placeholder="+1 (555) 000-0000" type="tel"
            onChange={v => setForm(f => ({...f, phone: v}))}
          />
          <Field
            label="Email address" value={form.email} placeholder="jane@email.com" type="email"
            onChange={v => setForm(f => ({...f, email: v}))}
            onBlur={() => touch('email')}
            error={touched.email ? errors.email : null}
          />

          {/* Password */}
          <Box>
            <FieldLabel>Password</FieldLabel>
            <TextField
              fullWidth
              type={showPass ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={e => setForm(f => ({...f, password: e.target.value}))}
              onBlur={() => touch('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPass(s => !s)}
                      edge="end"
                      sx={{ color: 'text.disabled', mr: '-8px' }}
                    >
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {touched.password && errors.password && (
              <Typography sx={{ color: 'rgba(255,80,80,0.9)', fontSize: 11.5, mt: '5px' }}>
                {errors.password}
              </Typography>
            )}
          </Box>

          <Typography sx={{ color: 'rgba(255,255,255,0.28)', fontSize: 11.5, textAlign: 'center', py: '4px' }}>
            By continuing you agree to our{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>Terms</Box>
            {' '}&amp;{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>Privacy Policy</Box>
          </Typography>
        </motion.div>
      </Box>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Box sx={{ p: '20px 24px 48px' }}>
          <PrimaryButton onClick={handleNext} label="Continue" disabled={!isValid} />
        </Box>
      </motion.div>
    </Box>
  )
}

// ─── Field components ─────────────────────────────────

function FieldLabel({ children }) {
  return (
    <Typography sx={{
      color: 'rgba(255,255,255,0.48)', fontSize: 12, fontWeight: 600,
      letterSpacing: '0.2px', display: 'block', mb: '8px',
    }}>
      {children}
    </Typography>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', onBlur, error }) {
  return (
    <Box sx={{ flex: 1 }}>
      <FieldLabel>{label}</FieldLabel>
      <TextField
        fullWidth
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {error && (
        <Typography sx={{ color: 'rgba(255,80,80,0.9)', fontSize: 11.5, mt: '5px' }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

/* ─────────────────────────────────────────────────────────
   Exported for DeviceSetupWizard and ChoosePlan
───────────────────────────────────────────────────────── */

export const screenBase = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 44,
  background: 'transparent',
  position: 'relative',
}

export const headingStyle = {
  fontSize: 26,
  fontWeight: 800,
  color: '#fff',
  marginBottom: 6,
  letterSpacing: '-0.6px',
  fontFamily: 'Inter, sans-serif',
}

export const subStyle = {
  color: 'rgba(255,255,255,0.42)',
  fontSize: 14,
  marginBottom: 24,
  fontFamily: 'Inter, sans-serif',
}

export const labelStyle = {
  color: 'rgba(255,255,255,0.48)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: 8,
  fontFamily: 'Inter, sans-serif',
}

export const inputStyle = {
  width: '100%',
  height: 50,
  borderRadius: 14,
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1.5px solid rgba(255,255,255,0.09)',
  color: '#fff',
  fontSize: 15,
  padding: '0 16px',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

export function PrimaryButton({ onClick, label, disabled }) {
  return (
    <MotionButton
      fullWidth
      variant="contained"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      sx={{ height: 54, borderRadius: '18px', fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px' }}
    >
      {label}
    </MotionButton>
  )
}
