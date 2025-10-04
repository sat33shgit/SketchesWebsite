import React, { createContext, useContext, useState } from 'react'
import translations from './translations.js'

const I18nContext = createContext({ t: (k) => k, lang: 'en', setLang: () => {} })

export function I18nProvider({ children, defaultLang = 'en' }) {
  const [lang, setLang] = useState(defaultLang)

  const t = (key, fallback) => {
    if (!key) return fallback || key
    const parts = key.split('.')
    const ns = parts[0]
    const rest = parts.slice(1)
    
    // Get the language translations (fallback to 'en' if language not found)
    const langData = translations[lang] || translations['en'] || {}
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

  return (
    <I18nContext.Provider value={{ t, lang, setLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  return useContext(I18nContext)
}

export default I18nContext
