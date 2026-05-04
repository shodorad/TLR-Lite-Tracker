import { motion } from 'framer-motion'
import { MapPin, Route, HeartPulse, Settings } from 'lucide-react'

const TABS = [
  { id: 'home',     label: 'Home',     Icon: MapPin      },
  { id: 'trips',    label: 'Trips',    Icon: Route       },
  { id: 'health',   label: 'Health',   Icon: HeartPulse  },
  { id: 'settings', label: 'Settings', Icon: Settings    },
]

export default function BottomTabs({ current, onNavigate }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 12,
      left: 20,
      right: 20,
      height: 62,
      background: 'rgba(18,22,32,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 28,
      display: 'flex',
      alignItems: 'center',
      paddingTop: 0,
      zIndex: 90,
      boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
    }}>
      {TABS.map(({ id, label, Icon, disabled }) => {
        const isActive = current === id
        const color = disabled
          ? 'rgba(255,255,255,0.18)'
          : isActive
            ? '#C8FF00'
            : 'rgba(255,255,255,0.45)'

        return (
          <motion.button
            key={id}
            whileTap={!disabled ? { scale: 0.88 } : {}}
            onClick={() => !disabled && onNavigate(id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: disabled ? 'default' : 'pointer',
              padding: '10px 0',
              position: 'relative',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                style={{
                  position: 'absolute',
                  inset: 6,
                  borderRadius: 18,
                  background: 'rgba(200,255,0,0.10)',
                  border: '1px solid rgba(200,255,0,0.18)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon size={20} color={color} style={{ position: 'relative', zIndex: 1 }} />
            <span style={{
              fontSize: 9.5,
              fontWeight: isActive ? 700 : 400,
              color,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.2px',
              position: 'relative',
              zIndex: 1,
            }}>
              {label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
