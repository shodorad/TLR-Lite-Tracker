import carImage from '../../Car_images/vecteezy_white-city-car-isolated-on-transparent-background-3d_29913559.png'

/**
 * Car3D — 3/4 perspective render with GPS pin overlay.
 * Uses the pre-rendered 3D PNG (transparent background).
 */
export default function Car3D({ width = 320, glowColor = '#C8FF00' }) {
  const glowRgba = glowColor === '#4ade80'
    ? 'rgba(74,222,128,0.24)'
    : 'rgba(200,255,0,0.20)'

  return (
    <div style={{
      position: 'relative',
      width,
      margin: '0 auto',
      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.55))',
    }}>
      {/* Ground glow */}
      <div style={{
        position: 'absolute',
        bottom: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70%',
        height: 28,
        background: `radial-gradient(ellipse, ${glowRgba} 0%, transparent 70%)`,
        filter: 'blur(12px)',
        pointerEvents: 'none',
      }} />

      {/* 3D car render */}
      <img
        src={carImage}
        alt="Vehicle"
        style={{
          width: '100%',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* GPS pin — floats above the car roof */}
      <div style={{
        position: 'absolute',
        // ~42% from left (above roof center), ~2% from top
        top: '2%',
        left: '42%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
          <defs>
            <filter id="pinGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Ambient glow */}
          <circle cx="14" cy="14" r="13"
            fill="rgba(200,255,0,0.20)"
            filter="url(#pinGlow)"
          />
          {/* Teardrop */}
          <path
            d="M14 2 C8 2 3 7 3 13 C3 20 10 27 14 33 C18 27 25 20 25 13 C25 7 20 2 14 2Z"
            fill="#C8FF00"
            filter="url(#pinGlow)"
          />
          {/* Inner dot */}
          <circle cx="14" cy="13" r="5" fill="rgba(255,255,255,0.92)" />
        </svg>

        {/* Dashed guide line from pin to roof */}
        <svg width="2" height="18" viewBox="0 0 2 18" style={{ marginTop: -1 }}>
          <line x1="1" y1="0" x2="1" y2="18"
            stroke="rgba(200,255,0,0.45)" strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        </svg>
      </div>
    </div>
  )
}
