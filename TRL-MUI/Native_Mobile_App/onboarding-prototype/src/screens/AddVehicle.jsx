import { useState } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, Button, TextField, InputAdornment } from '@mui/material'
import { Camera, HelpCircle } from 'lucide-react'
import ProgressBar from './ProgressBar.jsx'
import { PrimaryButton } from './SignUp.jsx'
import { useUserContext } from '../context/UserContext.jsx'

const MotionButton = motion(Button)

export default function AddVehicle({ next, back, step, total }) {
  const { setVehicle } = useUserContext()
  const [vin, setVin] = useState('')
  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => { setVin('3TMLB5JN1RM038617'); setScanning(false) }, 1400)
  }

  const isValid = vin.length === 17

  const handleContinue = () => {
    if (isValid) {
      setVehicle(v => ({ ...v, vin, model: 'Toyota Tacoma 2024' }))
    }
    next()
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', pt: '44px', position: 'relative' }}>
      <ProgressBar current={step} total={total} onBack={back} title="Add Your Vehicle" />

      <Box sx={{ flex: 1, p: '16px 24px 0' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Typography sx={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px', mb: '6px' }}>
            Add your vehicle
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, mb: '24px' }}>
            We'll use your VIN to sync device data with your vehicle.
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>

          {/* Scan button */}
          <MotionButton
            fullWidth
            variant="outlined"
            whileTap={{ scale: 0.97 }}
            onClick={handleScan}
            sx={{
              height: 76, borderRadius: '20px', gap: '12px', mb: '18px',
              background: scanning ? 'rgba(200,255,0,0.12)' : 'rgba(200,255,0,0.07)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderStyle: 'dashed',
              borderColor: scanning ? 'rgba(200,255,0,0.7)' : 'rgba(200,255,0,0.3)',
              color: 'primary.main',
              transition: 'all 0.25s',
              '&:hover': { borderColor: 'rgba(200,255,0,0.5)', background: 'rgba(200,255,0,0.09)' },
            }}
          >
            {scanning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ width: 22, height: 22, border: '2.5px solid #C8FF00', borderTopColor: 'transparent', borderRadius: '50%' }}
              />
            ) : (
              <Camera size={20} color="#C8FF00" />
            )}
            <Typography sx={{ color: 'primary.main', fontSize: 15, fontWeight: 600 }}>
              {scanning ? 'Scanning barcode...' : 'Scan VIN barcode'}
            </Typography>
          </MotionButton>

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: '18px' }}>
            <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.07)' }} />
            <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.28)' }}>or type manually</Typography>
            <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.07)' }} />
          </Box>

          {/* VIN input */}
          <Typography sx={{ color: 'rgba(255,255,255,0.48)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', mb: '8px' }}>
            Vehicle Identification Number (VIN)
          </Typography>
          <TextField
            fullWidth
            inputProps={{ maxLength: 17 }}
            placeholder="17 characters, e.g. 3TMLB5JN1RM0..."
            value={vin}
            onChange={e => setVin(e.target.value.toUpperCase())}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ color: isValid ? '#4ade80' : 'text.disabled', fontSize: 11.5, fontWeight: 700 }}>
                    {vin.length}/17
                  </Typography>
                </InputAdornment>
              ),
            }}
            sx={{
              '& input': { letterSpacing: vin ? '1.5px' : 0, fontWeight: vin ? 600 : 400, fontSize: vin ? 13 : 15 },
              '& .MuiOutlinedInput-notchedOutline': isValid ? { borderColor: 'rgba(74,222,128,0.6) !important' } : {},
            }}
          />

          {/* Valid match badge */}
          {isValid && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: '9px', mt: '10px',
                p: '10px 14px', borderRadius: '13px',
                bgcolor: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.2)',
              }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,0.6)', flexShrink: 0 }} />
                <Typography sx={{ color: '#4ade80', fontSize: 13, fontWeight: 600 }}>
                  Match found — Toyota Tacoma 2024
                </Typography>
              </Box>
            </motion.div>
          )}

          {/* VIN hint */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <Box sx={{
              display: 'flex', gap: '10px', mt: '18px', p: '14px', borderRadius: '15px',
              bgcolor: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <HelpCircle size={17} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0, marginTop: 1 }} />
              <Typography variant="body2" sx={{ fontSize: 12.5, lineHeight: 1.65 }}>
                Your VIN is on a sticker inside your driver's door frame, or on the dashboard near the windshield. The barcode scan above reads it automatically.
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      </Box>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Box sx={{ p: '12px 24px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          {isValid ? (
            <PrimaryButton onClick={handleContinue} label="Continue" />
          ) : (
            <>
              <MotionButton
                fullWidth
                variant="text"
                whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
                sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 13.5, fontWeight: 500, py: '6px' }}
              >
                Skip for now
              </MotionButton>
            </>
          )}
        </Box>
      </motion.div>
    </Box>
  )
}
