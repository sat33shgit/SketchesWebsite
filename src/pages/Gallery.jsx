import { Link } from 'react-router-dom'
import { sketches } from '../data/sketches'

const Gallery = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pencil Sketches</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A collection of pencil artwork capturing life's beauty through detailed drawings and artistic expression.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sketches.map((sketch) => (
            <Link
              key={sketch.id}
              to={`/sketch/${sketch.id}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg"
              style={{ transition: 'box-shadow 0.3s ease' }}
            >
              {/* Image Container */}
              <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                {sketch.imagePath ? (
                  <img
                    src={sketch.imagePath}
                    alt={sketch.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center bg-gray-100" style={{ display: sketch.imagePath ? 'none' : 'flex' }}>
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400 text-sm font-medium">No Image</p>
                    <p className="text-gray-300 text-xs mt-1">Available</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {sketch.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  Completed: {new Date(sketch.completedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                  {sketch.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Gallery
