import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft } from 'lucide-react'
import { PrimaryButton } from '../SignUp'
import { useUserContext } from '../../context/UserContext'

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
  overflowY: 'auto',
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
})

const EmailHighlight = styled('span')({
  color: '#fff',
  fontWeight: 600,
})

const OtpRow = styled(Box)({
  display: 'flex',
  gap: '10px',
  marginTop: '36px',
  marginBottom: '8px',
  justifyContent: 'center',
})

const OtpBox = styled('input')<{ filled: boolean; hasError: boolean }>(({ filled, hasError }) => ({
  width: 46,
  height: 58,
  borderRadius: 16,
  background: 'rgba(255,255,255,0.055)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1.5px solid ${hasError ? 'rgba(255,80,80,0.7)' : filled ? '#C8FF00' : 'rgba(255,255,255,0.10)'}`,
  boxShadow: filled && !hasError ? '0 0 12px rgba(200,255,0,0.18)' : 'none',
  color: '#fff',
  fontSize: 22,
  fontWeight: 700,
  fontFamily: '"Inter", system-ui, sans-serif',
  textAlign: 'center',
  outline: 'none',
  caretColor: '#C8FF00',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  '&:focus': {
    borderColor: hasError ? 'rgba(255,80,80,0.9)' : '#C8FF00',
    boxShadow: hasError ? '0 0 12px rgba(255,80,80,0.15)' : '0 0 14px rgba(200,255,0,0.22)',
  },
}))

const ErrorText = styled(Typography)({
  color: 'rgba(255,80,80,0.9)',
  fontSize: 12,
  textAlign: 'center',
  marginTop: '8px',
})

const ResendRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  marginTop: 24,
})

const ResendPromptText = styled(Typography)({
  fontSize: 13.5,
  color: 'rgba(255,255,255,0.32)',
})

const ResendLink = styled(MotionButton)<{ disabled?: boolean }>(({ disabled }) => ({
  color: disabled ? 'rgba(255,255,255,0.22)' : '#C8FF00',
  fontSize: 13.5,
  fontWeight: 700,
  padding: 0,
  minWidth: 0,
  pointerEvents: disabled ? 'none' : 'auto',
}))

const FooterBox = styled(Box)({
  padding: '20px 24px 48px',
})

const CODE_LENGTH = 6
const RESEND_COOLDOWN = 30

// ─── Props ────────────────────────────────────────────

interface VerifyEmailProps {
  next: () => void
  back: () => void
}

// ─── Screen ───────────────────────────────────────────

export default function VerifyEmail({ next, back }: VerifyEmailProps) {
  const { user } = useUserContext()
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [hasError, setHasError] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const email = user?.email ?? ''
  const code = digits.join('')
  const isFilled = code.length === CODE_LENGTH

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return
    const id = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  // Auto-submit when code is fully entered
  useEffect(() => {
    if (isFilled) handleVerify()
  }, [isFilled]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleVerify = useCallback(() => {
    if (!isFilled) return
    // In production: POST /auth/verify-email { email, code }
    // Simulating success for prototype
    setHasError(false)
    next()
  }, [isFilled, next])

  const handleChange = (index: number, value: string) => {
    // Accept only digits; handle paste of full code
    const sanitized = value.replace(/\D/g, '')
    if (sanitized.length > 1) {
      // Pasted a multi-digit string — distribute across boxes
      const spread = sanitized.slice(0, CODE_LENGTH).split('')
      const next = [...digits]
      spread.forEach((d, i) => { if (index + i < CODE_LENGTH) next[index + i] = d })
      setDigits(next)
      setHasError(false)
      const focusIdx = Math.min(index + spread.length, CODE_LENGTH - 1)
      inputRefs.current[focusIdx]?.focus()
      return
    }

    const updated = [...digits]
    updated[index] = sanitized
    setDigits(updated)
    setHasError(false)

    if (sanitized && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResend = () => {
    if (cooldown > 0) return
    setDigits(Array(CODE_LENGTH).fill(''))
    setHasError(false)
    setCooldown(RESEND_COOLDOWN)
    inputRefs.current[0]?.focus()
    // In production: POST /auth/resend-verification { email }
  }

  const maskedEmail = email
    ? email.replace(/(.{2}).+(@.+)/, '$1•••$2')
    : 'your email'

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

      <Body>
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, type: 'spring', stiffness: 300, damping: 28 }}
        >
          <HeadingText>Verify your email</HeadingText>
          <SubText variant="body2">
            We sent a 6-digit code to{' '}
            <EmailHighlight>{maskedEmail}</EmailHighlight>.
            {' '}Enter it below to continue.
          </SubText>
        </motion.div>

        {/* OTP input row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
        >
          <OtpRow>
            {digits.map((digit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 + i * 0.04 }}
              >
                <OtpBox
                  ref={el => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={digit}
                  filled={!!digit}
                  hasError={hasError}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onFocus={e => e.target.select()}
                  autoFocus={i === 0}
                />
              </motion.div>
            ))}
          </OtpRow>

          {hasError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ErrorText>That code doesn't match. Please try again.</ErrorText>
            </motion.div>
          )}

          {/* Resend */}
          <ResendRow>
            <ResendPromptText variant="caption">Didn't receive it?</ResendPromptText>
            <ResendLink
              variant="text"
              whileTap={cooldown > 0 ? {} : { scale: 0.95 }}
              onClick={handleResend}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}
            </ResendLink>
          </ResendRow>
        </motion.div>
      </Body>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
      >
        <FooterBox>
          <PrimaryButton onClick={handleVerify} label="Verify & continue" disabled={!isFilled} />
        </FooterBox>
      </motion.div>

    </ScreenRoot>
  )
}
