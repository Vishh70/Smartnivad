import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";

export const metadata = {
  title: "About TechDeals AI — Our Mission",
  description: "TechDeals AI is an AI-powered deal discovery platform helping you find the best tech products and prices.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="text-6xl mb-6">🤖</div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">About <span className="text-[var(--color-primary)]">TechDeals AI</span></h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          We&apos;re on a mission to make smart tech buying simple — powered by artificial intelligence.
        </p>
      </div>

      {/* Mission */}
      <GlassCard className="mb-8 !p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          TechDeals AI was built because finding a genuinely good tech deal is hard. There&apos;s noise everywhere — fake discounts, expired coupons, and biased reviews. We use AI to cut through the clutter, surface real savings, and help you make confident buying decisions.
        </p>
      </GlassCard>

      {/* How it Works */}
      <GlassCard className="mb-8 !p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { emoji: "🔎", title: "We Discover", desc: "Our AI scans thousands of products across Amazon, Flipkart, Best Buy, Newegg, and more every day." },
            { emoji: "🧠", title: "We Analyse", desc: "AI evaluates real vs. inflated prices, rating authenticity, spec value, and deal freshness." },
            { emoji: "✅", title: "We Surface", desc: "Only genuinely good deals make it to you — with AI summaries, pros/cons, and verified affiliate links." },
          ].map(s => (
            <div key={s.title} className="text-center p-6 rounded-2xl bg-white/3 border border-[var(--color-glass-border)]">
              <div className="text-4xl mb-3">{s.emoji}</div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { value: "50K+",  label: "Deals Curated" },
          { value: "200+",  label: "Brands Tracked" },
          { value: "5+",    label: "Major Stores" },
          { value: "Daily", label: "Quiz Answers" },
        ].map(s => (
          <GlassCard key={s.label} className="text-center !py-6">
            <div className="text-3xl font-black text-[var(--color-primary)] mb-1">{s.value}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wider">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Affiliate Disclosure */}
      <GlassCard className="mb-8 !p-8 border-orange-500/20 bg-orange-500/5">
        <h2 className="text-xl font-bold text-orange-400 mb-3">Affiliate Disclosure</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          TechDeals AI participates in affiliate programs including Amazon Associates, Flipkart Affiliate, and others. When you click a deal link and make a purchase, we may earn a small commission at no extra cost to you. This helps us keep the platform free and AI-powered. We never compromise on deal quality for commission reasons.
        </p>
      </GlassCard>

      {/* CTA */}
      <div className="text-center">
        <Link href="/deals"><GlowButton variant="primary">Explore Deals</GlowButton></Link>
      </div>
    </div>
  );
}
