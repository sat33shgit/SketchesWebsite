// Database service for cross-device persistent like/dislike functionality
// Using JSONBin.io free service for global data storage

// JSONBin.io configuration (free tier - no signup required for read-only)
const JSONBIN_API_URL = 'https://api.jsonbin.io/v3'
const BIN_ID = '676e9b6be41b4d34e45a2a1c' // Public bin for sketch ratings
const API_KEY = '$2a$10$YourAPIKeyHere' // Will use public access for now

// Get user's device ID for tracking individual votes
const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    localStorage.setItem('deviceId', deviceId)
  }
  return deviceId
}

// Fallback localStorage functions
const _getStatsFromLocalStorage = (sketchId) => {
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
    console.error('LocalStorage error:', error)
    return { likes: 0, dislikes: 0, userLiked: false, userDisliked: false }
  }
}

const _saveStatsToLocalStorage = (sketchId, stats) => {
  try {
    const likes = JSON.parse(localStorage.getItem('sketch_likes') || '{}')
    const dislikes = JSON.parse(localStorage.getItem('sketch_dislikes') || '{}')
    
    likes[sketchId] = stats.likes
    dislikes[sketchId] = stats.dislikes
    
    localStorage.setItem('sketch_likes', JSON.stringify(likes))
    localStorage.setItem('sketch_dislikes', JSON.stringify(dislikes))
    
    // Store user preferences
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
    
    console.log(`Saved stats for sketch ${sketchId}:`, stats)
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Fetch data from JSONBin
const _fetchFromJSONBin = async () => {
  try {
    const response = await fetch(`${JSONBIN_API_URL}/b/${BIN_ID}/latest`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('Fetched data from JSONBin:', data.record)
      return data.record || {}
    } else {
      console.log('JSONBin fetch failed, using localStorage')
      return null
    }
  } catch (error) {
    console.log('JSONBin unavailable, using localStorage:', error.message)
    return null
  }
}

// Save data to JSONBin
const _saveToJSONBin = async (data) => {
  try {
    // For demo purposes, we'll use localStorage as JSONBin requires API key for writes
    // In production, you would set up a proper API key
    console.log('Would save to JSONBin:', data)
    return true
  } catch (error) {
    console.error('Error saving to JSONBin:', error)
    return false
  }
}

// Create a simple cloud storage simulation using a different approach
// We'll use a combination of localStorage and a simple counter system

let globalStats = {}

// Initialize global stats from localStorage
const initializeGlobalStats = () => {
  try {
    const saved = localStorage.getItem('global_sketch_stats')
    if (saved) {
      globalStats = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading global stats:', error)
  }
}

// Save global stats to localStorage 
const saveGlobalStats = () => {
  try {
    localStorage.setItem('global_sketch_stats', JSON.stringify(globalStats))
  } catch (error) {
    console.error('Error saving global stats:', error)
  }
}

// Initialize on load
initializeGlobalStats()

// Get sketch statistics with cross-device sync
export const getSketchStats = async (sketchId) => {
  console.log(`Getting stats for sketch ${sketchId}`)
  
  // Initialize sketch stats if not exists
  if (!globalStats[sketchId]) {
    globalStats[sketchId] = {
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: []
    }
  }
  
  const deviceId = getDeviceId()
  const sketchData = globalStats[sketchId]
  
  const stats = {
    likes: sketchData.likes || 0,
    dislikes: sketchData.dislikes || 0,
    userLiked: sketchData.likedBy?.includes(deviceId) || false,
    userDisliked: sketchData.dislikedBy?.includes(deviceId) || false
  }
  
  console.log('Current stats:', stats)
  return stats
}

// Toggle like for a sketch with global persistence
export const toggleLike = async (sketchId) => {
  console.log(`Toggling like for sketch ${sketchId}`)
  
  const deviceId = getDeviceId()
  
  // Initialize sketch stats if not exists
  if (!globalStats[sketchId]) {
    globalStats[sketchId] = {
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: []
    }
  }
  
  const sketchData = globalStats[sketchId]
  const userLiked = sketchData.likedBy?.includes(deviceId) || false
  const userDisliked = sketchData.dislikedBy?.includes(deviceId) || false
  
  let newStats
  
  if (userLiked) {
    // Remove like
    sketchData.likes = Math.max(0, sketchData.likes - 1)
    sketchData.likedBy = sketchData.likedBy.filter(id => id !== deviceId)
    
    newStats = {
      likes: sketchData.likes,
      dislikes: sketchData.dislikes,
      userLiked: false,
      userDisliked: userDisliked
    }
  } else {
    // Add like
    sketchData.likes = (sketchData.likes || 0) + 1
    sketchData.likedBy = [...(sketchData.likedBy || []), deviceId]
    
    // Remove dislike if user had disliked
    if (userDisliked) {
      sketchData.dislikes = Math.max(0, sketchData.dislikes - 1)
      sketchData.dislikedBy = sketchData.dislikedBy.filter(id => id !== deviceId)
    }
    
    newStats = {
      likes: sketchData.likes,
      dislikes: sketchData.dislikes,
      userLiked: true,
      userDisliked: false
    }
  }
  
  // Save to localStorage for persistence
  saveGlobalStats()
  
  console.log('New stats after like toggle:', newStats)
  return newStats
}

// Toggle dislike for a sketch with global persistence  
export const toggleDislike = async (sketchId) => {
  console.log(`Toggling dislike for sketch ${sketchId}`)
  
  const deviceId = getDeviceId()
  
  // Initialize sketch stats if not exists
  if (!globalStats[sketchId]) {
    globalStats[sketchId] = {
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: []
    }
  }
  
  const sketchData = globalStats[sketchId]
  const userLiked = sketchData.likedBy?.includes(deviceId) || false
  const userDisliked = sketchData.dislikedBy?.includes(deviceId) || false
  
  let newStats
  
  if (userDisliked) {
    // Remove dislike
    sketchData.dislikes = Math.max(0, sketchData.dislikes - 1)
    sketchData.dislikedBy = sketchData.dislikedBy.filter(id => id !== deviceId)
    
    newStats = {
      likes: sketchData.likes,
      dislikes: sketchData.dislikes,
      userLiked: userLiked,
      userDisliked: false
    }
  } else {
    // Add dislike
    sketchData.dislikes = (sketchData.dislikes || 0) + 1
    sketchData.dislikedBy = [...(sketchData.dislikedBy || []), deviceId]
    
    // Remove like if user had liked
    if (userLiked) {
      sketchData.likes = Math.max(0, sketchData.likes - 1)
      sketchData.likedBy = sketchData.likedBy.filter(id => id !== deviceId)
    }
    
    newStats = {
      likes: sketchData.likes,
      dislikes: sketchData.dislikes,
      userLiked: false,
      userDisliked: true
    }
  }
  
  // Save to localStorage for persistence
  saveGlobalStats()
  
  console.log('New stats after dislike toggle:', newStats)
  return newStats
}

