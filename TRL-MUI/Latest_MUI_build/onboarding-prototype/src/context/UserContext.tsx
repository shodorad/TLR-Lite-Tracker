import { createContext, useContext, useState } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'

export interface User {
  firstName: string
  lastName: string
  phone: string
  email: string
}

export interface Vehicle {
  vin: string
  nickname: string
  plate: string
  model: string
}

export interface Plan {
  type: 'monthly' | 'annual'
  price: number
}

interface UserContextType {
  user: User
  setUser: Dispatch<SetStateAction<User>>
  vehicle: Vehicle
  setVehicle: Dispatch<SetStateAction<Vehicle>>
  deviceScanned: boolean
  setDeviceScanned: Dispatch<SetStateAction<boolean>>
  deviceReady: boolean
  setDeviceReady: Dispatch<SetStateAction<boolean>>
  plan: Plan | null
  setPlan: Dispatch<SetStateAction<Plan | null>>
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser]               = useState<User>({ firstName: '', lastName: '', phone: '', email: '' })
  const [vehicle, setVehicle]         = useState<Vehicle>({ vin: '', nickname: '', plate: '', model: '' })
  const [deviceScanned, setDeviceScanned] = useState(false)
  const [deviceReady,   setDeviceReady]   = useState(false)
  const [plan, setPlan]               = useState<Plan | null>(null)

  return (
    <UserContext.Provider value={{
      user, setUser,
      vehicle, setVehicle,
      deviceScanned, setDeviceScanned,
      deviceReady, setDeviceReady,
      plan, setPlan,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext(): UserContextType {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUserContext must be used within UserProvider')
  return ctx
}
