import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { styled } from '@mui/material/styles'
import { MapPin, Route, User, Settings, MessageSquare } from 'lucide-react'

// ─── Styled primitives ───────────────────────────────────────────────────────

const TabBarWrapper = styled('div')({
  position: 'absolute',
  bottom: 12,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(560px, calc(100% - 40px))',
  zIndex: 100,
})

const TabBar = styled('div')({
  height: 62,
  background: 'rgba(18,22,32,0.92)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 28,
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
  overflow: 'hidden',
})

const TabButtonBase = styled('button')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3,
  background: 'none',
  border: 'none',
  padding: '10px 0',
  position: 'relative',
})

const MotionTabButton = motion(TabButtonBase)

const ActiveIndicatorBase = styled('div')({
  position: 'absolute',
  inset: 6,
  borderRadius: 18,
  background: 'rgba(200,255,0,0.10)',
  border: '1px solid rgba(200,255,0,0.18)',
})

const MotionActiveIndicator = motion(ActiveIndicatorBase)

const TabLabel = styled('span')({
  fontSize: 9.5,
  fontFamily: 'Inter, sans-serif',
  letterSpacing: '0.2px',
  position: 'relative',
  zIndex: 1,
})

const ToastPopupBase = styled('div')({
  position: 'absolute',
  bottom: 70,
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(18,22,32,0.95)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 12,
  padding: '8px 16px',
  whiteSpace: 'nowrap',
})

const MotionToastPopup = motion(ToastPopupBase)

const ToastText = styled('span')({
  color: 'rgba(255,255,255,0.70)',
  fontSize: 13,
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
})

// ─── Data ─────────────────────────────────────────────────────────────────────

const LEFT_TABS = [
  { id: 'home',  label: 'Home',  Icon: MapPin  },
  { id: 'trips', label: 'Trips', Icon: Route   },
]

const RIGHT_TABS = [
  { id: 'profile',  label: 'Profile',  Icon: User,     disabled: true },
  { id: 'settings', label: 'Settings', Icon: Settings  },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface BottomTabsProps {
  current: string
  onNavigate: (id: string) => void
  onChatOpen?: () => void
  chatActive?: boolean
}

export default function BottomTabs({ current, onNavigate, onChatOpen, chatActive }: BottomTabsProps) {
  const [toast, setToast] = useState(false)

  const handleProfileTap = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  const renderTab = ({ id, label, Icon, disabled = false }) => {
    const isActive = current === id
    const color = disabled
      ? 'rgba(255,255,255,0.18)'
      : isActive
        ? '#C8FF00'
        : 'rgba(255,255,255,0.45)'

    return (
      <MotionTabButton
        key={id}
        whileTap={!disabled ? { scale: 0.88 } : {}}
        onClick={() => {
          if (disabled) { handleProfileTap(); return }
          onNavigate(id)
        }}
        style={{ cursor: disabled ? 'default' : 'pointer' }}
      >
        {isActive && (
          <MotionActiveIndicator
            layoutId="tab-indicator"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <Icon size={20} color={color} style={{ position: 'relative', zIndex: 1 }} />
        <TabLabel style={{ fontWeight: isActive ? 700 : 400, color }}>
          {label}
        </TabLabel>
      </MotionTabButton>
    )
  }

  return (
    <TabBarWrapper>
      {/* "Coming soon" toast */}
      <AnimatePresence>
        {toast && (
          <MotionToastPopup
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <ToastText>Profile coming soon</ToastText>
          </MotionToastPopup>
        )}
      </AnimatePresence>

      <TabBar>
        {/* Left tabs */}
        {LEFT_TABS.map(tab => renderTab(tab))}

        {/* Center AI tab */}
        <MotionTabButton
          whileTap={{ scale: 0.88 }}
          onClick={onChatOpen}
          style={{ cursor: 'pointer' }}
        >
          {chatActive && (
            <MotionActiveIndicator
              layoutId="tab-indicator"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <MessageSquare size={20} color={chatActive ? '#C8FF00' : 'rgba(255,255,255,0.45)'} style={{ position: 'relative', zIndex: 1 }} />
          <TabLabel style={{ fontWeight: chatActive ? 700 : 400, color: chatActive ? '#C8FF00' : 'rgba(255,255,255,0.45)' }}>
            Ask AI
          </TabLabel>
        </MotionTabButton>

        {/* Right tabs */}
        {RIGHT_TABS.map(tab => renderTab(tab))}
      </TabBar>
    </TabBarWrapper>
  )
}
