import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Prix',
  description: 'Privacy Policy for Prix AI-powered code review platform.',
}

export default function PrivacyPage() {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
      <p className="text-white/50 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            We collect information you provide directly to us:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li><strong>Account Information:</strong> When you sign up via GitHub OAuth, we receive your GitHub profile information including username, email, and public profile data.</li>
            <li><strong>Payment Information:</strong> Payment processing is handled by Stripe. We do not store your credit card or payment details on our servers.</li>
            <li><strong>Code Submissions:</strong> Code you submit for review is processed temporarily and not permanently stored.</li>
            <li><strong>Usage Data:</strong> We collect information about how you interact with our service, including API calls, feature usage, and preferences.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
          <p className="text-white/60 leading-relaxed mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze usage patterns</li>
            <li>Detect, prevent, and address fraud and abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties, except:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li><strong>Service Providers:</strong> We share information with trusted service providers who assist us in operating our service (e.g., Stripe for payments, GitHub for authentication).</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in good faith belief that such action is necessary.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, user information may be transferred as part of the transaction.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            We implement appropriate technical and organizational measures to protect your personal information, including:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li>Encryption of data in transit using TLS/SSL</li>
            <li>Regular security assessments and audits</li>
            <li>Access controls and authentication requirements</li>
            <li>Secure storage of sensitive credentials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            We retain your information for as long as your account is active or as needed to provide services:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li><strong>Account Data:</strong> Retained until you delete your account or request deletion</li>
            <li><strong>Code Submissions:</strong> Not permanently stored; deleted immediately after review</li>
            <li><strong>Payment Records:</strong> Retained for 7 years as required by financial regulations</li>
            <li><strong>Usage Analytics:</strong> Aggregated and anonymized after 26 months</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
          <p className="text-white/60 leading-relaxed mb-4">Depending on your location, you may have the right to:</p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li>Access the personal information we hold about you</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Delete your personal information</li>
            <li>Object to or restrict certain processing activities</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="text-white/60 leading-relaxed mt-4">
            To exercise these rights, please contact us at privacy@prix.ai
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            We use cookies and similar tracking technologies to:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li>Remember your preferences and settings</li>
            <li>Authenticate your account</li>
            <li>Understand how you use our service</li>
            <li>Deliver relevant advertisements (optional)</li>
          </ul>
          <p className="text-white/60 leading-relaxed mt-4">
            For detailed information about our cookie usage, please see our Cookie Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Services</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            Our service integrates with third-party services:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li><strong>GitHub:</strong> Used for authentication. See GitHub&apos;s Privacy Policy.</li>
            <li><strong>Stripe:</strong> Handles all payment processing. See Stripe&apos;s Privacy Policy.</li>
            <li><strong>Vercel:</strong> Hosts our application and analytics. See Vercel&apos;s Privacy Policy.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">9. Children&apos;s Privacy</h2>
          <p className="text-white/60 leading-relaxed">
            Our service is not directed to individuals under 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete that information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
          <p className="text-white/60 leading-relaxed">
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers, including Standard Contractual Clauses or equivalent legal mechanisms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Policy</h2>
          <p className="text-white/60 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the service after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
          <p className="text-white/60 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at privacy@prix.ai
          </p>
        </section>
      </div>
    </article>
  )
}