import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import type { BoxProps } from '@mui/material'

const GlassCardRoot = styled(Box)({
  background: 'rgba(255,255,255,0.055)',
  backdropFilter: 'blur(20px) saturate(160%)',
  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 20,
  boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
})

export function GlassCard({ children, sx, ...props }: BoxProps) {
  return (
    <GlassCardRoot sx={sx} {...props}>
      {children}
    </GlassCardRoot>
  )
}
