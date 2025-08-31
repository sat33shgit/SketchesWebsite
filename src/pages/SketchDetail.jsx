import CommentsSection from '../components/CommentsSection'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { getSketchById, sketches } from '../data/sketches'
import { getAssetPath } from '../utils/paths'
import { parseRichText } from '../utils/richText'
import LikeDislike from '../components/LikeDislike'
import CommentCount from '../components/CommentCount'


const SketchDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const sketch = getSketchById(id)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  
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
    e.preventDefault()
    if (e.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
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


  return (
    <div className="sketch-detail-page split-view">
      <div className="sketch-detail-container split-view-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Sketches</Link>
          <span> / </span>
          <span style={{ color: '#1f2937' }}>{sketch.title}</span>
        </nav>

        <div className="split-view-content">
          {/* Left: Image (fixed, non-scrollable) */}
          <div className="split-view-image">
            <div className="sketch-image-section">
              {sketch.imagePath ? (
                <>
                  <img
                    src={getAssetPath(sketch.imagePath)}
                    alt={sketch.title}
                    className="sketch-detail-image"
                    onClick={openFullscreen}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                </>
              ) : (
                <div style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
                  <div style={{ textAlign: 'center' }}>
                    <svg style={{ width: '6rem', height: '6rem', margin: '0 auto 1.5rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p style={{ color: '#9ca3af', fontSize: '1.125rem', fontWeight: '500' }}>No Image Available</p>
                    <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginTop: '0.5rem' }}>Sketch artwork will be displayed here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Details, navigation, comments (scrollable) */}
          <div className="split-view-details">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Sketch Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', flex: '1' }}>{sketch.title}</h1>
                  {/* Share Button */}
                  <div style={{ position: 'relative', marginLeft: '1rem' }} className="share-menu-container">
                    {/* ...existing code... */}
                    {/* Share button and menu code unchanged */}
                    {/* ...existing code... */}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                    Completed: {new Date(sketch.completedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <button onClick={() => {
                    const el = document.getElementById('comments-section')
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      // focus for keyboard users
                      el.focus({ preventScroll: true })
                    }
                  }} aria-label="View comments" title="View comments" style={{ background: 'transparent', border: 'none', padding: 0, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <CommentCount sketchId={id} />
                  </button>
                </div>
                <div style={{ color: '#374151', lineHeight: 1.7 }}>
                  {parseRichText(sketch.description)}
                </div>
              </div>

              {/* Navigation controls removed from UI; keyboard and fullscreen navigation remain functional */}

              {/* Comments Section */}
              <CommentsSection sketchId={id} sketchName={sketch.title} />
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
                Completed: {new Date(sketch.completedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
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
                className={`fullscreen-image ${isDragging ? 'dragging' : ''}`}
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                  maxWidth: zoomLevel === 1 ? '90%' : 'none',
                  maxHeight: zoomLevel === 1 ? '90%' : 'none',
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
