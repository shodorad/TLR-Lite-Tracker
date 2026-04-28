import { useState } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, TextField } from '@mui/material'
import ProgressBar from './ProgressBar.jsx'
import { GlassCard } from '../components/GlassCard.jsx'
import { PrimaryButton } from './SignUp.jsx'
import Car3D from '../components/Car3D.jsx'
import { useUserContext } from '../context/UserContext.jsx'

export default function VehicleDetails({ next, back, step, total }) {
  const { vehicle, setVehicle } = useUserContext()
  const [nickname, setNickname] = useState('')
  const [plate, setPlate] = useState('')

  const hasVehicle = Boolean(vehicle.model || vehicle.vin)
  const displayModel = vehicle.model || vehicle.vin || ''
  const displayName  = nickname || (hasVehicle ? 'My Vehicle' : '')

  const handleContinue = () => {
    if (hasVehicle) {
      setVehicle(v => ({ ...v, nickname: nickname || v.model || 'My Vehicle', plate }))
    }
    next()
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', pt: '44px', position: 'relative' }}>
      <ProgressBar current={step} total={total} onBack={back} title="Vehicle Details" />

      <Box sx={{ flex: 1, p: '16px 24px 0', overflowY: 'auto' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Typography sx={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px', mb: '6px' }}>
            {hasVehicle ? 'Name your vehicle' : 'Vehicle details'}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, mb: '24px' }}>
            {hasVehicle ? 'Optional — helps you identify it in the app.' : 'No vehicle added yet. You can add one later in Settings.'}
          </Typography>
        </motion.div>

        {/* 3D Car preview card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, type: 'spring', stiffness: 280, damping: 26 }}
        >
          <GlassCard sx={{ p: '20px 16px 14px', mb: '22px', position: 'relative', overflow: 'hidden' }}>
            <Box className="car-float" sx={{ position: 'relative', zIndex: 1, opacity: hasVehicle ? 1 : 0.4 }}>
              <Car3D width={310} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: '12px', position: 'relative', zIndex: 1 }}>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                  {hasVehicle ? (displayName || 'My Vehicle') : 'No vehicle added'}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 12 }}>
                  {hasVehicle ? displayModel : 'Add a vehicle to continue setup'}
                </Typography>
              </Box>
              {hasVehicle && (
                <Box sx={{ bgcolor: 'rgba(250,204,21,0.10)', border: '1px solid rgba(250,204,21,0.22)', borderRadius: '99px', p: '4px 12px' }}>
                  <Typography sx={{ color: '#facc15', fontSize: 11, fontWeight: 600 }}>Setting up</Typography>
                </Box>
              )}
            </Box>
          </GlassCard>
        </motion.div>

        {hasVehicle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {/* Nickname */}
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.48)', fontSize: 12, fontWeight: 600, mb: '8px' }}>
                Nickname{' '}
                <Box component="span" sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(optional)</Box>
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Daily Driver, Work Truck..."
                value={nickname}
                onChange={e => setNickname(e.target.value)}
              />
            </Box>

            {/* License plate */}
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.48)', fontSize: 12, fontWeight: 600, mb: '8px' }}>
                License Plate{' '}
                <Box component="span" sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(optional)</Box>
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. ABC 1234"
                value={plate}
                onChange={e => setPlate(e.target.value.toUpperCase())}
                sx={{ '& input': { letterSpacing: plate ? '2.5px' : 0, fontWeight: plate ? 700 : 400 } }}
              />
            </Box>
          </motion.div>
        )}
      </Box>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Box sx={{ p: '20px 24px 48px' }}>
          <PrimaryButton onClick={handleContinue} label="Continue" />
        </Box>
      </motion.div>
    </Box>
  )
}
