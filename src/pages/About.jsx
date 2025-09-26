import { getAssetPath } from '../utils/paths'
import useAnalytics from '../hooks/useAnalytics'

const About = () => {
  // Track page visit
  useAnalytics('about')
  
  return (
    <div className="about-page">
      <div className="about-container">
        {/* Header */}
        <div className="about-header">
          <h1>About the Artist</h1>
        </div>

        <div className="about-content">
          {/* Profile Image */}
          <div className="about-profile">
            <div className="profile-image">
              <img
                src={getAssetPath("/images/sateesh-profile.jpg")}
                alt="Sateesh"
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src);
                  e.target.src = "https://via.placeholder.com/256x256/374151/ffffff?text=Sateesh"
                }}
              />
            </div>
            <div className="profile-info">
              <h2>Sateesh Kumar Boggarapu</h2>
              <br></br>
              <p>Pencil Sketch Artist</p>
            </div>
          </div>

          {/* Content */}
          <div className="about-text">
            {/* Bio */}
            <div>
              <p>
                Sateesh is a talented pencil sketch artist based in Victoria, Canada, originally from India. With a passion for capturing the 
                essence of his subjects, Sateesh creates detailed and lifelike portraits, and still life drawings. 
                His work showcases a deep understanding of light, shadow, and texture, bringing his art to life on paper using pencil(s).
              </p>
            </div>
            <div>
              <p>
                Sateesh's dedication to his craft and his ability to convey emotion through his art have earned him 
                recognition and appreciation from art enthusiasts and collectors alike.
              </p>
            </div>
          </div>
          <div className="artist-statement-card">
            <h3>Artist Statement</h3>
            <p>
              My art is a reflection of the world around me, a way to capture the beauty and emotion I see in everyday life. 
              Through pencil sketches, I aim to create a connection between the viewer and the subject, inviting them to see 
              the world through my eyes. Each stroke is a step in a journey of discovery, a process of bringing a vision to 
              life on paper. I am driven by a desire to constantly improve and explore new techniques, pushing the boundaries 
              of what can be achieved with a simple pencil.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
