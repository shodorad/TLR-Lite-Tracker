import Welcome from '../pages/Welcome'
import Auth from '../pages/Auth'
import SignUp from '../pages/SignUp'
import AddVehicle from '../pages/AddVehicle'
import VehicleDetails from '../pages/VehicleDetails'
import ScanDevice from '../pages/ScanDevice'
import DeviceSetupWizard from '../pages/DeviceSetupWizard'
import ChoosePlan from '../pages/ChoosePlan'
import Success from '../pages/Success'
import Home from '../pages/Home'
import Trips from '../pages/Trips'
import Settings from '../pages/Settings'

export const ONBOARDING_SCREENS = [
  'welcome',
  'auth',
  'signup',
  'scan',
  'vehicle',
  'details',
  'deviceSetup',
  'choosePlan',
  'success',
] as const

export type OnboardingScreen = (typeof ONBOARDING_SCREENS)[number]
export type MainScreen = 'home' | 'trips' | 'settings'

export interface ScreenProps {
  next: () => void
  back: () => void
  goTo: (i: number) => void
  step: number
  total: number
  onEnterApp: () => void
  onOAuthLogin: () => void
}

export function renderOnboardingScreen(screen: OnboardingScreen, props: ScreenProps) {
  switch (screen) {
    case 'welcome':     return <Welcome           {...props} />
    case 'auth':        return <Auth              {...props} />
    case 'signup':      return <SignUp            {...props} />
    case 'vehicle':     return <AddVehicle        {...props} />
    case 'details':     return <VehicleDetails    {...props} />
    case 'scan':        return <ScanDevice        {...props} />
    case 'deviceSetup': return <DeviceSetupWizard {...props} />
    case 'choosePlan':  return <ChoosePlan        {...props} />
    case 'success':     return <Success           {...props} onEnterApp={props.onEnterApp} />
    default:            return null
  }
}

export function renderMainScreen(screen: MainScreen) {
  switch (screen) {
    case 'home':     return <Home />
    case 'trips':    return <Trips />
    case 'settings': return <Settings />
  }
}

export { Home, Trips, Settings }
