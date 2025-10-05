import React from 'react'

const MaintenanceOverlay = ({ children }) => {
  return (
    <div className="maintenance-container">
      {/* Blurred content */}
      <div className="maintenance-content">
        {children}
      </div>
      
      {/* Diagonal watermark */}
      <div className="maintenance-watermark">
        <span>Under Maintenance</span>
      </div>
      
      {/* Click blocker */}
      <div className="maintenance-blocker"></div>
    </div>
  )
}

export default MaintenanceOverlay