import { DATE_MODES, getDateRange, formatDisplayDate } from '../utils/dateUtils.js'

const MODE_LABELS = {
  [DATE_MODES.MONDAY]:    'Monday',
  [DATE_MODES.WEDNESDAY]: 'Wednesday',
  [DATE_MODES.FRIDAY]:    'Friday',
  [DATE_MODES.CUSTOM]:    'Custom',
}

export default function DateModeSelector({
  mode,
  onModeChange,
  customStart,
  customEnd,
  onCustomChange,
  dateRange,
}) {
  return (
    <div className="date-selector-bar">
      <div className="date-selector-left">
        <div className="date-seg">
          {Object.values(DATE_MODES).map(m => (
            <button
              key={m}
              className={`date-seg-btn${mode === m ? ' on' : ''}`}
              onClick={() => onModeChange(m)}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        {mode === DATE_MODES.CUSTOM && (
          <div className="date-custom-inputs">
            <input
              type="date"
              className="date-input"
              value={customStart}
              onChange={e => onCustomChange('start', e.target.value)}
            />
            <span className="date-to">→</span>
            <input
              type="date"
              className="date-input"
              value={customEnd}
              onChange={e => onCustomChange('end', e.target.value)}
            />
          </div>
        )}
      </div>

      {dateRange && (
        <div className="date-selector-right">
          <span className="date-label">{dateRange.label}</span>
          {dateRange.sublabel && (
            <span className="date-sublabel">{dateRange.sublabel}</span>
          )}
          <span className="date-range-chip">
            {formatDisplayDate(dateRange.start)} — {formatDisplayDate(dateRange.end)}
          </span>
        </div>
      )}
    </div>
  )
}
