export const PRICING = {
  IN: {
    starter: { price: 69900, currency: 'INR', symbol: '₹', display: '₹699' }, // ₹699 (in paise for Razorpay)
    pro: { price: 89900, currency: 'INR', symbol: '₹', display: '₹899' }, // ₹899
  },
  GB: {
    starter: { price: 699, currency: 'GBP', symbol: '£', display: '£6.99' }, // £6.99
    pro: { price: 999, currency: 'GBP', symbol: '£', display: '£9.99' }, // £9.99
  },
  EU: {
    starter: { price: 699, currency: 'EUR', symbol: '€', display: '€6.99' }, // €6.99
    pro: { price: 999, currency: 'EUR', symbol: '€', display: '€9.99' }, // €9.99
  },
  US: {
    starter: { price: 699, currency: 'USD', symbol: '$', display: '$6.99' }, // $6.99
    pro: { price: 999, currency: 'USD', symbol: '$', display: '$9.99' }, // $9.99
  },
} as const

export type Region = keyof typeof PRICING
export type Plan = 'starter' | 'pro'

/**
 * Centralized region detection helper
 * Detects user's region based on timezone and locale
 */
export function getUserRegion(forcedRegion?: string | null): Region {
  // Priority 1: Forced region override (for testing)
  if (forcedRegion && ['IN', 'US', 'GB', 'EU'].includes(forcedRegion)) {
    console.log('REGION_DEBUG: Using forced region', forcedRegion)
    return forcedRegion as Region
  }

  // Priority 2: Server-side detection (production)
  if (typeof window === 'undefined') {
    // Server-side: would use headers here in production
    return 'US'
  }

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const locale = navigator.language || 'en-US'
    const languages = navigator.languages || []

    const debugInfo = { timezone, locale, languages, detectedRegion: 'US' }

    // Detect India
    if (timezone.includes('Asia/Kolkata') || locale.includes('IN') || languages.some(l => l.includes('IN'))) {
      debugInfo.detectedRegion = 'IN'
      console.log('REGION_DEBUG', debugInfo)
      return 'IN'
    }

    // Detect UK
    if (timezone.includes('Europe/London') || locale.includes('GB') || languages.some(l => l.includes('GB'))) {
      debugInfo.detectedRegion = 'GB'
      console.log('REGION_DEBUG', debugInfo)
      return 'GB'
    }

    // Detect EU (common European locales)
    const euLocales = ['de', 'fr', 'es', 'it', 'nl', 'pt', 'pl', 'sv', 'no', 'da', 'fi']
    if (timezone.includes('Europe') && !timezone.includes('London') || euLocales.some(l => locale.includes(l))) {
      debugInfo.detectedRegion = 'EU'
      console.log('REGION_DEBUG', debugInfo)
      return 'EU'
    }

    console.log('REGION_DEBUG', debugInfo)
  } catch (e) {
    console.error('Error detecting region:', e)
  }

  return 'US'
}

/**
 * Format price for display
 * Returns formatted price string like "₹699", "$6.99", etc.
 */
export function formatPrice(region: Region, plan: Plan): string {
  return PRICING[region][plan].display
}

/**
 * Get pricing data for a region and plan
 */
export function getPricing(region: Region, plan: Plan) {
  return PRICING[region][plan]
}

/**
 * Get currency symbol for a region
 */
export function getCurrencySymbol(region: Region): string {
  return PRICING[region].starter.symbol
}
