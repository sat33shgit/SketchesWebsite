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
                  src="/images/sateesh-profile.jpg"
                  alt="Sateesh"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/256x256/374151/ffffff?text=Sateesh"
                  }}
                />
              </div>
              <div className="text-center lg:text-left mt-6">
                <h2 className="text-2xl font-bold text-gray-900">Sateesh</h2>
                <p className="text-gray-600 mt-1">Pencil Sketch Artist</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Sateesh is a talented pencil sketch artist based in Bangalore, India. With a passion for capturing the 
                essence of his subjects, Sateesh creates detailed and lifelike portraits, landscapes, and still life drawings. 
                His work showcases a deep understanding of light, shadow, and texture, bringing his art to life on paper.
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

            {/* Contact */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                For inquiries, commissions, or collaborations, please reach out to me at{' '}
                <a href="mailto:sateesh.art@email.com" className="text-blue-600 hover:text-blue-800">
                  sateesh.art@email.com
                </a>. You can also follow my work on social media{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  @sateesh_art
                </a>.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex space-x-6 pt-6">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.316-1.296C4.165 14.824 3.675 13.673 3.675 12.376s.49-2.448 1.458-3.316c.968-.868 2.119-1.458 3.316-1.458s2.448.59 3.316 1.458c.868.868 1.458 2.019 1.458 3.316s-.59 2.448-1.458 3.316c-.868.806-2.019 1.296-3.316 1.296zm7.072 0c-1.297 0-2.448-.49-3.316-1.296-.868-.868-1.458-2.019-1.458-3.316s.59-2.448 1.458-3.316c.868-.868 2.019-1.458 3.316-1.458s2.448.59 3.316 1.458c.868.868 1.458 2.019 1.458 3.316s-.59 2.448-1.458 3.316c-.868.806-2.019 1.296-3.316 1.296z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
