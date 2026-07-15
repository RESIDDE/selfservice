import { useState, useEffect } from 'react'
import {
  Shield, MessageCircle, Map, Video, LayoutGrid,
  Wrench, Database, QrCode, BarChart3, Key, Building2,
  Handshake, Star, Zap, Calendar, Phone, X,
} from 'lucide-react'

/* ─── Service Data ─────────────────────────────────────────── */
const SERVICES = [
  { id: 'enquiry',     icon: MessageCircle, label: 'Enquiry',           desc: 'Instant answers from our team',       accent: '#e8e8ed' },
  { id: 'inventory',  icon: LayoutGrid,    label: 'Our Inventory',      desc: 'Browse our premium catalogue',        accent: '#e8e8ed' },
  { id: 'ppf',        icon: Shield,        label: 'PPF & Custom',       desc: 'Real-time 3D paint configuration',    accent: '#e8e8ed', ctaAction: 'configurator' },
  { id: 'booking',    icon: Calendar,      label: 'Book Appointment',   desc: 'Reserve your slot instantly',         accent: '#e8e8ed' },
  { id: 'talk',       icon: Phone,         label: 'Talk to Staff',      desc: 'Direct line to our team or CEO',      accent: '#e8e8ed' },
  { id: 'showroom',   icon: Video,         label: 'View Showroom',      desc: 'Immersive virtual 3D tour',           accent: '#e8e8ed' },
  { id: 'maintenance',icon: Wrench,        label: 'Maintenance',        desc: 'Schedule servicing & diagnostics',    accent: '#e8e8ed' },
  { id: 'rental',     icon: Key,           label: 'Rent a Car',         desc: 'Rent from our premium fleet',         accent: '#e8e8ed' },
  { id: 'gis',        icon: Map,           label: 'GIS Display',        desc: 'Geo-mapped inventory across the city',accent: '#e8e8ed' },
  { id: 'data',       icon: Database,      label: 'Data & Records',     desc: 'Manage your vehicle records',         accent: '#e8e8ed' },
  { id: 'analytics',  icon: BarChart3,     label: 'Analytics',          desc: 'Track trending models & insights',    accent: '#e8e8ed' },
  { id: 'scan',       icon: QrCode,        label: 'Our Platforms',      desc: 'Scan to follow our channels',         accent: '#e8e8ed' },
  { id: 'qr',         icon: Star,          label: 'Save Car via QR',    desc: 'Save favourites to your phone',       accent: '#e8e8ed' },
  { id: 'properties', icon: Building2,     label: 'Our Properties',     desc: 'Explore Abujacar locations',          accent: '#e8e8ed' },
  { id: 'partners',   icon: Handshake,     label: 'Our Partners',       desc: 'Meet the brands we work with',        accent: '#e8e8ed' },
]

/* ─── Live Clock ────────────────────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="kp-clock">
      <span className="kp-clock__time">
        {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
      </span>
      <span className="kp-clock__date">
        {time.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
      </span>
    </div>
  )
}

/* ─── Service Tile ──────────────────────────────────────────── */
function ServiceTile({ service, index, onNavigate, onClose }) {
  const [pressed, setPressed] = useState(false)
  const Icon = service.icon

  const handleTap = () => {
    setPressed(true)
    setTimeout(() => {
      setPressed(false)
      if (service.ctaAction) {
        onNavigate(service.ctaAction)
      } else {
        onClose()
      }
    }, 280)
  }

  return (
    <button
      className={`kp-tile ${pressed ? 'kp-tile--pressed' : ''}`}
      style={{ '--tile-accent': service.accent, animationDelay: `${0.04 + index * 0.035}s` }}
      onClick={handleTap}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setTimeout(() => setPressed(false), 280)}
      id={`tile-${service.id}`}
      aria-label={service.label}
      type="button"
    >
      <div className="kp-tile__glow" />
      <div className="kp-tile__icon">
        <Icon size={26} strokeWidth={1.5} />
      </div>
      <div className="kp-tile__text">
        <span className="kp-tile__label">{service.label}</span>
        <span className="kp-tile__desc">{service.desc}</span>
      </div>
      <div className="kp-tile__dot" />
    </button>
  )
}

/* ─── Main Component ────────────────────────────────────────── */
export default function LandingPage({ onNavigate }) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  const handleScreenTap = () => {
    if (!servicesOpen) setServicesOpen(true)
  }

  const handleClose = () => setServicesOpen(false)

  return (
    <div
      className={`kp-root ${mounted ? 'kp-root--mounted' : ''}`}
      onClick={handleScreenTap}
      role="button"
      tabIndex={0}
      aria-label="Tap to explore services"
      onKeyDown={(e) => e.key === 'Enter' && handleScreenTap()}
    >
      {/* ── Background ──────────────────────────────────────── */}
      <div className="kp-bg" aria-hidden="true">
        <video
          className={`kp-bg__video ${videoLoaded ? 'kp-bg__video--ready' : ''}`}
          autoPlay muted loop playsInline
          onCanPlay={() => setVideoLoaded(true)}
        >
          <source src="/my-car-video.mp4" type="video/mp4" />
        </video>
        <div className="kp-bg__overlay" />
        <div className="kp-bg__spotlight" />
        {/* Ghost watermark */}
        <div className="kp-bg__watermark" aria-hidden="true">
          <span>ABUJA</span>
          <span>CAR</span>
        </div>
      </div>

      {/* ── Top Bar: Clock only ──────────────────────────────── */}
      <header className="kp-topbar">
        <LiveClock />
      </header>

      {/* ══════════════════════════════════════════════════════
          LAYOUT: 3-zone portrait column
          Zone 1 (top ~30%)  — Logo
          Zone 2 (middle ~45%) — TAP animation (dominant)
          Zone 3 (bottom ~25%) — "Self-Service Centre" label
         ══════════════════════════════════════════════════════ */}
      <main className="kp-layout">

        {/* ── ZONE 1: Logo ─────────────────────────────────── */}
        <div className="kp-logo-zone">
          <div className="kp-logo-wrap">
            <img
              src="/logo.jpeg"
              alt="Abujacar Logo"
              className="kp-logo"
            />
            {/* Subtle glow ring behind logo */}
            <div className="kp-logo-glow" aria-hidden="true" />
          </div>
        </div>

        {/* ── ZONE 2: TAP animation (dominant centre) ──────── */}
        <div className={`kp-tap-zone ${servicesOpen ? 'kp-tap-zone--hidden' : ''}`}>
          {/* Outer glow halo */}
          <div className="kp-tap-halo" aria-hidden="true">
            <div className="kp-tap-halo__ring kp-tap-halo__ring--1" />
            <div className="kp-tap-halo__ring kp-tap-halo__ring--2" />
            <div className="kp-tap-halo__ring kp-tap-halo__ring--3" />
          </div>

          {/* Hand icon with tap animation */}
          <div className="kp-hand" aria-hidden="true">
            <div className="kp-hand__rings">
              <div className="kp-hand__ring kp-hand__ring--1" />
              <div className="kp-hand__ring kp-hand__ring--2" />
              <div className="kp-hand__ring kp-hand__ring--3" />
            </div>
            {/* Finger tap SVG */}
            <svg className="kp-hand__icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Index finger */}
              <rect x="35" y="8" width="10" height="36" rx="5" fill="white" opacity="0.9"/>
              {/* Middle finger */}
              <rect x="47" y="18" width="9" height="28" rx="4.5" fill="white" opacity="0.9"/>
              {/* Ring finger */}
              <rect x="58" y="22" width="9" height="24" rx="4.5" fill="white" opacity="0.9"/>
              {/* Pinky */}
              <rect x="68" y="26" width="7" height="20" rx="3.5" fill="white" opacity="0.9"/>
              {/* Thumb */}
              <rect x="22" y="30" width="15" height="9" rx="4.5" fill="white" opacity="0.9"/>
              {/* Palm */}
              <rect x="22" y="38" width="53" height="22" rx="11" fill="white" opacity="0.9"/>
            </svg>
          </div>

          {/* Big bold TAP text */}
          <p className="kp-tap-instruction">
            TOUCH ANYWHERE<br />TO BEGIN
          </p>
        </div>

        {/* ── ZONE 3: Self-Service label at bottom ─────────── */}
        <div className="kp-bottom-zone">
          <div className="kp-bottom-eyebrow">
            <span className="kp-bottom-eyebrow__dot" />
            <span>Africa's #1 Automotive Dealership</span>
            <span className="kp-bottom-eyebrow__dot" />
          </div>
          <h1 className="kp-bottom-title">
            Self&#8209;Service Centre
          </h1>
          <p className="kp-bottom-sub">Abuja, Nigeria · Est. 2014</p>
        </div>

      </main>

      {/* ── Services Drawer ───────────────────────────────────── */}
      <div
        className={`kp-drawer ${servicesOpen ? 'kp-drawer--open' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Available services"
      >
        <div
          className="kp-drawer__bar"
          onClick={handleClose}
          role="button"
          tabIndex={0}
          aria-label="Close"
          onKeyDown={(e) => e.key === 'Enter' && handleClose()}
        />

        <div className="kp-drawer__header">
          <div>
            <span className="kp-drawer__title">Select a Service</span>
            <span className="kp-drawer__sub">Tap any tile to continue</span>
          </div>
          <button
            className="kp-drawer__close"
            onClick={handleClose}
            id="drawer-close-btn"
            aria-label="Close"
            type="button"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="kp-services-grid">
          {SERVICES.map((svc, i) => (
            <ServiceTile
              key={svc.id}
              service={svc}
              index={i}
              onNavigate={onNavigate}
              onClose={handleClose}
            />
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {servicesOpen && (
        <div
          className="kp-backdrop"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
