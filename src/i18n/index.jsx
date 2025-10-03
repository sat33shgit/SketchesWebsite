import React, { createContext, useContext, useEffect, useState } from 'react'

const I18nContext = createContext({ t: (k) => k, lang: 'en', setLang: () => {} })

// Simple loader: dynamic import from src/locales/{lang}/{namespace}.json
async function loadNamespace(lang, namespace) {
  try {
    const mod = await import(`../locales/${lang}/${namespace}.json`)
    return mod.default || mod
  } catch (err) {
    console.warn(`i18n: could not load ${namespace} for ${lang}:`, err && err.message)
    return {}
  }
}

export function I18nProvider({ children, defaultLang = 'en' }) {
  const [lang, setLang] = useState(defaultLang)
  const [namespaces, setNamespaces] = useState({})

  useEffect(() => {
    // Preload common namespaces (contact, about) so pages render with
    // translations immediately instead of showing keys.
    let cancelled = false
    ;(async () => {
      // preload contact, about, ui, gallery and sketch namespaces to avoid flashing keys
      const [contact, about, ui, gallery, sketch] = await Promise.all([
        loadNamespace(lang, 'contact'),
        loadNamespace(lang, 'about'),
        loadNamespace(lang, 'ui'),
        loadNamespace(lang, 'gallery'),
        loadNamespace(lang, 'sketch')
      ])
      if (!cancelled) setNamespaces(ns => ({ ...ns, contact, about, ui, gallery, sketch }))
    })()
    return () => { cancelled = true }
  }, [lang])

  const t = (key, fallback) => {
    if (!key) return fallback || key
    const parts = key.split('.')
    const ns = parts[0]
    const rest = parts.slice(1)
    const data = namespaces[ns] || {}
    let curr = data
    for (const p of rest) {
      if (curr && Object.prototype.hasOwnProperty.call(curr, p)) curr = curr[p]
      else {
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
