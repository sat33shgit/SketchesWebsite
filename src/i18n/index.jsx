// Direct translation access without React Context to prevent FOUC
import translations from './translations.js'

// Create the translation function as a module-level constant
// This ensures it's available immediately when imported
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

// Export the translation function directly
export function useTranslation() {
  return { 
    t, 
    lang: 'en', 
    setLang: () => {} 
  }
}

// Keep the provider for compatibility but it does nothing now
export function I18nProvider({ children }) {
  return children
}

export default { useTranslation, I18nProvider }
