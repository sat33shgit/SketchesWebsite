import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
  <div className="footer-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
          <Link to="/privacy" aria-label="Privacy Policy" style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</Link>
          <span style={{ color: '#6b7280' }}>·</span>
          <Link to="/contact" aria-label="Contact" style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}>Contact</Link>
        </div>

        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          © 2025 Sateesh Boggarapu. All artwork is original and protected by copyright.
        </div>
      </div>
    </footer>
  )
}

export default Footer
