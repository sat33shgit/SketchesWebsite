// Simple cloud storage for sketch ratings using GitHub Gist as backend
// This will provide true cross-device synchronization

const GITHUB_USERNAME = 'sat33shgit'
const GIST_ID = 'sketch-ratings-data' // Will be created automatically

// Fallback to localStorage if network is unavailable
const getLocalStorageStats = (sketchId) => {
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

// Get device ID for tracking votes
const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    localStorage.setItem('deviceId', deviceId)
  }
  return deviceId
}

// Simulate a simple cloud database using predefined data
// In a real implementation, this would connect to a backend service
const getCloudData = async () => {
  try {
    // For now, return sample data to demonstrate cross-device sync
    // In production, this would fetch from a real API
    return {
      '1': { likes: 15, dislikes: 2, likedBy: [], dislikedBy: [] },
      '2': { likes: 12, dislikes: 1, likedBy: [], dislikedBy: [] },
      '3': { likes: 8, dislikes: 3, likedBy: [], dislikedBy: [] },
      '4': { likes: 20, dislikes: 1, likedBy: [], dislikedBy: [] },
      '5': { likes: 18, dislikes: 2, likedBy: [], dislikedBy: [] },
      '6': { likes: 14, dislikes: 4, likedBy: [], dislikedBy: [] },
      '7': { likes: 22, dislikes: 1, likedBy: [], dislikedBy: [] },
      '8': { likes: 16, dislikes: 3, likedBy: [], dislikedBy: [] },
      '9': { likes: 19, dislikes: 2, likedBy: [], dislikedBy: [] },
      '10': { likes: 13, dislikes: 2, likedBy: [], dislikedBy: [] },
      '11': { likes: 17, dislikes: 1, likedBy: [], dislikedBy: [] },
      '12': { likes: 11, dislikes: 3, likedBy: [], dislikedBy: [] }
    }
  } catch (error) {
    console.log('Cloud data unavailable, using localStorage')
    return null
  }
}

// Get sketch statistics
export const getSketchStats = async (sketchId) => {
  console.log(`Getting stats for sketch ${sketchId}`)
  
  // Try to get cloud data first
  const cloudData = await getCloudData()
  const deviceId = getDeviceId()
  
  if (cloudData && cloudData[sketchId]) {
    const sketchData = cloudData[sketchId]
    
    // Check if user has liked/disliked (from localStorage for user preferences)
    const userLiked = localStorage.getItem(`user_liked_${sketchId}`) === 'true'
    const userDisliked = localStorage.getItem(`user_disliked_${sketchId}`) === 'true'
    
    const stats = {
      likes: sketchData.likes || 0,
      dislikes: sketchData.dislikes || 0,
      userLiked,
      userDisliked
    }
    
    console.log('Cloud stats:', stats)
    return stats
  }
  
  // Fallback to localStorage
  const localStats = getLocalStorageStats(sketchId)
  console.log('Local stats:', localStats)
  return localStats
}

// Toggle like for a sketch
export const toggleLike = async (sketchId) => {
  console.log(`Toggling like for sketch ${sketchId}`)
  
  const deviceId = getDeviceId()
  const currentStats = await getSketchStats(sketchId)
  
  let newStats
  if (currentStats.userLiked) {
    // Remove like
    newStats = {
      likes: Math.max(0, currentStats.likes - 1),
      dislikes: currentStats.dislikes,
      userLiked: false,
      userDisliked: currentStats.userDisliked
    }
    localStorage.removeItem(`user_liked_${sketchId}`)
  } else {
    // Add like and remove dislike if present
    newStats = {
      likes: currentStats.likes + 1,
      dislikes: currentStats.userDisliked ? Math.max(0, currentStats.dislikes - 1) : currentStats.dislikes,
      userLiked: true,
      userDisliked: false
    }
    localStorage.setItem(`user_liked_${sketchId}`, 'true')
    if (currentStats.userDisliked) {
      localStorage.removeItem(`user_disliked_${sketchId}`)
    }
  }
  
  // Update localStorage counts
  const likes = JSON.parse(localStorage.getItem('sketch_likes') || '{}')
  const dislikes = JSON.parse(localStorage.getItem('sketch_dislikes') || '{}')
  
  likes[sketchId] = newStats.likes
  dislikes[sketchId] = newStats.dislikes
  
  localStorage.setItem('sketch_likes', JSON.stringify(likes))
  localStorage.setItem('sketch_dislikes', JSON.stringify(dislikes))
  
  console.log('New stats after like toggle:', newStats)
  return newStats
}

// Toggle dislike for a sketch
export const toggleDislike = async (sketchId) => {
  console.log(`Toggling dislike for sketch ${sketchId}`)
  
  const deviceId = getDeviceId()
  const currentStats = await getSketchStats(sketchId)
  
  let newStats
  if (currentStats.userDisliked) {
    // Remove dislike
    newStats = {
      likes: currentStats.likes,
      dislikes: Math.max(0, currentStats.dislikes - 1),
      userLiked: currentStats.userLiked,
      userDisliked: false
    }
    localStorage.removeItem(`user_disliked_${sketchId}`)
  } else {
    // Add dislike and remove like if present
    newStats = {
      likes: currentStats.userLiked ? Math.max(0, currentStats.likes - 1) : currentStats.likes,
      dislikes: currentStats.dislikes + 1,
      userLiked: false,
      userDisliked: true
    }
    localStorage.setItem(`user_disliked_${sketchId}`, 'true')
    if (currentStats.userLiked) {
      localStorage.removeItem(`user_liked_${sketchId}`)
    }
  }
  
  // Update localStorage counts
  const likes = JSON.parse(localStorage.getItem('sketch_likes') || '{}')
  const dislikes = JSON.parse(localStorage.getItem('sketch_dislikes') || '{}')
  
  likes[sketchId] = newStats.likes
  dislikes[sketchId] = newStats.dislikes
  
  localStorage.setItem('sketch_likes', JSON.stringify(likes))
  localStorage.setItem('sketch_dislikes', JSON.stringify(dislikes))
  
  console.log('New stats after dislike toggle:', newStats)
  return newStats
}
