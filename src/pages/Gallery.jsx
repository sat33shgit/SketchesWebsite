import { Link } from 'react-router-dom'
import { sketches } from '../data/sketches'
import { getAssetPath } from '../utils/paths'
import LikeCountBadge from '../components/LikeCountBadge'
import CommentCountBadge from '../components/CommentCountBadge'
import CommentCount from '../components/CommentCount'
import useAnalytics from '../hooks/useAnalytics'

import { useEffect, useState } from 'react'

const Gallery = () => {
  const [likeCounts, setLikeCounts] = useState({})
  const [commentCounts, setCommentCounts] = useState({})
  
  // Track page visit
  useAnalytics('home')
  
  useEffect(() => {
    fetch('/api/comments/counts')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success) setCommentCounts(data.data)
      })
      .catch(error => {
        console.error('Error fetching comment counts:', error);
        // Set empty counts on error to prevent UI issues
        setCommentCounts({});
      })
  }, [])

  useEffect(() => {
    fetch('/api/sketches/likes')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success) setLikeCounts(data.data)
      })
      .catch(error => {
        console.error('Error fetching like counts:', error);
        // Set empty counts on error to prevent UI issues
        setLikeCounts({});
      })
  }, [])

  return (
    <div className="page-container home-page">
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
            style={{ position: 'relative' }}
          >
            {/* Image Container */}
            <div className="sketch-image-container" style={{ position: 'relative' }}>
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
              {/* Like and comment count badge overlays */}
              <LikeCountBadge count={likeCounts[sketch.id] || 0} />
              <CommentCountBadge count={commentCounts[sketch.id] || 0} />
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
              {/* Removed old comment count display from card footer */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Gallery
