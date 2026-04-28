import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Welcome from './screens/Welcome.jsx'
import Auth from './screens/Auth.jsx'
import SignUp from './screens/SignUp.jsx'
import AddVehicle from './screens/AddVehicle.jsx'
import VehicleDetails from './screens/VehicleDetails.jsx'
import ScanDevice from './screens/ScanDevice.jsx'
import DeviceSetupWizard from './screens/DeviceSetupWizard.jsx'
import ChoosePlan from './screens/ChoosePlan.jsx'
import Success from './screens/Success.jsx'
import Home from './screens/Home.jsx'
import Trips from './screens/Trips.jsx'
import Settings from './screens/Settings.jsx'
import BottomTabs from './components/BottomTabs.jsx'

const SCREENS = ['welcome', 'auth', 'signup', 'scan', 'vehicle', 'details', 'deviceSetup', 'choosePlan', 'success']

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

const transition = { type: 'spring', stiffness: 380, damping: 38, mass: 0.8 }

export default function App() {
  const [step, setStep]             = useState(0)
  const [dir, setDir]               = useState(1)
  const [appPhase, setAppPhase]     = useState('onboarding')
  const [mainScreen, setMainScreen] = useState('home')

  const next        = () => { setDir(1);  setStep(s => Math.min(s + 1, SCREENS.length - 1)) }
  const back        = () => { setDir(-1); setStep(s => Math.max(s - 1, 0)) }
  const goTo        = (i) => { setDir(i > step ? 1 : -1); setStep(i) }
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
  const statusBarColor = 'rgba(255,255,255,0.80)'
  const homeIndicatorColor = isMainApp ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.22)'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse 70% 50% at 30% 40%, rgba(200,255,0,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 75% 60%, rgba(180,230,0,0.03) 0%, transparent 60%),
          #000
        `,
      }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: 390,
          height: 844,
          borderRadius: 48,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.06),
            0 0 0 10px #0a0a0a,
            0 0 0 11px rgba(255,255,255,0.04),
            0 48px 120px rgba(0,0,0,0.85),
            0 0 80px rgba(200,255,0,0.05)
          `,
        }}
      >
        {/* Aurora blobs — onboarding backdrop */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: '#000' }}>
          <div style={{ position: 'absolute', top: -80,  left: '40%',  transform: 'translateX(-50%)', width: 380, height: 380, background: 'radial-gradient(circle, rgba(200,255,0,0.07) 0%, transparent 65%)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', bottom: 60, right: -60, width: 300, height: 300, background: 'radial-gradient(circle, rgba(180,230,0,0.04) 0%, transparent 65%)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', top: 180, left: -40, width: 220, height: 220, background: 'radial-gradient(circle, rgba(200,255,0,0.04) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        </div>

        {/* Status bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px' }}>
          <span style={{ color: statusBarColor, fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', transition: 'color 0.3s' }}>9:41</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <SignalIcon color={statusBarColor} />
            <WifiIcon color={statusBarColor} />
            <BatteryIcon color={statusBarColor} />
          </div>
        </div>

        {/* Screen content */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
          {isMainApp ? (
            <motion.div
              key="main-app"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              style={{ position: 'absolute', inset: 0 }}
            >
              {mainScreen === 'home' ? <Home /> : mainScreen === 'trips' ? <Trips /> : <Settings />}
              <BottomTabs current={mainScreen} onNavigate={setMainScreen} />
            </motion.div>
          ) : (
            <AnimatePresence custom={dir} mode="popLayout" initial={false}>
              <motion.div
                key={screen}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                style={{ position: 'absolute', inset: 0 }}
              >
                {renderOnboardingScreen()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Home indicator */}
        <div style={{
          position: 'absolute', bottom: 8, left: '50%',
          transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 3,
          background: homeIndicatorColor,
          zIndex: 50,
          transition: 'background 0.3s',
        }} />
      </div>
    </div>
  )
}

function SignalIcon({ color }) {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
      <rect x="0"    y="7"   width="3" height="5"  rx="1" fill={color} />
      <rect x="4.5"  y="4.5" width="3" height="7.5" rx="1" fill={color} />
      <rect x="9"    y="2"   width="3" height="10"  rx="1" fill={color} />
      <rect x="13.5" y="0"   width="3" height="12"  rx="1" fill={color} />
    </svg>
  )
}

function WifiIcon({ color }) {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <path d="M8 9.5L8 11.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M5.2 7.2C6.2 6.2 7 5.8 8 5.8C9 5.8 9.8 6.2 10.8 7.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M2.5 4.5C4 3 5.9 2 8 2C10.1 2 12 3 13.5 4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function BatteryIcon({ color }) {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={color}/>
      <rect x="2" y="2" width="15" height="8" rx="2" fill={color}/>
      <path d="M23 4V8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
