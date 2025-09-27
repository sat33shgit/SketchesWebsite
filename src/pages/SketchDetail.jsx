import CommentsSection from '../components/CommentsSection'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { getSketchById, sketches } from '../data/sketches'
import { getAssetPath } from '../utils/paths'
import { parseRichText } from '../utils/richText'
import LikeDislike from '../components/LikeDislike'
import { toggleLike, getSketchStats } from '../utils/vercelDatabase'
import CommentCount from '../components/CommentCount'
import ViewCount from '../components/ViewCount'
import useAnalytics from '../hooks/useAnalytics'


const SketchDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  // Local fallback metadata (title/image) for immediate UI skeleton only.
  // IMPORTANT: do not display local description text — always fetch the authoritative
  // description from the API (DB-backed) and render whatever the DB returns
  const localSketch = getSketchById(id)
  // If we have local metadata, initialize with description=null so the UI waits
  // for DB-provided description rather than showing local markdown/plain text.
  const [sketch, setSketch] = useState(localSketch ? { ...localSketch, description: null } : null)
  
  // Track sketch visit
  useAnalytics('sketch', id)

  // Fetch authoritative sketch data (DB-backed) if available
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const resp = await fetch(`/api/sketches/${id}`, { cache: 'no-store' })
        if (resp && resp.ok) {
          const body = await resp.json()

          // Accept both shapes: { success: true, data: { ... } } or direct object
          let dbSketch = null
          if (body && body.success && body.data) dbSketch = body.data
          else if (body && (body.description || body.imagePath || body.title)) dbSketch = body

          if (!cancelled && dbSketch) {
            console.info(`SketchDetail: using API sketch for id=${id}`)
            // Merge DB result into local metadata, but preserve local imagePath
            // if the DB didn't provide one.
            setSketch(prev => ({
              ...(prev || {}),
              ...dbSketch,
              imagePath: dbSketch.imagePath || (prev && prev.imagePath) || null,
              // preserve orientation (landscape/portrait) from local metadata
              // when DB doesn't provide it (avoid forcing 'portrait')
              orientation: dbSketch.orientation || (prev && prev.orientation) || null
            }))
            return
          }
        }
        // If API returned non-ok or missing sketch, do not overwrite local metadata's description.
        if (!cancelled) console.warn(`SketchDetail: API returned no sketch for id=${id}`)
      } catch (err) {
        console.warn('Could not fetch sketch details from API:', err && err.message)
      }
    }
    if (id) load()
    return () => { cancelled = true }
  }, [id, localSketch])
  
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [aboutComments, setAboutComments] = useState([])
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [detailLikeCount, setDetailLikeCount] = useState(null)
  const [detailLikeLoading, setDetailLikeLoading] = useState(true)
  const [detailLiked, setDetailLiked] = useState(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem(`user_liked_${id}`) === 'true'
    } catch (e) {
      return false
    }
  })

  // NOTE: do NOT sync `detailLiked` automatically to localStorage here.
  // The API helper `toggleLike` reads the previous value from localStorage to
  // decide whether the action should be 'like' or 'unlike'. Writing to
  // localStorage prematurely (e.g. during an optimistic update) causes the
  // API helper to see the new state and flip the action, producing reversed
  // behavior. Instead, rely on `toggleLike` (and `getSketchStats`) to
  // persist authoritative state to localStorage.
  
  // Comments functionality disabled for now
  // const [comments] = useState([])
  // const [newComment, setNewComment] = useState('')

  // Navigation helpers
  const currentIndex = sketches.findIndex(s => s.id === parseInt(id))
  const previousSketch = currentIndex > 0 ? sketches[currentIndex - 1] : null
  const nextSketch = currentIndex < sketches.length - 1 ? sketches[currentIndex + 1] : null

  const goToPrevious = () => {
    if (previousSketch) {
      navigate(`/sketch/${previousSketch.id}`);
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }, 0);
    }
  }

  const goToNext = () => {
    if (nextSketch) {
      navigate(`/sketch/${nextSketch.id}`);
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }, 0);
    }
  }

  // Share functionality
  const handleCopyURL = async () => {
    const currentURL = window.location.href
    
    try {
      await navigator.clipboard.writeText(currentURL)
      setShowCopySuccess(true)
      setShowShareMenu(false)
      setTimeout(() => setShowCopySuccess(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = currentURL
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setShowCopySuccess(true)
      setShowShareMenu(false)
      setTimeout(() => setShowCopySuccess(false), 2000)
    }
  }

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href)
    const shareText = encodeURIComponent(`Check out this amazing pencil sketch: "${sketch.title}" by Sateesh Kumar Boggarapu`)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${shareText}`, '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out this amazing pencil sketch: "${sketch.title}" by Sateesh Kumar Boggarapu`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  const handleShareWhatsApp = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out this amazing pencil sketch: "${sketch.title}" by Sateesh Kumar Boggarapu ${window.location.href}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
    setShowShareMenu(false)
  }

  const handleShareInstagram = () => {
    // Instagram doesn't support direct URL sharing, so we'll copy the URL and show instructions
    handleCopyURL()
    alert('Instagram doesn\'t support direct link sharing. The URL has been copied to your clipboard. You can paste it in your Instagram post or story!')
  }

  const toggleShareMenu = () => {
    setShowShareMenu(!showShareMenu)
  }

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShareMenu && !event.target.closest('.share-menu-container')) {
        setShowShareMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showShareMenu])

  if (!sketch) {
    return (
      <div className="sketch-detail-page">
        <div className="sketch-detail-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>Sketch not found</h1>
              <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Return to Sketch Book
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Comments functionality disabled for now
  // const handleSubmitComment = (e) => {
  //   e.preventDefault()
  //   if (newComment.trim()) {
  //     console.log('New comment:', newComment)
  //     setNewComment('')
  //   }
  // }

  const openFullscreen = () => {
    setIsFullscreen(true)
    setZoomLevel(1)
    setImagePosition({ x: 0, y: 0 })
    document.body.style.overflow = 'hidden' // Prevent background scrolling
  }

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false)
    setZoomLevel(1)
    setImagePosition({ x: 0, y: 0 })
    // Restore scrolling - use multiple methods to ensure it works
    document.body.style.overflow = ''
    document.body.style.overflowY = ''
    document.documentElement.style.overflow = ''
  }, [])

  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5)) // Max zoom 5x
  }, [])

  const zoomOut = useCallback(() => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev / 1.5, 0.5) // Min zoom 0.5x
      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 }) // Reset position when back to 1x
      }
      return newZoom
    })
  }, [])

  const resetZoom = useCallback(() => {
    setZoomLevel(1)
    setImagePosition({ x: 0, y: 0 })
  }, [])

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e) => {
    // Only handle wheel when fullscreen is active
    if (!isFullscreen) return
    e.preventDefault()

    // Use a smooth factor based on the wheel delta so small rolls give small zoom changes
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1

    setZoomLevel((prev) => {
      const next = Math.min(5, Math.max(0.5, prev * factor))
      // When returning to 1x reset pan so image recenters
      if (next === 1) setImagePosition({ x: 0, y: 0 })
      return next
    })
  }

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      closeFullscreen()
    } else if (e.key === '+' || e.key === '=') {
      zoomIn()
    } else if (e.key === '-') {
      zoomOut()
    } else if (e.key === '0') {
      resetZoom()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const currentIdx = sketches.findIndex(s => s.id === parseInt(id))
      const prevSketch = currentIdx > 0 ? sketches[currentIdx - 1] : null
      if (prevSketch) {
        navigate(`/sketch/${prevSketch.id}`)
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      const currentIdx = sketches.findIndex(s => s.id === parseInt(id))
      const nextSk = currentIdx < sketches.length - 1 ? sketches[currentIdx + 1] : null
      if (nextSk) {
        navigate(`/sketch/${nextSk.id}`)
      }
    }
  }, [id, navigate, closeFullscreen, zoomIn, zoomOut, resetZoom])

  // Add event listeners
  useEffect(() => {
    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isFullscreen, handleKeyDown, isDragging, dragStart, imagePosition])

  // Add navigation keyboard shortcuts when not in fullscreen
  useEffect(() => {
    if (!isFullscreen) {
      const handleGlobalKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          goToPrevious()
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          goToNext()
        }
      }

      window.addEventListener('keydown', handleGlobalKeyDown)
      return () => window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isFullscreen, currentIndex])



  // Cleanup: Always restore scrolling when component unmounts or fullscreen changes
  useEffect(() => {
    return () => {
      // Ensure scrolling is always restored when component unmounts
      document.body.style.overflow = ''
      document.body.style.overflowY = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  // Also restore scrolling when leaving fullscreen mode
  useEffect(() => {
    if (!isFullscreen) {
      document.body.style.overflow = ''
      document.body.style.overflowY = ''
      document.documentElement.style.overflow = ''
    }
  }, [isFullscreen])

  // Fetch authoritative stats for this sketch (likes + whether user has liked)
  useEffect(() => {
    let cancelled = false
    const loadStats = async () => {
      try {
        setDetailLikeLoading(true)
        const stats = await getSketchStats(id)
        if (!cancelled && stats) {
          setDetailLikeCount(Number(stats.likes) || 0)
          setDetailLiked(Boolean(stats.userLiked))
        }
      } catch (err) {
        console.error('Error fetching sketch stats:', err)
        if (!cancelled) setDetailLikeCount(0)
      } finally {
        if (!cancelled) setDetailLikeLoading(false)
      }
    }

    if (id) loadStats()
    return () => { cancelled = true }
  }, [id])

  // Fetch visible comments for this sketch and display their comment text under "About This Piece"
  useEffect(() => {
    let cancelled = false
    const loadComments = async () => {
      if (!id) return
      try {
        const res = await fetch(`/api/comments/${encodeURIComponent(id)}`)
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && Array.isArray(data)) {
          setAboutComments(data)
        }
      } catch (err) {
        console.warn('Failed to load comments for sketch detail:', err && err.message)
      }
    }
    loadComments()
    return () => { cancelled = true }
  }, [id])


  return (
    <div className="sketch-detail-page single-view">
      <div className="sketch-detail-container single-view-container">
        {/* Header Section */}
        <div className="sketch-header">
          {/* Navigation and Actions */}
          <div className="header-nav">
            <Link to="/gallery" className="back-nav-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Gallery
            </Link>
          </div>
          
          <div className="header-actions">
            {/* Share Menu */}
            <div className="share-menu-container">
              <button
                onClick={toggleShareMenu}
                aria-label="Share"
                className="share-button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
              {showShareMenu && (
                <div className="share-menu">
                  <button onClick={handleCopyURL}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Copy link
                  </button>
                  <button onClick={handleShareFacebook}>Facebook</button>
                  <button onClick={handleShareTwitter}>Twitter</button>
                  <button onClick={handleShareWhatsApp}>WhatsApp</button>
                </div>
              )}
            </div>
            
            {/* Fullscreen Button */}
            <button
              onClick={openFullscreen}
              aria-label="View Fullscreen"
              className="fullscreen-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="sketch-content">
          {/* Metadata */}
          <div className="header-meta">
            <div className="meta-row">
              <div className="meta-item">
                {sketch && sketch.completedDate ? (
                  `Completed: ${new Date(sketch.completedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}`
                ) : 'Completed: —'}
              </div>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="sketch-main-title">{sketch.title}</h1>
          
          {/* Description moved to 'About This Piece' below the image */}
        </div>

        {/* Main Content */}
        <div className="single-view-content">
          {/* Image Section - Full Width */}
          <div className="single-view-image">
            {sketch.imagePath ? (
              <div className="image-center">
                <img
                  src={getAssetPath(sketch.imagePath)}
                  alt={sketch.title}
                  className={`sketch-detail-image ${sketch.orientation || 'portrait'}`}
                  onClick={openFullscreen}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.nextSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              </div>
            ) : (
              <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', borderRadius: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <svg style={{ width: '6rem', height: '6rem', margin: '0 auto 1.5rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p style={{ color: '#9ca3af', fontSize: '1.125rem', fontWeight: '500' }}>No Image Available</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Below Image */}
          <div className="single-view-details">
            <div className="content-and-sidebar">
              {/* Left: Main Content */}
              <div className="main-content">
                {/* About This Piece */}
                <section className="content-section">
                  <h2 className="section-title">About This Piece</h2>
                  <div className="section-content">
                    {parseRichText(sketch.description)}
                  </div>
                </section>

                {/* Technique & Process removed as per request */}

                {/* Comments Section */}
                <CommentsSection sketchId={id} sketchName={sketch.title} />
              </div>

              {/* Right: Stats Sidebar */}
              <div className="stats-sidebar">
                {/* Engagement Metrics Card */}
                <div 
                  className="stats-card engagement-card"
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px', 
                    border: '0.5px solid #e5e7eb',
                    padding: '16px',
                    marginBottom: '16px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Top row: Likes only */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                    <div
                      className={`like-count clickable-like ${detailLiked ? 'liked' : ''}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()

                        const prev = detailLikeCount ?? 0

                        // If currently not liked -> set liked
                        if (!detailLiked) {
                          // Optimistic update: set UI to liked state (black bg + white text), increment count
                          setDetailLiked(true)
                          setDetailLikeCount(prev + 1)

                          // Call API to persist like; do NOT update localStorage here because
                          // toggleLike reads the previous state from localStorage to decide
                          // whether to 'like' or 'unlike'. Writing localStorage prematurely
                          // causes the action to be reversed.
                          try {
                            const newStats = await toggleLike(id)
                            // Try to reconcile with authoritative stats after toggle
                            try {
                              const fresh = await getSketchStats(id)
                              if (fresh && typeof fresh.likes === 'number') {
                                setDetailLikeCount(Number(fresh.likes))
                                setDetailLiked(Boolean(fresh.userLiked))
                              } else if (newStats && typeof newStats.likes === 'number') {
                                setDetailLikeCount(newStats.likes)
                              }
                            } catch (fetchErr) {
                              // If stats fetch fails, fall back to returned newStats
                              if (newStats && typeof newStats.likes === 'number') setDetailLikeCount(newStats.likes)
                            }
                          } catch (err) {
                            console.error('Error toggling like:', err)
                          }

                        } else {
                          // Currently liked -> un-like
                          setDetailLiked(false)
                          setDetailLikeCount(Math.max(0, prev - 1))

                          try {
                            const newStats = await toggleLike(id)
                            try {
                              const fresh = await getSketchStats(id)
                              if (fresh && typeof fresh.likes === 'number') {
                                setDetailLikeCount(Number(fresh.likes))
                                setDetailLiked(Boolean(fresh.userLiked))
                              } else if (newStats && typeof newStats.likes === 'number') {
                                setDetailLikeCount(newStats.likes)
                              }
                            } catch (fetchErr) {
                              if (newStats && typeof newStats.likes === 'number') setDetailLikeCount(newStats.likes)
                            }
                          } catch (err) {
                            console.error('Error toggling like:', err)
                          }
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click() }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill={detailLiked ? '#ef4444' : 'none'}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>
                        {detailLikeLoading ? <span className="stat-shimmer" aria-hidden="true"></span> : (detailLikeCount ?? 0)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Views row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    <ViewCount sketchId={id} showIcon={false} />
                  </div>
                  
                  {/* Discussion row: icon + "N comments" */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', paddingTop: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <div style={{ color: '#6b7280', fontSize: '0.95rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600 }}><CommentCount sketchId={id} showIcon={false} size="large" /></span>
                      <span style={{ fontWeight: 400, color: '#000000' }}>Comments</span>
                    </div>
                  </div>
                </div>

                {/* Sketch Details Card */}
                <div 
                  className="stats-card sketch-details-card"
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '0.5px solid #e5e7eb',
                    padding: '16px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="detail-label" style={{ color: '#6b7280', fontSize: '14px' }}>Medium</span>
                    <span className="detail-value" style={{ color: '#111827', fontSize: '14px', fontWeight: '500' }}>Graphite</span>
                  </div>
                  
                  <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="detail-label" style={{ color: '#6b7280', fontSize: '14px' }}>Time</span>
                    <span className="detail-value" style={{ color: '#111827', fontSize: '14px', fontWeight: '500' }}>8-12 hours</span>
                  </div>
                  
                  <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="detail-label" style={{ color: '#6b7280', fontSize: '14px' }}>Paper</span>
                    <span className="detail-value" style={{ color: '#111827', fontSize: '14px', fontWeight: '500' }}>Strathmore</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Modal */}
        {isFullscreen && sketch.imagePath && (
          <div className="fullscreen-modal">
            {/* Close button */}
            <button
              onClick={closeFullscreen}
              className="fullscreen-close-btn"
              aria-label="Close fullscreen view"
            >
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Minimize button */}
            <button
              onClick={closeFullscreen}
              className="fullscreen-minimize-btn"
              aria-label="Exit fullscreen view"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9v-4.5M15 9h4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15v4.5M15 15h4.5m0 0l5.25 5.25" />
              </svg>
              <span style={{ fontSize: '0.875rem' }}>Exit Fullscreen</span>
            </button>

            {/* Zoom Controls */}
            <div className="fullscreen-zoom-controls">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
                className="fullscreen-zoom-btn"
                aria-label="Zoom out"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
              
              <div className="fullscreen-zoom-level">
                {Math.round(zoomLevel * 100)}%
              </div>
              
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 5}
                className="fullscreen-zoom-btn"
                aria-label="Zoom in"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </button>

              <div style={{ width: '1px', height: '24px', background: '#9ca3af', margin: '0 0.25rem' }}></div>

              <button
                onClick={resetZoom}
                className="fullscreen-zoom-btn"
                aria-label="Reset zoom"
                style={{ fontSize: '0.75rem' }}
              >
                1:1
              </button>
            </div>

            {/* Image info overlay */}
            <div className="fullscreen-info">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>{sketch.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                {sketch && sketch.completedDate ? (
                  `Completed: ${new Date(sketch.completedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}`
                ) : 'Completed: —'}
              </p>
              {zoomLevel > 1 && (
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Click and drag to pan around</p>
              )}
            </div>

            {/* Help text */}
            <div className="fullscreen-details">
              <div>Press <kbd style={{ background: '#374151', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Esc</kbd> to exit</div>
              <div style={{ marginTop: '0.25rem' }}>
                <kbd style={{ background: '#374151', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>+</kbd> / 
                <kbd style={{ background: '#374151', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', marginLeft: '0.25rem' }}>-</kbd> to zoom
              </div>
              <div style={{ marginTop: '0.25rem' }}>
                <kbd style={{ background: '#374151', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>0</kbd> to reset
              </div>
              <div style={{ marginTop: '0.25rem' }}>
                <kbd style={{ background: '#374151', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>←</kbd> / 
                <kbd style={{ background: '#374151', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', marginLeft: '0.25rem' }}>→</kbd> to navigate
              </div>
            </div>

            {/* Image Container */}
            <div 
              className="fullscreen-image-container"
              onWheel={handleWheel}
            >
              <img
                src={getAssetPath(sketch.imagePath)}
                alt={sketch.title}
                className={`fullscreen-image ${sketch.orientation || 'portrait'} ${isDragging ? 'dragging' : ''}`}
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                  maxWidth: zoomLevel === 1 ? (sketch.orientation === 'landscape' ? '95%' : '90%') : 'none',
                  maxHeight: zoomLevel === 1 ? (sketch.orientation === 'landscape' ? '85%' : '90%') : 'none',
                  marginTop: '32px', // Add space from the top
                }}
                onClick={zoomLevel === 1 ? closeFullscreen : undefined}
                onMouseDown={handleMouseDown}
                draggable={false}
              />
            </div>

            {/* Navigation arrows in fullscreen */}
            <div className="fullscreen-nav">
              {/* Previous arrow */}
              {previousSketch && (
                <button
                  onClick={goToPrevious}
                  className="fullscreen-nav-btn"
                  title={`Previous: ${previousSketch.title}`}
                >
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* Next arrow */}
              {nextSketch && (
                <button
                  onClick={goToNext}
                  className="fullscreen-nav-btn next"
                  title={`Next: ${nextSketch.title}`}
                >
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Click anywhere to close overlay (only when zoom is 1x) */}
            {zoomLevel === 1 && (
              <div 
                className="fullscreen-overlay"
                onClick={closeFullscreen}
                onWheel={handleWheel}
                aria-label="Click to close fullscreen view"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SketchDetail
