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
          <h1>{t('about.title', 'About Me')}</h1>
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
              <h2>{t('about.profile.name', 'Sateesh')}</h2>
              <br></br>
              <p>{t('about.profile.role', 'Portrait & Sketch Artist')}</p>
            </div>
          </div>

          {/* Content */}
          <div className="about-text">
            {/* Bio */}
            <div>
              <p>{t('about.bio.p1', 'I am a passionate artist with over a decade of experience in portrait and sketch art. My journey began in childhood, inspired by the beauty of human expressions and the stories they tell.')}</p>
            </div>
            <div>
              <p>{t('about.bio.p2', 'Through my art, I strive to capture not just the physical appearance, but the essence and personality of my subjects. Each sketch is a conversation between the artist and the viewer.')}</p>
            </div>
          </div>
          <div className="artist-statement-card">
            <h3>{t('about.artistStatement.heading', 'Artist Statement')}</h3>
            <p>{t('about.artistStatement.body', 'Art is the language of the soul. Through sketches and portraits, I aim to create a bridge between the inner world of emotions and the outer expression of beauty. Every line drawn is a step towards understanding humanity.')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
