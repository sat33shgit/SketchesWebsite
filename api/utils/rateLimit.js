// Simple rate limiting utility for production APIs
const rateLimitMap = new Map()

export function rateLimit(identifier, maxRequests = 10, windowMs = 60000) {
  const now = Date.now()
  const windowStart = now - windowMs
  
  // Clean old entries
  if (rateLimitMap.size > 1000) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const filtered = timestamps.filter(t => t > windowStart)
      if (filtered.length === 0) {
        rateLimitMap.delete(key)
      } else {
        rateLimitMap.set(key, filtered)
      }
    }
  }
  
  // Get current requests for this identifier
  const requests = rateLimitMap.get(identifier) || []
  const recentRequests = requests.filter(timestamp => timestamp > windowStart)
  
  // Check if limit exceeded
  if (recentRequests.length >= maxRequests) {
    return false
  }
  
  // Add current request
  recentRequests.push(now)
  rateLimitMap.set(identifier, recentRequests)
  
  return true
}

export function getRateLimitIdentifier(req) {
  // Use IP address or user agent as identifier
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         'unknown'
}