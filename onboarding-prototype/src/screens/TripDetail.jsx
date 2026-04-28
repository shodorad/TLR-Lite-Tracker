import { useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api'
import { ChevronLeft, Zap, TrendingUp, AlertTriangle, ShieldCheck, MapPin, Clock, Gauge, Flame } from 'lucide-react'

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

const MAP_OPTIONS = {
  styles: DARK_MAP_STYLES,
  disableDefaultUI: true,
  gestureHandling: 'none',
  clickableIcons: false,
}

const SCORE_CONFIG = {
  A: { color: '#C8FF00', label: 'Excellent drive', ringColor: '#C8FF00' },
  B: { color: '#F59E0B', label: 'Good drive',      ringColor: '#F59E0B' },
  C: { color: '#E8656A', label: 'Fair drive',       ringColor: '#E8656A' },
  D: { color: '#E8656A', label: 'Poor drive',       ringColor: '#E8656A' },
}

const EVENT_CONFIG = {
  brake: { Icon: Zap,          color: '#E8656A', bg: 'rgba(232,101,106,0.10)', label: 'Hard Braking' },
  accel: { Icon: TrendingUp,   color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', label: 'Rapid Accel' },
  speed: { Icon: AlertTriangle, color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', label: 'Speed Alert' },
}

function computeCenter(route) {
  if (!route || route.length === 0) return { lat: 40.7484, lng: -73.9967 }
  return {
    lat: route.reduce((s, p) => s + p.lat, 0) / route.length,
    lng: route.reduce((s, p) => s + p.lng, 0) / route.length,
  }
}

function RouteMap({ route }) {
  const mapRef = useRef(null)
  const center = computeCenter(route)
  const start = route[0]
  const end = route[route.length - 1]

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  })

  const onLoad = useCallback((map) => {
    mapRef.current = map
    if (window.google && route.length > 1) {
      const bounds = new window.google.maps.LatLngBounds()
      route.forEach(p => bounds.extend(p))
      map.fitBounds(bounds, 48)
    }
  }, [route])

  const startIcon = isLoaded ? {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 8, fillColor: '#C8FF00', fillOpacity: 1,
    strokeColor: '#000', strokeWeight: 2,
  } : null

  const endIcon = isLoaded ? {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 8, fillColor: '#E8656A', fillOpacity: 1,
    strokeColor: '#fff', strokeWeight: 2,
  } : null

  if (loadError) return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>Map unavailable</p>
    </div>
  )

  if (!isLoaded) return <div style={{ width: '100%', height: '100%', background: '#0d0d14' }} />

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center}
      zoom={13}
      options={MAP_OPTIONS}
      onLoad={onLoad}
    >
      <Polyline path={route} options={{ strokeColor: '#C8FF00', strokeOpacity: 0.95, strokeWeight: 4, zIndex: 1 }} />
      <Marker position={start} icon={startIcon} />
      <Marker position={end} icon={endIcon} />
    </GoogleMap>
  )
}

function ScoreGauge({ score }) {
  const cfg = SCORE_CONFIG[score] || SCORE_CONFIG.A
  const radius = 34
  const stroke = 5
  const norm = radius - stroke / 2
  const circ = 2 * Math.PI * norm
  const pct = ({ A: 1, B: 0.75, C: 0.5, D: 0.25 })[score] ?? 1
  const offset = circ * (1 - pct)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: radius * 2, height: radius * 2, flexShrink: 0 }}>
        <svg width={radius * 2} height={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={radius} cy={radius} r={norm} stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} fill="none" />
          <circle
            cx={radius} cy={radius} r={norm}
            stroke={cfg.color} strokeWidth={stroke} fill="none"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: cfg.color, fontFamily: 'Inter, sans-serif' }}>{score}</span>
        </div>
      </div>
      <div>
        <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>Driving Score</p>
        <p style={{ color: cfg.color, fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif', marginTop: 3 }}>{cfg.label}</p>
      </div>
    </div>
  )
}

function StatPill({ label, value }) {
  return (
    <div style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
      <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.2px' }}>{value}</p>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'Inter, sans-serif', marginTop: 4, letterSpacing: '0.2px' }}>{label}</p>
    </div>
  )
}

const Card = ({ children, delay = 0, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 320, damping: 28, delay }}
    style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 18,
      padding: '16px',
      marginBottom: 10,
      ...style,
    }}
  >
    {children}
  </motion.div>
)

export default function TripDetail({ trip, onBack }) {
  const scoreCfg = SCORE_CONFIG[trip.score] || SCORE_CONFIG.A

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 380, damping: 38 }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0d0d14', paddingTop: 44 }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 16px 12px',
        background: 'rgba(8,10,18,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onBack}
          style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.09)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <ChevronLeft size={18} color="#fff" />
        </motion.button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            color: '#fff', fontSize: 15, fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {trip.name}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Inter, sans-serif', marginTop: 1 }}>
            {trip.date} · {trip.start} – {trip.end}
          </p>
        </div>
        {/* Score indicator in header */}
        <div style={{
          padding: '4px 10px', borderRadius: 8,
          background: scoreCfg.color + '18',
          border: `1px solid ${scoreCfg.color}30`,
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: scoreCfg.color, fontFamily: 'Inter, sans-serif' }}>{trip.score}</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ height: 230, flexShrink: 0, position: 'relative' }}
        >
          <RouteMap route={trip.route} />
          {/* gradient fade into content */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
            background: 'linear-gradient(to bottom, transparent, #0d0d14)',
            pointerEvents: 'none',
          }} />
        </motion.div>

        <div style={{ padding: '6px 14px 0' }}>

          {/* Stats row */}
          <Card delay={0.08} style={{ display: 'flex', justifyContent: 'space-around', padding: '16px 8px' }}>
            <StatPill label="Distance"  value={trip.distance} />
            <div style={{ width: 1, background: 'rgba(255,255,255,0.07)', alignSelf: 'stretch' }} />
            <StatPill label="Duration"  value={trip.duration} />
            <div style={{ width: 1, background: 'rgba(255,255,255,0.07)', alignSelf: 'stretch' }} />
            <StatPill label="Avg Speed" value={trip.avgSpeed + ' mph'} />
            <div style={{ width: 1, background: 'rgba(255,255,255,0.07)', alignSelf: 'stretch' }} />
            <StatPill label="Max Speed" value={trip.maxSpeed + ' mph'} />
          </Card>

          {/* Driving score */}
          <Card delay={0.13}>
            <ScoreGauge score={trip.score} />
          </Card>

          {/* Route */}
          <Card delay={0.18}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 14 }}>Route</p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#C8FF00', boxShadow: '0 0 6px #C8FF0060' }} />
                <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.10)', margin: '4px 0' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#E8656A', boxShadow: '0 0 6px #E8656A60' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 3 }}>START</p>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{trip.startAddr}</p>
                </div>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 3 }}>END</p>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{trip.endAddr}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Events */}
          <Card delay={0.22}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 14 }}>Events</p>

            {trip.events.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                  background: 'rgba(200,255,0,0.10)',
                  border: '1px solid rgba(200,255,0,0.20)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ShieldCheck size={18} color="#C8FF00" />
                </div>
                <div>
                  <p style={{ color: '#C8FF00', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Clean drive</p>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'Inter, sans-serif', marginTop: 2 }}>No events recorded</p>
                </div>
              </div>
            ) : (
              trip.events.map((event, i) => {
                const cfg = EVENT_CONFIG[event.kind] || EVENT_CONFIG.brake
                const { Icon } = cfg
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 0',
                      borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                      background: cfg.bg,
                      border: `1px solid ${cfg.color}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={17} color={cfg.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{event.type}</p>
                      <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, fontFamily: 'Inter, sans-serif', marginTop: 2 }}>
                        {event.times.join(' · ')}
                      </p>
                    </div>
                    <div style={{
                      padding: '4px 9px', borderRadius: 8,
                      background: cfg.bg,
                      border: `1px solid ${cfg.color}25`,
                    }}>
                      <span style={{ color: cfg.color, fontSize: 12, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>×{event.count}</span>
                    </div>
                  </div>
                )
              })
            )}
          </Card>

        </div>
      </div>
    </motion.div>
  )
}
