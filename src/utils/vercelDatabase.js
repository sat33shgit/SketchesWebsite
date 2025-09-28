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

// Fallback localStorage functions
const getStatsFromLocalStorage = (sketchId) => {
  try {
    const likes = JSON.parse(localStorage.getItem('sketch_likes') || '{}')
    const dislikes = JSON.parse(localStorage.getItem('sketch_dislikes') || '{}')
    const userLiked = localStorage.getItem(`user_liked_${sketchId}`) === 'true'
    const userDisliked = localStorage.getItem(`user_disliked_${sketchId}`) === 'true'
    
    return {
      likes: likes[sketchId] || 0,
      dislikes: dislikes[sketchId] || 0,
      userLiked,
      userDisliked
    }
  } catch (error) {
    return { likes: 0, dislikes: 0, userLiked: false, userDisliked: false }
  }
}

const saveToLocalStorage = (sketchId, stats) => {
  try {
    const likes = JSON.parse(localStorage.getItem('sketch_likes') || '{}')
    const dislikes = JSON.parse(localStorage.getItem('sketch_dislikes') || '{}')
    
    likes[sketchId] = stats.likes
    dislikes[sketchId] = stats.dislikes
    
    localStorage.setItem('sketch_likes', JSON.stringify(likes))
    localStorage.setItem('sketch_dislikes', JSON.stringify(dislikes))
    
    if (stats.userLiked) {
      localStorage.setItem(`user_liked_${sketchId}`, 'true')
    } else {
      localStorage.removeItem(`user_liked_${sketchId}`)
    }
    
    if (stats.userDisliked) {
      localStorage.setItem(`user_disliked_${sketchId}`, 'true')
    } else {
      localStorage.removeItem(`user_disliked_${sketchId}`)
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Get sketch statistics from Vercel API
export const getSketchStats = async (sketchId) => {
  try {
    const response = await fetch(`/api/sketches/${sketchId}/stats`)

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

      const deviceId = getDeviceId()
      const userLiked = localStorage.getItem(`user_liked_${sketchId}`) === 'true'
      const userDisliked = localStorage.getItem(`user_disliked_${sketchId}`) === 'true'

      const stats = {
        likes: likes,
        dislikes: dislikes,
        userLiked,
        userDisliked
      }

      // Save to localStorage for caching
      saveToLocalStorage(sketchId, stats)
      return stats
    }
  } catch (error) {
    // API unavailable, fall back to localStorage
  }
  
  // Fallback to localStorage
  const localStats = getStatsFromLocalStorage(sketchId)
  return localStats
}

// Toggle like using Vercel API
export const toggleLike = async (sketchId) => {
  const deviceId = getDeviceId()
  const currentStats = getStatsFromLocalStorage(sketchId)
  const action = currentStats.userLiked ? 'unlike' : 'like'
  
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
        saveToLocalStorage(sketchId, newStats)
        console.log('API like toggle result:', newStats)
        return newStats
      }
      // Some endpoints may return { success: true, count: N }
      if (result && typeof result.count === 'number') {
        const newStats = { likes: Number(result.count), dislikes: 0, userLiked: action === 'like', userDisliked: false }
        saveToLocalStorage(sketchId, newStats)
        return newStats
      }
    }
  } catch (error) {
    console.log('API unavailable, using localStorage:', error.message)
  }
  
  // Fallback to localStorage
  const newStats = {
    likes: currentStats.userLiked ? Math.max(0, currentStats.likes - 1) : currentStats.likes + 1,
    dislikes: currentStats.userDisliked ? Math.max(0, currentStats.dislikes - 1) : currentStats.dislikes,
    userLiked: !currentStats.userLiked,
    userDisliked: false
  }
  
  saveToLocalStorage(sketchId, newStats)
  console.log('Local fallback like toggle:', newStats)
  return newStats
}

// Toggle dislike using Vercel API
export const toggleDislike = async (sketchId) => {
  console.log(`Toggling dislike for sketch ${sketchId}`)
  
  const deviceId = getDeviceId()
  const currentStats = getStatsFromLocalStorage(sketchId)
  const action = currentStats.userDisliked ? 'undislike' : 'dislike'
  
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
        saveToLocalStorage(sketchId, newStats)
        console.log('API dislike toggle result:', newStats)
        return newStats
      }
    }
  } catch (error) {
    console.log('API unavailable, using localStorage:', error.message)
  }
  
  // Fallback to localStorage
  const newStats = {
    likes: currentStats.userLiked ? Math.max(0, currentStats.likes - 1) : currentStats.likes,
    dislikes: currentStats.userDisliked ? Math.max(0, currentStats.dislikes - 1) : currentStats.dislikes + 1,
    userLiked: false,
    userDisliked: !currentStats.userDisliked
  }
  
  saveToLocalStorage(sketchId, newStats)
  console.log('Local fallback dislike toggle:', newStats)
  return newStats
}
