import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button, Divider } from '@mui/material'
import { MapPin, Shield, Zap, Check } from 'lucide-react'
import Car3D from '../components/Car3D.jsx'
import { GlassCard } from '../components/GlassCard.jsx'

// ─── Data ─────────────────────────────────────────────

const featureItems = [
  { icon: MapPin, title: 'Real-time tracking',  desc: 'Know exactly where your vehicle is, always.' },
  { icon: Shield, title: 'Instant alerts',       desc: 'Speed, geofence & trip notifications instantly.' },
  { icon: Zap,    title: 'Plug in and go',       desc: 'OBD device setup in under 2 minutes.' },
]

const planFeatures = [
  'Real-time GPS tracking',
  'Unlimited trip history',
  'Geofence zones',
  'Multi-vehicle dashboard',
]

const TOTAL_SLIDES = 3
const AUTO_ADVANCE_MS = 4500

// ─── Animation variants ───────────────────────────────

const slideVariants = {
  enter: d => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   d => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
}
const slideSpring = { type: 'spring', stiffness: 380, damping: 38, mass: 0.8 }

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 360, damping: 28 } },
}

const MotionButton = motion(Button)

// ─── Slide 1: Hero ────────────────────────────────────

function HeroSlide() {
  return (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', pb: '4px',
    }}>

      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, type: 'spring', stiffness: 300, damping: 28 }}
      >
        <Typography sx={{
          fontSize: 42, fontWeight: 900, color: 'text.primary',
          letterSpacing: '-1.8px', lineHeight: 1, textAlign: 'center', mb: '8px',
        }}>
          Track<Box component="span" sx={{ color: 'primary.main' }}>Lynk</Box>
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.14 }}
      >
        <Typography variant="caption" sx={{
          fontSize: 14, display: 'block', textAlign: 'center', mb: '18px',
        }}>
          Know where your vehicle is — always.
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.18, type: 'spring', stiffness: 240, damping: 26 }}
        className="car-float"
        style={{ position: 'relative', width: '100%' }}
      >
        <Car3D width={360} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', mt: '14px' }}>
          {[0, 1, 2].map(i => (
            <Box key={i} sx={{
              width: 24, height: 24, borderRadius: '7px',
              bgcolor: 'rgba(200,255,0,0.10)',
              border: '1px solid rgba(200,255,0,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="13" height="9" viewBox="0 0 14 10" fill="none">
                <path d="M11.5 5.3L10.6 3H3.4L2.5 5.3H11.5Z" fill="#C8FF00" opacity="0.9"/>
                <rect x="1" y="5.3" width="12" height="3" rx="1" fill="#C8FF00" opacity="0.7"/>
                <circle cx="3.5" cy="9" r="1.2" fill="#C8FF00"/>
                <circle cx="10.5" cy="9" r="1.2" fill="#C8FF00"/>
              </svg>
            </Box>
          ))}
          <Typography variant="caption" sx={{ fontSize: 12.5, fontWeight: 500 }}>
            10,000+ vehicles protected
          </Typography>
        </Box>
      </motion.div>
    </Box>
  )
}

// ─── Slide 2: Features ────────────────────────────────

function FeaturesSlide() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', px: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Box sx={{ mb: '24px' }}>
          <Typography sx={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.8px', mb: '6px' }}>
            Everything you need
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 14 }}>
            One device. Full vehicle intelligence.
          </Typography>
        </Box>
      </motion.div>

      <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {featureItems.map(({ icon: Icon, title, desc }) => (
          <motion.div key={title} variants={fadeUp}>
            <GlassCard sx={{ display: 'flex', alignItems: 'center', gap: '14px', p: '14px 16px', borderRadius: '18px' }}>
              <Box sx={{
                width: 42, height: 42, borderRadius: '13px', flexShrink: 0,
                bgcolor: 'rgba(200,255,0,0.10)',
                border: '1px solid rgba(200,255,0,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={19} color="#C8FF00" />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 14, mb: '3px' }}>{title}</Typography>
                <Typography variant="caption" sx={{ fontSize: 12.5, color: 'rgba(255,255,255,0.40)' }}>{desc}</Typography>
              </Box>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </Box>
  )
}

// ─── Slide 3: Pricing ─────────────────────────────────
// Toggle kept fully custom — MUI ToggleButtonGroup has no shared sliding indicator

function PricingSlide() {
  const [annual, setAnnual] = useState(false)
  const price = annual ? 7.99 : 9.65

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', px: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Box sx={{ mb: '18px' }}>
          <Typography sx={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.8px', mb: '6px' }}>
            Simple pricing
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 14 }}>
            No contracts. Cancel any time.
          </Typography>
        </Box>
      </motion.div>

      {/* Custom sliding toggle — kept as-is, MUI has no equivalent */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: 3, marginBottom: 16, position: 'relative',
        }}
      >
        <motion.div
          animate={{ x: annual ? '100%' : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'absolute', top: 3, bottom: 3, width: 'calc(50% - 3px)',
            background: 'rgba(200,255,0,0.12)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 9,
            border: '1px solid rgba(200,255,0,0.25)',
          }}
        />
        {['Monthly', 'Annual'].map((label, i) => (
          <button
            key={label}
            onClick={() => setAnnual(i === 1)}
            style={{
              flex: 1, padding: '8px 0', background: 'none', border: 'none',
              color: (i === 1) === annual ? '#C8FF00' : 'rgba(255,255,255,0.4)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              position: 'relative', zIndex: 1,
              fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {label}
            {i === 1 && (
              <span style={{
                fontSize: 9, background: 'rgba(74,222,128,0.15)', color: '#4ade80',
                padding: '2px 6px', borderRadius: 99, fontWeight: 700,
                border: '1px solid rgba(74,222,128,0.2)',
              }}>
                SAVE $21
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Price card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <GlassCard sx={{ position: 'relative', overflow: 'hidden', p: '20px' }}>
          <Box sx={{
            position: 'absolute', top: -20, right: -20, width: 90, height: 90,
            background: 'radial-gradient(circle, rgba(200,255,0,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '5px', mb: '14px' }}>
            <motion.span
              key={price}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'contents' }}
            >
              <Typography sx={{ fontSize: 42, fontWeight: 900, lineHeight: 1, letterSpacing: '-1.5px' }}>
                ${price.toFixed(2)}
              </Typography>
            </motion.span>
            <Typography variant="caption" sx={{ fontSize: 13, mb: '6px' }}>
              /mo{annual && ', billed yearly'}
            </Typography>
          </Box>

          <Divider sx={{ mb: '14px' }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {planFeatures.map(f => (
              <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Box sx={{
                  width: 20, height: 20, borderRadius: '99px', flexShrink: 0,
                  bgcolor: 'rgba(200,255,0,0.10)',
                  border: '1px solid rgba(200,255,0,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={11} color="#C8FF00" />
                </Box>
                <Typography variant="body2" sx={{ fontSize: 13 }}>{f}</Typography>
              </Box>
            ))}
          </Box>
        </GlassCard>
      </motion.div>
    </Box>
  )
}

// ─── Main component ────────────────────────────────────

export default function Welcome({ next, goTo, onEnterApp }) {
  const [slide, setSlide] = useState(0)
  const [dir, setDir]     = useState(1)
  const timerRef          = useRef(null)

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setDir(1)
      setSlide(s => (s + 1) % TOTAL_SLIDES)
    }, AUTO_ADVANCE_MS)
  }, [])

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [startTimer])

  const goToSlide = (i) => {
    if (i === slide) return
    setDir(i > slide ? 1 : -1)
    setSlide(i)
    startTimer()
  }

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -60 && slide < TOTAL_SLIDES - 1) {
      setDir(1); setSlide(s => s + 1); startTimer()
    } else if (info.offset.x > 60 && slide > 0) {
      setDir(-1); setSlide(s => s - 1); startTimer()
    }
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', pt: '44px' }}>

      {/* ── Carousel ── */}
      <Box
        sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}
        onMouseEnter={() => clearInterval(timerRef.current)}
        onMouseLeave={startTimer}
      >
        <AnimatePresence custom={dir} mode="wait" initial={false}>
          <motion.div
            key={slide}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideSpring}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            style={{ position: 'absolute', inset: 0 }}
          >
            {slide === 0 && <HeroSlide />}
            {slide === 1 && <FeaturesSlide />}
            {slide === 2 && <PricingSlide />}
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* ── Dot indicators ── */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '7px', py: '18px' }}>
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === slide ? 'true' : undefined}
            onClick={() => goToSlide(i)}
            style={{ background: 'none', border: 'none', padding: '8px 2px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <motion.div
              animate={{
                width: i === slide ? 24 : 6,
                background: i === slide ? '#C8FF00' : 'rgba(255,255,255,0.20)',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{ height: 6, borderRadius: 99 }}
            />
          </button>
        ))}
      </Box>

      {/* ── CTA section ── */}
      <Box sx={{ px: '24px', pb: '44px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <MotionButton
            fullWidth
            variant="contained"
            whileTap={{ scale: 0.97 }}
            onClick={next}
            sx={{ height: 54, borderRadius: '18px', fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px' }}
          >
            Get Started →
          </MotionButton>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
          <MotionButton
            fullWidth
            variant="outlined"
            whileTap={{ scale: 0.97 }}
            onClick={onEnterApp}
            sx={{
              height: 48,
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: 'rgba(255,255,255,0.72)',
              fontSize: 15,
            }}
          >
            Explore the app (skip onboarding) →
          </MotionButton>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>
          <MotionButton
            fullWidth
            variant="text"
            whileTap={{ scale: 0.97 }}
            onClick={next}
            sx={{ color: 'text.disabled', fontSize: 14, py: '4px' }}
          >
            Already have an account?{' '}
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 700, ml: '4px' }}>Sign In</Box>
          </MotionButton>
        </motion.div>

      </Box>
    </Box>
  )
}
