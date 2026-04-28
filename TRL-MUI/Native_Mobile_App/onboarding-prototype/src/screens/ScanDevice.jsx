import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { CheckCircle2 } from 'lucide-react'
import ProgressBar from './ProgressBar.jsx'
import { glassCard } from '../styles/glass'
import { PrimaryButton } from './SignUp.jsx'
import { useUserContext } from '../context/UserContext.jsx'

const MotionButton = motion(Button)

export default function ScanDevice({ next, back, step, total }) {
  const { setDeviceScanned } = useUserContext()
  const [scanned, setScanned] = useState(false)

  const handleScan = () => {
    setTimeout(() => {
      setScanned(true)
      setDeviceScanned(true)
    }, 1200)
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', pt: '44px', position: 'relative' }}>
      <ProgressBar current={step} total={total} onBack={back} title="Connect Device" />

      <Box sx={{ flex: 1, p: '16px 24px 0', display: 'flex', flexDirection: 'column' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Typography sx={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px', mb: '6px' }}>
            Scan your device
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, mb: '24px' }}>
            Scan the barcode on the back of your TrackLynk OBD-II device.
          </Typography>
        </motion.div>

        {/* Device visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 24 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', gap: 24 }}
        >
          <Box sx={{ position: 'relative' }}>
            {/* Glow ring */}
            {!scanned && (
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: -12, borderRadius: 30, border: '1px solid rgba(200,255,0,0.25)', pointerEvents: 'none' }}
              />
            )}

            {/* OBD device card */}
            <Box sx={{
              ...glassCard,
              width: 160, height: 110, borderRadius: '22px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '10px', position: 'relative', overflow: 'hidden',
            }}>
              <Typography sx={{ position: 'absolute', top: 10, left: 12, right: 12, color: 'rgba(255,255,255,0.25)', fontSize: 9, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'monospace', textAlign: 'center' }}>
                TRACKLYNK OBD-II
              </Typography>

              {/* Barcode */}
              <Box sx={{ display: 'flex', gap: '2.5px', alignItems: 'center', mt: '10px' }}>
                {[8, 4, 7, 3, 9, 4, 6, 3, 8, 5, 7, 4, 6].map((h, i) => (
                  <Box key={i} sx={{ width: 2, height: h * 2.8, bgcolor: 'rgba(255,255,255,0.65)', borderRadius: '1px' }} />
                ))}
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 8, letterSpacing: '1.5px', fontFamily: 'monospace' }}>
                352602116146553
              </Typography>

              {/* Scan line */}
              {!scanned && (
                <motion.div
                  animate={{ top: ['18%', '78%', '18%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', left: 8, right: 8, height: 1.5,
                    background: 'linear-gradient(90deg, transparent, #C8FF00 30%, #C8FF00 70%, transparent)',
                    borderRadius: 99, boxShadow: '0 0 6px rgba(200,255,0,0.7)',
                  }}
                />
              )}

              {/* Status LED */}
              <motion.div
                animate={scanned ? { background: ['#4ade80', '#4ade80'] } : { opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{
                  position: 'absolute', top: 10, right: 12, width: 7, height: 7, borderRadius: '50%',
                  background: scanned ? '#4ade80' : '#C8FF00',
                  boxShadow: scanned ? '0 0 6px rgba(74,222,128,0.8)' : '0 0 6px rgba(200,255,0,0.6)',
                }}
              />
            </Box>

            {/* Success badge */}
            {scanned && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                style={{
                  position: 'absolute', top: -10, right: -10,
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(74,222,128,0.4)',
                }}
              >
                <CheckCircle2 size={18} color="#fff" />
              </motion.div>
            )}
          </Box>

          <AnimatePresence mode="wait">
            {scanned ? (
              <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Box sx={{
                  textAlign: 'center', p: '16px 24px', borderRadius: '18px',
                  bgcolor: 'rgba(74,222,128,0.08)',
                  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(74,222,128,0.2)',
                }}>
                  <Typography sx={{ color: '#4ade80', fontWeight: 700, fontSize: 16 }}>Device validated!</Typography>
                  <Typography variant="caption" sx={{ fontSize: 12.5, mt: '4px', display: 'block' }}>IMEI: 352602116146553</Typography>
                </Box>
              </motion.div>
            ) : (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ fontSize: 13, maxWidth: 240, lineHeight: 1.6 }}>
                  Scan the barcode on the back of the device to pair it
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Primary CTA: Scan (only shown before scanning) */}
          {!scanned && (
            <PrimaryButton onClick={handleScan} label="Scan Barcode" />
          )}
        </motion.div>
      </Box>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Box sx={{ p: '12px 24px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          {scanned ? (
            <PrimaryButton onClick={next} label="Continue →" />
          ) : (
            <MotionButton
              variant="text"
              whileTap={{ scale: 0.96 }}
              onClick={next}
              sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 13.5, fontWeight: 500, py: '6px' }}
            >
              Skip for now
            </MotionButton>
          )}
        </Box>
      </motion.div>
    </Box>
  )
}
