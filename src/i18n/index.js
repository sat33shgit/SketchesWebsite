import React, { createContext, useContext, useEffect, useState } from 'react'

// Minimal i18n provider implemented without JSX so bundlers that resolve
// to .js entry points won't choke on JSX in .js files.
const I18nContext = createContext({ t: (k) => k, lang: 'en', setLang: () => {} })

async function loadNamespace(lang, namespace) {
	try {
		const mod = await import(`../locales/${lang}/${namespace}.json`)
		return mod.default || mod
	} catch (err) {
		// keep a quiet fallback; consumer can handle missing keys
		// (avoid referencing err directly to reduce lint noise in some environments)
		return {}
	}
}

export function I18nProvider({ children, defaultLang = 'en' }) {
	const [lang, setLang] = useState(defaultLang)
	const [namespaces, setNamespaces] = useState({})

	useEffect(() => {
			let cancelled = false
			;(async () => {
				// preload contact, about and ui namespaces to avoid flashing keys in UI
				const [contact, about, ui] = await Promise.all([
					loadNamespace(lang, 'contact'),
					loadNamespace(lang, 'about'),
					loadNamespace(lang, 'ui')
				])
				if (!cancelled) setNamespaces(ns => ({ ...ns, contact, about, ui }))
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
			else { curr = undefined; break }
		}
		return (curr !== undefined && curr !== null) ? curr : (fallback || key)
	}

	return React.createElement(I18nContext.Provider, { value: { t, lang, setLang } }, children)
}

export function useTranslation() { return useContext(I18nContext) }

export default I18nContext
