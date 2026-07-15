import { Sparkles, Layers, PaintBucket } from 'lucide-react'

const FINISHES = [
  {
    id: 'gloss',
    icon: <Sparkles size={16} strokeWidth={2} />,
    name: 'Gloss',
    desc: 'Shiny, reflective, classic look',
  },
  {
    id: 'metallic',
    icon: <Layers size={16} strokeWidth={2} />,
    name: 'Metallic',
    desc: 'Sparkle flakes, premium finish',
  },
  {
    id: 'matte',
    icon: <PaintBucket size={16} strokeWidth={2} />,
    name: 'Matte',
    desc: 'Flat, modern, stealthy aesthetic',
  },
]

export default function FinishSelector({ selected, onChange }) {
  return (
    <div className="finish-options" role="group" aria-label="Paint finish options">
      {FINISHES.map((f) => (
        <div
          key={f.id}
          className={`finish-option ${selected === f.id ? 'active' : ''}`}
          onClick={() => onChange(f.id)}
          role="radio"
          aria-checked={selected === f.id}
          tabIndex={0}
          id={`finish-${f.id}`}
          onKeyDown={(e) => e.key === 'Enter' && onChange(f.id)}
        >
          <div className="finish-icon" aria-hidden="true">{f.icon}</div>
          <div className="finish-info">
            <div className="finish-name">{f.name}</div>
            <div className="finish-desc">{f.desc}</div>
          </div>
          <div className="finish-check" aria-hidden="true">
            {selected === f.id ? '✓' : ''}
          </div>
        </div>
      ))}
    </div>
  )
}
