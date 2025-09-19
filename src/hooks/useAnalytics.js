// Utility hook for tracking page visits
// File: src/hooks/useAnalytics.js

import { useEffect } from 'react'

const useAnalytics = (pageType, pageId = null) => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // For development, you can enable/disable tracking by setting REACT_APP_ENABLE_ANALYTICS=true
        const enableTracking = process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_ANALYTICS === 'true'
        
        if (!enableTracking) {
          console.log(`[Analytics] Would track: ${pageType}${pageId ? ` - ${pageId}` : ''}`)
          return
        }

        const response = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pageType,
            pageId
          })
        })

        if (!response.ok) {
          console.warn('Failed to track visit:', response.statusText)
        }
      } catch (error) {
        console.warn('Error tracking visit:', error)
      }
    }

    // Track visit after a small delay to ensure page is loaded
    const timeoutId = setTimeout(trackVisit, 1000)

    return () => clearTimeout(timeoutId)
  }, [pageType, pageId])
}

export default useAnalytics