import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Prix',
  description: 'Terms of Service for Prix AI-powered code review platform.',
}

export default function TermsPage() {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
      <p className="text-white/50 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p className="text-white/60 leading-relaxed">
            By accessing or using Prix (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
          <p className="text-white/60 leading-relaxed">
            Prix provides AI-powered code review services. Our platform analyzes source code to identify bugs, security issues, and provide suggestions for improvement. We reserve the right to modify, suspend, or discontinue the service at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            To access certain features, you must create an account using GitHub OAuth. You are responsible for:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Providing accurate and complete information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Subscription and Payments</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            Paid subscriptions are billed on a recurring basis. By subscribing you agree to:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li>Pay all fees associated with your subscription plan</li>
            <li>Provide valid payment method information</li>
            <li>Cancel your subscription before the next billing cycle to avoid charges</li>
            <li>Prices are subject to change with 30 days notice</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Free Trial</h2>
          <p className="text-white/60 leading-relaxed">
            We may offer free trials. If you cancel during the trial period, you will not be charged. We reserve the right to modify trial terms or discontinue trials at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. Acceptable Use</h2>
          <p className="text-white/60 leading-relaxed mb-4">You agree not to:</p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li>Use the service for any illegal or unauthorized purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the service or servers</li>
            <li>Reverse engineer, decompile, or disassemble the service</li>
            <li>Use automated tools to access the service without permission</li>
            <li>Share your account or allow others to use your subscription</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">7. Code and Intellectual Property</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            Regarding code you submit for review:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li>You retain all ownership rights to your code</li>
            <li>We process your code solely to provide the review service</li>
            <li>Your code is not stored permanently and is deleted after processing</li>
            <li>We do not claim any ownership or rights to your code</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">8. Service Availability</h2>
          <p className="text-white/60 leading-relaxed">
            We strive to maintain high availability but do not guarantee uninterrupted access. We are not liable for any downtime, data loss, or service interruptions. We may perform scheduled maintenance with reasonable notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
          <p className="text-white/60 leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, PRIX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
          <p className="text-white/60 leading-relaxed">
            We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or prominent notice on our website. Continued use after changes constitutes acceptance of new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
          <p className="text-white/60 leading-relaxed">
            We may terminate or suspend your account immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the service immediately ceases.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">12. Contact</h2>
          <p className="text-white/60 leading-relaxed">
            For questions about these Terms, please contact us at legal@prix.ai
          </p>
        </section>
      </div>
    </article>
  )
}