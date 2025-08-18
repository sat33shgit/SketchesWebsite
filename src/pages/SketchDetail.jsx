import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { getSketchById, sketches } from '../data/sketches'
import { getAssetPath } from '../utils/paths'
import { parseRichText } from '../utils/richText'
import LikeDislike from '../components/LikeDislike'

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
      navigate(`/sketch/${previousSketch.id}`)
    }
  }

  const goToNext = () => {
    if (nextSketch) {
      navigate(`/sketch/${nextSketch.id}`)
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sketch not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to Sketch Book
          </Link>
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
    document.body.style.overflow = 'unset' // Restore scrolling
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-700">Sketches</Link>
          <span>/</span>
          <span className="text-gray-900">{sketch.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="lg:sticky lg:top-8 relative">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square relative group">
              {sketch.imagePath ? (
                <>
                  <img
                    src={getAssetPath(sketch.imagePath)}
                    alt={sketch.title}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={openFullscreen}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fullscreen indicator */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center cursor-pointer" onClick={openFullscreen}>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                    </div>
                  </div>
                </>
              ) : null}
              <div className="w-full h-full flex items-center justify-center bg-gray-100" style={{ display: sketch.imagePath ? 'none' : 'flex' }}>
                <div className="text-center">
                  <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 text-lg font-medium">No Image Available</p>
                  <p className="text-gray-300 text-sm mt-2">Sketch artwork will be displayed here</p>
                </div>
              </div>
            </div>
            
            {/* Navigation arrows */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
              {/* Previous arrow */}
              {previousSketch && (
                <button
                  onClick={goToPrevious}
                  className="pointer-events-auto bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 transform hover:scale-110"
                  title={`Previous: ${previousSketch.title}`}
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* Next arrow */}
              {nextSketch && (
                <button
                  onClick={goToNext}
                  className="pointer-events-auto bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 transform hover:scale-110 ml-auto"
                  title={`Next: ${nextSketch.title}`}
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Sketch Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex-1">{sketch.title}</h1>
                
                {/* Share Button */}
                <div className="relative ml-4 share-menu-container">
                  <button
                    onClick={toggleShareMenu}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    title="Share this sketch"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span className="text-sm font-medium">Share</span>
                    <svg className={`w-4 h-4 transition-transform ${showShareMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Share Menu Dropdown */}
                  {showShareMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                      <div className="py-2">
                        {/* Copy URL */}
                        <button
                          onClick={handleCopyURL}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">Copy URL</span>
                        </button>

                        {/* Facebook */}
                        <button
                          onClick={handleShareFacebook}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          <span className="text-sm">Share on Facebook</span>
                        </button>

                        {/* Twitter */}
                        <button
                          onClick={handleShareTwitter}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          <span className="text-sm">Share on Twitter</span>
                        </button>

                        {/* WhatsApp */}
                        <button
                          onClick={handleShareWhatsApp}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                          <span className="text-sm">Share on WhatsApp</span>
                        </button>

                        {/* Instagram */}
                        <button
                          onClick={handleShareInstagram}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          <span className="text-sm">Share on Instagram</span>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Success message */}
                  {showCopySuccess && (
                    <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-green-100 text-green-800 text-sm rounded-lg shadow-lg border border-green-200 whitespace-nowrap z-30">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>URL copied to clipboard!</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                Completed: {new Date(sketch.completedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="text-gray-700 leading-relaxed">
                {parseRichText(sketch.description)}
              </div>
              
              {/* Like/Dislike Component */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">What do you think of this sketch?</span>
                    <LikeDislike sketchId={sketch.id} size="large" showCounts={true} />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Info */}
            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-6">
              <div className="flex items-center space-x-2">
                {previousSketch ? (
                  <Link to={`/sketch/${previousSketch.id}`} className="flex items-center space-x-2 hover:text-gray-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>{previousSketch.title}</span>
                  </Link>
                ) : (
                  <span className="text-gray-300">First sketch</span>
                )}
              </div>
              
              <div className="flex items-center space-x-1 text-xs bg-gray-50 px-3 py-1 rounded-full">
                <span>{currentIndex + 1} of {sketches.length}</span>
                <span className="text-gray-400">•</span>
                <span>Use ← → keys to navigate</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {nextSketch ? (
                  <Link to={`/sketch/${nextSketch.id}`} className="flex items-center space-x-2 hover:text-gray-700 transition-colors">
                    <span>{nextSketch.title}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <span className="text-gray-300">Last sketch</span>
                )}
              </div>
            </div>

            {/* Comments Section - Disabled */}
            {/* 
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Comments</h2>
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Comments are currently disabled.</p>
              </div>
            </div>
            */}
          </div>
        </div>

        {/* Fullscreen Modal */}
        {isFullscreen && sketch.imagePath && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close fullscreen view"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Minimize button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 left-4 text-white hover:text-gray-300 transition-colors z-10 flex items-center space-x-2"
              aria-label="Exit fullscreen view"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9v-4.5M15 9h4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15v4.5M15 15h4.5m0 0l5.25 5.25" />
              </svg>
              <span className="text-sm">Exit Fullscreen</span>
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center space-x-2 bg-black bg-opacity-50 rounded-lg p-2">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
                className="text-white hover:text-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors p-1"
                aria-label="Zoom out"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
              
              <div className="text-white text-sm font-medium min-w-[60px] text-center">
                {Math.round(zoomLevel * 100)}%
              </div>
              
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 5}
                className="text-white hover:text-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors p-1"
                aria-label="Zoom in"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </button>

              <div className="w-px h-6 bg-gray-400 mx-1"></div>

              <button
                onClick={resetZoom}
                className="text-white hover:text-gray-300 transition-colors p-1 text-xs"
                aria-label="Reset zoom"
              >
                1:1
              </button>
            </div>

            {/* Image info overlay */}
            <div className="absolute bottom-4 left-4 text-white z-10">
              <h3 className="text-xl font-semibold mb-1">{sketch.title}</h3>
              <p className="text-sm text-gray-300">
                Completed: {new Date(sketch.completedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {zoomLevel > 1 && (
                <p className="text-xs text-gray-400 mt-1">Click and drag to pan around</p>
              )}
            </div>

            {/* Help text */}
            <div className="absolute bottom-4 right-4 text-gray-400 text-sm z-10 text-right">
              <div>Press <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Esc</kbd> to exit</div>
              <div className="mt-1">
                <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">+</kbd> / 
                <kbd className="bg-gray-700 px-2 py-1 rounded text-xs ml-1">-</kbd> to zoom
              </div>
              <div className="mt-1">
                <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">0</kbd> to reset
              </div>
              <div className="mt-1">
                <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">←</kbd> / 
                <kbd className="bg-gray-700 px-2 py-1 rounded text-xs ml-1">→</kbd> to navigate
              </div>
            </div>

            {/* Image Container */}
            <div 
              className="w-full h-full flex items-center justify-center overflow-hidden"
              onWheel={handleWheel}
            >
              <img
                src={getAssetPath(sketch.imagePath)}
                alt={sketch.title}
                className={`transition-transform duration-200 ${zoomLevel > 1 ? 'cursor-grab' : 'cursor-pointer'} ${isDragging ? 'cursor-grabbing' : ''}`}
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                  maxWidth: zoomLevel === 1 ? '90%' : 'none',
                  maxHeight: zoomLevel === 1 ? '90%' : 'none',
                }}
                onClick={zoomLevel === 1 ? closeFullscreen : undefined}
                onMouseDown={handleMouseDown}
                draggable={false}
              />
            </div>

            {/* Navigation arrows in fullscreen */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-8 pointer-events-none z-10">
              {/* Previous arrow */}
              {previousSketch && (
                <button
                  onClick={goToPrevious}
                  className="pointer-events-auto bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 text-white transition-all duration-200 transform hover:scale-110"
                  title={`Previous: ${previousSketch.title}`}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* Next arrow */}
              {nextSketch && (
                <button
                  onClick={goToNext}
                  className="pointer-events-auto bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 text-white transition-all duration-200 transform hover:scale-110 ml-auto"
                  title={`Next: ${nextSketch.title}`}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Click anywhere to close overlay (only when zoom is 1x) */}
            {zoomLevel === 1 && (
              <div 
                className="absolute inset-0 cursor-pointer"
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
