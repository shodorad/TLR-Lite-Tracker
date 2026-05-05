import { useState } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { PrimaryButton } from '../SignUp'

// ─── OAuth brand icons ────────────────────────────────

function AppleIcon() {
  return (
    <svg width="16" height="19" viewBox="0 0 16 19" fill="none">
      <path
        d="M13.17 10.04c-.02-1.96 1.6-2.9 1.67-2.95-.91-1.33-2.33-1.52-2.83-1.54-1.21-.12-2.37.72-2.99.72-.62 0-1.58-.7-2.59-.68-1.33.02-2.56.78-3.24 1.97C1.4 9.68 2.4 13.5 3.97 15.57c.79 1.13 1.73 2.39 2.96 2.35 1.19-.05 1.64-.77 3.08-.77 1.44 0 1.85.77 3.1.74 1.28-.02 2.09-1.15 2.86-2.28.9-1.31 1.27-2.58 1.29-2.65-.03-.01-2.49-1-.52-3.92l.43.0zM10.6 3.79c.65-.8 1.09-1.9.97-3.01-.94.04-2.07.63-2.74 1.41-.6.69-1.13 1.8-.99 2.86 1.05.08 2.12-.54 2.76-1.26z"
        fill="currentColor"
      />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.25-.164-1.84H9v3.48h4.844c-.209 1.126-.843 2.079-1.796 2.717v2.258h2.908C16.418 14.216 17.64 11.91 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.892 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

// ─── Styled components ────────────────────────────────

const MotionButton = motion(Button)

const ScreenRoot = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '16px',
})

const BackButtonWrapper = styled(Box)({
  padding: '12px 20px 0',
})

const BackButton = styled(MotionButton)({
  minWidth: 0,
  width: 44,
  height: 44,
  borderRadius: '14px',
  padding: 0,
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
})

const ScrollArea = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '28px 24px 0',
})

const HeadingText = styled(Typography)({
  fontSize: 30,
  fontWeight: 900,
  letterSpacing: '-0.8px',
  marginBottom: '7px',
})

const SubText = styled(Typography)({
  fontSize: 14.5,
  marginBottom: '32px',
})

const FieldLabelText = styled(Typography)({
  color: 'rgba(255,255,255,0.48)',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.2px',
  display: 'block',
  marginBottom: '8px',
})

const FieldErrorText = styled(Typography)({
  color: 'rgba(255,80,80,0.9)',
  fontSize: 11.5,
  marginTop: '5px',
})

const ForgotLink = styled(MotionButton)({
  color: '#C8FF00',
  fontSize: 12,
  fontWeight: 600,
  padding: 0,
  minWidth: 0,
  letterSpacing: 0,
})

const DividerRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  margin: '6px 0',
})

const DividerLine = styled(Box)({
  flex: 1,
  height: '1px',
  background: 'rgba(255,255,255,0.07)',
})

const DividerLabel = styled(Typography)({
  fontSize: 12,
  color: 'rgba(255,255,255,0.22)',
})

const OAuthAppleButton = styled(MotionButton)({
  height: 54,
  borderRadius: '18px',
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: '-0.2px',
  gap: '10px',
})

const OAuthGoogleButton = styled(MotionButton)({
  height: 50,
  borderRadius: '16px',
  fontSize: 15,
  fontWeight: 600,
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  gap: '10px',
})

const SignUpRow = styled(Box)({
  marginTop: 24,
  marginBottom: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 5,
})

const SignUpPromptText = styled(Typography)({
  fontSize: 13.5,
  color: 'rgba(255,255,255,0.32)',
})

const SignUpLink = styled(MotionButton)({
  color: '#C8FF00',
  fontSize: 13.5,
  fontWeight: 700,
  padding: 0,
  minWidth: 0,
})

const PasswordIconButton = styled(IconButton)({
  color: 'text.disabled',
  marginRight: '-8px',
})

// ─── Validation ───────────────────────────────────────

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── Props ────────────────────────────────────────────

interface LoginProps {
  next: () => void
  back: () => void
  onForgotPassword: () => void
  onSignUpEmail: () => void
  onOAuthLogin: () => void
}

// ─── Screen ───────────────────────────────────────────

export default function Login({ next, back, onForgotPassword, onSignUpEmail, onOAuthLogin }: LoginProps) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPass, setShowPass] = useState(false)

  const errors = {
    email:    !emailRe.test(form.email)  ? 'Enter a valid email' : null,
    password: form.password.length < 1   ? 'Required' : null,
  }
  const isValid = Object.values(errors).every(e => e === null)

  const touch = (key: string) => setTouched(t => ({ ...t, [key]: true }))

  return (
    <ScreenRoot>

      {/* Back */}
      <BackButtonWrapper>
        <BackButton
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.90 }}
          onClick={back}
          variant="outlined"
        >
          <ArrowLeft size={17} color="rgba(255,255,255,0.80)" />
        </BackButton>
      </BackButtonWrapper>

      <ScrollArea>
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, type: 'spring', stiffness: 300, damping: 28 }}
        >
          <HeadingText>Welcome back</HeadingText>
          <SubText variant="body2">Sign in to your TrackLynk account.</SubText>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >

          {/* Email */}
          <Box>
            <FieldLabelText>Email address</FieldLabelText>
            <TextField
              fullWidth
              type="email"
              placeholder="jane@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onBlur={() => touch('email')}
            />
            {touched.email && errors.email && (
              <FieldErrorText>{errors.email}</FieldErrorText>
            )}
          </Box>

          {/* Password + forgot link */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '8px' }}>
              <FieldLabelText sx={{ mb: 0 }}>Password</FieldLabelText>
              <ForgotLink
                variant="text"
                whileTap={{ scale: 0.95 }}
                onClick={onForgotPassword}
              >
                Forgot password?
              </ForgotLink>
            </Box>
            <TextField
              fullWidth
              type={showPass ? 'text' : 'password'}
              placeholder="Your password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onBlur={() => touch('password')}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <PasswordIconButton onClick={() => setShowPass(s => !s)} edge="end">
                        {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                      </PasswordIconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {touched.password && errors.password && (
              <FieldErrorText>{errors.password}</FieldErrorText>
            )}
          </Box>

          {/* Primary CTA — above SSO */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <PrimaryButton onClick={next} label="Sign in" disabled={!isValid} />
          </motion.div>

          {/* SSO divider */}
          <DividerRow>
            <DividerLine />
            <DividerLabel variant="caption">or continue with</DividerLabel>
            <DividerLine />
          </DividerRow>

          {/* Apple */}
          <OAuthAppleButton
            fullWidth
            variant="contained"
            whileTap={{ scale: 0.97 }}
            onClick={onOAuthLogin}
          >
            <AppleIcon />
            Continue with Apple
          </OAuthAppleButton>

          {/* Google */}
          <OAuthGoogleButton
            fullWidth
            variant="outlined"
            whileTap={{ scale: 0.97 }}
            onClick={onOAuthLogin}
            sx={{ color: 'text.primary' }}
          >
            <GoogleIcon />
            Continue with Google
          </OAuthGoogleButton>

          {/* Sign up prompt */}
          <SignUpRow>
            <SignUpPromptText variant="caption">Don't have an account?</SignUpPromptText>
            <SignUpLink variant="text" whileTap={{ scale: 0.95 }} onClick={onSignUpEmail}>
              Sign up
            </SignUpLink>
          </SignUpRow>

        </motion.div>
      </ScrollArea>

      {/* Bottom padding so last item clears the safe area */}
      <Box sx={{ pb: '32px' }} />

    </ScreenRoot>
  )
}
