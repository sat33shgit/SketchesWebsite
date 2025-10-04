import { Link } from 'react-router-dom'
import { sketches } from '../data/sketches'
import { getAssetPath } from '../utils/paths'
import useAnalytics from '../hooks/useAnalytics'

import { useEffect, useState } from 'react'
import { useTranslation } from '../i18n'

const Gallery = () => {
  const { t } = useTranslation()
  const [likeCounts, setLikeCounts] = useState({})
  const [commentCounts, setCommentCounts] = useState({})
  const [likeLoading, setLikeLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(true)
  const [viewsCounts, setViewsCounts] = useState({})
  const [viewsLoading, setViewsLoading] = useState(true)

  useAnalytics('home')

  useEffect(() => {
    setCommentLoading(true)
    fetch('/api/comments/counts')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (data && data.success) setCommentCounts(data.data)
        setCommentLoading(false)
      })
      .catch(() => {
        setCommentCounts({})
        setCommentLoading(false)
      })
      
    // Listen for comment updates to refresh gallery comment counts
    const handleCommentUpdate = (event) => {
      if (event.detail && event.detail.sketchId) {
        // Refresh comment counts when a new comment is added
        fetch('/api/comments/counts')
          .then(res => res.json())
          .then(data => {
            if (data && data.success) setCommentCounts(data.data)
          })
          .catch(() => {
            // If fetch fails, don't update
          })
      }
    }

    window.addEventListener('commentAdded', handleCommentUpdate)

    return () => {
      window.removeEventListener('commentAdded', handleCommentUpdate)
    }
  }, [])

  useEffect(() => {
    const fetchViews = async () => {
      try {
        setViewsLoading(true)
        const res = await fetch('/api/analytics/stats?timeframe=all')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const map = {}
        if (data && data.data && data.data.detailed) {
          data.data.detailed.forEach(item => {
            if (item.page_type === 'sketch') map[item.page_id] = Number(item.total_visits) || 0
          })
        }
        setViewsCounts(map)
      } catch {
        setViewsCounts({})
      } finally {
        setViewsLoading(false)
      }
    }
    fetchViews()
  }, [])

  useEffect(() => {
    setLikeLoading(true)
    fetch('/api/sketches/likes')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (data && data.success) setLikeCounts(data.data)
        setLikeLoading(false)
      })
      .catch(() => {
        setLikeCounts({})
        setLikeLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-white gallery-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="gallery-header">
          <h1 className="gallery-title">{t('gallery.title', 'Gallery')}</h1>
          <p className="gallery-description">{t('gallery.description', 'Welcome to my collection of sketches and digital art. Each piece tells a story and captures moments of inspiration.')}</p>
        </div>

        <div className="elegant-gallery">
          {sketches.map((sketch, index) => {
            const isEven = index % 2 === 0
            return (
              <div key={sketch.id} className={`elegant-card ${isEven ? 'image-left' : 'image-right'} ${sketch.orientation || 'portrait'}`}>
                <div style={{ borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                  <img
                    src={getAssetPath(sketch.imagePath)}
                    alt={sketch.title}
                    className={`direct-gallery-image ${sketch.orientation || 'portrait'}`}
                    style={{ backgroundColor: '#ffffff', cursor: 'pointer', height: sketch.orientation === 'landscape' ? '100px' : '120px', maxWidth: '100%', objectFit: 'contain', display: 'block' }}
                    onClick={() => (window.location.href = `/sketch/${sketch.id}`)}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                    onAuxClick={(e) => { if (e.button === 1) e.preventDefault() }}
                    onMouseDown={(e) => { if (e.button === 1) e.preventDefault() }}
                    onError={() => { /* hide broken image */ }}
                  />
                </div>

                <div className="card-content">
                  <div className="card-year">{new Date(sketch.completedDate).getFullYear()}</div>
                  <h3 className="card-title"><Link to={`/sketch/${sketch.id}`}>{sketch.title}</Link></h3>
                  <p className="card-description">{sketch.description.replace(/\*\*(.*?)\*\*/g, '$1').substring(0, 200)}{sketch.description.length > 200 ? '...' : ''}</p>

                  <div className="card-footer">
                    <div className="card-stats">
                      <span className="stat">
                        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" aria-hidden="true">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        {viewsLoading ? <span className="stat-shimmer" aria-hidden="true"></span> : (viewsCounts[sketch.id] ?? 0)}
                      </span>

                      <span className="stat">
                        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" aria-hidden="true">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        {likeLoading ? <span className="stat-shimmer" aria-hidden="true"></span> : (likeCounts[sketch.id] ?? 0)}
                      </span>

                      <span className="stat">
                        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" aria-hidden="true">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        {commentLoading ? <span className="stat-shimmer" aria-hidden="true"></span> : (commentCounts[sketch.id] ?? 0)}
                      </span>
                    </div>
                    <Link to={`/sketch/${sketch.id}`} className="view-details">{t('gallery.viewDetails', 'View Details')}<span className="arrow-icon">-&gt;</span></Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Gallery
