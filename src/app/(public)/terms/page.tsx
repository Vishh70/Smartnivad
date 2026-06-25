import { GlassCard } from "@/components/ui/GlassCard";

export const metadata = {
  title: "Terms of Service — TechDeals AI",
  description: "Terms of Service for using TechDeals AI.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-[var(--color-glass-border)]">{title}</h2>
      <div className="text-gray-700 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Terms of Service</h1>
        <p className="text-gray-600 text-sm">Last updated: June 24, 2025</p>
      </div>

      <GlassCard className="!p-10">
        <Section title="1. Acceptance of Terms">
          <p>By accessing or using TechDeals AI, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.</p>
        </Section>

        <Section title="2. Use of Service">
          <p>TechDeals AI provides an AI-powered deal aggregation and information service. The service is provided for personal, non-commercial use.</p>
          <p>You agree not to: scrape or automate access to our platform, misuse our content, or violate any applicable laws.</p>
        </Section>

        <Section title="3. Affiliate Disclaimer">
          <p>Product links on TechDeals AI may be affiliate links. We earn commissions from purchases made via these links at no additional cost to you. All deal information is provided for informational purposes only.</p>
        </Section>

        <Section title="4. Accuracy of Information">
          <p>We strive to keep deal prices and availability accurate, but prices change frequently. Always verify the final price on the retailer&apos;s website before purchasing. TechDeals AI is not responsible for price discrepancies.</p>
        </Section>

        <Section title="5. Intellectual Property">
          <p>All original content on TechDeals AI (AI summaries, blog posts, page layouts) is the property of TechDeals AI. Product names, logos, and trademarks belong to their respective owners.</p>
        </Section>

        <Section title="6. Limitation of Liability">
          <p>TechDeals AI shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service or reliance on deal information.</p>
        </Section>

        <Section title="7. Changes to Terms">
          <p>We reserve the right to update these Terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
        </Section>

        <Section title="8. Contact">
          <p>Questions? Contact us at <strong className="text-gray-900">legal@techdealsai.com</strong>.</p>
        </Section>
      </GlassCard>
    </div>
  );
}
