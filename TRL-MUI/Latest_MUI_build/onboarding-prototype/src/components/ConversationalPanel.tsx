import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button, InputBase } from '@mui/material'
import {
  Zap, Route, AlertTriangle, MapPin, Gauge, Wifi,
  Mic, Send, BatteryMedium, Cpu, History, X,
} from 'lucide-react'

const MotionButton = motion(Button)

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
  { label: 'Fuel',   value: '65%', Icon: Gauge,        ok: false },
  { label: 'Batt',   value: 'OK',  Icon: BatteryMedium, ok: true  },
  { label: 'Engine', value: 'OK',  Icon: Zap,           ok: true  },
  { label: 'Device', value: 'OK',  Icon: Cpu,           ok: true  },
]

const STATS = [
  { label: 'Range', value: '312', unit: 'km'  },
  { label: 'Trip',  value: '4.2', unit: 'mi'  },
  { label: 'Speed', value: '32',  unit: 'mph' },
]

const ACTIONS = [
  { label: 'Trips',   Icon: Route,         color: '#C8FF00' },
  { label: 'Alerts',  Icon: AlertTriangle,  color: '#facc15' },
  { label: 'History', Icon: History,        color: 'rgba(255,255,255,0.38)' },
  { label: 'Network', Icon: Wifi,           color: 'rgba(255,255,255,0.38)' },
]

const PANEL_WIDTH = 380

interface ConversationalPanelProps {
  open: boolean
  onClose: () => void
}

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
      style={{
        height: '100%',
        flexShrink: 0,
        overflow: 'hidden',
        background: 'rgba(8,10,18,0.97)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Fixed-width inner so content doesn't squish during animation */}
      <div style={{ width: PANEL_WIDTH, height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '16px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.3px' }}>TrackLynk AI</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.30)', fontSize: 11, mt: '1px' }}>Ask anything about your vehicle</Typography>
          </Box>
          <MotionButton whileTap={{ scale: 0.88 }} onClick={onClose} variant="outlined"
            sx={{ minWidth: 0, width: 32, height: 32, borderRadius: '50%', p: 0, bgcolor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.10)' }}>
            <X size={14} color="rgba(255,255,255,0.55)" />
          </MotionButton>
        </Box>

        {/* KPI strip */}
        <Box sx={{ flexShrink: 0, p: '10px 14px 6px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '8px' }}>
            <Box sx={{ display: 'flex', gap: '5px', flex: 1, flexWrap: 'wrap' }}>
              {HEALTH.map(({ label, value, Icon, ok }) => (
                <Box key={label} sx={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  bgcolor: ok ? 'rgba(255,255,255,0.05)' : 'rgba(200,255,0,0.08)',
                  border: `1px solid ${ok ? 'rgba(255,255,255,0.08)' : 'rgba(200,255,0,0.22)'}`,
                  borderRadius: '99px', p: '5px 8px',
                }}>
                  <Icon size={10} color={ok ? '#4ade80' : '#C8FF00'} />
                  <Typography sx={{ color: ok ? '#4ade80' : '#C8FF00', fontSize: 10, fontWeight: 700 }}>{value}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: '10px' }}>
              {STATS.map(({ label, value, unit }) => (
                <Box key={label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1 }}>
                    {value}<Box component="span" sx={{ fontSize: 8.5, fontWeight: 500, color: 'rgba(255,255,255,0.30)', ml: '1px' }}>{unit}</Box>
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 8, mt: '1px' }}>{label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: '6px' }}>
            {ACTIONS.map(({ label, Icon, color }) => (
              <MotionButton key={label} whileTap={{ scale: 0.88 }} variant="text" sx={{
                flex: 1, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px', p: '8px 0 6px', height: 'auto',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: 0,
              }}>
                <Icon size={14} color={color} />
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 500 }}>{label}</Typography>
              </MotionButton>
            ))}
          </Box>
        </Box>

        {/* Ask AI divider */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '8px 14px 6px', flexShrink: 0 }}>
          <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.08)' }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.22)', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase' }}>Ask AI</Typography>
          <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.08)' }} />
        </Box>

        {/* Quick pills */}
        <Box sx={{ overflowX: 'auto', display: 'flex', gap: '6px', p: '0 14px 8px', scrollbarWidth: 'none', flexShrink: 0 }}>
          {QUICK_PILLS.map((pill) => {
            const Icon = pill.icon
            return (
              <MotionButton key={pill.label} variant="outlined" whileTap={{ scale: 0.93 }} onClick={() => handlePill(pill)} sx={{
                flexShrink: 0, gap: '5px', p: '5px 10px', borderRadius: '99px',
                bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', minWidth: 0, height: 'auto',
                fontSize: 11.5, fontWeight: 500,
              }}>
                <Icon size={10} color="#C8FF00" />
                {pill.label}
              </MotionButton>
            )
          })}
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: '4px 14px 6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
              >
                <Box sx={{
                  maxWidth: '85%', p: '8px 12px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, rgba(200,255,0,0.18), rgba(200,255,0,0.10))' : 'rgba(255,255,255,0.07)',
                  border: msg.role === 'user' ? '1px solid rgba(200,255,0,0.25)' : '1px solid rgba(255,255,255,0.09)',
                }}>
                  <Typography sx={{ color: msg.role === 'user' ? 'primary.main' : 'rgba(255,255,255,0.82)', fontSize: 12.5, lineHeight: 1.55, fontWeight: msg.role === 'user' ? 600 : 400 }}>
                    {msg.text}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>

        {/* Input row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', p: '8px 12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <Box sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '99px', display: 'flex', alignItems: 'center', px: '14px', height: 38 }}>
            <InputBase value={inputText} onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask TrackLynk..." sx={{ flex: 1, color: 'text.primary', fontSize: 13 }} />
          </Box>
          <MotionButton whileTap={{ scale: 0.88 }} variant="outlined" onClick={handleMic} sx={{
            minWidth: 0, width: 38, height: 38, borderRadius: '50%', p: 0, flexShrink: 0,
            bgcolor: micActive ? 'rgba(200,255,0,0.18)' : 'rgba(255,255,255,0.07)',
            borderColor: micActive ? 'rgba(200,255,0,0.40)' : 'rgba(255,255,255,0.10)',
            position: 'relative', transition: 'background 0.3s, border-color 0.3s',
          }}>
            {micActive && (
              <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1, ease: 'easeOut' }}
                style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '2px solid rgba(200,255,0,0.5)' }} />
            )}
            <Mic size={14} color={micActive ? '#C8FF00' : 'rgba(255,255,255,0.45)'} />
          </MotionButton>
          <MotionButton whileTap={{ scale: 0.88 }} onClick={handleSend} variant={inputText.trim() ? 'contained' : 'outlined'} sx={{
            minWidth: 0, width: 38, height: 38, borderRadius: '50%', p: 0, flexShrink: 0,
            ...(!inputText.trim() && { bgcolor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.10)' }),
          }}>
            <Send size={13} color={inputText.trim() ? '#000' : 'rgba(255,255,255,0.30)'} />
          </MotionButton>
        </Box>

      </div>
    </motion.div>
  )
}
