'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: "Is there a free trial?",
    answer: "Yes! Start with our free Starter plan that includes 3 PR reviews per month at no cost. When you're ready for more, upgrade to Pro for unlimited PR reviews — you can try it free for 7 days with no credit card required."
  },
  {
    question: "Why is Prix better than CodeRabbit or Copilot for code reviews?",
    answer: "Unlike general-purpose models, Prix uses a specialized multi-dimensional graph analysis engine to understand structural dependencies and architectural intent, resulting in zero-false-positive reviews. Unlike CodeRabbit, we provide deep architectural context. Unlike Copilot, we focus exclusively on PR reviews with security vulnerability detection and automated fix generation."
  },
  {
    question: "Is my code stored on your servers?",
    answer: "No. Prix is architected for privacy. We analyze your code in real-time and purge all review data immediately after the analysis is complete. We are SOC 2 Type II certified."
  },
  {
    question: "Does it support private repositories?",
    answer: "Yes. Our Pro and Team plans provide full support for private organizations, with native integrations for GitHub, GitLab, and Bitbucket."
  },
  {
    question: "Can I customize the review guidelines?",
    answer: "Absolutely. You can define custom style guides, performance requirements, and security policies via natural language or configuration files."
  },
  {
    question: "How many reviews can it perform per day?",
    answer: "Unlimited. Our infrastructure is designed for scale, processing thousands of pull requests simultaneously without any latency impact on your workflow."
  }
]

export function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-32 bg-background relative overflow-hidden border-t border-white/[0.03]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" />

      <div className="w-full max-w-[1000px] mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-editorial text-5xl md:text-6xl font-semibold text-white mb-4 leading-tight">
            Frequently asked questions
          </h2>
          <p className="text-white/40 text-xl">
            Everything you need to know about Prix.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                activeIndex === index
                  ? 'border-primary/30 bg-white/[0.02]'
                  : 'border-white/[0.05] hover:border-white/10'
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full p-8 flex items-center justify-between text-left"
              >
                <span className={`font-semibold text-xl transition-colors duration-300 pr-4 ${
                  activeIndex === index ? 'text-white' : 'text-white/70'
                }`}>
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeIndex === index
                    ? 'bg-primary/20 text-primary rotate-0'
                    : 'bg-white/5 text-white/40'
                }`}>
                  {activeIndex === index ? (
                    <Minus className="w-3 h-3" />
                  ) : (
                    <Plus className="w-3 h-3" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-lg text-white/50 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-white/40 mb-4">Still have questions?</p>
          <a href="mailto:support@prix.dev" className="text-primary hover:text-primary/80 transition-colors font-medium">
            Contact our team
          </a>
        </motion.div>
      </div>
      
      {/* FAQPage Schema for AI Systems */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  )
}
