import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser]               = useState({ firstName: '', lastName: '', phone: '', email: '' })
  const [vehicle, setVehicle]         = useState({ vin: '', nickname: '', plate: '', model: '' })
  const [deviceScanned, setDeviceScanned] = useState(false)
  const [deviceReady,   setDeviceReady]   = useState(false)
  const [plan, setPlan]               = useState(null) // null | { type: 'monthly'|'annual', price: number }

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

export function useUserContext() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUserContext must be used within UserProvider')
  return ctx
}
