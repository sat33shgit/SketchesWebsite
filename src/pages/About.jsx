import { getAssetPath } from '../utils/paths'
import useAnalytics from '../hooks/useAnalytics'
import { useTranslation } from '../i18n'
import useMaintenance from '../hooks/useMaintenance'
import MaintenanceOverlay from '../components/MaintenanceOverlay'

const About = () => {
  // Track page visit
  useAnalytics('about')
  
  const { t } = useTranslation()
  const { isMaintenanceMode } = useMaintenance()

  const aboutContent = (
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
              <h2>{t('about.profile.name', 'Sateesh Kumar Boggarapu')}</h2>
              <br></br>
              <p>{t('about.profile.role', 'Pencil Sketch Artist')}</p>
            </div>
          </div>

          {/* Content */}
          <div className="about-text">
            {/* Bio */}
            <div>
              <p>{t('about.bio.p1', 'I\'m an IT professional and pencil sketch artist living in Victoria, Canada, who grew up in India. I have a deep passion for capturing the essence of my subjects through detailed and life like portraits and still life drawings. My work reflects a profound understanding of light, shadow, and texture, bringing my art to life on paper using pencil(s).')}</p>
            </div>
            <div>
              <p><br></br>{t('about.bio.p2', 'I\'ve been passionate about art since I was a child. For over twenty years, I\'ve focused on creating detailed portraits and sketches.')}</p>
            </div>
            <div>
              <p><br></br>{t('about.bio.p3', 'My goal is to capture more than just what a person looks like; I want to show their true personality and feeling. I use light, shadow, and texture to bring my drawings to life on the page.')}</p>
            </div>
            <div>
              <p><br></br>{t('about.bio.p4', 'Every piece I create is like a conversation with the person looking at it. This dedication to emotion and detail has helped my work gain appreciation from art lovers and collectors.')}</p>
                <br></br>
            </div>
          </div>
          <div className="artist-statement-card">
            <h3>{t('about.artistStatement.heading', 'Artist Statement')}</h3>
            <p>{t('about.artistStatement.body', 'My art is a reflection of the world around me, a way to capture the beauty and emotion I see in everyday life. Through pencil sketches, I aim to create a connection between the viewer and the subject, inviting them to see the world through my eyes. Each stroke is a step in a journey of discovery, a process of bringing a vision to life on paper. I am driven by a desire to constantly improve and explore new techniques, pushing the boundaries of what can be achieved with a simple pencil.')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return isMaintenanceMode ? (
    <MaintenanceOverlay>
      {aboutContent}
    </MaintenanceOverlay>
  ) : aboutContent;
}

export default About
