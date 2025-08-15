import { getAssetPath } from '../utils/paths'

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Sateesh</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="w-64 h-64 mx-auto lg:mx-0 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={getAssetPath("/images/sateesh-profile.jpg")}
                  alt="Sateesh"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Image failed to load:', e.target.src);
                    e.target.src = "https://via.placeholder.com/256x256/374151/ffffff?text=Sateesh"
                  }}
                />
              </div>
              <div className="text-center lg:text-left mt-6">
                <h2 className="text-2xl font-bold text-gray-900">Sateesh Kumar Boggarapu</h2>
                <p className="text-gray-600 mt-1">Pencil Sketch Artist</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Sateesh is a talented pencil sketch artist based in Victoria, Canada, originally from India. With a passion for capturing the 
                essence of his subjects, Sateesh creates detailed and lifelike portraits, and still life drawings. 
                His work showcases a deep understanding of light, shadow, and texture, bringing his art to life on paper using pencil(s).
              </p>
            </div>

            <div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Sateesh's dedication to his craft and his ability to convey emotion through his art have earned him 
                recognition and appreciation from art enthusiasts and collectors alike.
              </p>
            </div>

            {/* Artist Statement */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Artist Statement</h3>
              <p className="text-gray-700 leading-relaxed">
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
    </div>
  )
}

export default About
