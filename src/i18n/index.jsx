// Inline translations to guarantee immediate availability
const inlineTranslations = {
  en: {
    ui: {
      nav: {
        logoText: "Sateesh Sketches",
        gallery: "Gallery",
        about: "About",
        contact: "Contact",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        mobileMenuLabel: "Main menu"
      },
      footer: {
        privacy: "Privacy Policy",
        contact: "Contact",
        copyright: "© 2025 Sateesh Sketches. All artwork is original and protected by copyright."
      }
    },
    gallery: {
      title: "Pencil Sketches",
      description: "Welcome to my collection of pencil sketches. Each piece tells a story and captures moments of inspiration.",
      viewDetails: "View Details",
      stats: {
        viewsAria: "views",
        likesAria: "likes",
        commentsAria: "comments"
      }
    },
    about: {
      title: "About Me",
      profile: {
        name: "Sateesh Kumar Boggarapu",
        role: "Pencil Sketch Artist"
      },
      bio: {
        p1: "I'm an IT professional and pencil sketch artist living in Victoria, Canada, who grew up in India. I have a deep passion for capturing the essence of my subjects through detailed and life like portraits and still life drawings. My work reflects a profound understanding of light, shadow, and texture, bringing my art to life on paper using pencil(s).",
        p2: "I've been passionate about art since I was a child. For over twenty years, I've focused on creating detailed portraits and sketches.",
        p3: "My goal is to capture more than just what a person looks like; I want to show their true personality and feeling. I use light, shadow, and texture to bring my drawings to life on the page.",
        p4: "Every piece I create is like a conversation with the person looking at it. This dedication to emotion and detail has helped my work gain appreciation from art lovers and collectors."
      },
      artistStatement: {
        heading: "Artist Statement",
        body: "My art is a reflection of the world around me, a way to capture the beauty and emotion I see in everyday life. Through pencil sketches, I aim to create a connection between the viewer and the subject, inviting them to see the world through my eyes. Each stroke is a step in a journey of discovery, a process of bringing a vision to life on paper. I am driven by a desire to constantly improve and explore new techniques, pushing the boundaries of what can be achieved with a simple pencil."
      }
    },
    contact: {
      title: "Contact Me",
      intro: "Have a question or want to share feedback about my work? I'd love to hear from you.",
      form: {
        heading: "Send a Message",
        nameLabel: "Name *",
        emailLabel: "Email *",
        subjectLabel: "Subject *",
        messageLabel: "Message *",
        submit: "Send Message",
        submitting: "Sending Message...",
        messageDisabled: "Message posting is currently disabled",
        validation: {
          required: "All fields are required.",
          invalidEmail: "Please enter a valid email address.",
          disallowedHtml: "Input contains disallowed HTML or script patterns.",
          tooLong: "One or more fields exceed the allowed length.",
          invalidOrUnsafe: "Invalid or unsafe input detected."
        },
        fallbackError: "Failed to send message. Please try again or contact me directly at bsateeshk@gmail.com"
      },
      status: {
        success: "Your message was sent successfully.",
        error: "There was an error sending your message."
      },
      contactInfo: {
        heading: "Get in Touch",
        emailLabel: "Email",
        locationLabel: "Location",
        locationValue: "Victoria, Canada"
      },
      social: {
        heading: "Follow My Work",
        facebook: "Facebook",
        instagram: "Instagram"
      },
      aria: {
        facebook: "Facebook",
        instagram: "Instagram",
        sendButton: "Send Message"
      }
    },
    sketch: {
      notFound: {
        title: "Sketch not found",
        returnLink: "Return to Sketch Book"
      },
      backToGallery: "Back to Gallery",
      share: "Share",
      copyLink: "Copy link",
      facebook: "Facebook",
      twitter: "Twitter",
      whatsapp: "WhatsApp",
      instagramNote: "Instagram doesn't support direct link sharing. The URL has been copied to your clipboard.",
      viewFullscreen: "View Fullscreen",
      completed: "Completed",
      aboutThisPiece: "About This Sketch",
      comments: "Comments",
      commentsLabel: "Comments",
      commentsDisabled: "Comment posting is currently disabled",
      medium: "Medium",
      time: "Time",
      paper: "Paper",
      noImage: "No Image Available",
      exitFullscreen: "Exit Fullscreen",
      zoomInstructions: "Click and drag to pan around"
    }
  }
}

// Create the translation function with direct object access
const t = (key, fallback) => {
  if (!key) return fallback || key
  const parts = key.split('.')
  const ns = parts[0]
  const rest = parts.slice(1)
  
  // Direct access to inline translations
  const langData = inlineTranslations['en'] || {}
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
