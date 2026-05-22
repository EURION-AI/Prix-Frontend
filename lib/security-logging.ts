import { NextRequest } from 'next/server'

interface SecurityEvent {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'critical'
  category: 'auth' | 'payment' | 'admin' | 'api' | 'csrf' | 'rate_limit' | 'validation' | 'sql_injection' | 'xss'
  event: string
  details: Record<string, any>
  ip?: string
  userAgent?: string
  userId?: string | number
  endpoint?: string
  method?: string
}

class SecurityLogger {
  private static instance: SecurityLogger
  private logBuffer: SecurityEvent[] = []
  private readonly MAX_BUFFER_SIZE = 100
  private readonly FLUSH_INTERVAL = 5000 // 5 seconds

  private constructor() {
    // Start periodic flush
    setInterval(() => {
      this.flushLogs()
    }, this.FLUSH_INTERVAL)
  }

  static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger()
    }
    return SecurityLogger.instance
  }

  log(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      timestamp: new Date().toISOString(),
      ...event
    }

    // Add to buffer
    this.logBuffer.push(securityEvent)

    // Immediately log critical events
    if (event.level === 'critical' || event.level === 'error') {
      this.writeLog(securityEvent)
    }

    // Flush if buffer is full
    if (this.logBuffer.length >= this.MAX_BUFFER_SIZE) {
      this.flushLogs()
    }
  }

  private flushLogs(): void {
    if (this.logBuffer.length === 0) return

    const eventsToFlush = [...this.logBuffer]
    this.logBuffer = []

    eventsToFlush.forEach(event => {
      this.writeLog(event)
    })
  }

  private writeLog(event: SecurityEvent): void {
    const logMessage = this.formatLogMessage(event)
    
    switch (event.level) {
      case 'critical':
        console.error(`[CRITICAL] ${logMessage}`)
        break
      case 'error':
        console.error(`[ERROR] ${logMessage}`)
        break
      case 'warn':
        console.warn(`[WARN] ${logMessage}`)
        break
      default:
        console.log(`[INFO] ${logMessage}`)
    }
  }

  private formatLogMessage(event: SecurityEvent): string {
    const parts = [
      event.category.toUpperCase(),
      event.event,
      event.ip ? `IP:${event.ip.substring(0, 8)}...` : '',
      event.userId ? `User:${event.userId}` : '',
      event.endpoint ? `Route:${event.method} ${event.endpoint}` : ''
    ].filter(Boolean)

    const baseMessage = parts.join(' | ')
    
    if (Object.keys(event.details).length > 0) {
      return `${baseMessage} | Details: ${JSON.stringify(event.details)}`
    }
    
    return baseMessage
  }

  // Specific logging methods for different security events
  logAuth(event: string, details: Record<string, any>, request?: NextRequest): void {
    this.log({
      level: 'warn',
      category: 'auth',
      event,
      details,
      ip: request ? this.getClientIP(request) : undefined,
      userAgent: request?.headers.get('user-agent') || undefined,
      endpoint: request?.url
    })
  }

  logPayment(event: string, details: Record<string, any>, request?: NextRequest): void {
    this.log({
      level: 'info',
      category: 'payment',
      event,
      details,
      ip: request ? this.getClientIP(request) : undefined,
      endpoint: request?.url
    })
  }

  logAdmin(event: string, details: Record<string, any>, request?: NextRequest): void {
    this.log({
      level: 'critical',
      category: 'admin',
      event,
      details,
      ip: request ? this.getClientIP(request) : undefined,
      userAgent: request?.headers.get('user-agent') || undefined,
      endpoint: request?.url
    })
  }

  logCSRF(event: string, details: Record<string, any>, request?: NextRequest): void {
    this.log({
      level: 'error',
      category: 'csrf',
      event,
      details,
      ip: request ? this.getClientIP(request) : undefined,
      userAgent: request?.headers.get('user-agent') || undefined,
      endpoint: request?.url
    })
  }

  logRateLimit(event: string, details: Record<string, any>, request?: NextRequest): void {
    this.log({
      level: 'warn',
      category: 'rate_limit',
      event,
      details,
      ip: request ? this.getClientIP(request) : undefined,
      endpoint: request?.url
    })
  }

  logValidation(event: string, details: Record<string, any>, request?: NextRequest): void {
    this.log({
      level: 'warn',
      category: 'validation',
      event,
      details,
      ip: request ? this.getClientIP(request) : undefined,
      endpoint: request?.url
    })
  }

  logSQLInjection(event: string, details: Record<string, any>, request?: NextRequest): void {
    this.log({
      level: 'critical',
      category: 'sql_injection',
      event,
      details,
      ip: request ? this.getClientIP(request) : undefined,
      userAgent: request?.headers.get('user-agent') || undefined,
      endpoint: request?.url
    })
  }

  logXSS(event: string, details: Record<string, any>, request?: NextRequest): void {
    this.log({
      level: 'critical',
      category: 'xss',
      event,
      details,
      ip: request ? this.getClientIP(request) : undefined,
      userAgent: request?.headers.get('user-agent') || undefined,
      endpoint: request?.url
    })
  }

  logAPI(event: string, details: Record<string, any>, request?: NextRequest): void {
    this.log({
      level: 'info',
      category: 'api',
      event,
      details,
      ip: request ? this.getClientIP(request) : undefined,
      endpoint: request?.url,
      method: request?.method
    })
  }

  private getClientIP(request: NextRequest): string {
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
}

// Export singleton instance
export const securityLogger = SecurityLogger.getInstance()

// Middleware for automatic security logging
export function withSecurityLogging(
  category: SecurityEvent['category'],
  getEventDetails?: (request: NextRequest, response?: Response) => Record<string, any>
) {
  return (request: NextRequest, response?: Response) => {
    const details = getEventDetails ? getEventDetails(request, response) : {}
    
    securityLogger.log({
      level: 'info',
      category,
      event: `${request.method} ${new URL(request.url).pathname}`,
      details,
      ip: securityLogger['getClientIP']?.(request) || 'unknown',
      userAgent: request.headers.get('user-agent') || undefined,
      endpoint: request.url,
      method: request.method
    })
  }
}

// Security metrics and monitoring
export class SecurityMetrics {
  private static metrics: Record<string, number> = {}
  
  static increment(metric: string): void {
    this.metrics[metric] = (this.metrics[metric] || 0) + 1
  }
  
  static getMetrics(): Record<string, number> {
    return { ...this.metrics }
  }
  
  static reset(): void {
    this.metrics = {}
  }
  
  // Periodic metrics reporting
  static startReporting(): void {
    setInterval(() => {
      const metrics = this.getMetrics()
      if (Object.keys(metrics).length > 0) {
        securityLogger.logAPI('Security metrics report', metrics)
        this.reset()
      }
    }, 60000) // Report every minute
  }
}

// Initialize metrics reporting
SecurityMetrics.startReporting()

// Export convenience functions
export const logAuth = (event: string, details: Record<string, any>, request?: NextRequest) => 
  securityLogger.logAuth(event, details, request)

export const logPayment = (event: string, details: Record<string, any>, request?: NextRequest) => 
  securityLogger.logPayment(event, details, request)

export const logAdmin = (event: string, details: Record<string, any>, request?: NextRequest) => 
  securityLogger.logAdmin(event, details, request)

export const logCSRF = (event: string, details: Record<string, any>, request?: NextRequest) => 
  securityLogger.logCSRF(event, details, request)

export const logRateLimit = (event: string, details: Record<string, any>, request?: NextRequest) => 
  securityLogger.logRateLimit(event, details, request)

export const logValidation = (event: string, details: Record<string, any>, request?: NextRequest) => 
  securityLogger.logValidation(event, details, request)

export const logSQLInjection = (event: string, details: Record<string, any>, request?: NextRequest) => 
  securityLogger.logSQLInjection(event, details, request)

export const logXSS = (event: string, details: Record<string, any>, request?: NextRequest) => 
  securityLogger.logXSS(event, details, request)

export const logAPI = (event: string, details: Record<string, any>, request?: NextRequest) => 
  securityLogger.logAPI(event, details, request)
