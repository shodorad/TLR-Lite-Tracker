import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Route, User, Settings } from 'lucide-react'

const TABS = [
  { id: 'home',     label: 'Home',     Icon: MapPin   },
  { id: 'trips',    label: 'Trips',    Icon: Route    },
  { id: 'profile',  label: 'Profile',  Icon: User,    disabled: true },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

export default function BottomTabs({ current, onNavigate }) {
  const [toast, setToast] = useState(false)

  const handleProfileTap = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  return (
    <div style={{ position: 'absolute', bottom: 12, left: 20, right: 20 }}>
      {/* "Coming soon" toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={{
              position: 'absolute', bottom: 70, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(18,22,32,0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 12, padding: '8px 16px',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.70)', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              Profile coming soon
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        height: 62,
        background: 'rgba(18,22,32,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 28,
        display: 'flex',
        alignItems: 'center',
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
              onClick={() => {
                if (disabled) { handleProfileTap(); return }
                onNavigate(id)
              }}
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
    </div>
  )
}
