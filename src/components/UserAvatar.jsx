import React from 'react'

const UserAvatar = ({ name, size = 'medium', className = '' }) => {
  // Get first letter of the name, fallback to '?'
  const firstLetter = name && name.trim() ? name.trim()[0].toUpperCase() : '?'
  
  // Generate a consistent color based on the name
  const getAvatarColor = (name) => {
    if (!name) return '#6b7280' // gray for fallback
    
    // Simple hash function to generate consistent colors
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    // Pre-defined color palette for avatars
    const colors = [
      '#ef4444', // red
      '#f97316', // orange  
      '#eab308', // yellow
      '#22c55e', // green
      '#06b6d4', // cyan
      '#3b82f6', // blue
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#f59e0b', // amber
      '#10b981', // emerald
      '#6366f1', // indigo
      '#84cc16', // lime
    ]
    
    return colors[Math.abs(hash) % colors.length]
  }
  
  const sizeClasses = {
    small: { width: '24px', height: '24px', fontSize: '12px' },
    medium: { width: '32px', height: '32px', fontSize: '14px' },
    large: { width: '40px', height: '40px', fontSize: '16px' }
  }
  
  const avatarColor = getAvatarColor(name)
  const sizeStyle = sizeClasses[size]
  
  return (
    <div 
      className={`inline-flex items-center justify-center rounded-full text-white font-semibold ${className}`}
      style={{
        backgroundColor: avatarColor,
        width: sizeStyle.width,
        height: sizeStyle.height,
        fontSize: sizeStyle.fontSize,
        flexShrink: 0
      }}
      title={name || 'Anonymous'}
    >
      {firstLetter}
    </div>
  )
}

export default UserAvatar