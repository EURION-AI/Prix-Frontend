export const PRICING = {
  IN: {
    starter: { price: 69900, currency: 'INR' }, // ₹699
    pro: { price: 89900, currency: 'INR' }, // ₹899
  },
  GB: {
    starter: { price: 699, currency: 'GBP' }, // £6.99
    pro: { price: 999, currency: 'GBP' }, // £9.99
  },
  EU: {
    starter: { price: 699, currency: 'EUR' }, // €6.99
    pro: { price: 999, currency: 'EUR' }, // €9.99
  },
  US: {
    starter: { price: 699, currency: 'USD' }, // $6.99
    pro: { price: 999, currency: 'USD' }, // $9.99
  },
} as const

export type Region = keyof typeof PRICING
export type Plan = 'starter' | 'pro'
