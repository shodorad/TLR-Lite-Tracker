import { useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api'
import { useUserContext } from '../../context/UserContext'
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

// ─── Styled Components ────────────────────────────────

const HomeRoot = styled(Box)({
  height: '100%',
  position: 'relative',
  backgroundColor: '#000',
})

const MapContainer = styled(Box)({
  position: 'absolute',
  inset: 0,
})

const MapFallbackRoot = styled(Box)({
  width: '100%',
  height: '100%',
  backgroundColor: '#0d0d14',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const MapFallbackText = styled(Typography)({
  color: 'rgba(255,255,255,0.3)',
  fontSize: 12,
})

const MapLoadingBox = styled(Box)({
  width: '100%',
  height: '100%',
  backgroundColor: '#0d0d14',
})

const TopGradient = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 140,
  zIndex: 2,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)',
  pointerEvents: 'none',
})

// FloatingHeader styled elements
const HeaderShell = styled('div')({
  position: 'absolute',
  top: 16,
  left: 12,
  right: 12,
  zIndex: 30,
  background: 'rgba(10,12,20,0.96)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  padding: '10px 14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})
const MotionHeaderShell = motion(HeaderShell)

const HeaderLeft = styled(Box)({})

const VehicleRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
})

const VehicleLabel = styled(Typography)({
  fontSize: 15,
  fontWeight: 800,
  letterSpacing: '-0.4px',
})

const DeviceSubtitle = styled(Typography)({
  color: 'rgba(255,255,255,0.26)',
  fontSize: 10,
  marginTop: '1px',
})

const HeaderRight = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

const NotificationButton = styled(Button)({
  minWidth: 0,
  width: 30,
  height: 30,
  borderRadius: '50%',
  padding: 0,
  backgroundColor: 'rgba(255,255,255,0.07)',
})

const AvatarBadge = styled(Box)({
  width: 30,
  height: 30,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #C8FF00, #8FB800)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11,
  fontWeight: 800,
  color: '#000',
})

// TripInfoCard styled elements
const TripCardShell = styled('div')({
  position: 'absolute',
  top: 80,
  left: 12,
  right: 12,
  zIndex: 20,
  background: 'rgba(12,15,22,0.90)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 18,
  padding: '10px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
})
const MotionTripCardShell = motion(TripCardShell)

const TripCardContent = styled(Box)({
  flex: 1,
})

const TripBadgeRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '3px',
})

const TripBadge = styled(Box)({
  backgroundColor: 'rgba(200,255,0,0.12)',
  border: '1px solid rgba(200,255,0,0.22)',
  borderRadius: '99px',
  padding: '2px 8px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
})

const TripBadgeLabel = styled(Typography)({
  color: '#C8FF00',
  fontSize: 9.5,
  fontWeight: 700,
})

const TripTitle = styled(Typography)({
  fontSize: 14,
  fontWeight: 700,
  marginBottom: '2px',
})

const TripDestRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
})

const TripDestIcon = styled(Box)({
  width: 18,
  height: 18,
  borderRadius: '5px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 8,
  fontWeight: 800,
  color: 'rgba(255,255,255,0.6)',
})

const TripDestText = styled(Typography)({
  color: 'rgba(255,255,255,0.40)',
  fontSize: 11,
})

const GoButton = styled(Button)({
  minWidth: 0,
  width: 42,
  height: 42,
  borderRadius: '13px',
  padding: 0,
  flexShrink: 0,
  fontSize: 12,
  fontWeight: 800,
})

// Recenter button
const RecenterButton = styled(Button)({
  position: 'absolute',
  bottom: 90,
  right: 16,
  minWidth: 0,
  width: 36,
  height: 36,
  borderRadius: '50%',
  padding: 0,
  backgroundColor: 'rgba(12,15,22,0.88)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  zIndex: 30,
  boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
})

// ─── Motion wrappers ──────────────────────────────────

const MotionNotificationButton = motion(NotificationButton)
const MotionRecenterButton = motion(RecenterButton)
const MotionGoButton = motion(GoButton)

// ─── MapView ──────────────────────────────────────────

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
      <MapFallbackRoot>
        <MapFallbackText>Map unavailable</MapFallbackText>
      </MapFallbackRoot>
    )
  }

  if (!isLoaded) return <MapLoadingBox />

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

function FloatingHeader() {
  const { vehicle } = useUserContext()
  const vehicleLabel = vehicle.nickname || vehicle.model || 'My Vehicle'
  return (
    <MotionHeaderShell
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 28 }}
    >
      <HeaderLeft>
        <VehicleRow>
          <VehicleLabel>{vehicleLabel}</VehicleLabel>
          <ChevronDown size={12} color="rgba(255,255,255,0.38)" />
        </VehicleRow>
        <DeviceSubtitle>OBD-II · 352602116146553</DeviceSubtitle>
      </HeaderLeft>
      <HeaderRight>
        <MotionNotificationButton
          whileTap={{ scale: 0.90 }}
          variant="outlined"
        >
          <Bell size={13} color="rgba(255,255,255,0.55)" />
        </MotionNotificationButton>
        <AvatarBadge>S</AvatarBadge>
      </HeaderRight>
    </MotionHeaderShell>
  )
}

// ─── Trip Info Card ───────────────────────────────────

function TripInfoCard() {
  return (
    <MotionTripCardShell
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.28, type: 'spring', stiffness: 300, damping: 28 }}
    >
      <TripCardContent>
        <TripBadgeRow>
          <TripBadge>
            <Zap size={9} color="#C8FF00" />
            <TripBadgeLabel>Live Trip</TripBadgeLabel>
          </TripBadge>
        </TripBadgeRow>
        <TripTitle>Morning Commute</TripTitle>
        <TripDestRow>
          <TripDestIcon>AC</TripDestIcon>
          <TripDestText>Candace Ln · 5 mins away</TripDestText>
        </TripDestRow>
      </TripCardContent>
      <MotionGoButton
        whileTap={{ scale: 0.92 }}
        variant="contained"
      >
        GO
      </MotionGoButton>
    </MotionTripCardShell>
  )
}

// ─── Main ─────────────────────────────────────────────

export default function Home() {
  return (
    <HomeRoot>

      {/* Full-screen map */}
      <MapContainer>
        <MapView />
      </MapContainer>

      {/* Top gradient — prevents map bleed behind header cards */}
      <TopGradient />

      <FloatingHeader />
      <TripInfoCard />

      {/* Recenter button */}
      <MotionRecenterButton
        whileTap={{ scale: 0.90 }}
        variant="outlined"
      >
        <LocateFixed size={15} color="#C8FF00" />
      </MotionRecenterButton>

    </HomeRoot>
  )
}
