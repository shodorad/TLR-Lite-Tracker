const API_BASE = import.meta.env.VITE_API_BASE_URL

export interface Trip {
  id: string
  vehicleId: string
  startTime: string
  endTime: string
  distanceMiles: number
  startAddress: string
  endAddress: string
}

export async function getTrips(vehicleId?: string): Promise<Trip[]> {
  const url = vehicleId
    ? `${API_BASE}/trips?vehicleId=${vehicleId}`
    : `${API_BASE}/trips`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch trips')
  return res.json()
}

export async function getTripById(id: string): Promise<Trip> {
  const res = await fetch(`${API_BASE}/trips/${id}`)
  if (!res.ok) throw new Error('Failed to fetch trip')
  return res.json()
}
