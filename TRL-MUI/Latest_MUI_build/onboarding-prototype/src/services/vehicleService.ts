const API_BASE = import.meta.env.VITE_API_BASE_URL

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  licensePlate: string
}

export async function getVehicles(): Promise<Vehicle[]> {
  const res = await fetch(`${API_BASE}/vehicles`)
  if (!res.ok) throw new Error('Failed to fetch vehicles')
  return res.json()
}

export async function addVehicle(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
  const res = await fetch(`${API_BASE}/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to add vehicle')
  return res.json()
}

export async function deleteVehicle(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/vehicles/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete vehicle')
}
