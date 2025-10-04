// Vercel API-based database service for cross-device persistence
const API_BASE = typeof window !== 'undefined' 
  ? window.location.origin
  : 'https://sketches-website.vercel.app'

// Get device ID for tracking votes
const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    localStorage.setItem('deviceId', deviceId)
  }
  return deviceId
}

// Get sketch statistics from Vercel API (always fetch from API, no caching) (always fetch from API, no caching)
export const getSketchStats = async (sketchId) => {
  try {
    const response = await fetch(`/api/sketches/${sketchId}/stats`, {
      cache: 'no-store' // Force fresh fetch from API
    })

    if (response.ok) {
      const result = await response.json()

      // result may be one of several shapes. Normalize to { likes, dislikes }
      let likes = 0
      let dislikes = 0
      if (result) {
        if (result.success && result.data) {
          likes = Number(result.data.likes ?? result.data.count ?? 0) || 0
          dislikes = Number(result.data.dislikes ?? 0) || 0
        } else if (typeof result.count === 'number' || typeof result.likes === 'number') {
          likes = Number(result.likes ?? result.count ?? 0) || 0
          dislikes = Number(result.dislikes ?? 0) || 0
        } else if (Array.isArray(result)) {
          // Some endpoints may accidentally return rows; try to extract mapping
          // e.g., [{smiley_type: 'like', count: 3}, ...]
          const mapping = {}
          result.forEach(r => { if (r.smiley_type) mapping[r.smiley_type] = Number(r.count || 0) })
          likes = mapping['like'] || 0
          dislikes = mapping['dislike'] || 0
        }
      }

      // Read userLiked state from localStorage only (for client-side UI state)
      const userLiked = localStorage.getItem(`user_liked_${sketchId}`) === 'true'
      const userDisliked = localStorage.getItem(`user_disliked_${sketchId}`) === 'true'

      const stats = {
        likes: likes,
        dislikes: dislikes,
        userLiked,
        userDisliked
      }

      return stats
    }
  } catch (error) {
    console.error('Error fetching sketch stats from API:', error)
  }
  
  // If API fails, return zeros (no localStorage fallback for counts)
  const userLiked = localStorage.getItem(`user_liked_${sketchId}`) === 'true'
  const userDisliked = localStorage.getItem(`user_disliked_${sketchId}`) === 'true'
  return { likes: 0, dislikes: 0, userLiked, userDisliked }
}

// Toggle like using Vercel API (always calls Postgres-backed API)
export const toggleLike = async (sketchId) => {
  const deviceId = getDeviceId()
  
  // Read current user state from localStorage (UI state only, not counts)
  const userLiked = localStorage.getItem(`user_liked_${sketchId}`) === 'true'
  const action = userLiked ? 'unlike' : 'like'
  
  try {
    const response = await fetch(`/api/sketches/${sketchId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deviceId, action })
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result && result.success && result.data) {
        const newStats = {
          likes: Number(result.data.likes ?? result.data.count ?? 0) || 0,
          dislikes: Number(result.data.dislikes ?? 0) || 0,
          userLiked: Boolean(result.data.userLiked),
          userDisliked: Boolean(result.data.userDisliked)
        }
        
        // Update only user state in localStorage (not counts)
        if (newStats.userLiked) {
          localStorage.setItem(`user_liked_${sketchId}`, 'true')
        } else {
          localStorage.removeItem(`user_liked_${sketchId}`)
        }
        if (newStats.userDisliked) {
          localStorage.setItem(`user_disliked_${sketchId}`, 'true')
        } else {
          localStorage.removeItem(`user_disliked_${sketchId}`)
        }
        
        return newStats
      }
      // Some endpoints may return { success: true, count: N }
      if (result && typeof result.count === 'number') {
        const newStats = { likes: Number(result.count), dislikes: 0, userLiked: action === 'like', userDisliked: false }
        
        // Update user state in localStorage
        if (action === 'like') {
          localStorage.setItem(`user_liked_${sketchId}`, 'true')
        } else {
          localStorage.removeItem(`user_liked_${sketchId}`)
        }
        
        return newStats
      }
    }
    
    throw new Error('API request failed or returned unexpected format')
  } catch (error) {
    console.error('Error toggling like via API:', error.message)
    throw error // Propagate error so UI can handle it
  }
}

// Toggle dislike using Vercel API (always calls Postgres-backed API)
export const toggleDislike = async (sketchId) => {
  console.log(`Toggling dislike for sketch ${sketchId}`)
  
  const deviceId = getDeviceId()
  
  // Read current user state from localStorage (UI state only, not counts)
  const userDisliked = localStorage.getItem(`user_disliked_${sketchId}`) === 'true'
  const action = userDisliked ? 'undislike' : 'dislike'
  
  try {
    const response = await fetch(`/api/sketches/${sketchId}/dislike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deviceId, action })
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        const newStats = result.data
        
        // Update only user state in localStorage (not counts)
        if (newStats.userLiked) {
          localStorage.setItem(`user_liked_${sketchId}`, 'true')
        } else {
          localStorage.removeItem(`user_liked_${sketchId}`)
        }
        if (newStats.userDisliked) {
          localStorage.setItem(`user_disliked_${sketchId}`, 'true')
        } else {
          localStorage.removeItem(`user_disliked_${sketchId}`)
        }
        
        console.log('API dislike toggle result:', newStats)
        return newStats
      }
    }
    
    throw new Error('API request failed or returned unexpected format')
  } catch (error) {
    console.error('Error toggling dislike via API:', error.message)
    throw error // Propagate error so UI can handle it
  }
}
