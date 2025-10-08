// Submit contact form with database storage and email notification
export async function sendContactEmail(formData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    const result = await response.json();
    if (response.ok && result && result.success) {
      return {
        success: true,
        message: 'Thank you for your message! I will get back to you soon.',
        messageId: result.id,
        timestamp: result.timestamp
      };
    }
    return {
      success: false,
      message: result?.message || result?.error || 'Failed to send message',
      status: response.status
    };
  } catch (error) {
    console.error('Error sending contact message:', error);
    return {
      success: false,
      message: 'Failed to send message due to a network or server error. Please try again later.',
      details: error?.message
    };
  }
}

// Minimal notification email used for comment notifications.
export async function sendNotificationEmail({ sketchName, commenterName, message } = {}) {
  const timestamp = new Date().toLocaleString();
  const bodyMessage = `${message || ''}\n\nSent at: ${timestamp}`;
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: commenterName || 'Anonymous',
        email: 'bsateeshk@gmail.com',
        subject: `A new comment from ${commenterName || 'Anonymous'}`,
        message: bodyMessage,
        from_name: 'Sateesh Sketches Form'
      })
    });
    const result = await response.json();
    if (response.ok && result && result.success) {
      return { success: true };
    }
    return { success: false, message: result?.message || 'Failed to send notification' };
  } catch (err) {
    return { success: false, message: 'Notification email failed.' };
  }
}
