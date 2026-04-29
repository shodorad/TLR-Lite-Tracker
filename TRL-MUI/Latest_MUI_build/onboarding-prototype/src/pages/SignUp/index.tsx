import React, { useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Eye, EyeOff } from 'lucide-react'
import ProgressBar from '../../components/ProgressBar'
import { useUserContext } from '../../context/UserContext'

const MotionButton = motion(Button)

// ─── Styled Components ────────────────────────────────

const ScreenRoot = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '44px',
  position: 'relative',
})

const ScrollArea = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '20px 24px 0',
})

const HeadingText = styled(Typography)({
  fontSize: 26,
  fontWeight: 800,
  letterSpacing: '-0.6px',
  marginBottom: '6px',
})

const SubText = styled(Typography)({
  fontSize: 14,
  marginBottom: '24px',
})

const NameRow = styled(Box)({
  display: 'flex',
  gap: '10px',
})

const PasswordErrorText = styled(Typography)({
  color: 'rgba(255,80,80,0.9)',
  fontSize: 11.5,
  marginTop: '5px',
})

const LegalText = styled(Typography)({
  color: 'rgba(255,255,255,0.28)',
  fontSize: 11.5,
  textAlign: 'center',
  paddingTop: '4px',
  paddingBottom: '4px',
})

const PasswordIconButton = styled(IconButton)({
  color: 'text.disabled',
  marginRight: '-8px',
})

const LegalLink = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
}))

const FooterBox = styled(Box)({
  padding: '20px 24px 48px',
})

const FieldLabelText = styled(Typography)({
  color: 'rgba(255,255,255,0.48)',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.2px',
  display: 'block',
  marginBottom: '8px',
})

const FieldRoot = styled(Box)({
  flex: 1,
})

const FieldErrorText = styled(Typography)({
  color: 'rgba(255,80,80,0.9)',
  fontSize: 11.5,
  marginTop: '5px',
})

const FormFieldsColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
})

const MotionFormFieldsColumn = motion(FormFieldsColumn)

const PrimaryMotionButton = styled(MotionButton)({
  height: 54,
  borderRadius: '18px',
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: '-0.2px',
})

// ─── Validation ───────────────────────────────────────

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface SignUpProps {
  next: () => void
  back: () => void
  step: number
  total: number
}

export default function SignUp({ next, back, step, total }: SignUpProps) {
  const { setUser } = useUserContext()
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ first: '', last: '', phone: '', email: '', password: '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})

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

  const touch = (key: string) => setTouched(t => ({ ...t, [key]: true }))

  return (
    <ScreenRoot>
      <ProgressBar current={step} total={total} onBack={back} title="Create Account" />

      <ScrollArea>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <HeadingText>
            Let's get you set up
          </HeadingText>
          <SubText variant="body2">
            Takes under 3 minutes. We'll protect your data.
          </SubText>
        </motion.div>

        <MotionFormFieldsColumn
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <NameRow>
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
          </NameRow>
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
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <PasswordIconButton
                        onClick={() => setShowPass(s => !s)}
                        edge="end"
                      >
                        {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                      </PasswordIconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {touched.password && errors.password && (
              <PasswordErrorText>
                {errors.password}
              </PasswordErrorText>
            )}
          </Box>

          <LegalText>
            By continuing you agree to our{' '}
            <LegalLink>Terms</LegalLink>
            {' '}&amp;{' '}
            <LegalLink>Privacy Policy</LegalLink>
          </LegalText>
        </MotionFormFieldsColumn>
      </ScrollArea>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <FooterBox>
          <PrimaryButton onClick={handleNext} label="Continue" disabled={!isValid} />
        </FooterBox>
      </motion.div>
    </ScreenRoot>
  )
}

// ─── Field components ─────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <FieldLabelText>
      {children}
    </FieldLabelText>
  )
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  onBlur?: () => void
  error?: string | null
}

function Field({ label, value, onChange, placeholder, type = 'text', onBlur, error }: FieldProps) {
  return (
    <FieldRoot>
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
        <FieldErrorText>{error}</FieldErrorText>
      )}
    </FieldRoot>
  )
}

/* ─────────────────────────────────────────────────────────
   Exported for DeviceSetupWizard and ChoosePlan
───────────────────────────────────────────────────────── */

export const screenBase: CSSProperties = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 16,
  background: 'transparent',
  position: 'relative',
}

export const headingStyle: CSSProperties = {
  fontSize: 26,
  fontWeight: 800,
  color: '#fff',
  marginBottom: 6,
  letterSpacing: '-0.6px',
  fontFamily: 'Inter, sans-serif',
}

export const subStyle: CSSProperties = {
  color: 'rgba(255,255,255,0.42)',
  fontSize: 14,
  marginBottom: 24,
  fontFamily: 'Inter, sans-serif',
}

export const labelStyle: CSSProperties = {
  color: 'rgba(255,255,255,0.48)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: 8,
  fontFamily: 'Inter, sans-serif',
}

export const inputStyle: CSSProperties = {
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

export interface PrimaryButtonProps {
  onClick: () => void
  label: string
  disabled?: boolean
}

export function PrimaryButton({ onClick, label, disabled }: PrimaryButtonProps) {
  return (
    <PrimaryMotionButton
      fullWidth
      variant="contained"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </PrimaryMotionButton>
  )
}
