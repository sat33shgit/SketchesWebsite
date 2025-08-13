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

            {/* Contact */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                For inquiries, commissions, or collaborations, please reach out to me at{' '}
                <a href="mailto:bsateeshk@gmail.com" className="text-blue-600 hover:text-blue-800">
                  bsateeshk@gmail.com
                </a>.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex space-x-6 pt-6">
              <a
                href="https://www.instagram.com/boggarapusateeshkumar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/media/set/?set=a.367537920160&type=3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
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
