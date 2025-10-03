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
              const visits = Number(sketchData.total_visits) || 0
              // Add 1 to show the current visit count including the current page view
              setViewCount(visits + 1)
            } else {
              // If no data found, this is the first visit
              setViewCount(1)
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

  // keep sizeClasses for the svg sizing and allow passing a custom className on the root span

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#374151', fontSize: '0.95rem', fontWeight: 500 }}>
      <svg 
        className={sizeClasses[size]} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        title="Views"
        style={{
          width: '1.25rem',
          height: '1.25rem',
          strokeWidth: 2
        }}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <span style={{ color: '#2563eb', fontWeight: 600 }}>
        {isLoading ? '...' : viewCount}
      </span>
  <span style={{ color: '#000000' }}>Views</span>
    </span>
  )
}

export default ViewCount