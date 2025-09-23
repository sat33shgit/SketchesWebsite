import React from 'react'

/**
 * UserAvatar Component
 * 
 * Displays a circular avatar with the first letter of a user's name.
 * Uses consistent color generation based on the name for visual consistency.
 * 
 * @param {string} name - The user's name
 * @param {string} size - Avatar size: 'small', 'medium', or 'large'
 * @param {string} className - Additional CSS classes
 */
const UserAvatar = ({ name, size = 'medium', className = '' }) => {
  // Get first letter of the name, fallback to '?'
  const firstLetter = name && name.trim() ? name.trim()[0].toUpperCase() : '?'
  
  // Generate a consistent color based on the name
  const getAvatarColor = (name) => {
    if (!name) return { bg: '#9ca3af', text: '#ffffff' }
    
    // Simple hash function to generate consistent colors
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    // Color palette with high contrast combinations
    const colorPairs = [
      { bg: '#ef4444', text: '#ffffff' }, // red
      { bg: '#f97316', text: '#ffffff' }, // orange
      { bg: '#eab308', text: '#ffffff' }, // yellow
      { bg: '#22c55e', text: '#ffffff' }, // green
      { bg: '#06b6d4', text: '#ffffff' }, // cyan
      { bg: '#3b82f6', text: '#ffffff' }, // blue
      { bg: '#8b5cf6', text: '#ffffff' }, // violet
      { bg: '#ec4899', text: '#ffffff' }, // pink
      { bg: '#f59e0b', text: '#ffffff' }, // amber
      { bg: '#10b981', text: '#ffffff' }, // emerald
      { bg: '#6366f1', text: '#ffffff' }, // indigo
      { bg: '#84cc16', text: '#ffffff' }, // lime
      { bg: '#dc2626', text: '#ffffff' }, // red-600
      { bg: '#ea580c', text: '#ffffff' }, // orange-600
      { bg: '#ca8a04', text: '#ffffff' }, // yellow-600
      { bg: '#16a34a', text: '#ffffff' }, // green-600
      { bg: '#0891b2', text: '#ffffff' }, // cyan-600
      { bg: '#2563eb', text: '#ffffff' }, // blue-600
      { bg: '#7c3aed', text: '#ffffff' }, // violet-600
      { bg: '#db2777', text: '#ffffff' }, // pink-600
    ]
    
    return colorPairs[Math.abs(hash) % colorPairs.length]
  }
  
  // Size configurations
  const sizeConfigs = {
    small: { 
      size: '28px', 
      fontSize: '14px',
      border: '2px solid #ffffff',
      shadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
    },
    medium: { 
      size: '36px', 
      fontSize: '16px',
      border: '2px solid #ffffff',
      shadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    large: { 
      size: '44px', 
      fontSize: '20px',
      border: '3px solid #ffffff',
      shadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  }
  
  const colors = getAvatarColor(name)
  const config = sizeConfigs[size]
  
  const handleMouseEnter = (e) => {
    e.target.style.transform = 'scale(1.05)'
  }
  
  const handleMouseLeave = (e) => {
    e.target.style.transform = 'scale(1)'
  }
  
  return (
    <div 
      className={className}
      style={{
        // Dimensions and shape
        width: config.size,
        height: config.size,
        borderRadius: '50%',
        
        // Colors and background
        backgroundColor: colors.bg,
        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}dd 100%)`,
        color: colors.text,
        
        // Border and shadow
        border: config.border,
        boxShadow: config.shadow,
        
        // Layout and positioning
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        
        // Typography
        fontSize: config.fontSize,
        fontWeight: 'bold',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textTransform: 'uppercase',
        
        // Interaction
        cursor: 'default',
        userSelect: 'none',
        transition: 'all 0.2s ease-in-out',
        
        // Overflow
        overflow: 'hidden'
      }}
      title={name || 'Anonymous'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {firstLetter}
    </div>
  )
}

export default UserAvatar