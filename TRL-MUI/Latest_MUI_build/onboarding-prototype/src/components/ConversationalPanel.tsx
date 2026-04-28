import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button, InputBase } from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  Zap, Route, AlertTriangle, MapPin, Gauge, Wifi,
  Mic, Send, BatteryMedium, Cpu, History, X,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Framer-motion wrapped MUI components
// ---------------------------------------------------------------------------
const MotionButton = motion(Button)

// ---------------------------------------------------------------------------
// Styled: outer panel shell (static styles only; animated width stays inline)
// ---------------------------------------------------------------------------
const PanelShell = styled('div')({
  height: '100%',
  flexShrink: 0,
  overflow: 'hidden',
  background: 'rgba(8,10,18,0.97)',
  borderLeft: '1px solid rgba(255,255,255,0.08)',
  display: 'flex',
  flexDirection: 'column',
})

// Fixed-width inner wrapper so content doesn't squish during animation
const PanelInner = styled('div')({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
})

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
const PanelHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 14px 12px',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  flexShrink: 0,
})

const PanelTitle = styled(Typography)({
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: '-0.3px',
})

const PanelSubtitle = styled(Typography)({
  color: 'rgba(255,255,255,0.30)',
  fontSize: 11,
  marginTop: '1px',
})

const CloseBtn = styled(MotionButton)({
  minWidth: 0,
  width: 32,
  height: 32,
  borderRadius: '50%',
  padding: 0,
  backgroundColor: 'rgba(255,255,255,0.07)',
  borderColor: 'rgba(255,255,255,0.10)',
})

// ---------------------------------------------------------------------------
// KPI strip
// ---------------------------------------------------------------------------
const KpiStrip = styled(Box)({
  flexShrink: 0,
  padding: '10px 14px 6px',
})

const KpiRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '8px',
})

const KpiChipGroup = styled(Box)({
  display: 'flex',
  gap: '5px',
  flex: 1,
  flexWrap: 'wrap',
})

interface KpiChipRootProps {
  isok: string // 'true' | 'false' — avoid boolean DOM prop warning
}
const KpiChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isok',
})<KpiChipRootProps>(({ isok }) => {
  const ok = isok === 'true'
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: ok ? 'rgba(255,255,255,0.05)' : 'rgba(200,255,0,0.08)',
    border: `1px solid ${ok ? 'rgba(255,255,255,0.08)' : 'rgba(200,255,0,0.22)'}`,
    borderRadius: '99px',
    padding: '5px 8px',
  }
})

interface KpiChipLabelProps {
  isok: string
}
const KpiChipLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isok',
})<KpiChipLabelProps>(({ isok }) => ({
  color: isok === 'true' ? '#4ade80' : '#C8FF00',
  fontSize: 10,
  fontWeight: 700,
}))

const StatGroup = styled(Box)({
  display: 'flex',
  gap: '10px',
})

const StatItem = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const StatValue = styled(Typography)({
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '-0.3px',
  lineHeight: 1,
})

const StatUnit = styled('span')({
  fontSize: 8.5,
  fontWeight: 500,
  color: 'rgba(255,255,255,0.30)',
  marginLeft: '1px',
})

const StatLabel = styled(Typography)({
  color: 'rgba(255,255,255,0.25)',
  fontSize: 8,
  marginTop: '1px',
})

// ---------------------------------------------------------------------------
// Action buttons row
// ---------------------------------------------------------------------------
const ActionRow = styled(Box)({
  display: 'flex',
  gap: '6px',
})

const ActionBtn = styled(MotionButton)({
  flex: 1,
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '14px',
  padding: '8px 0 6px',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  minWidth: 0,
})

const ActionBtnLabel = styled(Typography)({
  color: 'rgba(255,255,255,0.35)',
  fontSize: 9,
  fontWeight: 500,
})

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------
const DividerRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 14px 6px',
  flexShrink: 0,
})

const DividerLine = styled(Box)({
  flex: 1,
  height: 1,
  backgroundColor: 'rgba(255,255,255,0.08)',
})

const DividerLabel = styled(Typography)({
  color: 'rgba(255,255,255,0.22)',
  fontSize: 9.5,
  fontWeight: 600,
  letterSpacing: '0.6px',
  textTransform: 'uppercase',
})

// ---------------------------------------------------------------------------
// Quick pills
// ---------------------------------------------------------------------------
const PillsRow = styled(Box)({
  overflowX: 'auto',
  display: 'flex',
  gap: '6px',
  padding: '0 14px 8px',
  scrollbarWidth: 'none',
  flexShrink: 0,
})

const PillButton = styled(MotionButton)({
  flexShrink: 0,
  gap: '5px',
  padding: '5px 10px',
  borderRadius: '99px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderColor: 'rgba(255,255,255,0.09)',
  color: 'rgba(255,255,255,0.55)',
  whiteSpace: 'nowrap',
  minWidth: 0,
  height: 'auto',
  fontSize: 11.5,
  fontWeight: 500,
})

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
const MessagesArea = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '4px 14px 6px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

// Framer-motion div with static layout styles only; dynamic justifyContent stays inline
const MessageRowDiv = styled('div')({
  display: 'flex',
})

interface MessageBubbleProps {
  role: 'user' | 'ai'
}
const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'role',
})<MessageBubbleProps>(({ role }) => ({
  maxWidth: '85%',
  padding: '8px 12px',
  borderRadius: role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
  background:
    role === 'user'
      ? 'linear-gradient(135deg, rgba(200,255,0,0.18), rgba(200,255,0,0.10))'
      : 'rgba(255,255,255,0.07)',
  border:
    role === 'user'
      ? '1px solid rgba(200,255,0,0.25)'
      : '1px solid rgba(255,255,255,0.09)',
}))

interface MessageTextProps {
  role: 'user' | 'ai'
}
const MessageText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'role',
})<MessageTextProps>(({ role }) => ({
  color: role === 'user' ? undefined : 'rgba(255,255,255,0.82)',
  ...(role === 'user' && { color: undefined }), // let theme primary.main handle it via the sx below
  fontSize: 12.5,
  lineHeight: 1.55,
  fontWeight: role === 'user' ? 600 : 400,
}))

// ---------------------------------------------------------------------------
// Input row
// ---------------------------------------------------------------------------
const InputRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  padding: '8px 12px 20px',
  borderTop: '1px solid rgba(255,255,255,0.06)',
  flexShrink: 0,
})

const InputWrap = styled(Box)({
  flex: 1,
  backgroundColor: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '99px',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '14px',
  paddingRight: '14px',
  height: 38,
})

const StyledInput = styled(InputBase)({
  flex: 1,
  fontSize: 13,
})

interface MicBtnProps {
  micactive: string // 'true' | 'false'
}
const MicBtn = styled(MotionButton, {
  shouldForwardProp: (prop) => prop !== 'micactive',
})<MicBtnProps>(({ micactive }) => {
  const active = micactive === 'true'
  return {
    minWidth: 0,
    width: 38,
    height: 38,
    borderRadius: '50%',
    padding: 0,
    flexShrink: 0,
    backgroundColor: active ? 'rgba(200,255,0,0.18)' : 'rgba(255,255,255,0.07)',
    borderColor: active ? 'rgba(200,255,0,0.40)' : 'rgba(255,255,255,0.10)',
    position: 'relative',
    transition: 'background 0.3s, border-color 0.3s',
  }
})

// Ripple ring around mic button (animated; only static styles here)
const MicRing = styled('div')({
  position: 'absolute',
  inset: -4,
  borderRadius: '50%',
  border: '2px solid rgba(200,255,0,0.5)',
})

const SendBtn = styled(MotionButton)({
  minWidth: 0,
  width: 38,
  height: 38,
  borderRadius: '50%',
  padding: 0,
  flexShrink: 0,
})

// ---------------------------------------------------------------------------
// Data constants
// ---------------------------------------------------------------------------
const QUICK_PILLS = [
  { icon: Zap,           label: 'Check fuel',    response: 'Fuel level is at 65% — approximately 312 km of range remaining. Low fuel alert is set at 20%.' },
  { icon: Route,         label: 'Trips today',   response: "You've completed 2 trips today covering 8.4 mi. Morning Commute is currently active." },
  { icon: AlertTriangle, label: 'Speed alerts',  response: 'No speed alerts in the last 7 days. Your limit is set to 75 mph on highways.' },
  { icon: MapPin,        label: 'Find parking',  response: 'Searching for parking near your destination... 3 spots within 0.2 mi of Candace Ln.' },
  { icon: Gauge,         label: 'Diagnostics',   response: 'Engine and battery are healthy. Fuel is at 65% — consider refueling soon.' },
  { icon: Wifi,          label: 'Device health', response: 'Device is online and syncing. Last heartbeat: 12 seconds ago. Signal: strong.' },
]

const MOCK_CONVERSATION = [
  { role: 'user', text: 'Check fuel' },
  { role: 'ai',   text: 'Fuel level is at 65% — approximately 312 km of range remaining. Low fuel alert is set at 20%.' },
]

const HEALTH = [
  { label: 'Fuel',   value: '65%', Icon: Gauge,         ok: false },
  { label: 'Batt',   value: 'OK',  Icon: BatteryMedium,  ok: true  },
  { label: 'Engine', value: 'OK',  Icon: Zap,            ok: true  },
  { label: 'Device', value: 'OK',  Icon: Cpu,            ok: true  },
]

const STATS = [
  { label: 'Range', value: '312', unit: 'km'  },
  { label: 'Trip',  value: '4.2', unit: 'mi'  },
  { label: 'Speed', value: '32',  unit: 'mph' },
]

const ACTIONS = [
  { label: 'Trips',   Icon: Route,          color: '#C8FF00' },
  { label: 'Alerts',  Icon: AlertTriangle,   color: '#facc15' },
  { label: 'History', Icon: History,         color: 'rgba(255,255,255,0.38)' },
  { label: 'Network', Icon: Wifi,            color: 'rgba(255,255,255,0.38)' },
]

const PANEL_WIDTH = 380

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------
interface ConversationalPanelProps {
  open: boolean
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ConversationalPanel({ open, onClose }: ConversationalPanelProps) {
  const [messages, setMessages] = useState(MOCK_CONVERSATION)
  const [inputText, setInputText] = useState('')
  const [micActive, setMicActive] = useState(false)

  const handlePill = (pill) => {
    setMessages(prev => [
      ...prev,
      { role: 'user', text: pill.label },
      { role: 'ai',   text: pill.response },
    ])
  }

  const handleSend = () => {
    if (!inputText.trim()) return
    setMessages(prev => [
      ...prev,
      { role: 'user', text: inputText.trim() },
      { role: 'ai',   text: 'Got it — looking into that for you now. Give me a second...' },
    ])
    setInputText('')
  }

  const handleMic = () => {
    setMicActive(v => !v)
    if (!micActive) {
      setTimeout(() => {
        setMicActive(false)
        setMessages(prev => [
          ...prev,
          { role: 'user', text: 'How fast was I going on my last trip?' },
          { role: 'ai',   text: "Your top speed on this morning's trip was 48 mph. Average was 22 mph over 4.2 miles." },
        ])
      }, 2200)
    }
  }

  return (
    <motion.div
      animate={{ width: open ? PANEL_WIDTH : 0 }}
      initial={{ width: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 36 }}
    >
      <PanelShell>
        {/* Fixed-width inner so content doesn't squish during animation */}
        <PanelInner style={{ width: PANEL_WIDTH }}>

          {/* Header */}
          <PanelHeader>
            <Box>
              <PanelTitle>TrackLynk AI</PanelTitle>
              <PanelSubtitle>Ask anything about your vehicle</PanelSubtitle>
            </Box>
            <CloseBtn whileTap={{ scale: 0.88 }} onClick={onClose} variant="outlined">
              <X size={14} color="rgba(255,255,255,0.55)" />
            </CloseBtn>
          </PanelHeader>

          {/* KPI strip */}
          <KpiStrip>
            <KpiRow>
              <KpiChipGroup>
                {HEALTH.map(({ label, value, Icon, ok }) => (
                  <KpiChip key={label} isok={String(ok)}>
                    <Icon size={10} color={ok ? '#4ade80' : '#C8FF00'} />
                    <KpiChipLabel isok={String(ok)}>{value}</KpiChipLabel>
                  </KpiChip>
                ))}
              </KpiChipGroup>
              <StatGroup>
                {STATS.map(({ label, value, unit }) => (
                  <StatItem key={label}>
                    <StatValue>
                      {value}<StatUnit>{unit}</StatUnit>
                    </StatValue>
                    <StatLabel>{label}</StatLabel>
                  </StatItem>
                ))}
              </StatGroup>
            </KpiRow>

            <ActionRow>
              {ACTIONS.map(({ label, Icon, color }) => (
                <ActionBtn key={label} whileTap={{ scale: 0.88 }} variant="text">
                  <Icon size={14} color={color} />
                  <ActionBtnLabel>{label}</ActionBtnLabel>
                </ActionBtn>
              ))}
            </ActionRow>
          </KpiStrip>

          {/* Ask AI divider */}
          <DividerRow>
            <DividerLine />
            <DividerLabel>Ask AI</DividerLabel>
            <DividerLine />
          </DividerRow>

          {/* Quick pills */}
          <PillsRow>
            {QUICK_PILLS.map((pill) => {
              const Icon = pill.icon
              return (
                <PillButton
                  key={pill.label}
                  variant="outlined"
                  whileTap={{ scale: 0.93 }}
                  onClick={() => handlePill(pill)}
                >
                  <Icon size={10} color="#C8FF00" />
                  {pill.label}
                </PillButton>
              )
            })}
          </PillsRow>

          {/* Messages */}
          <MessagesArea>
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                >
                  <MessageRowDiv style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <MessageBubble role={msg.role as 'user' | 'ai'}>
                      <MessageText
                        role={msg.role as 'user' | 'ai'}
                        {...(msg.role === 'user' ? { color: 'primary.main' } : {})}
                      >
                        {msg.text}
                      </MessageText>
                    </MessageBubble>
                  </MessageRowDiv>
                </motion.div>
              ))}
            </AnimatePresence>
          </MessagesArea>

          {/* Input row */}
          <InputRow>
            <InputWrap>
              <StyledInput
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask TrackLynk..."
                sx={{ color: 'text.primary' }}
              />
            </InputWrap>
            <MicBtn
              whileTap={{ scale: 0.88 }}
              variant="outlined"
              onClick={handleMic}
              micactive={String(micActive)}
            >
              {micActive && (
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'easeOut' }}
                >
                  <MicRing />
                </motion.div>
              )}
              <Mic size={14} color={micActive ? '#C8FF00' : 'rgba(255,255,255,0.45)'} />
            </MicBtn>
            <SendBtn
              whileTap={{ scale: 0.88 }}
              onClick={handleSend}
              variant={inputText.trim() ? 'contained' : 'outlined'}
              {...(!inputText.trim() && {
                sx: { bgcolor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.10)' },
              })}
            >
              <Send size={13} color={inputText.trim() ? '#000' : 'rgba(255,255,255,0.30)'} />
            </SendBtn>
          </InputRow>

        </PanelInner>
      </PanelShell>
    </motion.div>
  )
}
