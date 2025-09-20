import React from 'react'

const UserAvatar = ({ name, size = 'medium', className = '' }) => {
  // Get first letter of the name, fallback to '?'
  const firstLetter = name && name.trim() ? name.trim()[0].toUpperCase() : '?'
  
  // Generate a consistent color based on the name
  const getAvatarColor = (name) => {
    if (!name) return {
      bg: '#9ca3af',
      text: '#ffffff'
    }
    
    // Simple hash function to generate consistent colors
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    // Enhanced color palette with background and text colors for better contrast
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
  
  const sizeClasses = {
    small: { 
      width: '28px', 
      height: '28px', 
      fontSize: '14px', // Increased from 12px to 14px
      border: '2px solid #ffffff',
      shadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
    },
    medium: { 
      width: '36px', 
      height: '36px', 
      fontSize: '16px', // Increased from 14px to 16px
      border: '2px solid #ffffff',
      shadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    large: { 
      width: '44px', 
      height: '44px', 
      fontSize: '20px', // Increased from 18px to 20px
      border: '3px solid #ffffff',
      shadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  }
  
  const colors = getAvatarColor(name)
  const sizeStyle = sizeClasses[size]
  
  return (
    <div 
      className={`${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        width: sizeStyle.width,
        height: sizeStyle.height,
        fontSize: sizeStyle.fontSize,
        flexShrink: 0,
        border: sizeStyle.border,
        boxShadow: sizeStyle.shadow,
        userSelect: 'none',
        position: 'relative',
        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}dd 100%)`,
        transition: 'all 0.2s ease-in-out',
        cursor: 'default',
        borderRadius: '50%',
        minWidth: sizeStyle.width,
        minHeight: sizeStyle.height,
        overflow: 'hidden',
        // Perfect centering
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        lineHeight: '1',
        fontWeight: 'bold',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
      title={name || 'Anonymous'}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.05)'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)'
      }}
    >
      <span style={{
        display: 'block',
        textAlign: 'center',
        lineHeight: '1',
        transform: 'translateY(0)', // Ensure no vertical offset
        fontSize: 'inherit',
        textTransform: 'uppercase', // Ensure capital letters at CSS level
        fontWeight: 'bold'
      }}>
        {firstLetter}
      </span>
    </div>
  )
}

export default UserAvatar