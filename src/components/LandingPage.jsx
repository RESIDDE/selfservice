import { useState, useEffect, useRef } from 'react'
import {
  Car, Shield, MessageCircle, Map, Video, LayoutGrid,
  Wrench, Database, QrCode, BarChart3, Key, Building2,
  Handshake, ChevronRight, Star, Zap, Eye, Calendar,
  Phone, ArrowRight, Sparkles, Play, Wifi,
} from 'lucide-react'

/* ─── Service Data ─────────────────────────────────────────── */
const SERVICES = [
  {
    id: 'enquiry',
    icon: MessageCircle,
    label: 'Enquiry',
    desc: 'Ask our team anything — instant response.',
    accent: '#ff6b35',
    tag: 'Instant',
  },
  {
    id: 'gis',
    icon: Map,
    label: 'GIS Display',
    desc: 'Geo-mapped inventory across the city.',
    accent: '#6366f1',
    tag: 'Live Map',
  },
  {
    id: 'talk',
    icon: Phone,
    label: 'Talk to Staff',
    desc: 'Direct line to our team or CEO.',
    accent: '#10b981',
    tag: 'Direct',
  },
  {
    id: 'showroom',
    icon: Video,
    label: 'View Showroom',
    desc: 'Immersive virtual showroom tour.',
    accent: '#f0b429',
    tag: '3D Tour',
  },
  {
    id: 'inventory',
    icon: LayoutGrid,
    label: 'Our Inventory',
    desc: 'Browse our full premium catalogue.',
    accent: '#e879f9',
    tag: 'Live',
  },
  {
    id: 'ppf',
    icon: Shield,
    label: 'PPF & Custom',
    desc: 'Real-time 3D paint protection & colour.',
    accent: '#38bdf8',
    tag: '3D',
    ctaAction: 'configurator',
    featured: true,
  },
  {
    id: 'maintenance',
    icon: Wrench,
    label: 'Maintenance',
    desc: 'Schedule servicing & diagnostics.',
    accent: '#fb923c',
    tag: 'Book',
  },
  {
    id: 'data',
    icon: Database,
    label: 'Data & Records',
    desc: 'Manage your vehicle records securely.',
    accent: '#a78bfa',
    tag: 'Secure',
  },
  {
    id: 'scan',
    icon: QrCode,
    label: 'Our Platforms',
    desc: 'Scan to follow our channels.',
    accent: '#34d399',
    tag: 'QR',
  },
  {
    id: 'booking',
    icon: Calendar,
    label: 'Book Appointment',
    desc: 'Reserve your slot instantly.',
    accent: '#ff6b35',
    tag: 'Quick',
  },
  {
    id: 'qr',
    icon: Star,
    label: 'Save Car via QR',
    desc: 'Save your favourite cars to your phone.',
    accent: '#f0b429',
    tag: 'Mobile',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Analytics',
    desc: 'Track the most viewed models & trends.',
    accent: '#6366f1',
    tag: 'Insights',
  },
  {
    id: 'rental',
    icon: Key,
    label: 'Rent a Car',
    desc: 'Rent from our fleet right here.',
    accent: '#e879f9',
    tag: 'Now',
  },
  {
    id: 'properties',
    icon: Building2,
    label: 'Our Properties',
    desc: 'Explore Rolling Automobiles properties.',
    accent: '#fb923c',
    tag: 'Explore',
  },
  {
    id: 'partners',
    icon: Handshake,
    label: 'Our Partners',
    desc: 'Meet the brands we collaborate with.',
    accent: '#38bdf8',
    tag: 'Network',
  },
]

/* ─── Animated Counter ─────────────────────────────────────── */
function Counter({ to, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const step = Math.ceil(to / 50)
          const timer = setInterval(() => {
            start += step
            if (start >= to) { setCount(to); clearInterval(timer) }
            else setCount(start)
          }, 20)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [to])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ─── Kiosk Service Card ────────────────────────────────────── */
function KioskCard({ service, index, onNavigate }) {
  const [pressed, setPressed] = useState(false)
  const Icon = service.icon

  const handleTap = () => {
    setPressed(true)
    setTimeout(() => setPressed(false), 300)
    if (service.ctaAction) onNavigate(service.ctaAction)
  }

  return (
    <button
      className={`kiosk-card ${pressed ? 'kiosk-card-pressed' : ''} ${service.featured ? 'kiosk-card-featured' : ''}`}
      style={{ '--card-accent': service.accent, animationDelay: `${index * 0.04}s` }}
      onClick={handleTap}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setTimeout(() => setPressed(false), 300)}
      id={`service-${service.id}`}
      aria-label={service.label}
      type="button"
    >
      {/* Ripple bg */}
      <div className="kiosk-card-ripple" />

      {/* Tag pill */}
      <span className="kiosk-card-tag">{service.tag}</span>

      {/* Icon */}
      <div className="kiosk-card-icon">
        <Icon size={28} strokeWidth={1.6} />
      </div>

      {/* Label */}
      <span className="kiosk-card-label">{service.label}</span>

      {/* Desc */}
      <p className="kiosk-card-desc">{service.desc}</p>

      {/* Arrow indicator */}
      <div className="kiosk-card-chevron">
        <ChevronRight size={16} strokeWidth={2.5} />
      </div>

      {/* Bottom accent line */}
      <div className="kiosk-card-line" />
    </button>
  )
}

/* ─── Clock ─────────────────────────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="kiosk-clock">
      <span className="kiosk-clock-time">
        {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
      </span>
      <span className="kiosk-clock-date">
        {time.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
      </span>
    </div>
  )
}

/* ─── Main Kiosk Landing ────────────────────────────────────── */
export default function LandingPage({ onNavigate }) {
  const [videoLoaded, setVideoLoaded] = useState(false)

  return (
    <div className="kiosk-root">

      {/* ── Background Video ───────────────────────────────── */}
      <div className="kiosk-video-wrap" aria-hidden="true">
        <video
          className={`kiosk-video ${videoLoaded ? 'kiosk-video-ready' : ''}`}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
        >
          {/* Free luxury driving videos from Mixkit/Coverr */}
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-driving-through-the-city-at-night-5413-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-road-in-the-city-at-night-4381-large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Layered overlays */}
        <div className="kiosk-video-overlay" />
        <div className="kiosk-video-vignette" />
        <div className="kiosk-video-scanlines" />
      </div>

      {/* ── Ambient orbs (fallback/accent) ─────────────────── */}
      <div className="kiosk-orbs" aria-hidden="true">
        <div className="kiosk-orb kiosk-orb-1" />
        <div className="kiosk-orb kiosk-orb-2" />
      </div>

      {/* ── Kiosk Content ──────────────────────────────────── */}
      <div className="kiosk-scroll">

        {/* ════ SECTION 1 – Hero ════════════════════════════ */}
        <section className="kiosk-hero" aria-label="Welcome">

          {/* Top bar */}
          <div className="kiosk-topbar">
            <div className="kiosk-brand">
              <div className="kiosk-brand-icon">
                <Car size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="kiosk-brand-name">Rolling Automobiles</div>
                <div className="kiosk-brand-sub">Self-Service Kiosk</div>
              </div>
            </div>

            <div className="kiosk-topbar-right">
              <LiveClock />
            </div>
          </div>

          {/* Hero copy */}
          <div className="kiosk-hero-body">

            <h1 className="kiosk-hero-title">
              Everything<br />
              <span className="kiosk-hero-accent">at your</span><br />
              fingertips.
            </h1>

            <p className="kiosk-hero-sub">
              Browse inventory · Book appointments · Configure your car
              in real-time 3D · Rent vehicles · Talk to our team.
            </p>

            {/* Primary CTA */}
            <button
              className="kiosk-cta-main"
              id="kiosk-hero-config-btn"
              onClick={() => onNavigate('configurator')}
            >
              <Zap size={20} />
              <span>Launch 3D Configurator</span>
              <ArrowRight size={20} />
            </button>

            <button
              className="kiosk-cta-ghost"
              id="kiosk-hero-services-btn"
              onClick={() => document.getElementById('kiosk-services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Eye size={16} />
              <span>Explore All Services</span>
            </button>
          </div>

          {/* Stats row */}
          <div className="kiosk-stats-row">
            {[
              { val: 500, suf: '+', label: 'Vehicles' },
              { val: 15, suf: '', label: 'Services' },
              { val: 98, suf: '%', label: 'Satisfied' },
              { val: 24, suf: '/7', label: 'Uptime' },
            ].map(s => (
              <div key={s.label} className="kiosk-stat">
                <div className="kiosk-stat-num"><Counter to={s.val} suffix={s.suf} /></div>
                <div className="kiosk-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll cue */}
          <div className="kiosk-scroll-cue" aria-hidden="true">
            <div className="kiosk-scroll-line" />
            <span>SCROLL</span>
          </div>
        </section>

        {/* ════ SECTION 2 – Services Grid ══════════════════ */}
        <section className="kiosk-services" id="kiosk-services" aria-label="Services">

          <div className="kiosk-services-head">
            <div className="kiosk-eyebrow" style={{ justifyContent: 'center' }}>
              <LayoutGrid size={13} />
              <span>Self-Service Hub</span>
            </div>
            <h2 className="kiosk-section-title">Choose a service</h2>
            <p className="kiosk-section-sub">
              Tap any tile to access the service instantly.
            </p>
          </div>

          <div className="kiosk-grid" role="list">
            {SERVICES.map((svc, i) => (
              <KioskCard
                key={svc.id}
                service={svc}
                index={i}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>

        {/* ════ SECTION 3 – Bottom CTA ═════════════════════ */}
        <section className="kiosk-bottom" aria-label="3D Configurator">
          <div className="kiosk-bottom-glow" aria-hidden="true" />

          <div className="kiosk-eyebrow" style={{ justifyContent: 'center' }}>
            <Shield size={13} />
            <span>Paint Protection Film Studio</span>
          </div>

          <h2 className="kiosk-bottom-title">See your car in 3D</h2>
          <p className="kiosk-bottom-sub">
            Visualise every colour, finish & PPF layer
            before you book — all in real-time.
          </p>

          <button
            className="kiosk-cta-main kiosk-cta-xl"
            id="kiosk-bottom-launch-btn"
            onClick={() => onNavigate('configurator')}
          >
            <Zap size={22} />
            <span>Launch the Configurator</span>
            <ArrowRight size={22} />
          </button>

          {/* Footer */}
          <div className="kiosk-footer">
            <div className="kiosk-brand" style={{ justifyContent: 'center' }}>
              <div className="kiosk-brand-icon kiosk-brand-icon-sm">
                <Car size={14} strokeWidth={2} />
              </div>
              <div>
                <div className="kiosk-brand-name" style={{ fontSize: '0.85rem' }}>Rolling Automobiles</div>
                <div className="kiosk-brand-sub">Abuja, Nigeria · © 2025</div>
              </div>
            </div>
          </div>
        </section>

      </div>{/* /kiosk-scroll */}
    </div>
  )
}
