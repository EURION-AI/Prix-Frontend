import { NextResponse } from 'next/server'

// Comprehensive input validation and sanitization system

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  sanitize?: boolean
  whitelist?: string[]
  blacklist?: string[]
  type?: 'string' | 'number' | 'email' | 'url' | 'boolean' | 'object'
}

export interface ValidationResult {
  isValid: boolean
  value: any
  errors: string[]
}

// XSS protection patterns
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /expression\s*\(/gi,
  /@import/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
]

// SQL injection patterns
const SQL_INJECTION_PATTERNS = [
  /('|(\\')|(;)|(\-\-)|(\s+(or|and)\s+.*(=|like))/gi,
  /(union\s+select)/gi,
  /(insert\s+into)/gi,
  /(delete\s+from)/gi,
  /(update\s+.+\s+set)/gi,
  /(drop\s+(table|database))/gi,
  /(create\s+(table|database))/gi,
  /(exec\s*\(|execute\s*\()/gi,
  /(xp_cmdshell|sp_oacreate)/gi,
]

// Common attack patterns
const ATTACK_PATTERNS = [
  /\.\./g, // Directory traversal
  /\/etc\/passwd/gi, // System file access
  /\/proc\//gi, // Process file access
  /<\?php/gi, // PHP injection
  /<\%/g, // ASP injection
]

export function sanitizeString(input: string, options: {
  removeHTML?: boolean
  preventXSS?: boolean
  preventSQLInjection?: boolean
  preventAttacks?: boolean
  customWhitelist?: string[]
} = {}): string {
  if (typeof input !== 'string') {
    return ''
  }

  let sanitized = input

  // Remove null bytes and control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '')

  // Prevent XSS attacks
  if (options.preventXSS !== false) {
    XSS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '')
    })
    
    // Additional XSS protection
    sanitized = sanitized.replace(/</g, '&lt;')
    sanitized = sanitized.replace(/>/g, '&gt;')
    sanitized = sanitized.replace(/"/g, '&quot;')
    sanitized = sanitized.replace(/'/g, '&#x27;')
    sanitized = sanitized.replace(/\//g, '&#x2F;')
  }

  // Prevent SQL injection
  if (options.preventSQLInjection !== false) {
    SQL_INJECTION_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '')
    })
  }

  // Prevent common attacks
  if (options.preventAttacks !== false) {
    ATTACK_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '')
    })
  }

  // Apply custom whitelist if provided
  if (options.customWhitelist) {
    const whitelistRegex = new RegExp(`[^${options.customWhitelist.join('')}]`, 'g')
    sanitized = sanitized.replace(whitelistRegex, '')
  }

  // Trim whitespace
  sanitized = sanitized.trim()

  return sanitized
}

export function validateInput(value: any, rules: ValidationRule): ValidationResult {
  const errors: string[] = []
  let processedValue = value

  // Type validation
  if (rules.type) {
    switch (rules.type) {
      case 'string':
        if (typeof processedValue !== 'string') {
          processedValue = String(processedValue || '')
        }
        break
      case 'number':
        const num = Number(processedValue)
        if (isNaN(num)) {
          errors.push('Value must be a valid number')
        } else {
          processedValue = num
        }
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (typeof processedValue !== 'string' || !emailRegex.test(processedValue)) {
          errors.push('Invalid email format')
        }
        break
      case 'url':
        try {
          new URL(processedValue)
        } catch {
          errors.push('Invalid URL format')
        }
        break
      case 'boolean':
        if (typeof processedValue === 'string') {
          processedValue = processedValue.toLowerCase() === 'true'
        } else {
          processedValue = Boolean(processedValue)
        }
        break
      case 'object':
        if (typeof processedValue === 'string') {
          try {
            processedValue = JSON.parse(processedValue)
          } catch {
            errors.push('Invalid JSON format')
          }
        }
        break
    }
  }

  // Required validation
  if (rules.required && (processedValue === null || processedValue === undefined || processedValue === '')) {
    errors.push('This field is required')
  }

  // String-specific validations
  if (typeof processedValue === 'string') {
    // Length validation
    if (rules.minLength && processedValue.length < rules.minLength) {
      errors.push(`Minimum length is ${rules.minLength} characters`)
    }
    if (rules.maxLength && processedValue.length > rules.maxLength) {
      errors.push(`Maximum length is ${rules.maxLength} characters`)
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(processedValue)) {
      errors.push('Invalid format')
    }

    // Sanitization
    if (rules.sanitize !== false) {
      processedValue = sanitizeString(processedValue, {
        preventXSS: true,
        preventSQLInjection: true,
        preventAttacks: true
      })
    }

    // Whitelist validation
    if (rules.whitelist && rules.whitelist.length > 0) {
      const whitelistRegex = new RegExp(`^[${rules.whitelist.join('')}]*$`)
      if (!whitelistRegex.test(processedValue)) {
        errors.push('Contains invalid characters')
      }
    }

    // Blacklist validation
    if (rules.blacklist) {
      for (const blacklisted of rules.blacklist) {
        if (processedValue.toLowerCase().includes(blacklisted.toLowerCase())) {
          errors.push('Contains prohibited content')
          break
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    value: processedValue,
    errors
  }
}

// Predefined validation schemas
export const validationSchemas = {
  // User input validation
  username: {
    required: true,
    type: 'string' as const,
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_-]+$/,
    sanitize: true
  },
  
  email: {
    required: true,
    type: 'email' as const,
    maxLength: 254,
    sanitize: true
  },
  
  githubId: {
    required: true,
    type: 'number' as const,
    minLength: 1
  },
  
  plan: {
    required: true,
    type: 'string' as const,
    whitelist: ['starter', 'pro', 'free'],
    sanitize: true
  },
  
  affiliateCode: {
    required: true,
    type: 'string' as const,
    pattern: /^[a-z0-9]{1,15}_[a-z0-9]+_[a-z0-9]+$/i,
    maxLength: 50,
    sanitize: true
  },
  
  message: {
    required: true,
    type: 'string' as const,
    minLength: 1,
    maxLength: 2000,
    sanitize: true
  },
  
  feedbackRating: {
    required: false,
    type: 'number' as const,
    min: 0,
    max: 5
  },
  
  timeRange: {
    required: false,
    type: 'string' as const,
    whitelist: ['24H', '7D', '1M', '3M', 'ALL'],
    sanitize: true
  },
  
  page: {
    required: false,
    type: 'number' as const,
    min: 1,
    max: 1000
  },
  
  limit: {
    required: false,
    type: 'number' as const,
    min: 1,
    max: 100
  }
}

// Validation middleware for API routes
export function validateRequest(body: any, schema: Record<string, ValidationRule>): {
  isValid: boolean
  validatedData: Record<string, any>
  errors: Record<string, string[]>
  response?: NextResponse
} {
  const errors: Record<string, string[]> = {}
  const validatedData: Record<string, any> = {}

  for (const [field, rules] of Object.entries(schema)) {
    const result = validateInput(body[field], rules)
    
    if (!result.isValid) {
      errors[field] = result.errors
    } else {
      validatedData[field] = result.value
    }
  }

  const isValid = Object.keys(errors).length === 0

  if (!isValid) {
    const response = NextResponse.json({
      error: 'Validation failed',
      details: errors
    }, { status: 400 })
    
    return { isValid, validatedData, errors, response }
  }

  return { isValid, validatedData, errors }
}

// Rate limiting for validation failures
const validationFailureStore = new Map<string, { count: number; resetTime: number }>()

export function checkValidationFailureRate(identifier: string): boolean {
  const now = Date.now()
  const record = validationFailureStore.get(identifier)

  if (!record || now > record.resetTime) {
    validationFailureStore.set(identifier, { count: 1, resetTime: now + (15 * 60 * 1000) }) // 15 minutes
    return true
  }

  if (record.count >= 10) { // Max 10 validation failures per 15 minutes
    return false
  }

  record.count++
  return true
}

// Security headers for validation responses
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}
