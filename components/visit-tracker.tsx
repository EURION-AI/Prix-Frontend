'use client'

import { useEffect } from 'react'

export function VisitTracker() {
  useEffect(() => {
    const lastVisit = localStorage.getItem('last_visit')
    const today = new Date().toISOString().split('T')[0]

    if (lastVisit !== today) {
      fetch('/api/track/visit', { method: 'POST' })
        .then(() => {
          localStorage.setItem('last_visit', today)
        })
        .catch(() => {})
    }
  }, [])

  return null
}
