import { NextResponse } from 'next/server'

export function corsResponse(response: NextResponse, request?: Request): NextResponse {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || ['https://localhost:3000']
  const origin = request?.headers.get('origin')

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else if (allowedOrigins.length > 0) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigins[0])
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, stripe-signature')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', '86400')
  return response
}

export function handleOptions(request: Request): NextResponse {
  const response = new NextResponse(null, { status: 200 })
  return corsResponse(response, request)
}

export function validateGitHubId(id: unknown): id is number {
  return typeof id === 'number' && Number.isFinite(id) && id > 0 && Number.isInteger(id)
}

export function validateString(value: unknown, fieldName: string, maxLength = 255): string {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`)
  }
  if (value.length === 0) {
    throw new Error(`${fieldName} cannot be empty`)
  }
  if (value.length > maxLength) {
    throw new Error(`${fieldName} must be less than ${maxLength} characters`)
  }
  return value.trim()
}

export function validateAffiliateCode(code: string): boolean {
  const regex = /^[a-z0-9]{1,15}_[a-z0-9]+_[a-z0-9]+$/i
  return regex.test(code) && code.length <= 50
}

export function validatePlan(plan: unknown): plan is 'starter' | 'pro' {
  return plan === 'starter' || plan === 'pro'
}