import { motion } from 'framer-motion'
import { Box, Typography, IconButton } from '@mui/material'
import { ChevronRight, SlidersHorizontal, Route } from 'lucide-react'
import { glassCard } from '../styles/glass'

const TRIPS = [
  { id: 1, date: 'Today',     name: 'Morning Commute',  start: '8:14 AM',  end: '8:42 AM',  distance: '4.2 mi', duration: '28 min', color: '#C8FF00' },
  { id: 2, date: 'Today',     name: 'Lunch Run',         start: '12:05 PM', end: '12:18 PM', distance: '1.8 mi', duration: '13 min', color: '#C8FF00' },
  { id: 3, date: 'Yesterday', name: 'Evening Commute',   start: '5:30 PM',  end: '6:08 PM',  distance: '5.1 mi', duration: '38 min', color: '#C8FF00' },
  { id: 4, date: 'Yesterday', name: 'Grocery Run',       start: '10:20 AM', end: '10:35 AM', distance: '2.3 mi', duration: '15 min', color: '#C8FF00' },
  { id: 5, date: 'Apr 15',    name: 'Morning Commute',   start: '8:22 AM',  end: '8:49 AM',  distance: '4.0 mi', duration: '27 min', color: '#C8FF00' },
  { id: 6, date: 'Apr 15',    name: 'Evening Commute',   start: '5:45 PM',  end: '6:22 PM',  distance: '5.3 mi', duration: '37 min', color: '#C8FF00' },
]

const grouped = TRIPS.reduce((acc, trip) => {
  if (!acc[trip.date]) acc[trip.date] = []
  acc[trip.date].push(trip)
  return acc
}, {})

function TripCard({ trip, index }) {
  const cappedDelay = 0.03 + Math.min(index, 4) * 0.025
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: cappedDelay, type: 'spring', stiffness: 320, damping: 28 }}
    >
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: '12px',
        p: '13px 14px',
        ...glassCard,
        borderRadius: '14px', mb: '8px',
        cursor: 'pointer',
      }}>
        {/* Color stripe */}
        <Box sx={{ width: 3, height: 44, borderRadius: '4px', bgcolor: trip.color, flexShrink: 0, opacity: 0.7 }} />

        {/* Trip info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{
            color: 'text.primary', fontSize: 14, fontWeight: 600, mb: '3px',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {trip.name}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
            {trip.start} → {trip.end}
          </Typography>
        </Box>

        {/* Stats */}
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Typography sx={{ color: 'text.primary', fontSize: 14, fontWeight: 700, mb: '3px' }}>
            {trip.distance}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
            {trip.duration}
          </Typography>
        </Box>

        <ChevronRight size={16} color="rgba(255,255,255,0.20)" style={{ flexShrink: 0 }} />
      </Box>
    </motion.div>
  )
}

export default function Trips() {
  let index = 0

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'transparent', pt: '44px' }}>

      {/* Header */}
      <Box sx={{
        p: '14px 20px 12px',
        bgcolor: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <Typography sx={{ color: 'text.primary', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Trips
        </Typography>
        <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.07)', borderRadius: '10px', width: 36, height: 36 }}>
          <SlidersHorizontal size={16} color="rgba(255,255,255,0.60)" />
        </IconButton>
      </Box>

      {/* Trip list */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: '12px 16px', pb: `${82 + 12}px` }}>
        {TRIPS.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: '12px', opacity: 0.5 }}>
            <Route size={36} color="rgba(255,255,255,0.30)" />
            <Typography sx={{ color: 'rgba(255,255,255,0.40)', fontSize: 14, textAlign: 'center', maxWidth: 220 }}>
              No trips yet. Start driving to see your history here.
            </Typography>
          </Box>
        ) : (
          Object.entries(grouped).map(([date, trips]) => (
            <Box key={date} sx={{ mb: '4px' }}>
              <Typography sx={{
                color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.6px', textTransform: 'uppercase',
                mb: '8px', pl: '2px',
              }}>
                {date}
              </Typography>
              {trips.map(trip => (
                <TripCard key={trip.id} trip={trip} index={index++} />
              ))}
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}
