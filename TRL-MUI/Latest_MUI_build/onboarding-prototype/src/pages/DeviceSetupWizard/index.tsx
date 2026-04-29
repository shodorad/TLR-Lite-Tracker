import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { CheckCircle2, Bluetooth, Zap } from 'lucide-react'
import ProgressBar from '../../components/ProgressBar'
import { glassCard } from '../../styles/glass'
import { PrimaryButton } from '../SignUp'
import { useUserContext } from '../../context/UserContext'

const MotionButton = motion(Button)
const IS_DEV = import.meta.env.DEV

// ─── Styled components ────────────────────────────────────

const WizardRoot = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '16px',
  position: 'relative',
})

const SkipRow = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '0 24px 4px',
})

const SkipButton = styled(MotionButton)({
  color: 'rgba(255,255,255,0.35)',
  fontSize: 13,
  fontWeight: 500,
  padding: '4px 0',
  minWidth: 0,
})

const WizardBody = styled(Box)({
  flex: 1,
  padding: '8px 24px 0',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

const StepDotsRow = styled(Box)({
  display: 'flex',
  gap: '6px',
  justifyContent: 'center',
  marginBottom: '20px',
})

const WizardCTAArea = styled(Box)({
  padding: '16px 24px 48px',
})

const WizardStepTitle = styled(Typography)({
  fontSize: 26,
  fontWeight: 800,
  letterSpacing: '-0.6px',
  textAlign: 'center',
  marginBottom: '6px',
})

const WizardStepSubtitle = styled(Typography)({
  fontSize: 14,
  textAlign: 'center',
})

const VisualCenterBox = styled(Box)({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

// ─── OBD Port Illustration styled parts ───────────────────

const OBDIllustrationColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 20,
})

const OBDCardBox = styled(Box)({
  ...glassCard,
  width: 240,
  height: 160,
  borderRadius: '22px',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const OBDHintBox = styled(Box)({
  backgroundColor: 'rgba(200,255,0,0.07)',
  border: '1px solid rgba(200,255,0,0.20)',
  borderRadius: '16px',
  padding: '14px 18px',
  maxWidth: 280,
  textAlign: 'center',
})

const OBDHintTitle = styled(Typography)({
  fontSize: 12.5,
  fontWeight: 600,
  marginBottom: '4px',
})

const OBDHintBody = styled(Typography)({
  fontSize: 12,
  lineHeight: 1.6,
})

// ─── Plug In Illustration styled parts ────────────────────

const PlugInColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 20,
})

const PlugInCardBox = styled(Box)<{ plugged: boolean }>(({ plugged }) => ({
  ...glassCard,
  width: 200,
  height: 160,
  borderRadius: '22px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
}))

const OBDSocketBox = styled(Box)<{ plugged: boolean }>(({ plugged }) => ({
  position: 'absolute',
  bottom: 32,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 60,
  height: 36,
  borderRadius: '8px',
  backgroundColor: 'rgba(255,255,255,0.06)',
  border: `2px solid ${plugged ? '#4ade80' : 'rgba(255,255,255,0.20)'}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  transition: 'border-color 0.4s',
}))

const SocketPin = styled(Box)<{ plugged: boolean }>(({ plugged }) => ({
  width: 4,
  height: 7,
  backgroundColor: plugged ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.25)',
  borderRadius: '1px',
  transition: 'background 0.4s',
}))

const TracklynkLabel = styled(Typography)({
  color: 'rgba(255,255,255,0.30)',
  fontSize: 6,
  letterSpacing: '0.8px',
  fontFamily: 'monospace',
  textTransform: 'uppercase',
})

const BarRow = styled(Box)({
  display: 'flex',
  gap: '2px',
})

const BarPin = styled('span')<{ barheight: number }>(({ barheight }) => ({
  display: 'inline-block',
  width: 2,
  height: barheight,
  backgroundColor: 'rgba(255,255,255,0.5)',
  borderRadius: '1px',
}))

const SimulateTapText = styled(Typography)({
  color: 'rgba(255,255,255,0.25)',
  fontSize: 10,
})

const PlugInBodyText = styled(Typography)({
  fontSize: 13,
  textAlign: 'center',
  maxWidth: 240,
  lineHeight: 1.6,
})

// ─── Start Engine Illustration styled parts ────────────────

const StartEngineColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 20,
})

const StartEngineTapTarget = styled(Box)({
  cursor: 'pointer',
})

const StartEngineBodyText = styled(Typography)<{ started: boolean }>(({ started }) => ({
  fontSize: 13,
  textAlign: 'center',
  maxWidth: 240,
  lineHeight: 1.6,
  color: started ? '#4ade80' : 'rgba(255,255,255,0.45)',
  transition: 'color 0.4s',
}))

// ─── Bluetooth Illustration styled parts ──────────────────

const BluetoothColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 20,
})

const BluetoothRingContainer = styled(Box)({
  position: 'relative',
  width: 160,
  height: 160,
})

const BluetoothCenterCircle = styled(Box)<{ paired: boolean }>(({ paired }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 72,
  height: 72,
  borderRadius: '50%',
  backgroundColor: paired ? 'rgba(74,222,128,0.12)' : 'rgba(200,255,0,0.08)',
  border: `2px solid ${paired ? 'rgba(74,222,128,0.4)' : 'rgba(200,255,0,0.3)'}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.5s',
}))

const PairedBox = styled(Box)({
  backgroundColor: 'rgba(74,222,128,0.08)',
  border: '1px solid rgba(74,222,128,0.22)',
  borderRadius: '16px',
  padding: '14px 24px',
  textAlign: 'center',
})

const PairedTitle = styled(Typography)({
  color: '#4ade80',
  fontWeight: 700,
  fontSize: 15,
})

const PairedCaption = styled(Typography)({
  fontSize: 12,
  marginTop: '4px',
  display: 'block',
})

const SearchingText = styled(Typography)({
  fontSize: 13,
  lineHeight: 1.6,
})

const PairDeviceButton = styled(MotionButton)({
  gap: '8px',
  padding: '11px 22px',
  borderRadius: '14px',
  backgroundColor: 'rgba(200,255,0,0.10)',
  borderColor: 'rgba(200,255,0,0.28)',
  fontSize: 14,
  fontWeight: 600,
  '&:hover': { backgroundColor: 'rgba(200,255,0,0.14)' },
})

// ─── Step 0: OBD Port Illustration ────────────────────────

function OBDPortIllustration({ onDone }) {
  // Informational only — mark done immediately on mount
  useEffect(() => { onDone() }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 24 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
    >
      <OBDCardBox>
        <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
          <path d="M10 90 Q40 60 110 55 Q180 60 210 90 L210 140 L10 140 Z"
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <rect x="90" y="80" width="40" height="60" rx="6"
            fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
          <circle cx="110" cy="72" r="22" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
          <circle cx="110" cy="72" r="6" fill="rgba(255,255,255,0.10)" />
          <line x1="110" y1="50" x2="110" y2="72" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
          <line x1="88" y1="72" x2="110" y2="72" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
          <line x1="132" y1="72" x2="110" y2="72" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
          <motion.rect
            x="52" y="105" width="38" height="22" rx="5"
            fill="rgba(200,255,0,0.15)" stroke="#C8FF00" strokeWidth="2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          />
          {[0,1,2,3,4].map(i => (
            <rect key={i} x={56 + i * 6} y="112" width="3" height="4" rx="1" fill="rgba(200,255,0,0.6)" />
          ))}
          {[0,1,2,3].map(i => (
            <rect key={i} x={59 + i * 6} y="119" width="3" height="4" rx="1" fill="rgba(200,255,0,0.5)" />
          ))}
          <motion.g animate={{ x: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}>
            <line x1="108" y1="116" x2="96" y2="116" stroke="#C8FF00" strokeWidth="2" strokeLinecap="round" />
            <path d="M98 112 L92 116 L98 120" fill="none" stroke="#C8FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
          <text x="71" y="140" textAnchor="middle" fill="rgba(200,255,0,0.7)" fontSize="7" fontFamily="monospace" letterSpacing="0.5">OBD-II PORT</text>
        </svg>
      </OBDCardBox>

      <OBDHintBox>
        <OBDHintTitle color="primary.main">
          Usually under the dashboard
        </OBDHintTitle>
        <OBDHintBody variant="body2">
          Driver's side, near the steering column. Look for a 16-pin trapezoid socket.
        </OBDHintBody>
      </OBDHintBox>
    </motion.div>
  )
}

// ─── Step 1: Plug In Illustration ─────────────────────────

function PlugInIllustration({ onDone }) {
  const [plugged, setPlugged] = useState(false)

  const handlePlug = () => {
    setPlugged(true)
    onDone()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 24 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
    >
      <PlugInCardBox plugged={plugged} onClick={handlePlug}>
        {/* OBD socket */}
        <OBDSocketBox plugged={plugged}>
          {[0,1,2,3,4].map(i => (
            <SocketPin key={i} plugged={plugged} />
          ))}
        </OBDSocketBox>

        {/* Device */}
        <motion.div
          animate={{ y: plugged ? 28 : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          style={{
            position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)',
            width: 64, height: 44, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(200,255,0,0.12), rgba(200,255,0,0.05))',
            border: '1px solid rgba(200,255,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4,
          }}
        >
          <TracklynkLabel>TRACKLYNK</TracklynkLabel>
          <BarRow>
            {[6,4,7,3,8,4,6].map((h, i) => (
              <BarPin key={i} barheight={h * 1.8} />
            ))}
          </BarRow>
          <motion.div
            animate={plugged ? { background: ['#4ade80', '#4ade80'] } : { opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{
              position: 'absolute', top: 6, right: 7, width: 5, height: 5, borderRadius: '50%',
              background: plugged ? '#4ade80' : '#C8FF00',
              boxShadow: plugged ? '0 0 5px rgba(74,222,128,0.8)' : '0 0 5px rgba(200,255,0,0.6)',
            }}
          />
        </motion.div>

        {plugged && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            style={{
              position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(74,222,128,0.4)',
            }}
          >
            <CheckCircle2 size={14} color="#fff" />
          </motion.div>
        )}

        {IS_DEV && !plugged && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center' }}>
            <SimulateTapText>tap to simulate</SimulateTapText>
          </motion.div>
        )}
      </PlugInCardBox>

      <PlugInBodyText variant="body2">
        Push the device firmly into the OBD-II port until it clicks into place.
      </PlugInBodyText>
    </motion.div>
  )
}

// ─── Step 2: Start Engine Illustration ────────────────────

function StartEngineIllustration({ onDone }) {
  const [started, setStarted] = useState(false)

  const handleStart = () => {
    setStarted(true)
    onDone()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 24 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
    >
      <StartEngineTapTarget onClick={handleStart}>
        <motion.div
          whileTap={{ scale: 0.92 }}
          style={{
            ...glassCard,
            width: 140, height: 140, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            border: `2px solid ${started ? 'rgba(74,222,128,0.40)' : 'rgba(200,255,0,0.25)'}`,
            transition: 'border-color 0.5s',
          }}
        >
          {started && (
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '2px solid rgba(74,222,128,0.4)' }}
            />
          )}
          <svg width="56" height="64" viewBox="0 0 56 64" fill="none">
            <circle cx="28" cy="18" r="16"
              fill={started ? 'rgba(74,222,128,0.15)' : 'rgba(200,255,0,0.10)'}
              stroke={started ? '#4ade80' : '#C8FF00'} strokeWidth="2.5" />
            <circle cx="28" cy="18" r="8" fill={started ? 'rgba(74,222,128,0.20)' : 'rgba(200,255,0,0.15)'} />
            <rect x="25" y="32" width="6" height="24" rx="3" fill={started ? '#4ade80' : '#C8FF00'} opacity={started ? 1 : 0.7} />
            <rect x="31" y="40" width="5" height="4" rx="2" fill={started ? '#4ade80' : '#C8FF00'} opacity={started ? 1 : 0.7} />
            <rect x="31" y="48" width="4" height="4" rx="2" fill={started ? '#4ade80' : '#C8FF00'} opacity={started ? 1 : 0.7} />
          </svg>
          {started && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              style={{
                position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: '50%',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(74,222,128,0.4)',
              }}
            >
              <CheckCircle2 size={13} color="#fff" />
            </motion.div>
          )}
        </motion.div>
      </StartEngineTapTarget>

      <StartEngineBodyText variant="body2" started={started}>
        {started
          ? 'Engine running — device is powering up.'
          : IS_DEV
            ? 'Start your engine to power the TrackLynk device. Tap to simulate.'
            : 'Start your engine to power the TrackLynk device.'}
      </StartEngineBodyText>
    </motion.div>
  )
}

// ─── Step 3: Bluetooth Pairing ─────────────────────────────

function BluetoothIllustration({ onDone }) {
  const [paired, setPaired] = useState(false)

  const handlePair = () => {
    setPaired(true)
    onDone()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 24 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
    >
      <BluetoothRingContainer>
        {!paired && [1, 1.4, 1.8].map((scale, i) => (
          <motion.div
            key={i}
            animate={{ scale: [scale, scale + 0.3], opacity: [0.4, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.5, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(200,255,0,0.35)', margin: 'auto', width: 64, height: 64 }}
          />
        ))}
        <BluetoothCenterCircle paired={paired}>
          {paired ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
              <CheckCircle2 size={28} color="#4ade80" />
            </motion.div>
          ) : (
            <Bluetooth size={28} color="#C8FF00" />
          )}
        </BluetoothCenterCircle>
      </BluetoothRingContainer>

      <AnimatePresence mode="wait">
        {paired ? (
          <motion.div key="paired" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <PairedBox>
              <PairedTitle>TrackLynk Connected!</PairedTitle>
              <PairedCaption variant="caption">Device is syncing data</PairedCaption>
            </PairedBox>
          </motion.div>
        ) : (
          <motion.div key="searching" style={{ textAlign: 'center' }}>
            <SearchingText variant="body2">
              Scanning for your TrackLynk device via Bluetooth…
            </SearchingText>
          </motion.div>
        )}
      </AnimatePresence>

      {!paired && (
        <PairDeviceButton
          variant="outlined"
          whileTap={{ scale: 0.96 }}
          onClick={handlePair}
          color="primary"
        >
          <Zap size={14} /> {IS_DEV ? 'Simulate Pairing' : 'Pair Device'}
        </PairDeviceButton>
      )}
    </motion.div>
  )
}

// ─── Wizard steps config ───────────────────────────────────

const WIZARD_STEPS = [
  { title: 'Find the OBD port',   subtitle: "We'll show you exactly where to look.",        Visual: OBDPortIllustration,    cta: 'Found it →' },
  { title: 'Plug in the device',  subtitle: 'Insert the TrackLynk device into the port.',   Visual: PlugInIllustration,     cta: "It's plugged in →" },
  { title: 'Start your engine',   subtitle: 'Power on the device by starting your car.',    Visual: StartEngineIllustration, cta: 'Engine is running →' },
  { title: 'Bluetooth pairing',   subtitle: 'Connect to the device to confirm setup.',      Visual: BluetoothIllustration,  cta: 'All done →' },
]

// ─── Main screen ───────────────────────────────────────────

interface DeviceSetupWizardProps {
  next: () => void
  back: () => void
  step: number
  total: number
}

export default function DeviceSetupWizard({ next, back, step, total }: DeviceSetupWizardProps) {
  const { setDeviceReady } = useUserContext()
  const [wizardStep, setWizardStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [stepDone, setStepDone] = useState(true) // step 0 is informational → done by default

  const advance = () => {
    if (!stepDone) return
    if (wizardStep < WIZARD_STEPS.length - 1) {
      setDir(1)
      setStepDone(false) // disabled until next step's illustration fires onDone
      setWizardStep(s => s + 1)
    } else {
      setDeviceReady(true)
      next()
    }
  }

  const goBack = () => {
    if (wizardStep > 0) { setDir(-1); setWizardStep(s => s - 1); setStepDone(true) }
    else back()
  }

  const handleSkip = () => {
    const confirmed = window.confirm('Skip the setup guide? Your device won\'t be configured until you complete this step.')
    if (confirmed) next()
  }

  const handleStepDone = () => setStepDone(true)

  const { title, subtitle, Visual, cta } = WIZARD_STEPS[wizardStep]

  const slideVariants = {
    enter: d => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   d => ({ x: d > 0 ? '-60%' : '60%', opacity: 0 }),
  }

  return (
    <WizardRoot>
      <ProgressBar current={step} total={total} onBack={goBack} title="Device Setup" />

      {/* Skip guide */}
      <SkipRow>
        <SkipButton
          variant="text"
          whileTap={{ scale: 0.95 }}
          onClick={handleSkip}
        >
          Skip guide →
        </SkipButton>
      </SkipRow>

      <WizardBody>
        {/* Step dots */}
        <StepDotsRow>
          {WIZARD_STEPS.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === wizardStep ? 20 : 6, background: i === wizardStep ? '#C8FF00' : 'rgba(255,255,255,0.18)' }}
              style={{ height: 6, borderRadius: 99 }}
            />
          ))}
        </StepDotsRow>

        <AnimatePresence custom={dir} mode="popLayout" initial={false}>
          <motion.div
            key={wizardStep}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}
          >
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ textAlign: 'center', marginBottom: 20 }}>
              <WizardStepTitle>
                {title}
              </WizardStepTitle>
              <WizardStepSubtitle variant="body2">
                {subtitle}
              </WizardStepSubtitle>
            </motion.div>

            <VisualCenterBox>
              <Visual onDone={handleStepDone} />
            </VisualCenterBox>
          </motion.div>
        </AnimatePresence>
      </WizardBody>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <WizardCTAArea>
          <AnimatePresence mode="wait">
            <motion.div
              key={`cta-${wizardStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <PrimaryButton onClick={advance} label={cta} disabled={!stepDone} />
            </motion.div>
          </AnimatePresence>
        </WizardCTAArea>
      </motion.div>
    </WizardRoot>
  )
}
