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
      } catch (err) {
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
          <h1 className="gallery-title">{t('gallery.title')}</h1>
          <p className="gallery-description">{t('gallery.description')}</p>
        </div>

        <div className="elegant-gallery">
          {sketches.map((sketch, index) => {
            const isEven = index % 2 === 0
            return (
              <div key={sketch.id} className={`elegant-card ${isEven ? 'image-left' : 'image-right'} ${sketch.orientation || 'portrait'}`}>
                <img
                  src={getAssetPath(sketch.imagePath)}
                  alt={sketch.title}
                  className={`direct-gallery-image ${sketch.orientation || 'portrait'}`}
                  style={{ backgroundColor: '#ffffff', cursor: 'pointer', height: sketch.orientation === 'landscape' ? '400px' : '480px', maxWidth: '100%', objectFit: 'contain' }}
                  onClick={() => (window.location.href = `/sketch/${sketch.id}`)}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  onAuxClick={(e) => { if (e.button === 1) e.preventDefault() }}
                  onMouseDown={(e) => { if (e.button === 1) e.preventDefault() }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />

                <div className="card-content">
                  <div className="card-year">{new Date(sketch.completedDate).getFullYear()}</div>
                  <h3 className="card-title"><Link to={`/sketch/${sketch.id}`}>{sketch.title}</Link></h3>
                  <p className="card-description">{sketch.description.replace(/\*\*(.*?)\*\*/g, '$1').substring(0, 200)}{sketch.description.length > 200 ? '...' : ''}</p>

                  <div className="card-footer">
                    <div className="card-stats">
                      <span className="stat">{viewsLoading ? <span className="stat-shimmer" aria-hidden="true"></span> : (viewsCounts[sketch.id] ?? 0)}</span>
                      <span className="stat">{likeLoading ? <span className="stat-shimmer" aria-hidden="true"></span> : (likeCounts[sketch.id] ?? 0)}</span>
                      <span className="stat">{commentLoading ? <span className="stat-shimmer" aria-hidden="true"></span> : (commentCounts[sketch.id] ?? 0)}</span>
                    </div>
                    <Link to={`/sketch/${sketch.id}`} className="view-details">{t('gallery.viewDetails')}<span className="arrow-icon">-&gt;</span></Link>
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
