import React, { createContext, useContext } from 'react'
import translations from './translations.js'

// Pre-create the translation function to ensure it's immediately available
const t = (key, fallback) => {
  if (!key) return fallback || key
  const parts = key.split('.')
  const ns = parts[0]
  const rest = parts.slice(1)
  
  // Always use 'en' translations since they're pre-loaded
  const langData = translations['en'] || {}
  const data = langData[ns] || {}
  
  let curr = data
  for (const p of rest) {
    if (curr && Object.prototype.hasOwnProperty.call(curr, p)) {
      curr = curr[p]
    } else {
      curr = undefined
      break
    }
  }
  
  return (curr !== undefined && curr !== null) ? curr : (fallback || key)
}

// Create context with the stable translation function
const I18nContext = createContext({ 
  t, 
  lang: 'en', 
  setLang: () => {} 
})

export function I18nProvider({ children, defaultLang = 'en' }) {
  // Use the pre-created stable translation function
  const contextValue = {
    t,
    lang: defaultLang,
    setLang: () => {}
  }

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  return useContext(I18nContext)
}

export default I18nContext
