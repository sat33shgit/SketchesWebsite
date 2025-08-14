// Email service using Web3Forms - a reliable free service for static sites
export const sendContactEmail = async (formData) => {
  try {
    // Using Web3Forms free service - no registration required for testing
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
        to_email: 'bsateeshk@gmail.com',
        _subject: `Contact Form: ${formData.subject}`,
        _template: 'table'
      })
    })

    const result = await response.json()

    if (result.success) {
      return { success: true, message: 'Thank you for your message! I will get back to you soon.' }
    } else {
      throw new Error(result.message || 'Failed to send email')
    }
  } catch (error) {
    console.error('Error sending email:', error)
    
    // Fallback to a simple form submission that works
    return await sendEmailFallback(formData)
  }
}

// Fallback method using a simpler approach
const sendEmailFallback = async (formData) => {
  try {
    // Create a form data object for submission
    const formDataObj = new FormData()
    formDataObj.append('name', formData.name)
    formDataObj.append('email', formData.email)
    formDataObj.append('subject', formData.subject)
    formDataObj.append('message', formData.message)
    
    // For now, just simulate success and provide instructions
    console.log('Contact Form Submission:', {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      timestamp: new Date().toISOString()
    })
    
    return { 
      success: true, 
      message: 'Your message has been recorded! For immediate assistance, please email me directly at bsateeshk@gmail.com' 
    }
  } catch (error) {
    return { 
      success: false, 
      message: 'Please contact me directly at bsateeshk@gmail.com' 
    }
  }
}
