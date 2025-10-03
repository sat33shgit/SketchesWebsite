// Utility functions for managing likes and dislikes in localStorage
const LIKES_STORAGE_KEY = 'sketch_likes'
const DISLIKES_STORAGE_KEY = 'sketch_dislikes'

// Get likes data from localStorage
export const getLikesData = () => {
  try {
    const likes = localStorage.getItem(LIKES_STORAGE_KEY)
    return likes ? JSON.parse(likes) : {}
  } catch {
    // Ignore localStorage read errors in environments where it's not available
    return {}
  }
}

// Get dislikes data from localStorage
export const getDislikesData = () => {
  try {
    const dislikes = localStorage.getItem(DISLIKES_STORAGE_KEY)
    return dislikes ? JSON.parse(dislikes) : {}
  } catch {
    // Ignore localStorage read errors in environments where it's not available
    return {}
  }
}

// Save likes data to localStorage
export const saveLikesData = (likesData) => {
  try {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likesData))
  } catch {
    // Ignore save errors (best-effort caching)
  }
}

// Save dislikes data to localStorage
export const saveDislikesData = (dislikesData) => {
  try {
    localStorage.setItem(DISLIKES_STORAGE_KEY, JSON.stringify(dislikesData))
  } catch {
    // Ignore save errors (best-effort caching)
  }
}

// Get like count for a specific sketch
export const getLikeCount = (sketchId) => {
  const likes = getLikesData()
  return likes[sketchId] || 0
}

// Get dislike count for a specific sketch
export const getDislikeCount = (sketchId) => {
  const dislikes = getDislikesData()
  return dislikes[sketchId] || 0
}

// Check if user has liked a sketch
export const hasUserLiked = (sketchId) => {
  try {
    const userLikes = localStorage.getItem(`user_liked_${sketchId}`)
    return userLikes === 'true'
  } catch {
    return false
  }
}

// Check if user has disliked a sketch
export const hasUserDisliked = (sketchId) => {
  try {
    const userDislikes = localStorage.getItem(`user_disliked_${sketchId}`)
    return userDislikes === 'true'
  } catch {
    return false
  }
}

// Toggle like for a sketch
export const toggleLike = (sketchId) => {
  const likes = getLikesData()
  const dislikes = getDislikesData()
  const userLiked = hasUserLiked(sketchId)
  const userDisliked = hasUserDisliked(sketchId)

  if (userLiked) {
    // Remove like
    likes[sketchId] = Math.max(0, (likes[sketchId] || 0) - 1)
    localStorage.removeItem(`user_liked_${sketchId}`)
  } else {
    // Add like
    likes[sketchId] = (likes[sketchId] || 0) + 1
    localStorage.setItem(`user_liked_${sketchId}`, 'true')
    
    // Remove dislike if user had disliked
    if (userDisliked) {
      dislikes[sketchId] = Math.max(0, (dislikes[sketchId] || 0) - 1)
      localStorage.removeItem(`user_disliked_${sketchId}`)
      saveDislikesData(dislikes)
    }
  }

  saveLikesData(likes)
  return {
    likes: likes[sketchId] || 0,
    dislikes: dislikes[sketchId] || 0,
    userLiked: !userLiked,
    userDisliked: false
  }
}

// Toggle dislike for a sketch
export const toggleDislike = (sketchId) => {
  const likes = getLikesData()
  const dislikes = getDislikesData()
  const userLiked = hasUserLiked(sketchId)
  const userDisliked = hasUserDisliked(sketchId)

  if (userDisliked) {
    // Remove dislike
    dislikes[sketchId] = Math.max(0, (dislikes[sketchId] || 0) - 1)
    localStorage.removeItem(`user_disliked_${sketchId}`)
  } else {
    // Add dislike
    dislikes[sketchId] = (dislikes[sketchId] || 0) + 1
    localStorage.setItem(`user_disliked_${sketchId}`, 'true')
    
    // Remove like if user had liked
    if (userLiked) {
      likes[sketchId] = Math.max(0, (likes[sketchId] || 0) - 1)
      localStorage.removeItem(`user_liked_${sketchId}`)
      saveLikesData(likes)
    }
  }

  saveDislikesData(dislikes)
  return {
    likes: likes[sketchId] || 0,
    dislikes: dislikes[sketchId] || 0,
    userLiked: false,
    userDisliked: !userDisliked
  }
}

// Get all stats for a sketch
export const getSketchStats = (sketchId) => {
  return {
    likes: getLikeCount(sketchId),
    dislikes: getDislikeCount(sketchId),
    userLiked: hasUserLiked(sketchId),
    userDisliked: hasUserDisliked(sketchId)
  }
}
