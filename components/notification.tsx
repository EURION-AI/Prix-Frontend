'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, Mail } from 'lucide-react'

export type NotificationType = 'success' | 'error' | 'info'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
}

interface NotificationContextValue {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

let notificationCallback: ((notification: Omit<Notification, 'id'>) => void) | null = null

export function showNotification(notification: Omit<Notification, 'id'>) {
  if (notificationCallback) {
    notificationCallback(notification)
  }
}

export function NotificationToast({ 
  notification, 
  onDismiss 
}: { 
  notification: Notification
  onDismiss: () => void 
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300)
    }, notification.duration || 5000)
    return () => clearTimeout(timer)
  }, [notification, onDismiss])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  }

  const borderColors = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    info: 'border-blue-500/30',
  }

  return (
    <div 
      className={`transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`bg-[#1a1a1f] border ${borderColors[notification.type]} rounded-xl p-4 shadow-xl min-w-[320px] max-w-md`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {icons[notification.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm">{notification.title}</p>
            {notification.message && (
              <p className="text-white/50 text-sm mt-1">{notification.message}</p>
            )}
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onDismiss, 300)
            }}
            className="flex-shrink-0 text-white/40 hover:text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function NotificationContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    notificationCallback = (notification) => {
      const id = Math.random().toString(36).substring(2, 9)
      setNotifications((prev) => [...prev, { ...notification, id }])
    }
    return () => {
      notificationCallback = null
    }
  }, [])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onDismiss={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

export function EmailVerificationBanner({ email }: { email: string }) {
  const [dismissed, setDismissed] = useState(false)
  const [sent, setSent] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm">Verify your email</p>
          <p className="text-white/50 text-sm mt-1">
            We sent a verification link to <span className="text-blue-400">{email}</span>
          </p>
          {!sent && (
            <button
              onClick={() => {
                setSent(true)
                showNotification({
                  type: 'success',
                  title: 'Verification email sent',
                  message: 'Check your inbox for the verification link',
                })
              }}
              className="text-blue-400 text-sm font-medium mt-2 hover:text-blue-300 transition-colors"
            >
              Resend email
            </button>
          )}
          {sent && (
            <p className="text-white/50 text-sm mt-2">Email sent! Check again in a few minutes.</p>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/40 hover:text-white/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function PurchaseSuccessNotification({ planName, email }: { planName: string; email: string }) {
  return (
    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm">Payment successful!</p>
          <p className="text-white/50 text-sm mt-1">
            Your <span className="text-green-400">{planName}</span> subscription is now active. A receipt has been sent to <span className="text-white/70">{email}</span>
          </p>
        </div>
      </div>
    </div>
  )
}