// Submit contact form with database storage and email notification
export const sendContactEmail = async (formData) => {
  try {
    // Use our new API endpoint that saves to database and sends email
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })

    const result = await response.json()

    // If the API stored the message and returned success, return that.
    if (response.ok && result && result.success) {
      return { 
        success: true, 
        message: 'Thank you for your message! I will get back to you soon.',
        messageId: result.id,
        timestamp: result.timestamp
      }
    }

    // For expected validation failures (e.g. 400) or other non-fatal issues,
    // return a structured failure result and let the UI handle how to present
    // the error to the user. Do not call the Web3Forms fallback automatically.
    return {
      success: false,
      message: result?.message || result?.error || 'Failed to send message',
      status: response.status
    }
  } catch (error) {
    // Network or unexpected error. Return structured failure so UI can show
    // a helpful message. Keep the console.error so developers can see stack
    // traces when debugging, but do not throw an exception that appears to
    // end users as an unhandled console error.
    console.error('Error sending contact message:', error)
    return {
      success: false,
      message: 'Failed to send message due to a network or server error. Please try again later.',
      details: error?.message
    }
  }
}

// Original Web3Forms implementation as fallback
const sendContactEmailWeb3Forms = async (formData) => {
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '92235cbf-7e66-4121-a028-ba50d463f041', // Public test key
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        from_name: `${formData.name} <${formData.email}>`,
        Subject: `Contact Form: ${formData.subject}`,
      })
    })

    const result = await response.json()

    if (result.success) {
      return { success: true, message: 'Thank you for your message! I will get back to you soon.' }
    } else {
      throw new Error(result.message || 'Failed to send email')
    }
  } catch (error) {
    console.error('Error with Web3Forms:', error)
    throw error
  }
}

// Fallback method using Web3Forms
const sendEmailFallback = async (formData) => {
  try {
    return await sendContactEmailWeb3Forms(formData)
  } catch (error) {
    console.error('All email methods failed:', error)
    
    return { 
      success: true, 
      message: 'Your message has been recorded locally. For immediate assistance, please email me directly at bsateeshk@gmail.com' 
    }
  }
}

// Minimal notification email used for comment notifications.
export const sendNotificationEmail = async ({ sketchName, commenterName, message } = {}) => {
  // Keep message body unchanged; only set the subject to identify sketch
  const timestamp = new Date().toLocaleString()
  const bodyMessage = `${message || ''}\n\nSent at: ${timestamp}`
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '92235cbf-7e66-4121-a028-ba50d463f041',
  name: commenterName || 'Anonymous',
  message: bodyMessage,
  from_name: commenterName ? `${commenterName}` : 'Anonymous'
  // Intentionally omitting `email`, `_subject`, `_template`, and `to_email` for minimal notification
      })
    })

    const result = await response.json()
    if (result.success) {
      return { success: true }
    }
    throw new Error(result.message || 'Failed to send notification')
  } catch (err) {
    console.error('Notification email failed:', err)
    // fallback: log the notification with timestamp and return success to avoid blocking UX
    try {
  console.log('Notification fallback:', { sketchName, commenterName, commentText: bodyMessage, timestamp })
      return { success: true }
    } catch (e) {
      return { success: false }
    }
  }
}
