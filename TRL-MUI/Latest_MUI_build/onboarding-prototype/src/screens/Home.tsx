import { useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api'
import { useUserContext } from '../context/UserContext'
import { ChevronDown, Bell, Zap, LocateFixed } from 'lucide-react'

// ─── Google Map ───────────────────────────────────────

const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0d0d14' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d0d14' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a1a24' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#242430' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f1f2e' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#060d14' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
]

const ROUTE_PATH = [
  { lat: 40.7484, lng: -73.9967 },
  { lat: 40.7495, lng: -73.9875 },
  { lat: 40.7530, lng: -73.9826 },
  { lat: 40.7559, lng: -73.9800 },
  { lat: 40.7580, lng: -73.9758 },
  { lat: 40.7614, lng: -73.9776 },
]

const CAR_POSITION  = ROUTE_PATH[0]
const DEST_POSITION = ROUTE_PATH[ROUTE_PATH.length - 1]
const MAP_CENTER    = { lat: 40.7550, lng: -73.9870 }

const MAP_OPTIONS = {
  styles: DARK_MAP_STYLES,
  disableDefaultUI: true,
  gestureHandling: 'greedy',
  clickableIcons: false,
  zoomControl: false,
  streetViewControl: false,
  fullscreenControl: false,
}

const POLYLINE_OPTIONS = {
  strokeColor: '#C8FF00',
  strokeOpacity: 0.95,
  strokeWeight: 4,
  zIndex: 1,
}

function MapView() {
  const mapRef = useRef(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  })

  const onLoad = useCallback((map) => { mapRef.current = map }, [])

  const carIcon = isLoaded ? {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8, fillColor: '#C8FF00', fillOpacity: 1,
    strokeColor: '#000', strokeWeight: 2,
  } : null

  const destIcon = isLoaded ? {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 7, fillColor: '#fff', fillOpacity: 1,
    strokeColor: '#000', strokeWeight: 2,
  } : null

  if (loadError) {
    return (
      <Box sx={{ width: '100%', height: '100%', bgcolor: '#0d0d14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Map unavailable</Typography>
      </Box>
    )
  }

  if (!isLoaded) return <Box sx={{ width: '100%', height: '100%', bgcolor: '#0d0d14' }} />

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={MAP_CENTER}
      zoom={14}
      options={MAP_OPTIONS}
      onLoad={onLoad}
    >
      <Polyline path={ROUTE_PATH} options={POLYLINE_OPTIONS} />
      <Marker position={CAR_POSITION}  icon={carIcon}  />
      <Marker position={DEST_POSITION} icon={destIcon} />
    </GoogleMap>
  )
}

// ─── Floating Header ──────────────────────────────────

const MotionButton = motion(Button)

function FloatingHeader() {
  const { vehicle } = useUserContext()
  const vehicleLabel = vehicle.nickname || vehicle.model || 'My Vehicle'
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 28 }}
      style={{
        position: 'absolute', top: 16, left: 12, right: 12, zIndex: 30,
        background: 'rgba(10,12,20,0.96)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: '10px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.4px' }}>
            {vehicleLabel}
          </Typography>
          <ChevronDown size={12} color="rgba(255,255,255,0.38)" />
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.26)', fontSize: 10, mt: '1px' }}>
          OBD-II · 352602116146553
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MotionButton
          whileTap={{ scale: 0.90 }}
          variant="outlined"
          sx={{ minWidth: 0, width: 30, height: 30, borderRadius: '50%', p: 0, bgcolor: 'rgba(255,255,255,0.07)' }}
        >
          <Bell size={13} color="rgba(255,255,255,0.55)" />
        </MotionButton>
        <Box sx={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'linear-gradient(135deg, #C8FF00, #8FB800)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, color: '#000',
        }}>S</Box>
      </Box>
    </motion.div>
  )
}

// ─── Trip Info Card ───────────────────────────────────

function TripInfoCard() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.28, type: 'spring', stiffness: 300, damping: 28 }}
      style={{
        position: 'absolute', top: 80, left: 12, right: 12, zIndex: 20,
        background: 'rgba(12,15,22,0.90)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 18, padding: '10px 12px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '3px' }}>
          <Box sx={{
            bgcolor: 'rgba(200,255,0,0.12)', border: '1px solid rgba(200,255,0,0.22)',
            borderRadius: '99px', p: '2px 8px',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <Zap size={9} color="#C8FF00" />
            <Typography sx={{ color: 'primary.main', fontSize: 9.5, fontWeight: 700 }}>Live Trip</Typography>
          </Box>
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: '2px' }}>Morning Commute</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Box sx={{ width: 18, height: 18, borderRadius: '5px', bgcolor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>
            AC
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.40)', fontSize: 11 }}>Candace Ln · 5 mins away</Typography>
        </Box>
      </Box>
      <MotionButton
        whileTap={{ scale: 0.92 }}
        variant="contained"
        sx={{ minWidth: 0, width: 42, height: 42, borderRadius: '13px', p: 0, flexShrink: 0, fontSize: 12, fontWeight: 800 }}
      >
        GO
      </MotionButton>
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────

export default function Home() {
  return (
    <Box sx={{ height: '100%', position: 'relative', bgcolor: '#000' }}>

      {/* Full-screen map */}
      <Box sx={{ position: 'absolute', inset: 0 }}>
        <MapView />
      </Box>

      {/* Top gradient — prevents map bleed behind header cards */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 140, zIndex: 2,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <FloatingHeader />
      <TripInfoCard />

      {/* Recenter button */}
      <MotionButton
        whileTap={{ scale: 0.90 }}
        variant="outlined"
        sx={{
          position: 'absolute',
          bottom: 90, right: 16,
          minWidth: 0, width: 36, height: 36, borderRadius: '50%', p: 0,
          bgcolor: 'rgba(12,15,22,0.88)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          zIndex: 30,
          boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
        }}
      >
        <LocateFixed size={15} color="#C8FF00" />
      </MotionButton>

    </Box>
  )
}
