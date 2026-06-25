import { GlassCard } from "@/components/ui/GlassCard";

export const metadata = {
  title: "Disclaimer — TechDeals AI",
  description: "Disclaimer for TechDeals AI — affiliate disclosure and information accuracy.",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Disclaimer</h1>
        <p className="text-gray-600 text-sm">Last updated: June 24, 2025</p>
      </div>

      <GlassCard className="!p-10 space-y-8">
        {/* Affiliate */}
        <div>
          <h2 className="text-xl font-bold text-orange-400 mb-4">Amazon Affiliate Disclosure</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            TechDeals AI is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases.
          </p>
        </div>

        <div className="border-t border-[var(--color-glass-border)]" />

        {/* General Affiliate */}
        <div>
          <h2 className="text-xl font-bold text-blue-400 mb-4">General Affiliate Disclosure</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            In addition to Amazon, TechDeals AI may participate in affiliate programs for Flipkart, Best Buy, Newegg, B&H Photo, and other retailers. When you click our links and make a purchase, we may receive a commission at no extra cost to you. Our editorial opinions are never influenced by commissions.
          </p>
        </div>

        <div className="border-t border-[var(--color-glass-border)]" />

        {/* Price Accuracy */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Price & Availability Disclaimer</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            All prices and product availability are accurate at the time of publication. Prices change frequently and TechDeals AI cannot guarantee that prices shown are still valid at the time you view them. Always confirm the final price on the retailer&apos;s website before completing a purchase.
          </p>
        </div>

        <div className="border-t border-[var(--color-glass-border)]" />

        {/* AI Content */}
        <div>
          <h2 className="text-xl font-bold text-purple-400 mb-4">AI-Generated Content Disclaimer</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Some product summaries, pros/cons, and recommendations on TechDeals AI are generated with the assistance of artificial intelligence. While we review and curate AI outputs, we recommend verifying important product specifications directly with the manufacturer or retailer.
          </p>
        </div>

        <div className="border-t border-[var(--color-glass-border)]" />

        {/* Quiz */}
        <div>
          <h2 className="text-xl font-bold text-green-400 mb-4">Quiz Answers Disclaimer</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Quiz answers published on TechDeals AI are intended to help users participate in Amazon, Flipkart, and other promotional quizzes. We are not affiliated with Amazon, Flipkart, or any quiz organiser. Winners are selected by the respective platform. TechDeals AI takes no responsibility for quiz results or prize fulfilment.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
