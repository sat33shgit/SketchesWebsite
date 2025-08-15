import { useState, useEffect } from 'react'
import { toggleLike, toggleDislike, getSketchStats } from '../utils/likeSystem'

const LikeDislike = ({ sketchId, size = 'small', showCounts = true, className = '' }) => {
  const [stats, setStats] = useState({ likes: 0, dislikes: 0, userLiked: false, userDisliked: false })

  useEffect(() => {
    // Load initial stats
    setStats(getSketchStats(sketchId))
  }, [sketchId])

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const newStats = toggleLike(sketchId)
    setStats(newStats)
  }

  const handleDislike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const newStats = toggleDislike(sketchId)
    setStats(newStats)
  }

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  const buttonSizeClasses = {
    small: 'p-1',
    medium: 'p-2',
    large: 'p-2'
  }

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`flex items-center space-x-1 ${buttonSizeClasses[size]} rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
          stats.userLiked 
            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
        }`}
        title={stats.userLiked ? 'Remove like' : 'Like this sketch'}
      >
        <svg 
          className={sizeClasses[size]} 
          fill={stats.userLiked ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={stats.userLiked ? 0 : 2} 
            d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
          />
        </svg>
        {showCounts && (
          <span className={`font-medium ${textSizeClasses[size]}`}>
            {stats.likes}
          </span>
        )}
      </button>

      {/* Dislike Button */}
      <button
        onClick={handleDislike}
        className={`flex items-center space-x-1 ${buttonSizeClasses[size]} rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 ${
          stats.userDisliked 
            ? 'text-red-600 bg-red-50 hover:bg-red-100' 
            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
        }`}
        title={stats.userDisliked ? 'Remove dislike' : 'Dislike this sketch'}
      >
        <svg 
          className={`${sizeClasses[size]} transform rotate-180`} 
          fill={stats.userDisliked ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={stats.userDisliked ? 0 : 2} 
            d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
          />
        </svg>
        {showCounts && (
          <span className={`font-medium ${textSizeClasses[size]}`}>
            {stats.dislikes}
          </span>
        )}
      </button>
    </div>
  )
}

export default LikeDislike
