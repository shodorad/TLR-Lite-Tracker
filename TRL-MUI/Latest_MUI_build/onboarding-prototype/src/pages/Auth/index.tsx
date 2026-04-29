import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Fingerprint, Check, ArrowLeft } from 'lucide-react'
import { glassCard } from '../../styles/glass'

// ─── OAuth brand icons ─────────────────────────────────

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

const AuthRoot = styled(Box)({
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

const AuthBody = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: '28px 26px 0',
})

const AuthHeading = styled(Typography)({
  fontSize: 30,
  fontWeight: 900,
  letterSpacing: '-0.8px',
  marginBottom: '7px',
})

const AuthSubtitle = styled(Typography)({
  fontSize: 14.5,
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

const DividerRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  marginTop: '2px',
  marginBottom: '2px',
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

const EmailButton = styled(MotionButton)({
  color: 'rgba(255,255,255,0.55)',
  fontSize: 15,
  fontWeight: 600,
})

const SignInRow = styled(Box)({
  marginTop: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 5,
})

const SignInPromptText = styled(Typography)({
  fontSize: 13.5,
  color: 'rgba(255,255,255,0.32)',
})

const SignInLink = styled(MotionButton)({
  color: '#C8FF00',
  fontSize: 13.5,
  fontWeight: 700,
  padding: 0,
  minWidth: 0,
})

const BiometricCard = styled(motion.div)({
  marginTop: 32,
  borderRadius: 18,
  padding: '18px',
  ...glassCard,
})

const BiometricSectionLabel = styled(Typography)({
  color: 'rgba(255,255,255,0.30)',
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: '0.9px',
  textTransform: 'uppercase',
  marginBottom: '14px',
})

const BiometricRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
})

const BiometricTitle = styled(Typography)({
  fontSize: 14,
  fontWeight: 600,
  marginBottom: '3px',
})

const BiometricCaption = styled(Typography)({
  fontSize: 12,
  color: 'rgba(255,255,255,0.32)',
})

const FaceIDButtonRoot = styled(MotionButton)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 18px',
  borderRadius: '14px',
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  minWidth: 0,
  transition: 'border-color 0.3s',
})

const FaceIDLabel = styled(Typography)({
  fontSize: 13.5,
  fontWeight: 600,
  lineHeight: 1.2,
  transition: 'color 0.3s',
})

const FaceIDCaption = styled(Typography)({
  fontSize: 11.5,
  color: 'rgba(255,255,255,0.32)',
})

const LegalText = styled(Typography)({
  color: 'rgba(255,255,255,0.55)',
  fontSize: 11,
  textAlign: 'center',
  padding: '0 32px 24px',
  lineHeight: 1.5,
})

const LegalLink = styled('span')({
  color: 'rgba(255,255,255,0.75)',
  textDecoration: 'underline',
})

const EmailArrow = styled('span')({
  color: '#C8FF00',
  marginLeft: '4px',
})

const Spacer = styled(Box)({
  flex: 1,
})

// ─── Biometric button ──────────────────────────────────

function FaceIDButton({ onClick }) {
  const [state, setState] = useState('idle') // idle | scanning | verified

  const handlePress = () => {
    if (state !== 'idle') return
    setState('scanning')
    setTimeout(() => setState('verified'), 1100)
    setTimeout(() => { setState('idle'); onClick?.() }, 2100)
  }

  const color = state === 'verified' ? '#4ade80' : '#C8FF00'
  const borderColor = state === 'verified' ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.10)'

  return (
    <FaceIDButtonRoot
      whileTap={{ scale: 0.90 }}
      onClick={handlePress}
      variant="outlined"
      sx={{ borderColor }}
    >
      {state === 'scanning' ? (
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          style={{ display: 'flex', color }}
        >
          <Fingerprint size={20} color={color} />
        </motion.span>
      ) : state === 'verified' ? (
        <motion.span
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          style={{ display: 'flex' }}
        >
          <Check size={20} color="#4ade80" />
        </motion.span>
      ) : (
        <Fingerprint size={20} color={color} />
      )}
      <Box sx={{ textAlign: 'left' }}>
        <FaceIDLabel sx={{ color: state === 'verified' ? '#4ade80' : 'text.primary' }}>
          {state === 'verified' ? 'Verified' : 'Use Face ID'}
        </FaceIDLabel>
        <FaceIDCaption variant="caption">
          Quick, secure re-entry
        </FaceIDCaption>
      </Box>
    </FaceIDButtonRoot>
  )
}

// ─── Main screen ───────────────────────────────────────

interface AuthProps {
  next: () => void
  back: () => void
  onOAuthLogin?: () => void
}

export default function Auth({ next, back, onOAuthLogin }: AuthProps) {
  return (
    <AuthRoot>

      {/* Back button */}
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

      <AuthBody>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, type: 'spring', stiffness: 300, damping: 28 }}
          style={{ marginBottom: 32 }}
        >
          <AuthHeading>
            Create your account
          </AuthHeading>
          <AuthSubtitle variant="caption">
            Choose how you'd like to get started.
          </AuthSubtitle>
        </motion.div>

        {/* OAuth buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {/* Apple — primary */}
          <OAuthAppleButton
            fullWidth
            variant="contained"
            whileTap={{ scale: 0.97 }}
            onClick={onOAuthLogin || next}
          >
            <AppleIcon />
            Continue with Apple
          </OAuthAppleButton>

          {/* Google — secondary glass */}
          <OAuthGoogleButton
            fullWidth
            variant="outlined"
            whileTap={{ scale: 0.97 }}
            onClick={onOAuthLogin || next}
            sx={{ color: 'text.primary' }}
          >
            <GoogleIcon />
            Continue with Google
          </OAuthGoogleButton>

          {/* Divider */}
          <DividerRow>
            <DividerLine />
            <DividerLabel variant="caption">or</DividerLabel>
            <DividerLine />
          </DividerRow>

          {/* Email — tertiary */}
          <EmailButton
            fullWidth
            variant="text"
            whileTap={{ scale: 0.97 }}
            onClick={next}
          >
            Sign up with Email{' '}
            <EmailArrow>→</EmailArrow>
          </EmailButton>
        </motion.div>

        {/* Sign in link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
        >
          <SignInRow>
            <SignInPromptText variant="caption">
              Already have an account?
            </SignInPromptText>
            <SignInLink
              variant="text"
              whileTap={{ scale: 0.95 }}
              onClick={next}
            >
              Sign in
            </SignInLink>
          </SignInRow>
        </motion.div>

        {/* Returning user section */}
        <BiometricCard
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <BiometricSectionLabel>
            Returning user
          </BiometricSectionLabel>
          <BiometricRow>
            <Box>
              <BiometricTitle>
                Sign in with Face ID
              </BiometricTitle>
              <BiometricCaption variant="caption">
                Instant access to your account
              </BiometricCaption>
            </Box>
            <FaceIDButton onClick={next} />
          </BiometricRow>
        </BiometricCard>

      </AuthBody>

      <Spacer />

      {/* Legal disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.32 }}
      >
        <LegalText>
          By continuing, you agree to our{' '}
          <LegalLink>Terms of Service</LegalLink>
          {' '}and{' '}
          <LegalLink>Privacy Policy</LegalLink>
        </LegalText>
      </motion.div>

    </AuthRoot>
  )
}
