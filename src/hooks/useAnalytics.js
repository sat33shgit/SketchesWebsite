// Utility hook for tracking page visits
// File: src/hooks/useAnalytics.js

import { useEffect } from 'react'

const useAnalytics = (pageType, pageId = null) => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // For development, you can enable/disable tracking by setting REACT_APP_ENABLE_ANALYTICS=true
        // Enable tracking in development for testing
        const enableTracking = true // Always enable for now
        
        if (!enableTracking) {
          // console.log(`[Analytics] Would track: ${pageType}${pageId ? ` - ${pageId}` : ''}`)
          return
        }

  // console.log(`[Analytics] Tracking: ${pageType}${pageId ? ` - ${pageId}` : ''}`) // Debug log

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
          // console.warn('Failed to track visit:', response.status, response.statusText)
        } else {
          // console.log(`[Analytics] Successfully tracked: ${pageType}${pageId ? ` - ${pageId}` : ''}`)
        }
      } catch (error) {
  // console.warn('Error tracking visit:', error)
      }
    }

    // Track visit after a small delay to ensure page is loaded
    const timeoutId = setTimeout(trackVisit, 1000)

    return () => clearTimeout(timeoutId)
  }, [pageType, pageId])
}

export default useAnalytics