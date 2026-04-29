import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { MapPin, Shield, Zap, Check } from 'lucide-react'
import Car3D from '../../components/Car3D'
import { GlassCard } from '../../components/GlassCard'

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

// ─── Styled components ────────────────────────────────

const WelcomeRoot = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '16px',
})

const CarouselWrapper = styled(Box)({
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
})

const HeroRoot = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: '4px',
})

const HeroTitle = styled(Typography)({
  fontSize: 42,
  fontWeight: 900,
  letterSpacing: '-1.8px',
  lineHeight: 1,
  textAlign: 'center',
  marginBottom: '8px',
})

const HeroSubtitle = styled(Typography)({
  fontSize: 14,
  display: 'block',
  textAlign: 'center',
  marginBottom: '18px',
})

const VehicleCountRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  marginTop: '14px',
})

const VehicleIconBox = styled(Box)({
  width: 24,
  height: 24,
  borderRadius: '7px',
  background: 'rgba(200,255,0,0.10)',
  border: '1px solid rgba(200,255,0,0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const VehicleCountLabel = styled(Typography)({
  fontSize: 12.5,
  fontWeight: 500,
})

const FeaturesRoot = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingLeft: '24px',
  paddingRight: '24px',
})

const FeaturesHeadingBox = styled(Box)({
  marginBottom: '24px',
})

const SlideHeading = styled(Typography)({
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: '-0.8px',
  marginBottom: '6px',
})

const SlideCaption = styled(Typography)({
  fontSize: 14,
})

const FeatureIconBox = styled(Box)({
  width: 42,
  height: 42,
  borderRadius: '13px',
  flexShrink: 0,
  background: 'rgba(200,255,0,0.10)',
  border: '1px solid rgba(200,255,0,0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const FeatureTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: 14,
  marginBottom: '3px',
})

const FeatureDesc = styled(Typography)({
  fontSize: 12.5,
  color: 'rgba(255,255,255,0.40)',
})

const PricingRoot = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingLeft: '24px',
  paddingRight: '24px',
})

const PricingHeadingBox = styled(Box)({
  marginBottom: '18px',
})

const ToggleTrack = styled('div')({
  display: 'flex',
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: 3,
  marginBottom: 16,
  position: 'relative',
})

const ToggleThumb = styled(motion.div)({
  position: 'absolute',
  top: 3,
  bottom: 3,
  width: 'calc(50% - 3px)',
  background: 'rgba(200,255,0,0.12)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  borderRadius: 9,
  border: '1px solid rgba(200,255,0,0.25)',
})

const ToggleButton = styled('button')({
  flex: 1,
  padding: '8px 0',
  background: 'none',
  border: 'none',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  position: 'relative',
  zIndex: 1,
  fontFamily: 'Inter, sans-serif',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
})

const SaveBadge = styled('span')({
  fontSize: 9,
  background: 'rgba(74,222,128,0.15)',
  color: '#4ade80',
  padding: '2px 6px',
  borderRadius: 99,
  fontWeight: 700,
  border: '1px solid rgba(74,222,128,0.2)',
})

const PricingGlowBox = styled(Box)({
  position: 'absolute',
  top: -20,
  right: -20,
  width: 90,
  height: 90,
  background: 'radial-gradient(circle, rgba(200,255,0,0.05) 0%, transparent 70%)',
  pointerEvents: 'none',
})

const PriceAmountText = styled(Typography)({
  fontSize: 42,
  fontWeight: 900,
  lineHeight: 1,
  letterSpacing: '-1.5px',
})

const PricePerMonthText = styled(Typography)({
  fontSize: 13,
  marginBottom: '6px',
})

const PricingDivider = styled(Divider)({
  marginBottom: '14px',
})

const PlanFeaturesList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
})

const PlanFeatureRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
})

const CheckIconBox = styled(Box)({
  width: 20,
  height: 20,
  borderRadius: '99px',
  flexShrink: 0,
  background: 'rgba(200,255,0,0.10)',
  border: '1px solid rgba(200,255,0,0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const PlanFeatureLabel = styled(Typography)({
  fontSize: 13,
})

const DotsRow = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '7px',
  paddingTop: '18px',
  paddingBottom: '18px',
})

const DotButton = styled('button')({
  background: 'none',
  border: 'none',
  padding: '8px 2px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
})

const CtaSection = styled(Box)({
  paddingLeft: '24px',
  paddingRight: '24px',
  paddingBottom: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
})

const GetStartedButton = styled(MotionButton)({
  height: 54,
  borderRadius: '18px',
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: '-0.2px',
})

const ExploreButton = styled(MotionButton)({
  height: 48,
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  color: 'rgba(255,255,255,0.72)',
  fontSize: 15,
})

const SignInButton = styled(MotionButton)({
  color: 'rgba(255,255,255,0.38)',
  fontSize: 14,
  paddingTop: '4px',
  paddingBottom: '4px',
})

const SignInHighlight = styled(Box)({
  color: '#C8FF00',
  fontWeight: 700,
  marginLeft: '4px',
})

// ─── Slide 1: Hero ────────────────────────────────────

function HeroSlide() {
  return (
    <HeroRoot>

      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, type: 'spring', stiffness: 300, damping: 28 }}
      >
        <HeroTitle>
          Track<Box component="span" sx={{ color: 'primary.main' }}>Lynk</Box>
        </HeroTitle>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.14 }}
      >
        <HeroSubtitle variant="caption">
          Know where your vehicle is — always.
        </HeroSubtitle>
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
        <VehicleCountRow>
          {[0, 1, 2].map(i => (
            <VehicleIconBox key={i}>
              <svg width="13" height="9" viewBox="0 0 14 10" fill="none">
                <path d="M11.5 5.3L10.6 3H3.4L2.5 5.3H11.5Z" fill="#C8FF00" opacity="0.9"/>
                <rect x="1" y="5.3" width="12" height="3" rx="1" fill="#C8FF00" opacity="0.7"/>
                <circle cx="3.5" cy="9" r="1.2" fill="#C8FF00"/>
                <circle cx="10.5" cy="9" r="1.2" fill="#C8FF00"/>
              </svg>
            </VehicleIconBox>
          ))}
          <VehicleCountLabel variant="caption">
            10,000+ vehicles protected
          </VehicleCountLabel>
        </VehicleCountRow>
      </motion.div>
    </HeroRoot>
  )
}

// ─── Slide 2: Features ────────────────────────────────

function FeaturesSlide() {
  return (
    <FeaturesRoot>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <FeaturesHeadingBox>
          <SlideHeading>
            Everything you need
          </SlideHeading>
          <SlideCaption variant="caption">
            One device. Full vehicle intelligence.
          </SlideCaption>
        </FeaturesHeadingBox>
      </motion.div>

      <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {featureItems.map(({ icon: Icon, title, desc }) => (
          <motion.div key={title} variants={fadeUp}>
            <GlassCard sx={{ display: 'flex', alignItems: 'center', gap: '14px', p: '14px 16px', borderRadius: '18px' }}>
              <FeatureIconBox>
                <Icon size={19} color="#C8FF00" />
              </FeatureIconBox>
              <Box>
                <FeatureTitle>{title}</FeatureTitle>
                <FeatureDesc variant="caption">{desc}</FeatureDesc>
              </Box>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </FeaturesRoot>
  )
}

// ─── Slide 3: Pricing ─────────────────────────────────
// Toggle kept fully custom — MUI ToggleButtonGroup has no shared sliding indicator

function PricingSlide() {
  const [annual, setAnnual] = useState(false)
  const price = annual ? 7.99 : 9.65

  return (
    <PricingRoot>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <PricingHeadingBox>
          <SlideHeading>
            Simple pricing
          </SlideHeading>
          <SlideCaption variant="caption">
            No contracts. Cancel any time.
          </SlideCaption>
        </PricingHeadingBox>
      </motion.div>

      {/* Custom sliding toggle — kept as-is, MUI has no equivalent */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <ToggleTrack>
          <ToggleThumb
            animate={{ x: annual ? '100%' : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          {['Monthly', 'Annual'].map((label, i) => (
            <ToggleButton
              key={label}
              onClick={() => setAnnual(i === 1)}
              style={{ color: (i === 1) === annual ? '#C8FF00' : 'rgba(255,255,255,0.4)' }}
            >
              {label}
              {i === 1 && <SaveBadge>SAVE $21</SaveBadge>}
            </ToggleButton>
          ))}
        </ToggleTrack>
      </motion.div>

      {/* Price card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <GlassCard sx={{ position: 'relative', overflow: 'hidden', p: '20px' }}>
          <PricingGlowBox />

          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '5px', mb: '14px' }}>
            <motion.span
              key={price}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'contents' }}
            >
              <PriceAmountText>
                ${price.toFixed(2)}
              </PriceAmountText>
            </motion.span>
            <PricePerMonthText variant="caption">
              /mo{annual && ', billed yearly'}
            </PricePerMonthText>
          </Box>

          <PricingDivider />

          <PlanFeaturesList>
            {planFeatures.map(f => (
              <PlanFeatureRow key={f}>
                <CheckIconBox>
                  <Check size={11} color="#C8FF00" />
                </CheckIconBox>
                <PlanFeatureLabel variant="body2">{f}</PlanFeatureLabel>
              </PlanFeatureRow>
            ))}
          </PlanFeaturesList>
        </GlassCard>
      </motion.div>
    </PricingRoot>
  )
}

// ─── Main component ────────────────────────────────────

interface WelcomeProps {
  next: () => void
  goTo: (i: number) => void
  onEnterApp: () => void
}

export default function Welcome({ next, goTo, onEnterApp }: WelcomeProps) {
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
    <WelcomeRoot>

      {/* ── Carousel ── */}
      <CarouselWrapper
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
      </CarouselWrapper>

      {/* ── Dot indicators ── */}
      <DotsRow>
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <DotButton
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === slide ? 'true' : undefined}
            onClick={() => goToSlide(i)}
          >
            <motion.div
              animate={{
                width: i === slide ? 24 : 6,
                background: i === slide ? '#C8FF00' : 'rgba(255,255,255,0.20)',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{ height: 6, borderRadius: 99 }}
            />
          </DotButton>
        ))}
      </DotsRow>

      {/* ── CTA section ── */}
      <CtaSection>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GetStartedButton
            fullWidth
            variant="contained"
            whileTap={{ scale: 0.97 }}
            onClick={next}
          >
            Get Started →
          </GetStartedButton>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
          <ExploreButton
            fullWidth
            variant="outlined"
            whileTap={{ scale: 0.97 }}
            onClick={onEnterApp}
          >
            Explore the app (skip onboarding) →
          </ExploreButton>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>
          <SignInButton
            fullWidth
            variant="text"
            whileTap={{ scale: 0.97 }}
            onClick={next}
          >
            Already have an account?{' '}
            <SignInHighlight component="span">Sign In</SignInHighlight>
          </SignInButton>
        </motion.div>

      </CtaSection>
    </WelcomeRoot>
  )
}
