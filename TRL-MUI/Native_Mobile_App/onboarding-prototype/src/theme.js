import { createTheme, alpha } from '@mui/material/styles'

const lime  = '#C8FF00'
const olive = '#8FB800'
const green = '#4ade80'
const yellow = '#facc15'
const bg     = '#04050d'
const surface = '#0d0d14'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: lime,  dark: olive,  contrastText: '#000' },
    secondary: { main: green },
    warning:   { main: yellow },
    background: { default: bg, paper: surface },
    text: {
      primary:  '#ffffff',
      secondary: 'rgba(255,255,255,0.70)',
      disabled:  'rgba(255,255,255,0.38)',
    },
  },

  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    // MUI has no built-in 900 token — define it explicitly and always use this, never 'bold'
    fontWeightBlack: 900,
    h1: { fontWeight: 900, fontSize: '2.5rem' },
    h2: { fontWeight: 800, fontSize: '2rem' },
    h3: { fontWeight: 700, fontSize: '1.5rem' },
    h4: { fontWeight: 700, fontSize: '1.25rem' },
    body1: { lineHeight: 1.6 },
    body2: { color: 'rgba(255,255,255,0.70)' },
    button: { fontWeight: 600, textTransform: 'none' },
    caption: { color: 'rgba(255,255,255,0.38)' },
  },

  shape: { borderRadius: 16 },
  spacing: 4, // 4px base — spacing(6) = 24px (matches screen padding)

  components: {
    // Body background — must use @global form or CssBaseline's own rule wins
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: bg },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true, variant: 'contained' },
      styleOverrides: {
        root: {
          borderRadius: 99,
          padding: '14px 24px',
          fontSize: '1rem',
          fontWeight: 600,
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${lime} 0%, ${olive} 100%)`,
          color: '#000',
          boxShadow: `0 8px 32px ${alpha(lime, 0.30)}, inset 0 1px 0 ${alpha('#fff', 0.25)}`,
          '&:hover': {
            background: `linear-gradient(135deg, ${lime} 0%, ${olive} 100%)`,
            boxShadow: `0 12px 40px ${alpha(lime, 0.45)}`,
          },
        },
        outlined: {
          borderRadius: 18,
          borderColor: 'rgba(255,255,255,0.10)',
          '&:hover': { borderColor: 'rgba(255,255,255,0.25)' },
        },
        sizeLarge: { padding: '16px 32px', fontSize: '1.0625rem' },
        sizeSmall: { padding: '8px 16px', fontSize: '0.875rem', borderRadius: 99 },
      },
    },

    // Chip — pill sizing (MUI default 32px is too short for this design's 36px pills)
    MuiChip: {
      styleOverrides: {
        root: { height: 36, borderRadius: 99 },
        label: { padding: '0 13px' },
      },
    },

    // Avatar — override circle default to rounded-square
    // Individual instances needing smaller radius use sx={{ borderRadius: '10px' }}
    MuiAvatar: {
      styleOverrides: {
        root: { borderRadius: 13 },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(255,255,255,0.055)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.10)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.25)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: lime,
          },
        },
        input: { color: '#fff' },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.38)',
          '&.Mui-focused': { color: lime },
        },
      },
    },

    // Bottom navigation — glass blur + lime selected
    // Note: do NOT put layoutId Framer indicator inside BottomNavigationAction —
    // overflow:hidden on the root clips it. Keep custom BottomTabs.jsx instead.
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 28,
          boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
          height: 64,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.38)',
          minWidth: 0,
          '&.Mui-selected': { color: lime },
        },
      },
    },

    // List components (Settings rows)
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&:hover': { background: 'rgba(255,255,255,0.06)' },
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          background: 'transparent',
          color: 'rgba(255,255,255,0.38)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.07)' },
      },
    },

    // LinearProgress — used for ProgressBar replacement
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 4,
          borderRadius: 99,
          backgroundColor: 'rgba(255,255,255,0.10)',
        },
        bar: {
          borderRadius: 99,
          background: `linear-gradient(90deg, ${lime}, ${olive})`,
        },
      },
    },
  },
})

export default theme
