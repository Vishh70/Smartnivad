import { GlassCard } from "@/components/ui/GlassCard";

export const metadata = {
  title: "Privacy Policy — TechDeals AI",
  description: "Privacy Policy for TechDeals AI — how we collect, use, and protect your data.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-[var(--color-glass-border)]">{title}</h2>
      <div className="text-gray-700 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Privacy Policy</h1>
        <p className="text-gray-600 text-sm">Last updated: June 24, 2025</p>
      </div>

      <GlassCard className="!p-10">
        <Section title="1. Introduction">
          <p>TechDeals AI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the TechDeals AI website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service.</p>
        </Section>

        <Section title="2. Information We Collect">
          <p><strong className="text-gray-900">Usage Data:</strong> We automatically collect information on how the service is accessed and used, including your IP address, browser type, pages visited, and time spent.</p>
          <p><strong className="text-gray-900">Newsletter:</strong> If you subscribe to our newsletter, we collect your email address.</p>
          <p><strong className="text-gray-900">Cookies:</strong> We use cookies to improve user experience. You can instruct your browser to refuse cookies, though some features may not function properly.</p>
        </Section>

        <Section title="3. How We Use Your Data">
          <ul className="space-y-2 list-none">
            {["To provide and maintain our service", "To send deal notifications and newsletters (with your consent)", "To analyse usage patterns and improve our platform", "To detect and prevent fraudulent activity"].map(i => (
              <li key={i} className="flex items-start gap-2"><span className="text-[var(--color-primary)] mt-0.5 shrink-0">•</span>{i}</li>
            ))}
          </ul>
        </Section>

        <Section title="4. Affiliate Links">
          <p>TechDeals AI contains affiliate links to third-party stores (Amazon, Flipkart, etc.). When you click these links, the third-party stores may collect their own data as per their privacy policies. We earn a small commission on qualifying purchases.</p>
        </Section>

        <Section title="5. Analytics">
          <p>We use Google Analytics to understand usage patterns. This service may collect anonymised data about your device and browsing behaviour. You can opt out via Google&apos;s opt-out browser add-on.</p>
        </Section>

        <Section title="6. Data Security">
          <p>We implement industry-standard security measures to protect your data. However, no method of internet transmission is 100% secure.</p>
        </Section>

        <Section title="7. Your Rights">
          <p>You have the right to access, correct, or delete your personal data. Contact us at <strong className="text-gray-900">privacy@techdealsai.com</strong> for any data requests.</p>
        </Section>

        <Section title="8. Contact">
          <p>If you have any questions about this Privacy Policy, please contact us at <strong className="text-gray-900">privacy@techdealsai.com</strong>.</p>
        </Section>
      </GlassCard>
    </div>
  );
}
