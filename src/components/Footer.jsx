import { Link } from 'react-router-dom'
import { useTranslation } from '../i18n'

const Footer = () => {
  const { t } = useTranslation()
  return (
    <footer>
      <div className="footer-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
          <Link to="/privacy" aria-label={t('ui.footer.privacy', 'Privacy Policy')} style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}>{t('ui.footer.privacy', 'Privacy Policy')}</Link>
          <span style={{ color: '#6b7280' }}>·</span>
          <Link to="/contact" aria-label={t('ui.footer.contact', 'Contact')} style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}>{t('ui.footer.contact', 'Contact')}</Link>
        </div>

        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          {t('ui.footer.copyright', '© 2025 Sateesh Sketches. All artwork is original and protected by copyright. v1.0.0')}
        </div>
      </div>
    </footer>
  )
}

export default Footer
