import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft, Mail } from 'lucide-react'
import { PrimaryButton } from '../SignUp'

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

const Body = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
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
  lineHeight: 1.6,
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

const EnvelopeRing = styled(motion.div)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '50%',
  border: '1.5px solid rgba(200,255,0,0.25)',
})

const EnvelopeCircle = styled(Box)({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: 'rgba(200,255,0,0.10)',
  border: '1px solid rgba(200,255,0,0.20)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 1,
})

const SentEmailText = styled(Typography)({
  fontSize: 14,
  color: '#C8FF00',
  fontWeight: 600,
  textAlign: 'center',
  marginTop: 4,
})

const ResendRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  marginTop: 16,
})

const ResendPromptText = styled(Typography)({
  fontSize: 13.5,
  color: 'rgba(255,255,255,0.32)',
})

const ResendLink = styled(MotionButton)({
  color: '#C8FF00',
  fontSize: 13.5,
  fontWeight: 700,
  padding: 0,
  minWidth: 0,
})

const BackToSignInLink = styled(MotionButton)({
  color: 'rgba(255,255,255,0.55)',
  fontSize: 13.5,
  fontWeight: 600,
  padding: 0,
  minWidth: 0,
})

const FooterBox = styled(Box)({
  padding: '20px 24px 48px',
})

// ─── Validation ───────────────────────────────────────

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── Props ────────────────────────────────────────────

interface ForgotPasswordProps {
  back: () => void
}

// ─── Screen ───────────────────────────────────────────

export default function ForgotPassword({ back }: ForgotPasswordProps) {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'sent'>('idle')

  const emailError = !emailRe.test(email) ? 'Enter a valid email' : null
  const isValid = emailError === null

  const handleSend = () => {
    if (!isValid) return
    setPhase('sent')
  }

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

      <AnimatePresence mode="wait">

        {phase === 'idle' ? (

          // ── Form state ─────────────────────────────
          <motion.div
            key="idle"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Body>
              <motion.div
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, type: 'spring', stiffness: 300, damping: 28 }}
              >
                <HeadingText>Forgot password?</HeadingText>
                <SubText variant="body2">
                  Enter your email and we'll send you a link to reset your password.
                </SubText>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
              >
                <FieldLabelText>Email address</FieldLabelText>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="jane@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                />
                {touched && emailError && (
                  <FieldErrorText>{emailError}</FieldErrorText>
                )}
              </motion.div>
            </Body>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <FooterBox>
                <PrimaryButton onClick={handleSend} label="Send reset link" disabled={touched && !isValid} />
              </FooterBox>
            </motion.div>
          </motion.div>

        ) : (

          // ── Sent confirmation state ────────────────
          <motion.div
            key="sent"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 80px' }}
          >
            {/* Animated envelope icon */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.08 }}
              style={{ position: 'relative', marginBottom: 32 }}
            >
              {[96, 118, 140].map((size, i) => (
                <EnvelopeRing
                  key={size}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: [0, 0.5, 0] }}
                  transition={{ delay: 0.3 + i * 0.18, duration: 1.6, ease: 'easeOut' }}
                  style={{ width: size, height: size }}
                />
              ))}
              <EnvelopeCircle>
                <Mail size={32} color="#C8FF00" strokeWidth={1.5} />
              </EnvelopeCircle>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ textAlign: 'center' }}
            >
              <Typography sx={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.6px', mb: '10px' }}>
                Check your inbox
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 14.5, lineHeight: 1.65, maxWidth: 280, mx: 'auto', mb: 0 }}>
                We sent a password reset link to
              </Typography>
              <SentEmailText>{email}</SentEmailText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <ResendRow>
                <ResendPromptText variant="caption">Didn't receive it?</ResendPromptText>
                <ResendLink
                  variant="text"
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                >
                  Resend
                </ResendLink>
              </ResendRow>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <BackToSignInLink
                  variant="text"
                  whileTap={{ scale: 0.95 }}
                  onClick={back}
                >
                  ← Back to sign in
                </BackToSignInLink>
              </Box>
            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </ScreenRoot>
  )
}
