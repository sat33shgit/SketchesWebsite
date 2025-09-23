import CommentsSection from '../components/CommentsSection'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { getSketchById, sketches } from '../data/sketches'
import { getAssetPath } from '../utils/paths'
import { parseRichText } from '../utils/richText'
import LikeDislike from '../components/LikeDislike'
import CommentCount from '../components/CommentCount'
import SmileyLike from '../components/SmileyLike'
import ViewCount from '../components/ViewCount'
import useAnalytics from '../hooks/useAnalytics'


const SketchDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const sketch = getSketchById(id)
  
  // Track sketch visit
  useAnalytics('sketch', id)
  
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
                    className={`sketch-detail-image ${sketch.orientation || 'portrait'}`}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: '0.5rem' }}>
              {/* Sketch Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', flex: '1', marginBottom: '0.5rem' }}>{sketch.title}</h1>
                  {/* Share Button */}
                  <div style={{ position: 'relative', marginLeft: '1rem', marginTop: '0.25rem' }} className="share-menu-container">
                    <button
                      onClick={toggleShareMenu}
                      aria-label="Share"
                      style={{
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        borderRadius: '999px',
                        padding: '0.5rem 1.1rem',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s',
                        fontWeight: 500
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '0.5rem'}}>
                        <path d="M8 17V14C8 12.8954 8.89543 12 10 12H19" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 7L20 12L15 17" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontWeight: 500 }}>Share</span>
                    </button>
                    {showShareMenu && (
                      <div style={{
                        position: 'absolute',
                        top: '2.8rem',
                        right: 0,
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '1rem',
                        boxShadow: '0 6px 24px rgba(37,99,235,0.13)',
                        padding: '1.1rem 1.2rem',
                        zIndex: 20,
                        minWidth: '340px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gridTemplateRows: 'repeat(2, 1fr)',
                        gap: '1.4rem 1.2rem',
                        alignItems: 'center',
                        justifyItems: 'center',
                        animation: 'fadeIn 0.2s',
                        fontSize: '1.05rem',
                        textAlign: 'center'
                      }}>
                        <div>
                          <button onClick={handleCopyURL} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ background: '#f3f4f6', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.2rem' }}>
                              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="7" width="14" height="17" rx="3" stroke="#222" strokeWidth="2.5"/><rect x="4" y="4" width="14" height="17" rx="3" stroke="#222" strokeWidth="2.5"/></svg>
                            </span>
                            <span style={{ fontSize: '0.95rem', color: '#222' }}>Copy link</span>
                          </button>
                          {showCopySuccess && (
                            <span style={{ color: '#10b981', fontSize: '0.95rem', marginTop: '0.5rem', fontWeight: 500 }}>Link copied!</span>
                          )}
                        </div>
                        <div>
                          <button onClick={handleShareFacebook} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ background: '#f3f4f6', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.2rem' }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.592 1.325-1.326V1.326C24 .592 23.405 0 22.675 0" fill="#1877F2"/><path d="M16.671 24v-9.294h3.12l.467-3.622h-3.587v-2.313c0-1.048.293-1.763 1.797-1.763l1.918-.001v-3.24c-.334-.044-1.472-.143-2.797-.143-2.766 0-4.659 1.688-4.659 4.788v2.313h-3.13v3.622h3.13V24h2.004z" fill="#fff"/></svg>
                            </span>
                            <span style={{ fontSize: '0.95rem', color: '#222' }}>Facebook</span>
                          </button>
                        </div>
                        <div>
                          <button onClick={handleShareWhatsApp} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ background: '#f3f4f6', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.2rem' }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.173.198-.298.298-.496.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.501-.669-.511-.173-.008-.372-.01-.571-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.202 5.077 4.372.711.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.075-.124-.272-.198-.57-.347z" fill="#25D366"/><path d="M12.004 2.003c-5.523 0-9.997 4.474-9.997 9.997 0 1.762.462 3.487 1.338 4.997l-1.414 5.175 5.308-1.396c1.462.799 3.099 1.221 4.765 1.221 5.523 0 9.997-4.474 9.997-9.997s-4.474-9.997-9.997-9.997zm4.842 14.545c-.199.561-1.163 1.099-1.591 1.175-.408.075-.942.108-1.51-.118-.432-.136-1.107-.354-1.813-.653-3.003-1.172-4.956-4.072-5.104-4.271-.149-.198-1.213-1.612-1.213-3.074 0-1.463.768-2.182 1.04-2.479.272-.297.594-.372.792-.372.199 0 .398.002.571.01.182.01.427-.068.669.511.247.596.841 2.058.916 2.207.075.149.124.323.025.521-.1.198-.149.323-.298.496-.149.173-.313.387-.447.52-.148.148-.303.309-.13.606.173.298.77 1.271 1.653 2.059 1.135 1.013 2.093 1.326 2.39 1.475.297.148.471.123.644-.075.173-.198.743-.867.94-1.164.198-.298.397-.249.67-.15.272.1 1.733.818 2.03.967.297.149.495.223.57.347.075.125.075.719-.173 1.413z" fill="#25D366"/></svg>
                            </span>
                            <span style={{ fontSize: '0.95rem', color: '#222' }}>WhatsApp</span>
                          </button>
                        </div>
                        <div>
                          <button onClick={handleShareInstagram} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ background: '#f3f4f6', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.2rem' }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><radialGradient id="IGpaint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(12 12) scale(12)"><stop stopColor="#FFD600"/><stop offset="0.5" stopColor="#FF6B00"/><stop offset="1" stopColor="#E1306C"/></radialGradient><rect x="2" y="2" width="20" height="20" rx="6" fill="url(#IGpaint0_radial)"/><circle cx="12" cy="12" r="5" fill="#fff"/><circle cx="12" cy="12" r="3.5" fill="#E1306C"/><circle cx="16.5" cy="7.5" r="1" fill="#fff"/></svg>
                            </span>
                            <span style={{ fontSize: '0.95rem', color: '#222' }}>Instagram</span>
                          </button>
                        </div>
                        <div>
                          <button onClick={handleShareTwitter} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ background: '#f3f4f6', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.2rem' }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#000"/><path d="M17.53 7.47h-2.06l-2.47 3.53-2.47-3.53H8.47l2.97 4.24-3.13 4.29h2.06l2.63-3.76 2.63 3.76h2.06l-3.13-4.29 2.97-4.24z" fill="#fff"/></svg>
                            </span>
                            <span style={{ fontSize: '0.95rem', color: '#222' }}>X</span>
                          </button>
                        </div>
                        <div>
                          <button onClick={() => window.location.href = `mailto:?subject=Check%20out%20this%20sketch&body=${window.location.href}`} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ background: '#f3f4f6', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.2rem' }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="4" fill="#EA4335"/><path d="M2 6l10 7 10-7" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/></svg>
                            </span>
                            <span style={{ fontSize: '0.95rem', color: '#222' }}>Email</span>
                          </button>
                        </div>
                      </div>
                    )}
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
                {/* Smiley Like Picker and View Count */}
                <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  <SmileyLike sketchId={id} />
                  <ViewCount sketchId={id} size="medium" />
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
