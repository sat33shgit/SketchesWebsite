// Pre-loaded translations - no async loading needed
import uiEn from '../locales/en/ui.json'
import galleryEn from '../locales/en/gallery.json'
import aboutEn from '../locales/en/about.json'
import contactEn from '../locales/en/contact.json'
import sketchEn from '../locales/en/sketch.json'

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