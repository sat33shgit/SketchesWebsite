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
          <div className="logo-icon">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
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
