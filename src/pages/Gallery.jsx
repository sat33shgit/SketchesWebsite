import { Link } from 'react-router-dom'
import { sketches, getAllCategories } from '../data/sketches'
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
    <div className="min-h-screen bg-white gallery-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="gallery-header">
          <h1 className="gallery-title">
            Pencil Sketches
          </h1>
          <p className="gallery-description">
            A curated collection of pencil artwork capturing life's beauty through detailed drawings and artistic expression.
          </p>
        </div>

        {/* Alternating Gallery Cards */}
        <div className="elegant-gallery">
          {sketches.map((sketch, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <div key={sketch.id} className={`elegant-card ${isEven ? 'image-left' : 'image-right'}`}>
                {/* Direct image without any container */}
                <img
                  src={getAssetPath(sketch.imagePath)}
                  alt={sketch.title}
                  className={`direct-gallery-image ${sketch.orientation || 'portrait'}`}
                  style={{
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    height: sketch.orientation === 'landscape' ? '400px' : '480px',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                  onClick={() => window.location.href = `/sketch/${sketch.id}`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                
                {/* Content Section */}
                <div className="card-content">
                  <div className="card-year">{new Date(sketch.completedDate).getFullYear()}</div>
                  
                  <h3 className="card-title">
                    <Link to={`/sketch/${sketch.id}`}>{sketch.title}</Link>
                  </h3>
                  
                  <p className="card-description">
                    {sketch.description.replace(/\*\*(.*?)\*\*/g, '$1').substring(0, 200)}
                    {sketch.description.length > 200 ? '...' : ''}
                  </p>
                  
                  <div className="card-footer">
                    <div className="card-stats">
                      <span className="stat">
                        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        {Math.floor(Math.random() * 500) + 100}
                      </span>
                      
                      <span className="stat">
                        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        {likeCounts[sketch.id] || Math.floor(Math.random() * 100) + 20}
                      </span>
                      
                      <span className="stat">
                        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        {commentCounts[sketch.id] || Math.floor(Math.random() * 30) + 5}
                      </span>
                    </div>
                    
                    <Link to={`/sketch/${sketch.id}`} className="view-details">
                      View Details
                      <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7,7 17,7 17,17"></polyline>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Gallery
