'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Star, Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react'

interface FormData {
  name: string
  email: string
  rating: number
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

const RATING_LABELS = ['Terrible', 'Poor', 'Average', 'Good', 'Excellent']

const SPAM_PATTERNS = [
  /(https?:\/\/[^\s]+)/gi,
  /(.)\1{4,}/gi,
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
]

export function FeedbackForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    rating: 0,
    message: '',
  })
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [honeypot, setHoneypot] = useState('')
  const { toast } = useToast()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (honeypot) {
      return false
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    } else if (formData.message.length > 2000) {
      newErrors.message = 'Message must be less than 2000 characters'
    }

    for (const pattern of SPAM_PATTERNS) {
      if (pattern.test(formData.message)) {
        newErrors.message = 'Message contains invalid content'
        break
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please check your input and try again.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback')
      }

      setIsSuccess(true)
      toast({
        title: 'Feedback Sent!',
        description: 'Thank you for helping us improve Prix.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send feedback. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Feedback Submitted!</h3>
        <p className="text-white/50 mb-8 max-w-sm mx-auto">Thank you for taking the time to share your thoughts. We read every message.</p>
        <Button
          variant="outline"
          onClick={() => {
            setIsSuccess(false)
            setFormData({ name: '', email: '', rating: 0, message: '' })
          }}
          className="border-white/10 text-white hover:bg-white/5"
        >
          Submit Another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="honeypot-field" aria-hidden="true">
        <Input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-white/80">
            Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20 ${errors.name ? 'border-red-500/50' : ''}`}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-white/80">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20 ${errors.email ? 'border-red-500/50' : ''}`}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-white/80">
          How would you rate your experience?
        </label>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData({ ...formData, rating })}
                onMouseEnter={() => setHoverRating(rating)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                disabled={isSubmitting}
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    rating <= (hoverRating || formData.rating)
                      ? 'fill-primary text-primary'
                      : 'text-white/20 hover:text-white/40'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="ml-3 text-sm text-white/50">
            {(hoverRating || formData.rating) > 0 ? RATING_LABELS[(hoverRating || formData.rating) - 1] : 'Select a rating'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-white/80">
          Your Feedback
        </label>
        <Textarea
          id="message"
          placeholder="Tell us what is on your mind — feature requests, bug reports, or just to say hi..."
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20 resize-none ${errors.message ? 'border-red-500/50' : ''}`}
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center">
          {errors.message ? (
            <p className="text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.message}
            </p>
          ) : (
            <span className="text-white/30 text-sm">Be specific and detailed for better assistance</span>
          )}
          <span className={`text-sm font-mono ${formData.message.length > 2000 ? 'text-red-400' : 'text-white/30'}`}>
            {formData.message.length}/2000
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <p className="text-white/25 text-xs">
          By submitting, you agree your feedback may be shared with our team.
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Feedback
              <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}