import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { CheckCircle2 } from 'lucide-react'
import ProgressBar from '../../components/ProgressBar'
import { glassCard } from '../../styles/glass'
import { PrimaryButton } from '../SignUp'
import { useUserContext } from '../../context/UserContext'

const MotionButton = motion(Button)

// ─── Styled components ───────────────────────────────────────────────────────

const ScreenRoot = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '16px',
  position: 'relative',
})

const ContentArea = styled(Box)({
  flex: 1,
  padding: '16px 24px 0',
  display: 'flex',
  flexDirection: 'column',
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

const DeviceVisualWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  justifyContent: 'center',
  gap: 24,
})

const DevicePositioner = styled(Box)({
  position: 'relative',
})

// Glow ring: animated opacity/scale stay on motion.div wrapper; static styles here
const GlowRingBase = styled('div')({
  position: 'absolute',
  inset: -12,
  borderRadius: 30,
  border: '1px solid rgba(200,255,0,0.25)',
  pointerEvents: 'none',
})
const MotionGlowRing = motion(GlowRingBase)

const OBDCard = styled(Box)({
  ...glassCard,
  width: 160,
  height: 110,
  borderRadius: '22px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '10px',
  position: 'relative',
  overflow: 'hidden',
})

const DeviceLabel = styled(Typography)({
  position: 'absolute',
  top: 10,
  left: 12,
  right: 12,
  color: 'rgba(255,255,255,0.25)',
  fontSize: 9,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  fontFamily: 'monospace',
  textAlign: 'center',
})

const BarcodeRow = styled(Box)({
  display: 'flex',
  gap: '2.5px',
  alignItems: 'center',
  marginTop: '10px',
})

const BarcodeBar = styled(Box)<{ barheight: number }>(({ barheight }) => ({
  width: 2,
  height: barheight * 2.8,
  backgroundColor: 'rgba(255,255,255,0.65)',
  borderRadius: '1px',
}))

const BarcodeSerial = styled(Typography)({
  color: 'rgba(255,255,255,0.35)',
  fontSize: 8,
  letterSpacing: '1.5px',
  fontFamily: 'monospace',
})

// Scan line: animated `top` stays on motion.div; static styles here
const ScanLineBase = styled('div')({
  position: 'absolute',
  left: 8,
  right: 8,
  height: 1.5,
  background: 'linear-gradient(90deg, transparent, #C8FF00 30%, #C8FF00 70%, transparent)',
  borderRadius: 99,
  boxShadow: '0 0 6px rgba(200,255,0,0.7)',
})
const MotionScanLine = motion(ScanLineBase)

// Status LED: animated `opacity`/`background`/`boxShadow` stay on motion component; static shape here
const StatusLEDBase = styled('div')({
  position: 'absolute',
  top: 10,
  right: 12,
  width: 7,
  height: 7,
  borderRadius: '50%',
})
const MotionStatusLED = motion(StatusLEDBase)

// Success badge: animated `scale` stays on motion component; static styles here
const SuccessBadgeBase = styled('div')({
  position: 'absolute',
  top: -10,
  right: -10,
  width: 34,
  height: 34,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(74,222,128,0.4)',
})
const MotionSuccessBadge = motion(SuccessBadgeBase)

const ValidatedBox = styled(Box)({
  textAlign: 'center',
  padding: '16px 24px',
  borderRadius: '18px',
  backgroundColor: 'rgba(74,222,128,0.08)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(74,222,128,0.2)',
})

const ValidatedTitle = styled(Typography)({
  color: '#4ade80',
  fontWeight: 700,
  fontSize: 16,
})

const ValidatedImei = styled(Typography)({
  fontSize: 12.5,
  marginTop: '4px',
  display: 'block',
})

const HintWrapper = styled('div')({
  textAlign: 'center',
})

const HintText = styled(Typography)({
  fontSize: 13,
  maxWidth: 240,
  lineHeight: 1.6,
})

const FooterArea = styled(Box)({
  padding: '12px 24px 48px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
})

const SkipButton = styled(MotionButton)({
  color: 'rgba(255,255,255,0.38)',
  fontSize: 13.5,
  fontWeight: 500,
  paddingTop: '6px',
  paddingBottom: '6px',
})

// ─────────────────────────────────────────────────────────────────────────────

interface ScanDeviceProps {
  next: () => void
  back: () => void
  step: number
  total: number
}

export default function ScanDevice({ next, back, step, total }: ScanDeviceProps) {
  const { setDeviceScanned } = useUserContext()
  const [scanned, setScanned] = useState(false)

  const handleScan = () => {
    setTimeout(() => {
      setScanned(true)
      setDeviceScanned(true)
    }, 1200)
  }

  return (
    <ScreenRoot>
      <ProgressBar current={step} total={total} onBack={back} title="Connect Device" />

      <ContentArea>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <HeadingText>
            Scan your device
          </HeadingText>
          <SubText variant="body2">
            Scan the barcode on the back of your TrackLynk OBD-II device.
          </SubText>
        </motion.div>

        {/* Device visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 24 }}
        >
          <DeviceVisualWrapper>
            <DevicePositioner>
              {/* Glow ring — opacity/scale animated, static styles in styled component */}
              {!scanned && (
                <MotionGlowRing
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                />
              )}

              {/* OBD device card */}
              <OBDCard>
                <DeviceLabel>
                  TRACKLYNK OBD-II
                </DeviceLabel>

                {/* Barcode */}
                <BarcodeRow>
                  {[8, 4, 7, 3, 9, 4, 6, 3, 8, 5, 7, 4, 6].map((h, i) => (
                    <BarcodeBar key={i} barheight={h} />
                  ))}
                </BarcodeRow>
                <BarcodeSerial>
                  352602116146553
                </BarcodeSerial>

                {/* Scan line — `top` animated, static styles in styled component */}
                {!scanned && (
                  <MotionScanLine
                    animate={{ top: ['18%', '78%', '18%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  />
                )}

                {/* Status LED — opacity/background/boxShadow animated, static shape in styled component */}
                <MotionStatusLED
                  animate={scanned ? { background: ['#4ade80', '#4ade80'] } : { opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{
                    background: scanned ? '#4ade80' : '#C8FF00',
                    boxShadow: scanned ? '0 0 6px rgba(74,222,128,0.8)' : '0 0 6px rgba(200,255,0,0.6)',
                  }}
                />
              </OBDCard>

              {/* Success badge — scale animated, static styles in styled component */}
              {scanned && (
                <MotionSuccessBadge
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                  <CheckCircle2 size={18} color="#fff" />
                </MotionSuccessBadge>
              )}
            </DevicePositioner>

            <AnimatePresence mode="wait">
              {scanned ? (
                <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <ValidatedBox>
                    <ValidatedTitle>Device validated!</ValidatedTitle>
                    <ValidatedImei variant="caption">IMEI: 352602116146553</ValidatedImei>
                  </ValidatedBox>
                </motion.div>
              ) : (
                <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <HintWrapper>
                    <HintText variant="body2">
                      Scan the barcode on the back of the device to pair it
                    </HintText>
                  </HintWrapper>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Primary CTA: Scan (only shown before scanning) */}
            {!scanned && (
              <PrimaryButton onClick={handleScan} label="Scan Barcode" />
            )}
          </DeviceVisualWrapper>
        </motion.div>
      </ContentArea>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <FooterArea>
          {scanned ? (
            <PrimaryButton onClick={next} label="Continue →" />
          ) : (
            <SkipButton
              variant="text"
              whileTap={{ scale: 0.96 }}
              onClick={next}
            >
              Skip for now
            </SkipButton>
          )}
        </FooterArea>
      </motion.div>
    </ScreenRoot>
  )
}
