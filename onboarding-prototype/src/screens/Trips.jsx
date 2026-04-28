import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, Route, ChevronRight, Calendar } from 'lucide-react'
import TripDetail from './TripDetail.jsx'

const TRIPS = [
  {
    id: 1, date: 'Today', name: 'Morning Commute',
    start: '8:14 AM', end: '8:42 AM', distance: '4.2 mi', duration: '28 min',
    avgSpeed: 9, maxSpeed: 38, score: 'A',
    startAddr: '247 Atlantic Ave, Brooklyn', endAddr: '1 Penn Plaza, Manhattan',
    scoreColor: '#C8FF00',
    events: [],
    route: [
      { lat: 40.6878, lng: -73.9894 }, { lat: 40.6921, lng: -73.9840 },
      { lat: 40.7000, lng: -73.9773 }, { lat: 40.7072, lng: -73.9964 },
      { lat: 40.7128, lng: -74.0059 }, { lat: 40.7484, lng: -73.9967 },
    ],
  },
  {
    id: 2, date: 'Today', name: 'Lunch Run',
    start: '12:05 PM', end: '12:18 PM', distance: '1.8 mi', duration: '13 min',
    avgSpeed: 8, maxSpeed: 29, score: 'A',
    startAddr: '1 Penn Plaza, Manhattan', endAddr: '45 W 34th St, Manhattan',
    scoreColor: '#C8FF00',
    events: [],
    route: [
      { lat: 40.7484, lng: -73.9967 }, { lat: 40.7495, lng: -73.9900 },
      { lat: 40.7506, lng: -73.9875 }, { lat: 40.7484, lng: -73.9876 },
    ],
  },
  {
    id: 3, date: 'Yesterday', name: 'Evening Commute',
    start: '5:30 PM', end: '6:08 PM', distance: '5.1 mi', duration: '38 min',
    avgSpeed: 8, maxSpeed: 44, score: 'B',
    startAddr: '1 Penn Plaza, Manhattan', endAddr: '247 Atlantic Ave, Brooklyn',
    scoreColor: '#F59E0B',
    events: [
      { type: 'Hard Braking', kind: 'brake', count: 2, times: ['5:41 PM', '5:58 PM'] },
    ],
    route: [
      { lat: 40.7484, lng: -73.9967 }, { lat: 40.7128, lng: -74.0059 },
      { lat: 40.7072, lng: -73.9964 }, { lat: 40.7000, lng: -73.9773 },
      { lat: 40.6921, lng: -73.9840 }, { lat: 40.6878, lng: -73.9894 },
    ],
  },
  {
    id: 4, date: 'Yesterday', name: 'Grocery Run',
    start: '10:20 AM', end: '10:35 AM', distance: '2.3 mi', duration: '15 min',
    avgSpeed: 9, maxSpeed: 31, score: 'A',
    startAddr: '247 Atlantic Ave, Brooklyn', endAddr: "Trader Joe's, Court St, Brooklyn",
    scoreColor: '#C8FF00',
    events: [],
    route: [
      { lat: 40.6878, lng: -73.9894 }, { lat: 40.6840, lng: -73.9910 },
      { lat: 40.6870, lng: -73.9950 }, { lat: 40.6854, lng: -73.9930 },
    ],
  },
  {
    id: 5, date: 'Apr 15', name: 'Morning Commute',
    start: '8:22 AM', end: '8:49 AM', distance: '4.0 mi', duration: '27 min',
    avgSpeed: 9, maxSpeed: 41, score: 'B',
    startAddr: '247 Atlantic Ave, Brooklyn', endAddr: '1 Penn Plaza, Manhattan',
    scoreColor: '#F59E0B',
    events: [
      { type: 'Rapid Accel', kind: 'accel', count: 1, times: ['8:30 AM'] },
      { type: 'Speed Alert', kind: 'speed', count: 1, times: ['8:35 AM'] },
    ],
    route: [
      { lat: 40.6878, lng: -73.9894 }, { lat: 40.6940, lng: -73.9820 },
      { lat: 40.7050, lng: -73.9780 }, { lat: 40.7200, lng: -73.9950 },
      { lat: 40.7484, lng: -73.9967 },
    ],
  },
  {
    id: 6, date: 'Apr 15', name: 'Evening Commute',
    start: '5:45 PM', end: '6:22 PM', distance: '5.3 mi', duration: '37 min',
    avgSpeed: 9, maxSpeed: 47, score: 'C',
    startAddr: '1 Penn Plaza, Manhattan', endAddr: '247 Atlantic Ave, Brooklyn',
    scoreColor: '#E8656A',
    events: [
      { type: 'Hard Braking', kind: 'brake', count: 3, times: ['5:52 PM', '6:04 PM', '6:18 PM'] },
      { type: 'Rapid Accel', kind: 'accel', count: 2, times: ['5:50 PM', '6:02 PM'] },
    ],
    route: [
      { lat: 40.7484, lng: -73.9967 }, { lat: 40.7200, lng: -73.9950 },
      { lat: 40.7050, lng: -73.9780 }, { lat: 40.6940, lng: -73.9820 },
      { lat: 40.6878, lng: -73.9894 },
    ],
  },
]

const FILTER_OPTIONS = ['All', 'Today', 'Yesterday', 'Apr 15']

const weeklyStats = {
  trips: TRIPS.length,
  distance: TRIPS.reduce((s, t) => s + parseFloat(t.distance), 0).toFixed(1),
  duration: (() => {
    const total = TRIPS.reduce((s, t) => s + parseInt(t.duration), 0)
    return `${Math.floor(total / 60)}h ${total % 60}m`
  })(),
}

function FilterSheet({ active, onSelect, onClose }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 20 }}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 21,
          background: '#0d1018',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
          borderRadius: '24px 24px 0 0',
          padding: '12px 20px 48px',
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)', margin: '0 auto 22px' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(200,255,0,0.10)', border: '1px solid rgba(200,255,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SlidersHorizontal size={15} color="#C8FF00" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Inter, sans-serif' }}>Filter Trips</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={14} color="rgba(255,255,255,0.5)" />
          </button>
        </div>

        <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 12 }}>DATE RANGE</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
          {FILTER_OPTIONS.map(opt => (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelect(opt)}
              style={{
                padding: '9px 18px', borderRadius: 50, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                border: active === opt ? '1px solid rgba(200,255,0,0.35)' : '1px solid rgba(255,255,255,0.10)',
                background: active === opt ? 'rgba(200,255,0,0.12)' : 'rgba(255,255,255,0.04)',
                color: active === opt ? '#C8FF00' : 'rgba(255,255,255,0.55)',
                transition: 'all 0.15s',
              }}
            >
              {opt}
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { onSelect('All'); onClose() }}
            style={{
              flex: 1, padding: '13px', borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.04)',
              fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600,
              color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
            }}
          >
            Reset
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onClose}
            style={{
              flex: 2, padding: '13px', borderRadius: 14, border: 'none',
              background: '#C8FF00',
              fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 800,
              color: '#000', cursor: 'pointer',
            }}
          >
            Apply
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}

function TripCard({ trip, index, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 + index * 0.045, type: 'spring', stiffness: 340, damping: 30 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelect(trip)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '13px 14px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 16,
        marginBottom: 8,
        border: '1px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
      }}
    >
      {/* Route icon in score color */}
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: trip.scoreColor + '18',
        border: `1px solid ${trip.scoreColor}28`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Route size={18} color={trip.scoreColor} />
      </div>

      {/* Trip info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          color: '#fff', fontSize: 14, fontWeight: 600,
          fontFamily: 'Inter, sans-serif', marginBottom: 3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {trip.name}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>
          {trip.start} → {trip.end}
        </p>
      </div>

      {/* Stats + score */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif', marginBottom: 3 }}>
          {trip.distance}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>
          {trip.duration}
        </p>
      </div>

      {/* Score pill */}
      <div style={{
        width: 28, height: 28, borderRadius: 9, flexShrink: 0,
        background: trip.scoreColor + '18',
        border: `1px solid ${trip.scoreColor}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: trip.scoreColor, fontFamily: 'Inter, sans-serif' }}>
          {trip.score}
        </span>
      </div>

      <ChevronRight size={14} color="rgba(255,255,255,0.18)" style={{ flexShrink: 0 }} />
    </motion.div>
  )
}

export default function Trips() {
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [showFilter, setShowFilter] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')

  if (selectedTrip) {
    return <TripDetail trip={selectedTrip} onBack={() => setSelectedTrip(null)} />
  }

  const filtered = activeFilter === 'All' ? TRIPS : TRIPS.filter(t => t.date === activeFilter)
  const grouped = filtered.reduce((acc, trip) => {
    if (!acc[trip.date]) acc[trip.date] = []
    acc[trip.date].push(trip)
    return acc
  }, {})

  let cardIndex = 0

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: '#0d0d14', paddingTop: 44, position: 'relative',
    }}>

      {/* Header */}
      <div style={{
        padding: '14px 18px 13px',
        background: 'rgba(8,10,18,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{
            color: '#fff', fontSize: 22, fontWeight: 800,
            fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px',
          }}>
            Trips
          </h1>
          {activeFilter !== 'All' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                fontSize: 11, fontWeight: 700, color: '#C8FF00',
                background: 'rgba(200,255,0,0.12)',
                border: '1px solid rgba(200,255,0,0.25)',
                borderRadius: 20, padding: '3px 9px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {activeFilter}
            </motion.span>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setShowFilter(true)}
          style={{
            width: 36, height: 36, borderRadius: 11,
            background: activeFilter !== 'All' ? 'rgba(200,255,0,0.12)' : 'rgba(255,255,255,0.06)',
            border: activeFilter !== 'All' ? '1px solid rgba(200,255,0,0.25)' : '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <SlidersHorizontal size={16} color={activeFilter !== 'All' ? '#C8FF00' : 'rgba(255,255,255,0.45)'} />
        </motion.button>
      </div>

      {/* Weekly summary */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28, delay: 0.06 }}
        style={{
          margin: '14px 16px 0',
          padding: '16px 20px',
          background: 'rgba(200,255,0,0.05)',
          border: '1px solid rgba(200,255,0,0.12)',
          borderRadius: 18,
          display: 'flex', justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        {[
          { label: 'Trips', value: weeklyStats.trips },
          { label: 'Distance', value: weeklyStats.distance + ' mi' },
          { label: 'Drive Time', value: weeklyStats.duration },
        ].map(({ label, value }, i) => (
          <div key={label} style={{ textAlign: 'center' }}>
            {i > 0 && (
              <div style={{ position: 'absolute' }} />
            )}
            <p style={{ color: '#C8FF00', fontSize: 19, fontWeight: 800, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.4px' }}>{value}</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter, sans-serif', marginTop: 3 }}>{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Trip list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px', paddingBottom: 90 }}>
        {Object.keys(grouped).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 0' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Calendar size={22} color="rgba(255,255,255,0.2)" />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>No trips for this period</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, trips]) => (
            <div key={date} style={{ marginBottom: 4 }}>
              <p style={{
                color: 'rgba(255,255,255,0.28)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.8px', textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
                marginBottom: 8, marginTop: 16, paddingLeft: 2,
              }}>
                {date}
              </p>
              {trips.map(trip => (
                <TripCard key={trip.id} trip={trip} index={cardIndex++} onSelect={setSelectedTrip} />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Filter sheet */}
      <AnimatePresence>
        {showFilter && (
          <FilterSheet
            active={activeFilter}
            onSelect={setActiveFilter}
            onClose={() => setShowFilter(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
