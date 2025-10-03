import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const Privacy = () => {
  const topRef = useRef(null)

  useEffect(() => {
    // Ensure the page is scrolled to top and the main header receives focus for accessibility
    try {
      window.scrollTo(0, 0)
    } catch (e) {
      // ignore in non-browser environments
    }
    if (topRef.current && typeof topRef.current.focus === 'function') {
      topRef.current.focus()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header: centered shield icon, title and short description */}
  <div ref={topRef} tabIndex={-1} style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111827' }} aria-hidden>
            <svg viewBox="0 0 24 24" width="60" height="60" fill="none"><path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinejoin="round" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Privacy Policy</div>
          <div style={{ color: '#6b7280', maxWidth: 820, margin: '0 auto', lineHeight: 1.8 }}>
            Your privacy is important to me. This policy explains how I handle information when you visit this pencil sketches gallery and what rights you have regarding your data.
          </div>

          <div style={{ color: '#6b7280', maxWidth: 820, margin: '12px auto 0', lineHeight: 1.6 }}>
            This site is operated by Sateesh Boggarapu. I am the data controller for this website.
          </div>
          <div style={{ color: '#9ca3af', maxWidth: 820, margin: '6px auto 0', fontSize: '0.875rem' }}>
            Last updated: September 27, 2025
          </div>
        </div>

  <div style={{ borderRadius: 12, border: '1.5px solid #e7dadaff', padding: '22px 24px', background: '#ffffff', maxWidth: 850, margin: '0 auto 24px' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ flex: '0 0 56px' }}>
              <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginTop: '-6px' }} aria-hidden>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div style={{ flex: '1 1 auto', lineHeight: 1.8 }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem', color: '#111827' }}>Personal Information Protection</h2>
              <p style={{ color: '#6b7280', marginBottom: 12 }}>
                I am committed to protecting your privacy. You can browse the gallery anonymously. However, if you contact me using the Contact page I collect the information you provide in the message form (typically your name, email address, and the message content). I use that information only to respond to your enquiry and to keep a record of the communication while it’s needed.
              </p>

              <ul style={{ color: '#6b7280', marginLeft: 20, marginBottom: 12, listStyleType: 'disc' }}>
                <li style={{ marginBottom: 8 }}><strong>Purpose:</strong> To reply to messages you send via the Contact form.</li>
                <li style={{ marginBottom: 8 }}><strong>Retention:</strong> Your message and contact details are retained for up to 12 months unless you ask to have them removed earlier.</li>
                <li style={{ marginBottom: 8 }}><strong>Security:</strong> Messages are transmitted over HTTPS and stored in a protected database; access is limited to site administration.</li>
                <li style={{ marginBottom: 8 }}><strong>Your rights:</strong> You can request access, correction, or deletion of your contact data by emailing me using the Contact page.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional sections below (kept compact to match visual emphasis on the card above) */}
  <div className="mt-10 space-y-8">
          <div style={{ borderRadius: 12, border: '1.5px solid #e7dadaff', padding: '22px 24px', background: '#ffffff', maxWidth: 850, margin: '0 auto 20px' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 56px' }}>
                <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginTop: '-6px' }} aria-hidden>
                  <svg viewBox="0 0 24 24" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  </svg>
                </div>
              </div>

              <div style={{ flex: '1 1 auto', lineHeight: 1.8 }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#111827' }}>Analytics & Location Data</h3>
                <p style={{ color: '#6b7280', marginBottom: 12 }}>To understand how visitors interact with my artwork and improve the gallery experience, I collect limited anonymous analytics data:</p>

                <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Location Information</h4>
                <p style={{ color: '#6b7280', marginBottom: 8 }}>I capture general location data (country/region level) solely for analytics purposes to understand my global audience and tailor my content accordingly. This data is:</p>

                <ul style={{ color: '#6b7280', marginLeft: 20, marginBottom: 12, listStyleType: 'disc' }}>
                  <li style={{ marginBottom: 8 }}>Collected automatically when you visit the site</li>
                  <li style={{ marginBottom: 8 }}>Used only in aggregate form for statistical analysis</li>
                  <li style={{ marginBottom: 8 }}>Never linked to your personal identity</li>
                  <li style={{ marginBottom: 8 }}>Not stored beyond what's necessary for analytics</li>
                </ul>

                <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Usage Analytics</h4>
                <p style={{ color: '#6b7280', marginBottom: 0 }}>I track anonymous interactions such as page views and sketch views to understand which artworks resonate most with visitors and optimize the gallery experience.</p>
              </div>
            </div>
          </div>

          <div style={{ borderRadius: 12, border: '1.5px solid #e7dadaff', padding: '22px 24px', background: '#ffffff', maxWidth: 850, margin: '0 auto 24px', lineHeight: 1.8 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 56px' }}>
                <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', marginTop: '-4px' }} aria-hidden>
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.1 2 5 5.1 5 9c0 2.1.9 4 2.3 5.3.7.6 1 1.5.8 2.4-.2.9-.7 1.9-1.6 2.6-.3.2-.1.7.3.7 5.1.1 9.6-1.9 11.9-6.1 1.1-1.9.6-4.3-1.1-5.8C17.6 5 14.9 2 12 2z" fill="currentColor"/>
                    <circle cx="9.5" cy="9" r="0.9" fill="#ffffff"/>
                    <circle cx="12.5" cy="7.5" r="0.9" fill="#ffffff"/>
                    <circle cx="15.2" cy="10" r="0.9" fill="#ffffff"/>
                  </svg>
                </div>
              </div>

              <div style={{ flex: '1 1 auto' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>Artwork & Intellectual Property</h3>

                <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Original Artwork Protection</h4>
                <p style={{ color: '#6b7280', marginBottom: 12 }}>All pencil sketches displayed in this gallery are original works created by Sateesh Boggarapu and are protected by copyright law.</p>

                <ul style={{ color: '#6b7280', marginLeft: 20, marginBottom: 12, listStyleType: 'disc' }}>
                  <li style={{ marginBottom: 8 }}>Viewing and appreciating the artwork is encouraged</li>
                  <li style={{ marginBottom: 8 }}>Screenshots for personal reference are permitted</li>
                  <li style={{ marginBottom: 8 }}>Commercial use, reproduction, or distribution requires written permission</li>
                  <li style={{ marginBottom: 8 }}>Attribution is required for any educational or non-commercial use</li>
                </ul>

                <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Portrait Subject Privacy</h4>
                <p style={{ color: '#6b7280' }}>Portrait subjects have consented to the display of their artwork. If you are featured in a portrait and have concerns about its display, please <Link to="/contact">contact me</Link> using the information provided in the Contact section.</p>
              </div>
            </div>
          </div>

          <div style={{ borderRadius: 12, border: '1.5px solid #e7dadaff', padding: '22px 24px', background: '#ffffff', maxWidth: 850, margin: '0 auto 24px', lineHeight: 1.8 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 56px' }}>
                <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb923c', marginTop: '-6px'  }} aria-hidden>
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor"><path d="M4 7h4l2-2h4l2 2h4v11a1 1 0 01-1 1H5a1 1 0 01-1-1V7zm8 9a3 3 0 100-6 3 3 0 000 6z"/></svg>
                </div>
              </div>

              <div style={{ flex: '1 1 auto' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>Technical Data & Cookies</h3>

                <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Essential Technical Data</h4>
                <p style={{ color: '#6b7280', marginBottom: 12 }}>Like most websites, I automatically collect certain technical information:</p>

                <ul style={{ color: '#6b7280', marginLeft: 20, marginBottom: 12, listStyleType: 'disc' }}>
                  <li style={{ marginBottom: 8 }}>Browser type and version for optimal artwork display</li>
                  <li style={{ marginBottom: 8 }}>Device type (desktop/mobile) for responsive design</li>
                  <li style={{ marginBottom: 8 }}>Basic usage patterns to improve gallery navigation</li>
                </ul>

                <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Cookies & Local Storage</h4>
                <p style={{ color: '#6b7280' }}>I may use minimal cookies or local storage to remember your preferences (such as theme settings) and provide a better browsing experience. No personal information is stored in these cookies.</p>
              </div>
            </div>
          </div>

          <div style={{ borderRadius: 12, border: '1.5px solid #e7dadaff', padding: '22px 24px', background: '#ffffff', maxWidth: 850, margin: '0 auto 24px', lineHeight: 1.8 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 56px' }}>
                  <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginTop: '-4px'  }} aria-hidden>
                    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 2h7l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 9h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      <path d="M8 13h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      <path d="M8 17h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
              </div>

              <div style={{ flex: '1 1 auto' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>Your Rights & Choices</h3>

                <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Data Control</h4>
                <p style={{ color: '#6b7280', marginBottom: 12 }}>Since I don't collect personal information for general browsing, there's minimal data to control. However, you can:</p>

                <ul style={{ color: '#6b7280', marginLeft: 20, marginBottom: 12, listStyleType: 'disc' }}>
                  <li style={{ marginBottom: 8 }}>Browse with cookies disabled (may affect functionality)</li>
                  <li style={{ marginBottom: 8 }}>Use private/incognito browsing mode</li>
                  <li style={{ marginBottom: 8 }}>Clear your browser's local storage at any time</li>
                  <li style={{ marginBottom: 8 }}>Contact me with any privacy concerns</li>
                </ul>

                <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Artwork Usage Requests</h4>
                <p style={{ color: '#6b7280' }}>If you're interested in using any artwork for educational, journalistic, or other purposes, please <Link to="/contact">contact me</Link> to discuss proper attribution and usage rights.</p>
              </div>
            </div>
          </div>

          <div style={{ borderRadius: 12, border: '1.5px solid #e7dadaff', padding: '22px 24px', background: '#ffffff', maxWidth: 850, margin: '0 auto', lineHeight: 1.8 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 56px' }}>
                <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', marginTop: '-6px' }} aria-hidden>
                    <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v.01L12 13 2 6.01V6zM2 8v10a2 2 0 002 2h16a2 2 0 002-2V8l-10 6L2 8z"/></svg>
                  </div>
              </div>

              <div style={{ flex: '1 1 auto' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>Contact & Policy Updates</h3>

                <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Privacy Questions</h4>
                <p style={{ color: '#6b7280', marginBottom: 12 }}>If you have questions about this privacy policy or concerns about how I handle data, please reach out:</p>

                <ul style={{ color: '#6b7280', marginLeft: 20, marginBottom: 12, listStyleType: 'disc' }}>
                  <li style={{ marginBottom: 8 }}>Use the <Link to="/contact">Contact</Link> page to send a message or email me</li>
                  <li style={{ marginBottom: 8 }}>I respond to privacy inquiries within 48 hours</li>
                </ul>

                <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Policy Changes</h4>
                <p style={{ color: '#6b7280' }}>I may update this privacy policy occasionally to reflect changes in my practices or for legal compliance. When I do, I'll update the "Last updated" date at the top of this page. Continued use of the site constitutes acceptance of any changes.</p>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '32px auto', maxWidth: 850, width: '100%' }} />

          <div style={{ background: '#f3f4f6', borderRadius: 8, padding: '22px 24px', maxWidth: 850, margin: '0 auto 32px', textAlign: 'center', color: '#374151' }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#111827' }}>Privacy Summary</div>
            <div style={{ color: '#6b7280', maxWidth: 720, margin: '0 auto', lineHeight: 1.8 }}>
              This pencil portrait gallery is designed with privacy in mind. I don't collect personal information for general browsing; I use minimal analytics for improvement, and I protect both visitor privacy and artwork integrity.
            </div>
            <div style={{ marginTop: 12, color: '#6b7280' }}>Questions? Visit the <Link to="/contact">Contact</Link> page or email me directly.</div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Privacy
