import { Droplet } from 'lucide-react'

const TINT_LEVELS = [
  { id: 'clear', label: 'Clear', value: 0.1, hex: '#e2e8f0', desc: 'No tint, maximum visibility' },
  { id: 'light', label: 'Light', value: 0.4, hex: '#94a3b8', desc: '35% tint, subtle privacy' },
  { id: 'dark', label: 'Dark', value: 0.7, hex: '#334155', desc: '20% tint, sleek & private' },
  { id: 'limo', label: 'Limo', value: 0.95, hex: '#020617', desc: '5% tint, maximum privacy' }
]

export default function TintSelector({ selectedValue, onChange }) {
  return (
    <div className="finish-options" role="group" aria-label="Window tint options">
      {TINT_LEVELS.map((tint) => {
        const isActive = Math.abs(tint.value - selectedValue) < 0.01
        return (
          <div
            key={tint.id}
            className={`finish-option ${isActive ? 'active' : ''}`}
            onClick={() => onChange(tint.value)}
            role="radio"
            aria-checked={isActive}
            tabIndex={0}
            id={`tint-${tint.id}`}
            onKeyDown={(e) => e.key === 'Enter' && onChange(tint.value)}
          >
            <div className="finish-icon" aria-hidden="true" style={{ color: tint.hex }}>
              <Droplet size={16} strokeWidth={2} fill={isActive ? tint.hex : 'transparent'} />
            </div>
            <div className="finish-info">
              <div className="finish-name">{tint.label}</div>
              <div className="finish-desc">{tint.desc}</div>
            </div>
            <div className="finish-check" aria-hidden="true">
              {isActive ? '✓' : ''}
            </div>
          </div>
        )
      })}
    </div>
  )
}
