const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const WINDOW_MS = 60 * 1000
const MAX_REQUESTS = 30
const MAX_STORE_SIZE = 10000

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetIn: WINDOW_MS }
  }

  if (record.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now }
  }

  record.count++
  return { allowed: true, remaining: MAX_REQUESTS - record.count, resetIn: record.resetTime - now }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  return 'unknown'
}

setInterval(() => {
  const now = Date.now()
  const keysToDelete: string[] = []

  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      keysToDelete.push(key)
    }
  }

  for (const key of keysToDelete) {
    rateLimitStore.delete(key)
  }

  if (rateLimitStore.size > MAX_STORE_SIZE) {
    const excess = rateLimitStore.size - MAX_STORE_SIZE
    const keysToEvict = Array.from(rateLimitStore.keys()).slice(0, excess)
    for (const key of keysToEvict) {
      rateLimitStore.delete(key)
    }
  }
}, WINDOW_MS)