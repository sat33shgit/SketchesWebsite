import { Link } from 'react-router-dom'
import { sketches } from '../data/sketches'
import { getAssetPath } from '../utils/paths'
import LikeDislike from '../components/LikeDislike'
import CommentCount from '../components/CommentCount'

const Gallery = () => {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="gallery-header">
        <h1 className="gallery-title">Pencil Sketches</h1>
        <p className="gallery-description">
          A collection of pencil artwork capturing life's beauty through detailed drawings and artistic expression.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {sketches.map((sketch) => (
          <Link
            key={sketch.id}
            to={`/sketch/${sketch.id}`}
            className="sketch-card"
          >
            {/* Image Container */}
            <div className="sketch-image-container">
              {sketch.imagePath ? (
                <img
                  src={getAssetPath(sketch.imagePath)}
                  alt={sketch.title}
                  className="sketch-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="no-image-placeholder" style={{ display: sketch.imagePath ? 'none' : 'flex' }}>
                <svg className="no-image-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                </svg>
                <p>No Image Available</p>
              </div>
            </div>

            {/* Content */}
            <div className="sketch-card-content">
              <h3 className="sketch-title">
                {sketch.title}
              </h3>
              <p className="sketch-date">
                Completed: {new Date(sketch.completedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="sketch-card-footer" style={{ alignItems: 'center', gap: '1rem' }}>
                <CommentCount sketchId={sketch.id} />
                <LikeDislike sketchId={sketch.id} size="small" showCounts={false} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Gallery
