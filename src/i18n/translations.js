// Pre-loaded translations - no async loading needed
import uiEn from '../locales/en/ui.js'
import galleryEn from '../locales/en/gallery.js'
import aboutEn from '../locales/en/about.js'
import contactEn from '../locales/en/contact.js'
import sketchEn from '../locales/en/sketch.js'

// All translations loaded at build time
const translations = {
  en: {
    ui: uiEn,
    gallery: galleryEn,
    about: aboutEn,
    contact: contactEn,
    sketch: sketchEn
  }
}

export default translations