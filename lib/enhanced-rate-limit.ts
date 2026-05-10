import { NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
  firstRequest: number
}

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

const rateLimitStore = new Map<string, RateLimitEntry>()
const MAX_STORE_SIZE = 10000

// Enhanced rate limiting with progressive delays and better tracking
export function createEnhancedRateLimit(config: RateLimitConfig) {
  return function (identifier: string, request?: Request): { 
    allowed: boolean
    remaining: number
    resetIn: number
    retryAfter?: number
    response?: NextResponse
  } {
    const now = Date.now()
    const key = identifier
    
    // Clean up expired entries periodically
    cleanupExpiredEntries(now)
    
    let entry = rateLimitStore.get(key)
    
    if (!entry || now > entry.resetTime) {
      // Create new entry
      entry = {
        count: 1,
        resetTime: now + config.windowMs,
        firstRequest: now
      }
      rateLimitStore.set(key, entry)
      
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetIn: config.windowMs
      }
    }
    
    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      const resetIn = entry.resetTime - now
      
      // Progressive delay for repeated violations
      const delayMultiplier = Math.floor(entry.count / config.maxRequests)
      const retryAfter = Math.ceil(resetIn / 1000) * delayMultiplier
      
      const response = NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter,
          resetIn,
          limit: config.maxRequests,
          windowMs: config.windowMs
        },
        { 
          status: 429 
        }
      )
      
      // Add security headers
      response.headers.set('Retry-After', retryAfter.toString())
      response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', '0')
      response.headers.set('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000).toString())
      response.headers.set('X-RateLimit-Retry-After', retryAfter.toString())
      
      return {
        allowed: false,
        remaining: 0,
        resetIn,
        retryAfter,
        response
      }
    }
    
    // Increment counter
    entry.count++
    
    // Calculate progressive delay for approaching limits
    const usageRatio = entry.count / config.maxRequests
    let delayMs = 0
    
    if (usageRatio > 0.8) {
      // Add delay when approaching limit
      delayMs = Math.ceil((usageRatio - 0.8) * 1000) // Up to 200ms delay
    }
    
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetIn: entry.resetTime - now
    }
  }
}

// Predefined rate limiters for different use cases
export const rateLimiters = {
  // Very strict for admin operations
  admin: createEnhancedRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10
  }),
  
  // Strict for authentication
  auth: createEnhancedRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  }),
  
  // Moderate for payments
  payment: createEnhancedRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5
  }),
  
  // Standard for general API
  standard: createEnhancedRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100
  }),
  
  // Very strict for webhooks
  webhook: createEnhancedRateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100
  }),
  
  // Strict for feedback
  feedback: createEnhancedRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3
  })
}

function cleanupExpiredEntries(now: number): void {
  const keysToDelete: string[] = []
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      keysToDelete.push(key)
    }
  }
  
  for (const key of keysToDelete) {
    rateLimitStore.delete(key)
  }
  
  // Prevent memory bloat
  if (rateLimitStore.size > MAX_STORE_SIZE) {
    const excess = rateLimitStore.size - MAX_STORE_SIZE
    const keysToEvict = Array.from(rateLimitStore.keys()).slice(0, excess)
    for (const key of keysToEvict) {
      rateLimitStore.delete(key)
    }
  }
}

// Enhanced IP detection with proxy support
export function getEnhancedClientIP(request: Request): string {
  const headers = request.headers
  
  // Check various headers for real IP
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIP = headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }
  
  const cfConnectingIP = headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }
  
  const xClientIP = headers.get('x-client-ip')
  if (xClientIP) {
    return xClientIP.trim()
  }
  
  // Fallback to remote address (not available in serverless environments)
  return 'unknown'
}

// Rate limiting middleware for Next.js API routes
export function withRateLimit(
  limiter: ReturnType<typeof createEnhancedRateLimit>,
  getIdentifier: (request: Request) => string = (req) => getEnhancedClientIP(req)
) {
  return async (request: Request) => {
    const identifier = getIdentifier(request)
    const result = limiter(identifier, request)
    
    if (!result.allowed && result.response) {
      return result.response
    }
    
    return null // Continue to next handler
  }
}

// Security monitoring for rate limit violations
export function logRateLimitViolation(
  identifier: string, 
  endpoint: string, 
  details: any = {}
): void {
  console.warn('[RATE_LIMIT] Violation detected', {
    identifier: identifier.substring(0, 20) + '...', // Log partial IP for privacy
    endpoint,
    timestamp: new Date().toISOString(),
    ...details
  })
}
