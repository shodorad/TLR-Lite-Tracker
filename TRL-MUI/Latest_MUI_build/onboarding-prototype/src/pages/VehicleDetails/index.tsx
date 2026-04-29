import { useState } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import ProgressBar from '../../components/ProgressBar'
import { GlassCard } from '../../components/GlassCard'
import { PrimaryButton } from '../SignUp'
import Car3D from '../../components/Car3D'
import { useUserContext } from '../../context/UserContext'

// ─── Styled Components ────────────────────────────────

const ScreenRoot = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '16px',
  position: 'relative',
})

const ScrollArea = styled(Box)({
  flex: 1,
  padding: '16px 24px 0',
  overflowY: 'auto',
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

interface CarPreviewBoxProps {
  hasVehicle?: boolean
}

const CarPreviewBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'hasVehicle',
})<CarPreviewBoxProps>(({ hasVehicle }) => ({
  position: 'relative',
  zIndex: 1,
  opacity: hasVehicle ? 1 : 0.4,
}))

const VehicleInfoRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '12px',
  position: 'relative',
  zIndex: 1,
})

const VehicleNameText = styled(Typography)({
  fontWeight: 700,
  fontSize: 15,
})

const FieldsColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
})

const MotionFieldsColumn = motion(FieldsColumn)

const VehicleModelCaption = styled(Typography)({
  fontSize: 12,
})

const SetupBadge = styled(Box)({
  backgroundColor: 'rgba(250,204,21,0.10)',
  border: '1px solid rgba(250,204,21,0.22)',
  borderRadius: '99px',
  padding: '4px 12px',
})

const SetupBadgeLabel = styled(Typography)({
  color: '#facc15',
  fontSize: 11,
  fontWeight: 600,
})

const FieldLabelText = styled(Typography)({
  color: 'rgba(255,255,255,0.48)',
  fontSize: 12,
  fontWeight: 600,
  marginBottom: '8px',
})

const OptionalSpan = styled(Box)({
  color: 'rgba(255,255,255,0.2)',
  fontWeight: 400,
  display: 'inline',
})

const FooterBox = styled(Box)({
  padding: '20px 24px 48px',
})

// ─── Component ────────────────────────────────────────

interface VehicleDetailsProps {
  next: () => void
  back: () => void
  step: number
  total: number
}

export default function VehicleDetails({ next, back, step, total }: VehicleDetailsProps) {
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
    <ScreenRoot>
      <ProgressBar current={step} total={total} onBack={back} title="Vehicle Details" />

      <ScrollArea>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <HeadingText>
            {hasVehicle ? 'Name your vehicle' : 'Vehicle details'}
          </HeadingText>
          <SubText variant="body2">
            {hasVehicle ? 'Optional — helps you identify it in the app.' : 'No vehicle added yet. You can add one later in Settings.'}
          </SubText>
        </motion.div>

        {/* 3D Car preview card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, type: 'spring', stiffness: 280, damping: 26 }}
        >
          <GlassCard sx={{ p: '20px 16px 14px', mb: '22px', position: 'relative', overflow: 'hidden' }}>
            <CarPreviewBox className="car-float" hasVehicle={hasVehicle}>
              <Car3D width={310} />
            </CarPreviewBox>

            <VehicleInfoRow>
              <Box>
                <VehicleNameText>
                  {hasVehicle ? (displayName || 'My Vehicle') : 'No vehicle added'}
                </VehicleNameText>
                <VehicleModelCaption variant="caption">
                  {hasVehicle ? displayModel : 'Add a vehicle to continue setup'}
                </VehicleModelCaption>
              </Box>
              {hasVehicle && (
                <SetupBadge>
                  <SetupBadgeLabel>Setting up</SetupBadgeLabel>
                </SetupBadge>
              )}
            </VehicleInfoRow>
          </GlassCard>
        </motion.div>

        {hasVehicle && (
          <MotionFieldsColumn
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            {/* Nickname */}
            <Box>
              <FieldLabelText>
                Nickname{' '}
                <OptionalSpan component="span">(optional)</OptionalSpan>
              </FieldLabelText>
              <TextField
                fullWidth
                placeholder="e.g. Daily Driver, Work Truck..."
                value={nickname}
                onChange={e => setNickname(e.target.value)}
              />
            </Box>

            {/* License plate */}
            <Box>
              <FieldLabelText>
                License Plate{' '}
                <OptionalSpan component="span">(optional)</OptionalSpan>
              </FieldLabelText>
              <TextField
                fullWidth
                placeholder="e.g. ABC 1234"
                value={plate}
                onChange={e => setPlate(e.target.value.toUpperCase())}
                sx={{ '& input': { letterSpacing: plate ? '2.5px' : 0, fontWeight: plate ? 700 : 400 } }}
              />
            </Box>
          </MotionFieldsColumn>
        )}
      </ScrollArea>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <FooterBox>
          <PrimaryButton onClick={handleContinue} label="Continue" />
        </FooterBox>
      </motion.div>
    </ScreenRoot>
  )
}
