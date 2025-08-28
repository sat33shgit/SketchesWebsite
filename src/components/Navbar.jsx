import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  
  const isActive = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/gallery')) {
      return true
    }
    return location.pathname === path
  }

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
          <span className="logo-text">Sateesh's Sketch Book</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link
            to="/"
            className={isActive('/') ? 'active' : ''}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={isActive('/about') ? 'active' : ''}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={isActive('/contact') ? 'active' : ''}
          >
            Contact
          </Link>
        </div>

        {/* Right side icons */}
        <div className="social-links">
          {/* Search Icon */}
          <button>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
