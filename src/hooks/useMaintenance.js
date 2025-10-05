import { useState, useEffect } from 'react'

const useMaintenance = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await fetch('/api/config')
        if (response.ok) {
          const data = await response.json()
          
          // Check if the response has the expected structure
          if (data.success && data.data) {
            // maintenance key exists and value is 'Y', enable maintenance mode
            const isMaintenanceEnabled = data.data.maintenance === 'Y'
            setIsMaintenanceMode(isMaintenanceEnabled)
          } else {
            // If unexpected structure, default to normal operation (BAU)
            setIsMaintenanceMode(false)
          }
        } else {
          // If config API fails, default to normal operation (BAU)
          setIsMaintenanceMode(false)
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error)
        // On error, default to normal operation (BAU)
        setIsMaintenanceMode(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkMaintenanceMode()
  }, [])

  return { isMaintenanceMode, isLoading }
}

export default useMaintenance