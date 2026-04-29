import { motion } from 'framer-motion'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { MapPin, Bell, Route, Plug } from 'lucide-react'
import { GlassCard } from '../../components/GlassCard'
import { PrimaryButton } from '../SignUp'
import Car3D from '../../components/Car3D'
import { useUserContext } from '../../context/UserContext'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.65 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 360, damping: 28 } },
}

// ─── Styled components ───────────────────────────────────────────────────────

const ScreenRoot = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '16px',
  position: 'relative',
  overflow: 'hidden',
})

const ScrollArea = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '32px 24px 0',
  overflowY: 'auto',
})

const CheckmarkContainer = styled('div')({
  position: 'relative',
  marginBottom: 24,
})

const RippleRing = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  borderRadius: '50%',
  border: '1.5px solid #4ade80',
})

const CheckmarkCircle = styled(Box)({
  width: 72,
  height: 72,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #22c55e, #15803d)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 1,
  boxShadow: '0 8px 32px rgba(74,222,128,0.38)',
})

const TitleBlock = styled('div')({
  textAlign: 'center',
  marginBottom: 8,
})

const TitleText = styled(Typography)({
  fontSize: 30,
  fontWeight: 900,
  letterSpacing: '-0.8px',
  marginBottom: '8px',
})

const SubTitleText = styled(Typography)({
  fontSize: 14.5,
  maxWidth: 260,
  lineHeight: 1.65,
})

const ChipsRow = styled(Box)({
  display: 'flex',
  gap: '8px',
  margin: '18px 0 24px',
  flexWrap: 'wrap',
  justifyContent: 'center',
})

const CarPreviewCard = styled(GlassCard)({
  width: '100%',
  padding: '16px 12px 10px',
  marginBottom: '20px',
  position: 'relative',
})

const CarGlowBase = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 200,
  height: 30,
  background: 'radial-gradient(ellipse, rgba(74,222,128,0.12) 0%, transparent 70%)',
  filter: 'blur(8px)',
  pointerEvents: 'none',
})

const CarWrapper = styled(Box)({
  position: 'relative',
  zIndex: 1,
})

const NextStepsList = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 9,
})

const SectionLabel = styled(Typography)({
  color: 'rgba(255,255,255,0.28)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  marginBottom: '4px',
})

const NextStepCard = styled(Box)({
  display: 'flex',
  gap: '14px',
  padding: '13px 15px',
  borderRadius: '17px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.09)',
  alignItems: 'flex-start',
})

const NextStepIconBox = styled(Box)({
  width: 36,
  height: 36,
  borderRadius: '11px',
  flexShrink: 0,
  backgroundColor: 'rgba(200,255,0,0.1)',
  border: '1px solid rgba(200,255,0,0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const NextStepTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: 13.5,
  marginBottom: '2px',
})

const NextStepDesc = styled(Typography)({
  fontSize: 12,
  lineHeight: 1.55,
})

const FooterArea = styled(Box)({
  padding: '18px 24px 48px',
})

// ─── StatusChip ──────────────────────────────────────────────────────────────

const ChipRoot = styled(Box)<{ dimcolor: string }>(({ dimcolor }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 14px',
  borderRadius: '99px',
  backgroundColor: `rgba(${dimcolor}, 0.09)`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid rgba(${dimcolor}, 0.20)`,
}))

const ChipDot = styled(Box)<{ dotcolor: string }>(({ dotcolor }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: dotcolor,
  boxShadow: `0 0 6px ${dotcolor}99`,
  flexShrink: 0,
}))

const ChipLabel = styled(Typography)<{ labelcolor: string }>(({ labelcolor }) => ({
  color: labelcolor,
  fontSize: 12.5,
  fontWeight: 600,
}))

function StatusChip({ label, color, dimColor }: { label: string; color: string; dimColor: string }) {
  return (
    <ChipRoot dimcolor={dimColor}>
      <ChipDot dotcolor={color} />
      <ChipLabel labelcolor={color}>{label}</ChipLabel>
    </ChipRoot>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface SuccessProps {
  goTo: (i: number) => void
  onEnterApp: () => void
}

export default function Success({ goTo, onEnterApp }: SuccessProps) {
  const { deviceReady, plan } = useUserContext()

  const deviceLabel = deviceReady ? 'Device ready' : 'Device pending setup'
  const deviceColor = deviceReady ? '#4ade80' : '#facc15'
  const deviceDim   = deviceReady ? '74,222,128' : '250,204,21'

  const planLabel = plan
    ? `${plan.type === 'annual' ? 'Annual' : 'Monthly'} plan active`
    : 'Trial active'
  const planColor = plan ? '#4ade80' : '#facc15'
  const planDim   = plan ? '74,222,128' : '250,204,21'

  const next_steps = [
    deviceReady
      ? { icon: Route,  title: 'Start driving',        desc: 'Your first trip will appear within minutes.' }
      : { icon: Plug,   title: 'Plug in your device',   desc: 'Insert it into the OBD port under your dashboard.' },
    { icon: Route, title: 'Take your first trip',    desc: 'Trip history updates automatically after each drive.' },
    { icon: Bell,  title: 'Set up alerts',            desc: 'Geofences, speed limits, trip notifications.' },
  ]

  return (
    <ScreenRoot>

      <ScrollArea>

        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        >
          <CheckmarkContainer>
            {[72, 90, 108].map((size, i) => (
              <motion.div
                key={size}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: [0, 0.18, 0] }}
                transition={{ delay: 0.35 + i * 0.15, duration: 1.4, ease: 'easeOut' }}
              >
                <RippleRing style={{ width: size, height: size }} />
              </motion.div>
            ))}
            <CheckmarkCircle>
              <motion.svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <motion.path
                  d="M6 17L13 24L26 9" stroke="white" strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
                />
              </motion.svg>
            </CheckmarkCircle>
          </CheckmarkContainer>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <TitleBlock>
            <TitleText>
              You're all set!
            </TitleText>
            <SubTitleText variant="body2">
              Your TrackLynk account is active and ready.
            </SubTitleText>
          </TitleBlock>
        </motion.div>

        {/* Status chips — state-driven */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }}>
          <ChipsRow>
            <StatusChip label={planLabel}   color={planColor}   dimColor={planDim}   />
            <StatusChip label={deviceLabel} color={deviceColor} dimColor={deviceDim} />
          </ChipsRow>
        </motion.div>

        {/* Mini car preview */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ width: '100%' }}>
          <CarPreviewCard>
            <CarGlowBase />
            <CarWrapper className="car-float">
              <Car3D width={260} glowColor="#4ade80" />
            </CarWrapper>
          </CarPreviewCard>
        </motion.div>

        {/* What's next */}
        <motion.div variants={container} initial="hidden" animate="show" style={{ width: '100%' }}>
          <NextStepsList>
            <SectionLabel>
              What's next
            </SectionLabel>
            {next_steps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} variants={item}>
                <NextStepCard>
                  <NextStepIconBox>
                    <Icon size={17} color="#C8FF00" />
                  </NextStepIconBox>
                  <Box>
                    <NextStepTitle>{i + 1}. {title}</NextStepTitle>
                    <NextStepDesc variant="caption">{desc}</NextStepDesc>
                  </Box>
                </NextStepCard>
              </motion.div>
            ))}
          </NextStepsList>
        </motion.div>
      </ScrollArea>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <FooterArea>
          <PrimaryButton onClick={onEnterApp} label="Open TrackLynk" />
        </FooterArea>
      </motion.div>
    </ScreenRoot>
  )
}
