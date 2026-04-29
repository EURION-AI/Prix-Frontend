import { Metadata } from 'next'
import { Shield, Lock, Eye, Server, Database, CreditCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Security - Prix',
  description: 'Security practices and measures at Prix.',
}

export default function SecurityPage() {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">Security</h1>
      <p className="text-white/50 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="space-y-8">
        <section>
          <p className="text-white/60 leading-relaxed">
            At Prix, security is our top priority. We implement industry-leading security practices to protect your code and data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            Data Encryption
          </h2>
          <p className="text-white/60 leading-relaxed mb-4">
            All data is encrypted both in transit and at rest:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li><strong>TLS/SSL encryption</strong> for all data transmitted between your browser and our servers</li>
            <li><strong>AES-256 encryption</strong> for data stored on our servers</li>
            <li><strong>Encrypted database backups</strong> with separate encryption keys</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Lock className="w-6 h-6 text-primary" />
            Authentication
          </h2>
          <p className="text-white/60 leading-relaxed mb-4">
            We use industry-standard authentication providers:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li><strong>GitHub OAuth</strong> for user authentication - we never store passwords</li>
            <li><strong>Secure session management</strong> with httpOnly cookies</li>
            <li><strong>CSRF protection</strong> on all state-changing operations</li>
            <li><strong>Rate limiting</strong> to prevent brute force attacks</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Eye className="w-6 h-6 text-primary" />
            Privacy
          </h2>
          <p className="text-white/60 leading-relaxed mb-4">
            Your code privacy is fundamental to our service:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li><strong>No permanent storage</strong> - Code is processed in real-time and deleted immediately after review</li>
            <li><strong>Zero data retention</strong> - We do not store your source code on our servers</li>
            <li><strong>Minimal data collection</strong> - We only collect what's necessary for the service</li>
            <li><strong>GDPR compliant</strong> - Full compliance with data protection regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-primary" />
            Payment Security
          </h2>
          <p className="text-white/60 leading-relaxed mb-4">
            Payment processing is handled securely by Stripe:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li><strong>PCI DSS Level 1 compliant</strong> - The highest level of payment security certification</li>
            <li><strong>No card data stored</strong> - All payment information is handled by Stripe</li>
            <li><strong>Encrypted transactions</strong> - End-to-end encryption for all payments</li>
            <li><strong>3D Secure support</strong> - Additional authentication for fraud prevention</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Server className="w-6 h-6 text-primary" />
            Infrastructure
          </h2>
          <p className="text-white/60 leading-relaxed mb-4">
            Our infrastructure is built on secure, enterprise-grade cloud providers:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li><strong>Cloud-hosted</strong> on secure data centers with 24/7 monitoring</li>
            <li><strong> DDoS protection</strong> and automatic threat detection</li>
            <li><strong>Regular security audits</strong> and penetration testing</li>
            <li><strong>Automated vulnerability scanning</strong> and patching</li>
            <li><strong>99.9% uptime SLA</strong> with redundant infrastructure</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Database className="w-6 h-6 text-primary" />
            Data Handling
          </h2>
          <p className="text-white/60 leading-relaxed mb-4">
            How we handle your user data:
          </p>
          <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
            <li><strong>User data</strong> - Stored securely with encrypted backups</li>
            <li><strong>Code submissions</strong> - Processed in memory and never persisted</li>
            <li><strong>Payment records</strong> - Retained for 7 years per financial regulations</li>
            <li><strong>Analytics data</strong> - Aggregated and anonymized after 26 months</li>
            <li><strong>Account deletion</strong> - Full data deletion available upon request</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Reporting Security Issues</h2>
          <p className="text-white/60 leading-relaxed">
            If you discover a security vulnerability, please contact us immediately at <a href="mailto:security@prix.ai" className="text-primary hover:underline">security@prix.ai</a>. We respond to all security reports within 24 hours and appreciate responsible disclosure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
          <p className="text-white/60 leading-relaxed">
            For any security-related questions, please contact us at security@prix.ai
          </p>
        </section>
      </div>
    </article>
  )
}