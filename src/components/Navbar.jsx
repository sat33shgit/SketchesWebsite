import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from '../i18n'

const Navbar = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  
  const isActive = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/gallery')) {
      return true
    }
    return location.pathname === path
  }

  const { t } = useTranslation()

  return (
    <nav>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/images/logo.png" alt="Sateesh Sketches" className="logo-image" />
          <span className="logo-text">{t('ui.nav.logoText')}</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link
            to="/"
            className={isActive('/') ? 'active' : ''}
          >
            {t('ui.nav.gallery')}
          </Link>
          <Link
            to="/about"
            className={isActive('/about') ? 'active' : ''}
          >
            {t('ui.nav.about')}
          </Link>
          <Link
            to="/contact"
            className={isActive('/contact') ? 'active' : ''}
          >
            {t('ui.nav.contact')}
          </Link>
        </div>

        {/* Mobile hamburger toggle (shown on small screens) */}
        <button
          className="hamburger"
          aria-label={menuOpen ? t('ui.nav.closeMenu') : t('ui.nav.openMenu')}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Right side icons */}
        <div className="social-links">
          {/* (search icon removed per request) */}
        </div>
      </div>

      {/* Mobile menu (renders below header when open) */}
      {menuOpen && (
        <div className="mobile-menu" role="menu" aria-label={t('ui.nav.mobileMenuLabel')}>
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setMenuOpen(false)}>{t('ui.nav.gallery')}</Link>
          <Link to="/about" className={isActive('/about') ? 'active' : ''} onClick={() => setMenuOpen(false)}>{t('ui.nav.about')}</Link>
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''} onClick={() => setMenuOpen(false)}>{t('ui.nav.contact')}</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
