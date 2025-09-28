import { getAssetPath } from '../utils/paths'
import useAnalytics from '../hooks/useAnalytics'
import { useTranslation } from '../i18n'

const About = () => {
  // Track page visit
  useAnalytics('about')
  
  const { t } = useTranslation()

  return (
    <div className="about-page">
      <div className="about-container">
        {/* Header */}
        <div className="about-header">
          <h1>{t('about.title')}</h1>
        </div>

        <div className="about-content">
          {/* Profile Image */}
          <div className="about-profile">
            <div className="profile-image">
              <img
                src={getAssetPath("/images/sateesh-profile.jpg")}
                alt="Sateesh"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                onAuxClick={(e) => { if (e.button === 1) e.preventDefault() }}
                onMouseDown={(e) => { if (e.button === 1) e.preventDefault() }}
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src);
                  e.target.src = "https://via.placeholder.com/256x256/374151/ffffff?text=Sateesh"
                }}
              />
            </div>
            <div className="profile-info">
              <h2>{t('about.profile.name')}</h2>
              <br></br>
              <p>{t('about.profile.role')}</p>
            </div>
          </div>

          {/* Content */}
          <div className="about-text">
            {/* Bio */}
            <div>
              <p>{t('about.bio.p1')}</p>
            </div>
            <div>
              <p>{t('about.bio.p2')}</p>
            </div>
          </div>
          <div className="artist-statement-card">
            <h3>{t('about.artistStatement.heading')}</h3>
            <p>{t('about.artistStatement.body')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
