import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getSketchById } from '../data/sketches'
import { getAssetPath } from '../utils/paths'

const SketchDetail = () => {
  const { id } = useParams()
  const sketch = getSketchById(id)
  const [newComment, setNewComment] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  // Comments data - initially empty, real comments would come from a backend
  const [comments] = useState([])

  if (!sketch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sketch not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to Gallery
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      // In a real app, this would send the comment to a backend
      console.log('New comment:', newComment)
      setNewComment('')
    }
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
    setZoomLevel(1)
    setImagePosition({ x: 0, y: 0 })
    document.body.style.overflow = 'hidden' // Prevent background scrolling
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
    setZoomLevel(1)
    setImagePosition({ x: 0, y: 0 })
    document.body.style.overflow = 'unset' // Restore scrolling
  }

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5)) // Max zoom 5x
  }

  const zoomOut = () => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev / 1.5, 0.5) // Min zoom 0.5x
      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 }) // Reset position when back to 1x
      }
      return newZoom
    })
  }

  const resetZoom = () => {
    setZoomLevel(1)
    setImagePosition({ x: 0, y: 0 })
  }

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

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeFullscreen()
    } else if (e.key === '+' || e.key === '=') {
      zoomIn()
    } else if (e.key === '-') {
      zoomOut()
    } else if (e.key === '0') {
      resetZoom()
    }
  }

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
  }, [isFullscreen, isDragging, dragStart, imagePosition])

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
          <div className="lg:sticky lg:top-8">
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
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Sketch Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{sketch.title}</h1>
              <p className="text-gray-600 text-sm mb-4">
                Completed: {new Date(sketch.completedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {sketch.description}
              </p>
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Comments</h2>
              
              {/* Comments List */}
              <div className="space-y-6 mb-8">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-10 h-10 rounded-full bg-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900">{comment.author}</h4>
                          <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <button className="flex items-center space-x-1 hover:text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{comment.likes}</span>
                          </button>
                          <button className="hover:text-gray-700">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
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
