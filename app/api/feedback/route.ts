import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { validateString } from '@/lib/validation'

const DISCORD_WEBHOOK_URL = process.env.DISCORD_FEEDBACK_WEBHOOK_URL

const SPAM_PATTERNS = [
  /https?:\/\/[^\s]+/gi,
  /(.)\1{4,}/gi,
  /\[(disc|discord|nitro|boost)\]/gi,
  /(free|winner|prize|click here|act now)/gi,
]

const MAX_MESSAGE_LENGTH = 2000
const MAX_NAME_LENGTH = 100
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW = 60 * 1000

const feedbackRateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkFeedbackRateLimit(identifier: string): boolean {
  const now = Date.now()
  const record = feedbackRateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    feedbackRateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function containsSpam(text: string): boolean {
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      return true
    }
  }
  return false
}

function escapeDiscord(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\~')
    .replace(/\|/g, '\\|')
}

function getRatingEmoji(rating: number): string {
  const stars = '⭐'.repeat(rating)
  return stars || 'No rating'
}

function getClientIdentifier(request: Request): string {
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return `${ip}:${userAgent.slice(0, 50)}`
}

setInterval(() => {
  const now = Date.now()
  for (const [key, value] of feedbackRateLimitStore.entries()) {
    if (now > value.resetTime) {
      feedbackRateLimitStore.delete(key)
    }
  }
}, RATE_LIMIT_WINDOW)

export async function POST(request: Request) {
  try {
    if (!DISCORD_WEBHOOK_URL) {
      console.error('Discord feedback webhook URL not configured')
      return NextResponse.json(
        { error: 'Feedback submission is temporarily unavailable' },
        { status: 503 }
      )
    }

    const identifier = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(identifier)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', retryAfter: rateLimitResult.resetIn },
        { status: 429 }
      )
    }

    if (!checkFeedbackRateLimit(identifier)) {
      return NextResponse.json(
        { error: 'You have submitted too much feedback recently. Please wait before submitting again.' },
        { status: 429 }
      )
    }

    let body: { name?: string; email?: string; rating?: number; message?: string; timestamp?: string }

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { name, email, rating, message, timestamp } = body

    let validatedName: string
    let validatedEmail: string
    let validatedMessage: string
    let validatedRating: number

    try {
      validatedName = validateString(name, 'Name', MAX_NAME_LENGTH)
      validatedEmail = validateString(email, 'Email', 254)
      validatedMessage = validateString(message, 'Message', MAX_MESSAGE_LENGTH)
    } catch (validationError) {
      return NextResponse.json(
        { error: validationError instanceof Error ? validationError.message : 'Invalid input' },
        { status: 400 }
      )
    }

    if (typeof rating !== 'number' || rating < 0 || rating > 5 || !Number.isInteger(rating)) {
      validatedRating = 0
    } else {
      validatedRating = rating
    }

    const sanitizedName = sanitizeString(validatedName)
    const sanitizedMessage = sanitizeString(validatedMessage)

    if (containsSpam(sanitizedName) || containsSpam(sanitizedMessage)) {
      return NextResponse.json(
        { error: 'Your feedback contains prohibited content' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(validatedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const discordPayload = {
      username: 'Prix Feedback',
      avatar_url: 'https://prix.ai/icon.png',
      embeds: [
        {
          title: '📝 New Feedback Received',
          color: 5814783,
          fields: [
            {
              name: '👤 Name',
              value: escapeDiscord(sanitizedName),
              inline: true,
            },
            {
              name: '⭐ Rating',
              value: getRatingEmoji(validatedRating),
              inline: true,
            },
            {
              name: '📧 Email',
              value: escapeDiscord(validatedEmail),
              inline: true,
            },
            {
              name: '💬 Message',
              value: escapeDiscord(sanitizedMessage),
              inline: false,
            },
          ],
          footer: {
            text: 'Prix Feedback System',
          },
          timestamp: timestamp || new Date().toISOString(),
        },
      ],
    }

    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload),
    })

    if (!discordResponse.ok) {
      console.error('Discord webhook error:', await discordResponse.text())
      return NextResponse.json(
        { error: 'Failed to send feedback. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Feedback submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}