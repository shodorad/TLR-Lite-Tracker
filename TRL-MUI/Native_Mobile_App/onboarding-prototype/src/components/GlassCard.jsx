import { Box } from '@mui/material'
import { glassCard } from '../styles/glass'

export function GlassCard({ children, sx, ...props }) {
  return (
    <Box sx={{ ...glassCard, ...sx }} {...props}>
      {children}
    </Box>
  )
}
