'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Send, Shield, Heart, Bug, Lightbulb, ThumbsUp } from 'lucide-react'
import { FeedbackForm } from './feedback-form'

const feedbackTypes = [
  {
    icon: Bug,
    title: 'Report a Bug',
    description: 'Found something broken? Let us know so we can fix it quickly.',
  },
  {
    icon: Lightbulb,
    title: 'Feature Request',
    description: 'Have an idea for something new? We read every suggestion.',
  },
  {
    icon: ThumbsUp,
    title: 'General Feedback',
    description: 'Tell us what you love or how we can do better.',
  },
]

export function FeedbackContent() {
  return (
    <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary">We value your input</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Share Your Feedback
        </h1>
        <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
          Your experience matters. Whether it is a feature request, bug report, or just telling us what you love — we are all ears.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      >
        {feedbackTypes.map((item) => (
          <div
            key={item.title}
            className="group p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-10 md:p-14"
      >
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-white/[0.06]">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Send className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Send Us a Message</h2>
            <p className="text-white/40 text-sm">We read every submission and respond to urgent issues.</p>
          </div>
        </div>
        <FeedbackForm />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-10 py-8 border-t border-white/[0.04]"
      >
        <div className="flex items-center gap-2 text-white/30 text-sm">
          <Shield className="w-4 h-4" />
          <span>Secure & Private</span>
        </div>
        <div className="flex items-center gap-2 text-white/30 text-sm">
          <Heart className="w-4 h-4" />
          <span>Read by Humans</span>
        </div>
        <div className="flex items-center gap-2 text-white/30 text-sm">
          <MessageSquare className="w-4 h-4" />
          <span>Direct to Discord</span>
        </div>
      </motion.div>
    </div>
  )
}