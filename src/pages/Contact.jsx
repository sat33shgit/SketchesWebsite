import { useState, useEffect } from 'react'
import { sendContactEmail } from '../utils/emailService'
import DOMPurify from 'dompurify'
import useAnalytics from '../hooks/useAnalytics'
import { useTranslation } from '../i18n'
import useMaintenance from '../hooks/useMaintenance'
import MaintenanceOverlay from '../components/MaintenanceOverlay'

function sanitizeInput(input) {
  // Remove all HTML tags and attributes
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}

function validateFields({ name, email, subject, message }, t) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !subject || !message) {
    return { ok: false, message: t ? t('contact.form.validation.required') : 'All fields are required.' };
  }

  if (!emailRegex.test(email)) {
    return { ok: false, message: t ? t('contact.form.validation.invalidEmail') : 'Please enter a valid email address.' };
  }

  // Disallow angle brackets and suspicious patterns
  const pattern = /<|>|script|onerror|onload|onclick|javascript:/i;
  if (pattern.test(name) || pattern.test(subject) || pattern.test(message)) {
    return { ok: false, message: t ? t('contact.form.validation.disallowedHtml') : 'Input contains disallowed HTML or script patterns.' };
  }

  // Allow Unicode characters (emoji, smart quotes, em-dash, etc.) in messages.
  // Server will also accept Unicode. We still enforce length limits below.

  // Limit field lengths (match front-end limits)
  if (name.length > 100 || subject.length > 100 || message.length > 1000) {
    return { ok: false, message: t ? t('contact.form.validation.tooLong') : 'One or more fields exceed the allowed length.' };
  }

  return { ok: true };
}

const Contact = () => {
  // Track page visit
  useAnalytics('contact')
  const { t } = useTranslation()
  const { isMaintenanceMode, isLoading } = useMaintenance()
  // validateFields now accepts `t` directly; no global bridge required.
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ message: '', isError: false })
  const [messageDisabled, setMessageDisabled] = useState(false)

  // Fetch configuration to check if messages are disabled
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config?key=message_disable');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.message_disable === 'Y') {
            setMessageDisabled(true);
          }
        }
      } catch (err) {
        // If config fetch fails, default to messages enabled
        console.error('Failed to fetch config:', err);
      }
    };
    
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Block form submission during maintenance mode
    if (isMaintenanceMode) {
      setSubmitStatus({ 
        message: t('contact.form.maintenanceMode', 'Contact form is unavailable during maintenance. Please try again later.'), 
        isError: true 
      })
      return
    }

    // Sanitize input
    const sanitized = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      subject: sanitizeInput(formData.subject),
      message: sanitizeInput(formData.message),
    }

    // Validate input and show user-friendly messages
    const validation = validateFields(sanitized, t)
    if (!validation.ok) {
      setSubmitStatus({ message: validation.message || (t ? t('contact.form.validation.invalidOrUnsafe') : 'Invalid or unsafe input detected.'), isError: true })
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus({ message: '', isError: false })
    
    try {
      const result = await sendContactEmail(sanitized)
      
      if (result.success) {
        setSubmitStatus({ 
          message: result.message, 
          isError: false 
        })
        
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        setSubmitStatus({ 
          message: result.message, 
          isError: true 
        })
      }
    } catch (err) {
      console.error('sendContactEmail error', err)
      setSubmitStatus({ 
        message: t ? t('contact.form.fallbackError') : 'Failed to send message. Please try again or contact me directly at bsateeshk@gmail.com', 
        isError: true 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-header">
            <h1>Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  const contactContent = (
    <div className="contact-page">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h1>{t('contact.title', 'Contact Me')}</h1>
          <p>{t('contact.intro', 'Have a question about my artwork or interested in commissioning a portrait? I\'d love to hear from you!')}</p>
        </div>

        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form">
            <h2>{t('contact.form.heading', 'Send a Message')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label htmlFor="name">
                  {t('contact.form.nameLabel', 'Your Name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={messageDisabled || isMaintenanceMode}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  {t('contact.form.emailLabel', 'Your Email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  maxLength={100}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={messageDisabled || isMaintenanceMode}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  {t('contact.form.subjectLabel', 'Subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  maxLength={100}
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={messageDisabled || isMaintenanceMode}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  {t('contact.form.messageLabel', 'Your Message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  maxLength={1000}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={messageDisabled || isMaintenanceMode}
                />
              </div>

                <button
                type="submit"
                disabled={isSubmitting || messageDisabled || isMaintenanceMode}
                className="submit-button"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('contact.form.submitting', 'Sending...')}
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {t('contact.form.submit', 'Send Message')}
                  </>
                )}
              </button>

              {/* Maintenance Mode Notice */}
              {isMaintenanceMode && (
                <div className="message-disabled-notice">
                  {t('contact.form.maintenanceNotice', 'Contact form is temporarily unavailable during maintenance. Please email me directly at bsateeshk@gmail.com')}
                </div>
              )}

              {/* Message Disabled Notice */}
              {messageDisabled && !isMaintenanceMode && (
                <div className="message-disabled-notice">
                  {t('contact.form.messageDisabled', 'Contact form is temporarily disabled. Please email me directly at bsateeshk@gmail.com')}
                </div>
              )}
              
              {/* Status Message */}
              {submitStatus.message && (
                <div className={`status-message ${submitStatus.isError ? 'error' : 'success'}`}>
                  <div className="flex">
                    <div>
                      {submitStatus.isError ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p>{submitStatus.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info">
            {/* Contact Details */}
            <div className="contact-info-card">
              <h2>{t('contact.contactInfo.heading', 'Get in Touch')}</h2>
              <div className="space-y-4">
                <div className="contact-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="contact-item-content">
                    <p>{t('contact.contactInfo.emailLabel', 'Email')}</p>
                    <a href="mailto:bsateeshk@gmail.com">
                      bsateeshk@gmail.com
                    </a>
                  </div>
                </div>

                <div className="contact-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="contact-item-content">
                    <p>{t('contact.contactInfo.locationLabel', 'Location')}</p>
                    <p>{t('contact.contactInfo.locationValue', 'Victoria, Canada')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="contact-info-card social-media">
              <h2>{t('contact.social.heading', 'Follow Me')}</h2>
              <div className="social-links-contact">
                <a
                  href="https://www.facebook.com/media/set/?set=a.367537920160&type=3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="facebook"
                  aria-label={t('contact.aria.facebook')}
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/boggarapusateeshkumar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="instagram"
                  aria-label={t('contact.aria.instagram')}
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return isMaintenanceMode ? (
    <MaintenanceOverlay>
      {contactContent}
    </MaintenanceOverlay>
  ) : contactContent;
}

export default Contact