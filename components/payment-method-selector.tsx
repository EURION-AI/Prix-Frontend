'use client'

import { Check } from 'lucide-react'

interface PaymentMethodSelectorProps {
  selected: 'razorpay' | 'paypal' | null
  onSelect: (method: 'razorpay' | 'paypal') => void
}

export function PaymentMethodSelector({ selected, onSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-white/60 uppercase tracking-wider">
        Choose your payment method
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onSelect('paypal')}
          className={`relative flex items-center gap-4 p-5 rounded-2xl border transition-all text-left
            ${selected === 'paypal'
              ? 'border-primary bg-primary/5 shadow-[0_0_15px_-3px] shadow-primary/20'
              : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/[0.07]'
            }`}
        >
          {selected === 'paypal' && (
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          <div className="w-12 h-12 rounded-xl bg-white/[0.08] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 36 36" className="w-7 h-7">
              <defs>
                <linearGradient id="paypal-logo" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#003087" />
                  <stop offset="100%" stopColor="#009cde" />
                </linearGradient>
              </defs>
              <path fill="url(#paypal-logo)" d="M26.66 4.04A6.37 6.37 0 0 0 22.6 2H10.88a1.8 1.8 0 0 0-1.78 1.54L6.05 22.62a1.07 1.07 0 0 0 1.06 1.24h4.07l1.02-6.48-.03.18a1.8 1.8 0 0 1 1.79-1.54h3.72a7.34 7.34 0 0 0 7.34-7.35c0-.9-.16-1.75-.45-2.55a5.87 5.87 0 0 0-1.7-2.02Z"/>
              <path fill="#003087" d="M24.39 10.42a7.33 7.33 0 0 1-7.33 7.34h-3.73l-1.02 6.48H9.3l.37-2.37-.03.18a1.8 1.8 0 0 1 1.79-1.54h3.72a7.34 7.34 0 0 0 7.34-7.35c0-.9-.16-1.75-.45-2.55.32.6.5 1.26.5 1.96Z"/>
              <path fill="#009cde" d="M18.38 10.71c0-.62.5-1.12 1.12-1.12h4.23a5.54 5.54 0 0 1 1.56.22 4.6 4.6 0 0 1 .45.17c0-.9-.16-1.75-.45-2.55a6.37 6.37 0 0 0-4.06-2.01H10.88a1.8 1.8 0 0 0-1.78 1.54L6.05 22.62a1.07 1.07 0 0 0 1.06 1.24h4.07l1.02-6.48-.03.18a1.8 1.8 0 0 1 1.79-1.54h3.72c3.63 0 6.82-2.65 7.47-6.23a4.17 4.17 0 0 0-.5-2.55 2.4 2.4 0 0 0-1.25-.53h-3.98a1.11 1.11 0 0 0-1.12 1.12Z"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-base">PayPal</p>
            <p className="text-white/40 text-xs mt-0.5">Pay with your PayPal account</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect('razorpay')}
          className={`relative flex items-center gap-4 p-5 rounded-2xl border transition-all text-left
            ${selected === 'razorpay'
              ? 'border-primary bg-primary/5 shadow-[0_0_15px_-3px] shadow-primary/20'
              : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/[0.07]'
            }`}
        >
          {selected === 'razorpay' && (
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          {selected !== 'razorpay' && (
            <div className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
              Popular
            </div>
          )}
          <div className="w-12 h-12 rounded-xl bg-white/[0.08] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 200 60" className="w-11 h-8">
              <defs>
                <linearGradient id="rzp-logo" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0b63e5" />
                  <stop offset="100%" stopColor="#1a8cff" />
                </linearGradient>
              </defs>
              <path fill="url(#rzp-logo)" d="M25.8 0L8.4 31.5h11.8L33.5 7.3l-4.5 24.2h11.6L25.8 0zm50.5 0L59 31.5h11.8L84.2 7.3l-4.6 24.2h11.6L76.3 0zM0 36.2L15.8 60h35.6l-4.5-23.8H0zm44.6 0L60.4 60h35.6L91.5 36.2H44.6zm44.5 0L104.9 60h35.6L136 36.2H89.1zM128.5 0l-10.5 28.6h11.8l6.8-19.1L133 60h11.8L140.3 0h-11.8zm39.3 0l-10.5 28.6h11.7l6.9-19.1L172.3 60h11.8L179.6 0h-11.8zm-79 0l-10.5 28.6h11.7l6.9-19.1L93.3 60h11.8L100.6 0H88.8z"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-base">Razorpay</p>
            <p className="text-white/40 text-xs mt-0.5">Pay with cards, UPI & more</p>
          </div>
        </button>
      </div>
    </div>
  )
}
