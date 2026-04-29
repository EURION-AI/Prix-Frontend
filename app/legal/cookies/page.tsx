import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy - Prix',
  description: 'Cookie Policy for Prix AI-powered code review platform.',
}

export default function CookiePage() {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>
      <p className="text-white/50 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies</h2>
          <p className="text-white/60 leading-relaxed">
            Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and understand how you interact with the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            We use cookies for several purposes:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li><strong>Authentication:</strong> To keep you logged in and secure your session</li>
            <li><strong>Preferences:</strong> To remember your settings and preferences</li>
            <li><strong>Analytics:</strong> To understand how visitors use our website</li>
            <li><strong>Security:</strong> To detect fraud and protect against abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Types of Cookies We Use</h2>
          
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Essential Cookies</h3>
              <p className="text-white/60 leading-relaxed mb-2">
                These cookies are required for the website to function properly. They enable core features like security, authentication, and accessibility.
              </p>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/40">Cookie Names</p>
                    <p className="text-white font-mono">github_token, oauth_state</p>
                  </div>
                  <div>
                    <p className="text-white/40">Purpose</p>
                    <p className="text-white">Authentication</p>
                  </div>
                  <div>
                    <p className="text-white/40">Duration</p>
                    <p className="text-white">7 days</p>
                  </div>
                  <div>
                    <p className="text-white/40">Third Party</p>
                    <p className="text-white">No</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Functional Cookies</h3>
              <p className="text-white/60 leading-relaxed mb-2">
                These cookies enable personalized features and functionality.
              </p>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/40">Cookie Names</p>
                    <p className="text-white font-mono">affiliate_code, theme</p>
                  </div>
                  <div>
                    <p className="text-white/40">Purpose</p>
                    <p className="text-white">Preferences & Referrals</p>
                  </div>
                  <div>
                    <p className="text-white/40">Duration</p>
                    <p className="text-white">7 days</p>
                  </div>
                  <div>
                    <p className="text-white/40">Third Party</p>
                    <p className="text-white">No</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Analytics Cookies</h3>
              <p className="text-white/60 leading-relaxed mb-2">
                These cookies help us understand how visitors interact with our website.
              </p>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/40">Provider</p>
                    <p className="text-white font-mono">Vercel Analytics</p>
                  </div>
                  <div>
                    <p className="text-white/40">Purpose</p>
                    <p className="text-white">Usage Analytics</p>
                  </div>
                  <div>
                    <p className="text-white/40">Data Collected</p>
                    <p className="text-white">Anonymous usage patterns</p>
                  </div>
                  <div>
                    <p className="text-white/40">Opt-Out</p>
                    <p className="text-white">Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Cookies</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            Some cookies are placed by third-party services that appear on our site:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li><strong>GitHub:</strong> Used for OAuth authentication when you sign in with GitHub</li>
            <li><strong>Stripe:</strong> Used for secure payment processing</li>
            <li><strong>Vercel:</strong> Used for analytics and performance monitoring</li>
          </ul>
          <p className="text-white/60 leading-relaxed mt-4">
            These third-party services have their own cookie policies. We recommend reviewing their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Managing Your Cookies</h2>
          <p className="text-white/60 leading-relaxed mb-4">
            You have several options for managing cookies:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies through settings</li>
            <li><strong>Privacy Mode:</strong> Use incognito/private browsing mode to avoid storing cookies</li>
            <li><strong>Opt-Out Links:</strong> Some analytics services offer opt-out extensions</li>
          </ul>
          <p className="text-white/60 leading-relaxed mt-4">
            Note: Blocking essential cookies may affect website functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. Cookie Consent</h2>
          <p className="text-white/60 leading-relaxed">
            When you first visit our website, you will be presented with options regarding cookie consent. You can change these preferences at any time by contacting us or adjusting your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">7. Updates to This Policy</h2>
          <p className="text-white/60 leading-relaxed">
            We may update this Cookie Policy periodically. Any changes will be posted on this page with an updated &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
          <p className="text-white/60 leading-relaxed">
            If you have questions about our use of cookies, please contact us at privacy@prix.ai
          </p>
        </section>
      </div>
    </article>
  )
}