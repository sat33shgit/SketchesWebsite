import { useState, useEffect } from 'react'

const ViewCount = ({ sketchId, size = 'small', className = '' }) => {
  const [viewCount, setViewCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/analytics/stats?timeframe=all')
        if (response.ok) {
          const data = await response.json()
          
          if (data.success && data.data && data.data.detailed) {
            // Find the view count for this specific sketch
            const sketchData = data.data.detailed.find(
              item => item.page_type === 'sketch' && (item.page_id === String(sketchId) || item.page_id === sketchId)
            )
            
            if (sketchData) {
              setViewCount(parseInt(sketchData.total_visits) || 0)
            } else {
              setViewCount(0)
            }
          } else {
            setViewCount(0)
          }
        } else {
          setViewCount(0)
        }
      } catch (error) {
        console.error('Error fetching view count:', error)
        setViewCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    if (sketchId) {
      fetchViewCount()
    }
  }, [sketchId])

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
    <div 
      className={`flex items-center space-x-1 ${buttonSizeClasses[size]} rounded-full transition-colors text-gray-600 bg-gray-100 ${className}`}
    >
      {/* Eye icon for views */}
      <svg 
        className={sizeClasses[size]} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        title="Views"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <span className={`${textSizeClasses[size]}`}>
        Views
      </span>
      <span className={`font-medium ${textSizeClasses[size]} ml-1`}>
        {isLoading ? '...' : viewCount}
      </span>
    </div>
  )
}

export default ViewCount