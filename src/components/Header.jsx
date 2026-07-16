import { Car, Shield } from 'lucide-react'

export default function Header() {
  return (
    <header className="app-header">
      <a className="header-logo" href="/" aria-label="Abuja Cars Home">
        <div className="logo-icon" style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }} aria-hidden="true">
          <img src="/logop.jpg" alt="Abuja Cars Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="logo-text">
          Abuja Cars
          <div className="logo-sub">PPF Studio</div>
        </div>
      </a>

      <nav className="header-nav" aria-label="Header navigation">
        <div className="header-badge">
          <span className="badge-dot" aria-hidden="true" />
          3D Live Preview
        </div>
        <button
          className="header-cta-btn"
          id="header-book-btn"
          onClick={() => {
            document.getElementById('booking-cta-section')?.scrollIntoView({ behavior: 'smooth' })
          }}
          aria-label="Book PPF service"
        >
          Book PPF Service
        </button>
      </nav>
    </header>
  )
}
