import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { styled } from '@mui/material/styles'
import {
  ONBOARDING_SCREENS,
  renderOnboardingScreen,
  renderMainScreen,
  type OnboardingScreen,
  type MainScreen,
} from './routes'
import BottomTabs from './components/BottomTabs'
import ConversationalPanel from './components/ConversationalPanel'

// ─── Styled Components ────────────────────────────────

const AppRoot = styled('div')({
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  position: 'relative',
  background: `
    radial-gradient(ellipse 70% 50% at 30% 40%, rgba(200,255,0,0.04) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 75% 60%, rgba(180,230,0,0.03) 0%, transparent 60%),
    #000
  `,
})

const MainAppInner = styled('div')({
  position: 'absolute',
  inset: 0,
  display: 'flex',
})

const ContentPane = styled('div')({
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
  minWidth: 0,
})

const OnboardingSlide = styled('div')({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  justifyContent: 'center',
})

const OnboardingFrame = styled('div')({
  width: '100%',
  maxWidth: 480,
  height: '100%',
  position: 'relative',
})

const MotionMainApp = motion(MainAppInner)
const MotionOnboardingSlide = motion(OnboardingSlide)

// ─── Animation ────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

const transition = { type: 'spring', stiffness: 380, damping: 38, mass: 0.8 }

// ─── Named indices (avoids magic numbers throughout) ──

const idx = (name: OnboardingScreen) => ONBOARDING_SCREENS.indexOf(name)

// ─── App ──────────────────────────────────────────────

export default function App() {
  // History stack — back() pops, all forward navigation pushes.
  // This ensures back always returns to the exact screen the user came from,
  // regardless of how they got to the current screen (sequential or goTo jump).
  const [history, setHistory]       = useState<number[]>([0])
  const [dir, setDir]               = useState(1)
  const [appPhase, setAppPhase]     = useState<'onboarding' | 'main'>('onboarding')
  const [mainScreen, setMainScreen] = useState<MainScreen>('home')
  const [panelOpen, setPanelOpen]   = useState(false)

  const step = history[history.length - 1]

  const push = (i: number) => {
    setDir(i >= step ? 1 : -1)
    setHistory(h => [...h, i])
  }
  const back = () => {
    if (history.length <= 1) return
    const prev = history[history.length - 2]
    setDir(prev < step ? -1 : 1)
    setHistory(h => h.slice(0, -1))
  }
  const next = () => push(Math.min(step + 1, ONBOARDING_SCREENS.length - 1))
  const goTo = (i: number) => push(i)

  // Named navigation callbacks used by each screen
  const goToScan          = () => push(idx('scan'))
  const goToLogin         = () => push(idx('login'))
  const goToSignupEmail   = () => push(idx('auth'))
  const goToForgotPass    = () => push(idx('forgotPassword'))
  const goToVerifyEmail   = () => push(idx('verifyEmail'))

  const enterApp = () => setAppPhase('main')

  const screen = ONBOARDING_SCREENS[step] as OnboardingScreen

  // ProgressBar step/total covers signup → choosePlan (6 onboarding steps)
  const signupIdx       = idx('signup')
  const onboardingStep  = step - signupIdx
  const totalOnboarding = idx('choosePlan') - signupIdx + 1

  const screenProps = {
    next,
    back,
    goTo,
    step: onboardingStep,
    total: totalOnboarding,
    onEnterApp:      enterApp,
    onOAuthLogin:    goToScan,
    onSignIn:        goToLogin,
    onSignUpEmail:   goToSignupEmail,
    onForgotPassword: goToForgotPass,
    onVerifyEmail:   goToVerifyEmail,
  }

  const isMainApp = appPhase === 'main'

  return (
    <AppRoot>
      {isMainApp ? (
        <MotionMainApp
          key="main-app"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        >
          <ContentPane>
            {renderMainScreen(mainScreen)}
            <BottomTabs
              current={mainScreen}
              onNavigate={(id) => setMainScreen(id as MainScreen)}
              onChatOpen={() => setPanelOpen(true)}
              chatActive={panelOpen}
            />
          </ContentPane>

          <ConversationalPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
        </MotionMainApp>
      ) : (
        <AnimatePresence custom={dir} mode="popLayout" initial={false}>
          <MotionOnboardingSlide
            key={screen}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <OnboardingFrame>
              {renderOnboardingScreen(screen, screenProps)}
            </OnboardingFrame>
          </MotionOnboardingSlide>
        </AnimatePresence>
      )}
    </AppRoot>
  )
}
