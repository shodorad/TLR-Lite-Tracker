import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { styled } from '@mui/material/styles'
import Welcome from './screens/Welcome'
import Auth from './screens/Auth'
import SignUp from './screens/SignUp'
import AddVehicle from './screens/AddVehicle'
import VehicleDetails from './screens/VehicleDetails'
import ScanDevice from './screens/ScanDevice'
import DeviceSetupWizard from './screens/DeviceSetupWizard'
import ChoosePlan from './screens/ChoosePlan'
import Success from './screens/Success'
import Home from './screens/Home'
import Trips from './screens/Trips'
import Settings from './screens/Settings'
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

// ─── Constants ────────────────────────────────────────

const SCREENS = ['welcome', 'auth', 'signup', 'scan', 'vehicle', 'details', 'deviceSetup', 'choosePlan', 'success']

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

const transition = { type: 'spring', stiffness: 380, damping: 38, mass: 0.8 }

export default function App() {
  const [step, setStep]             = useState(0)
  const [dir, setDir]               = useState(1)
  const [appPhase, setAppPhase]     = useState('onboarding')
  const [mainScreen, setMainScreen] = useState('home')
  const [panelOpen, setPanelOpen]   = useState(false)

  const next        = () => { setDir(1);  setStep(s => Math.min(s + 1, SCREENS.length - 1)) }
  const back        = () => { setDir(-1); setStep(s => Math.max(s - 1, 0)) }
  const goTo        = (i: number) => { setDir(i > step ? 1 : -1); setStep(i) }
  const enterApp    = () => setAppPhase('main')
  const skipToScan  = () => { setDir(1); setStep(SCREENS.indexOf('scan')) }

  const screen          = SCREENS[step]
  const onboardingStep  = step - 2
  const totalOnboarding = 6

  const screenProps = { next, back, goTo, step: onboardingStep, total: totalOnboarding, onEnterApp: enterApp, onOAuthLogin: skipToScan }

  const renderOnboardingScreen = () => {
    switch (screen) {
      case 'welcome': return <Welcome    {...screenProps} />
      case 'auth':    return <Auth       {...screenProps} />
      case 'signup':  return <SignUp     {...screenProps} />
      case 'vehicle': return <AddVehicle {...screenProps} />
      case 'details': return <VehicleDetails {...screenProps} />
      case 'scan':        return <ScanDevice        {...screenProps} />
      case 'deviceSetup': return <DeviceSetupWizard {...screenProps} />
      case 'choosePlan':  return <ChoosePlan        {...screenProps} />
      case 'success':     return <Success            {...screenProps} onEnterApp={enterApp} />
      default:        return null
    }
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
          {/* Left content — shrinks when panel opens */}
          <ContentPane>
            {mainScreen === 'home' ? <Home /> : mainScreen === 'trips' ? <Trips /> : <Settings />}
            <BottomTabs
              current={mainScreen}
              onNavigate={setMainScreen}
              onChatOpen={() => setPanelOpen(true)}
              chatActive={panelOpen}
            />
          </ContentPane>

          {/* Right panel — slides in and pushes layout */}
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
              {renderOnboardingScreen()}
            </OnboardingFrame>
          </MotionOnboardingSlide>
        </AnimatePresence>
      )}
    </AppRoot>
  )
}
