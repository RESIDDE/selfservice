import { useState } from 'react'
import { Car, Shield, ChevronRight, Zap } from 'lucide-react'

export const CAR_CATALOG = [
  {
    id: 'sports',
    name: 'Sports Class',
    type: 'Coupe / Supercar',
    category: 'sports',
    modelUrl: '/models/ferrari.glb',
    description: 'Low-slung, aerodynamic profiles designed for maximum performance and aggressive styling.',
    specs: { class: 'Sports', form: '2-Door Coupe' },
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80&auto=format&fit=crop',
    accentColor: '#e63946',
    cameraPos: [4.5, 1.8, 4.5],
    scale: 1.0,
    yOffset: -0.05,
  },
  {
    id: 'suv',
    name: 'SUV Class (Land Cruiser)',
    type: 'Luxury SUV',
    category: 'suv',
    modelUrl: '/models/land_cruiser_2025/scene.gltf',
    description: 'Commanding presence with a higher ride height and substantial surface area for premium protection.',
    specs: { class: 'SUV', form: '4-Door SUV' },
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80&auto=format&fit=crop',
    accentColor: '#6366f1',
    cameraPos: [5, 2.5, 5],
    scale: 1.0,
    yOffset: -0.5,
  },
  {
    id: 'g63',
    name: 'Mercedes-AMG G63',
    type: 'Luxury SUV',
    category: 'suv',
    modelUrl: '/models/g63/scene.gltf',
    description: 'Iconic boxy design meets AMG twin-turbo V8 power. Massive flat panels perfect for PPF.',
    specs: { class: 'SUV', form: 'Off-Road Luxury' },
    image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=600&q=80',
    accentColor: '#10b981',
    cameraPos: [6, 2.5, 6],
    scale: 1.0,
    yOffset: -0.5,
  },
  {
    id: 'escalade',
    name: 'Cadillac Escalade',
    type: 'Luxury SUV',
    category: 'suv',
    modelUrl: '/models/escalade/scene.gltf',
    description: 'The pinnacle of American luxury SUVs. Expansive side panels requiring premium protection.',
    specs: { class: 'SUV', form: 'Full-Size' },
    image: 'https://images.unsplash.com/photo-1549479342-99781ce73b88?w=600&q=80',
    accentColor: '#f59e0b',
    cameraPos: [7, 3, 7],
    scale: 1.0,
    yOffset: -0.5,
  },
  {
    id: 'sedan',
    name: 'Sedan Class',
    type: 'Luxury Sedan',
    category: 'sedan',
    modelUrl: '/models/toycar.glb',
    description: 'Timeless four-door styling combining elegant lines with executive luxury.',
    specs: { class: 'Sedan', form: '4-Door Executive' },
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80&auto=format&fit=crop',
    accentColor: '#10b981',
    cameraPos: [3.5, 1.5, 3.5],
    scale: 18.0,
    yOffset: -0.05,
  },
  {
    id: 'truck',
    name: 'Truck Class',
    type: 'Pickup Truck',
    category: 'truck',
    modelUrl: '/models/truck.glb',
    description: 'Rugged capability meets massive panel sizing. Requires specialized heavy-duty PPF coverage.',
    specs: { class: 'Truck', form: 'Pickup' },
    image: 'https://images.unsplash.com/photo-1551829142-d9b8e6c4ae27?w=600&q=80&auto=format&fit=crop',
    accentColor: '#f59e0b',
    cameraPos: [6, 2.5, 6],
    scale: 1.0,
    yOffset: -0.5,
  },
]


const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Classes', icon: <Car size={13} /> },
  { id: 'sports', label: 'Sports', icon: <Zap size={13} /> },
  { id: 'suv', label: 'SUV', icon: <Shield size={13} /> },
  { id: 'sedan', label: 'Sedan', icon: <Car size={13} /> },
  { id: 'truck', label: 'Truck', icon: <Car size={13} /> },
]

export default function CarSelector({ onSelect, onBack }) {
  const [filter, setFilter] = useState('all')
  const [hovered, setHovered] = useState(null)

  const filtered = filter === 'all'
    ? CAR_CATALOG
    : CAR_CATALOG.filter(c => c.category === filter)

  return (
    <div className="car-selector-overlay">
      {/* Background orbs */}
      <div className="selector-bg" aria-hidden="true">
        <div className="selector-orb selector-orb-1" />
        <div className="selector-orb selector-orb-2" />
        <div className="selector-orb selector-orb-3" />
      </div>

      <div className="selector-content">
        {/* Header */}
        <div className="selector-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="selector-brand">
              <Car size={14} strokeWidth={2} />
              <span className="selector-brand-text">Abuja Cars <span>PPF Studio</span></span>
            </div>
            {onBack && (
              <button
                className="change-car-btn"
                onClick={onBack}
                id="back-to-home-btn"
                aria-label="Back to home"
              >
                ← Home
              </button>
            )}
          </div>
          <h1 className="selector-title">
            Which car are you<br />
            <span className="selector-title-accent">protecting today?</span>
          </h1>
          <p className="selector-subtitle">
            Select your vehicle to begin the real-time 3D color & PPF visualization
          </p>
        </div>

        {/* Category Filter */}
        <div className="selector-filters" role="group" aria-label="Filter cars by type">
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f.id}
              className={`filter-chip ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
              id={`filter-${f.id}`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>

        {/* Car Grid */}
        <div className="car-grid" role="list">
          {filtered.map((car, i) => (
            <div
              key={car.id}
              className={`car-card ${hovered === car.id ? 'hovered' : ''}`}
              style={{ animationDelay: `${i * 0.08}s` }}
              onMouseEnter={() => setHovered(car.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(car)}
              role="listitem"
              tabIndex={0}
              id={`car-card-${car.id}`}
              onKeyDown={e => e.key === 'Enter' && onSelect(car)}
              aria-label={`Select ${car.name}`}
            >
              {/* Car Image */}
              <div className="car-card-visual">
                <img
                  src={car.image}
                  alt={car.name}
                  className="car-card-image"
                  loading="lazy"
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                {/* Fallback icon if image fails */}
                <div className="car-card-img-fallback" style={{ display: 'none' }}>
                  <Car size={48} strokeWidth={1} style={{ color: car.accentColor, opacity: 0.6 }} />
                </div>
                <div
                  className="car-card-image-overlay"
                  style={{ background: `linear-gradient(to top, ${car.accentColor}33 0%, transparent 50%)` }}
                />
                <div className="car-card-glow" style={{ background: car.accentColor }} />
              </div>

              {/* Info */}
              <div className="car-card-info">
                <div className="car-card-category" style={{ color: car.accentColor }}>
                  {car.type}
                </div>
                <h3 className="car-card-name">{car.name}</h3>
                <p className="car-card-desc">{car.description}</p>

                <div className="car-card-specs">
                  {Object.entries(car.specs).map(([key, val]) => (
                    <div key={key} className="car-spec-item">
                      <span className="car-spec-key">{key}</span>
                      <span className="car-spec-val">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="car-card-cta">
                <button
                  className="car-select-btn"
                  style={{ background: `linear-gradient(135deg, ${car.accentColor}, ${car.accentColor}bb)` }}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  Configure in 3D
                  <ChevronRight size={15} strokeWidth={2.5} style={{ display: 'inline', marginLeft: 4 }} />
                </button>
              </div>

              {/* Corner accent */}
              <div
                className="car-card-corner"
                style={{ background: car.accentColor }}
              />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="selector-footer">
          <Shield size={13} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
          All configurations include a real-time PPF visualization — see your exact protection finish before booking
        </p>
      </div>
    </div>
  )
}
