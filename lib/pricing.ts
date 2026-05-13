export const PRICING = {
  IN: {
    starter: { price: 500, currency: 'INR', symbol: '₹', display: '₹5' }, // ₹5 (in paise for Razorpay)
    pro: { price: 1000, currency: 'INR', symbol: '₹', display: '₹10' }, // ₹10
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
    
    // Normalize locale for proper detection
    const normalizedLocale = locale.toUpperCase()
    const normalizedLanguages = languages.map(l => l.toUpperCase())

    const debugInfo = { timezone, locale, normalizedLocale, normalizedLanguages, detectedRegion: 'US' }

    // Detect India (more reliable detection)
    if (
      timezone === 'Asia/Kolkata' ||
      timezone === 'Asia/Calcutta' ||
      normalizedLocale.endsWith('-IN') ||
      normalizedLanguages.some(l => l.endsWith('-IN'))
    ) {
      debugInfo.detectedRegion = 'IN'
      console.log('REGION_DEBUG', debugInfo)
      console.log('REGION_DEBUG: Locale detected as India - timezone:', timezone, 'locale:', locale, 'normalizedLocale:', normalizedLocale, 'languages:', normalizedLanguages)
      return 'IN'
    }

    // Detect UK
    if (
      timezone.includes('Europe/London') ||
      normalizedLocale.includes('GB') ||
      normalizedLocale.includes('-GB') ||
      normalizedLanguages.some(l => l.includes('GB')) ||
      normalizedLanguages.some(l => l.includes('-GB'))
    ) {
      debugInfo.detectedRegion = 'GB'
      console.log('REGION_DEBUG: Locale detected as UK - timezone:', timezone, 'locale:', locale, 'normalizedLocale:', normalizedLocale, 'languages:', normalizedLanguages)
      return 'GB'
    }

    // Detect EU (common European locales)
    const euLocales = ['DE', 'FR', 'ES', 'IT', 'NL', 'PT', 'PL', 'SV', 'NO', 'DA', 'FI']
    if (
      (timezone.includes('Europe') && !timezone.includes('London')) ||
      euLocales.some(eu => 
        normalizedLocale.includes(eu) || 
        normalizedLocale.includes(`-${eu}`) ||
        normalizedLanguages.some(l => l.includes(eu)) ||
        normalizedLanguages.some(l => l.includes(`-${eu}`))
      )
    ) {
      debugInfo.detectedRegion = 'EU'
      console.log('REGION_DEBUG: Locale detected as EU - timezone:', timezone, 'locale:', locale, 'normalizedLocale:', normalizedLocale, 'languages:', normalizedLanguages)
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

export const UPGRADE_PRICE: Record<string, string> = {
  IN: '₹2.99',
  US: '$2.99',
  GB: '£2.99',
  EU: '€2.99',
}

