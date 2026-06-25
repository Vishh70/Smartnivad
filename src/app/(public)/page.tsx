export const revalidate = 3600; // 1 hour ISR caching

import Link from "next/link";
import {
  ChevronRight,
  Percent,
  CheckCircle2,
  Tag as TagIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { HomeFeedTabs } from "@/components/sections/HomeFeedTabs";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { DealScore } from "@/components/ui/DealScore";
import { ProductCard } from "@/components/sections/ProductCard";
import {
  getFeaturedDeals,
  getHotDeals,
  getLiveDeals,
  getTrendingDeals,
  getCategories,
  getFlashDeals,
  getCouponsPreview,
  getStoresWithLogos,
} from "@/lib/data";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Particles } from "@/components/ui/Particles";

export const metadata = {
  title: "SmartNivad — Find the Best Deals. Save More.",
  description:
    "AI-curated tech deals, reviews, and buying guides. Save money on laptops, phones, gaming, and more.",
};

export default async function HomePage() {
  const [
    featured,
    hot,
    live,
    trending,
    categories,
    flashDeals,
    coupons,
    stores,
  ] = await Promise.all([
    getFeaturedDeals(),
    getHotDeals(),
    getLiveDeals(),
    getTrendingDeals(),
    getCategories(),
    getFlashDeals(),
    getCouponsPreview(),
    getStoresWithLogos(),
  ]);

  const dealOfTheDay = featured[0];

  return (
    <div className="w-full relative overflow-hidden">
      <ScrollProgress />
      {/* ─── Aurora Background ────────────────────────────────────────────── */}
      <div className="aurora-bg">
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-10 sm:pt-32 sm:pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy & CTA */}
          <div className="text-center lg:text-left z-10">
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tighter leading-[1.1]">
              <ScrollReveal delay={200}>Find the Best Deals.</ScrollReveal>{" "}
              <ScrollReveal delay={400}>
                <span className="gradient-text">Save More.</span>
              </ScrollReveal>
            </h1>
            <ScrollReveal delay={600}>
              <p className="text-sm sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-10 font-medium">
                AI-powered product discovery, price tracking, and deal
                recommendations.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={800}>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
                <Link href="/deals" className="w-full sm:w-auto block">
                  <MagneticButton className="w-full">
                    <div className="gradient-btn w-full px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-lg font-bold flex items-center justify-center gap-2">
                      Explore Deals <ChevronRight size={20} />
                    </div>
                  </MagneticButton>
                </Link>
                <Link href="/compare" className="w-full sm:w-auto block">
                  <MagneticButton className="w-full">
                    <div className="w-full px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-lg font-bold text-gray-900 bg-white/50 border border-gray-200 hover:bg-white transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                      Compare Products
                    </div>
                  </MagneticButton>
                </Link>
              </div>
            </ScrollReveal>

            {/* 2. TRUST BADGES */}
            <ScrollReveal delay={1000}>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-500" />
                  <AnimatedCounter value={50000} suffix="+" /> Monthly Users
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-500" /> Verified
                  Deals
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-500" /> Amazon &
                  Flipkart Partners
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-500" /> AI
                  Powered
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Featured Product Card */}
          {dealOfTheDay && (
            <ScrollReveal
              delay={1200}
              className="relative z-10 flex justify-center lg:justify-end"
            >
              <div className="animate-float w-full max-w-md">
                <GlassCard className="w-full p-6 sm:p-8 hover:shadow-[0_25px_60px_rgba(37,99,235,0.18)] transition-all duration-500 group border border-white/80">
                  <div className="relative h-64 mb-6 bg-white/40 rounded-2xl p-4 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={dealOfTheDay.imageUrl}
                      alt={dealOfTheDay.title}
                      className="max-h-full object-contain drop-shadow-xl group-hover:scale-[1.08] transition-transform duration-400 will-change-transform"
                    />
                    {dealOfTheDay.discount > 0 && (
                      <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <Percent size={14} /> {dealOfTheDay.discount}% OFF
                      </span>
                    )}
                    {/* AI Score */}
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md rounded-xl p-1 shadow-sm">
                      <DealScore
                        discount={dealOfTheDay.discount}
                        rating={dealOfTheDay.rating}
                        hasBrand={!!dealOfTheDay.brand}
                        createdAt={dealOfTheDay.createdAt}
                        storeName={dealOfTheDay.store?.name}
                        size="sm"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                    {dealOfTheDay.title}
                  </h3>
                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-4xl font-black text-gray-900">
                      ₹{dealOfTheDay.currentPrice}
                    </span>
                    {dealOfTheDay.originalPrice > 0 && (
                      <span className="text-lg text-gray-500 line-through mb-1 font-semibold">
                        ₹{dealOfTheDay.originalPrice}
                      </span>
                    )}
                  </div>
                  <Link href={`/product/${dealOfTheDay.slug}`}>
                    <MagneticButton className="w-full">
                      <div className="w-full gradient-btn py-4 rounded-xl font-bold text-lg text-center">
                        View AI Analysis
                      </div>
                    </MagneticButton>
                  </Link>
                </GlassCard>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-24 pb-16 sm:pb-32">
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 3. TRENDING DEALS (Tabbed Feed)                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <ScrollReveal>
          <section id="feed" className="pt-8">
            <SectionHeading
              title="Trending Deals"
              subtitle="Real-time verified discounts across top stores."
            />
            <div className="mt-10">
              <HomeFeedTabs
                hotDeals={hot}
                liveDeals={live}
                trendingDeals={trending}
              />
            </div>
            <div className="text-center mt-12 flex justify-center">
              <Link href="/deals">
                <MagneticButton>
                  <div className="px-8 py-4 rounded-full bg-white text-gray-900 font-bold border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    View All Deals
                  </div>
                </MagneticButton>
              </Link>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 4. FLASH DEALS (Countdown)                                        */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {flashDeals.length > 0 && (
          <ScrollReveal>
            <section id="flash-deals">
              <SectionHeading
                title="⚡ Flash Deals"
                subtitle="These deals expire soon — grab them before they're gone!"
              />
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-6 sm:mt-10">
                {flashDeals.map((deal, idx) => (
                  <ScrollReveal key={deal.id} delay={idx * 100}>
                    <div className="flash-deal rounded-3xl h-full">
                      <ProductCard product={deal} />
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 5. AI RECOMMENDATIONS                                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {featured.length > 0 && (
          <ScrollReveal>
            <section id="ai-picks">
              <SectionHeading
                title="AI Recommendations"
                subtitle="Top picks selected by our AI based on value, quality, and trust."
              />
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-6 sm:mt-10">
                {featured.slice(0, 8).map((deal, idx) => (
                  <ScrollReveal key={deal.id} delay={idx * 100}>
                    <ProductCard product={deal} />
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 6. TOP CATEGORIES (Premium Icons)                                 */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <ScrollReveal>
          <section id="categories">
            <SectionHeading
              title="Top Categories"
              subtitle="Browse deals by your favorite tech categories."
            />
            <div className="flex overflow-x-auto snap-x hide-scrollbar md:grid md:grid-cols-4 gap-6 mt-12 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((category, idx) => (
                <ScrollReveal
                  key={category.id}
                  delay={idx * 50}
                  className="group shrink-0 w-[240px] md:w-auto snap-center h-full"
                >
                  <Link href={`/deals?category=${category.slug}`}>
                    <GlassCard className="text-center hover:border-blue-200 transition-all !p-8 h-full flex flex-col items-center justify-center gap-5">
                      <CategoryIcon iconName={category.icon} />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm font-semibold text-gray-500">
                          Explore deals{" "}
                          <ChevronRight size={14} className="inline" />
                        </p>
                      </div>
                    </GlassCard>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 7. BRAND MARQUEE (Trusted Partners)                               */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <ScrollReveal>
          <BrandMarquee stores={stores} />
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 8. COUPONS PREVIEW                                                */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {coupons.length > 0 && (
          <ScrollReveal>
            <section id="coupons">
              <SectionHeading
                title="Latest Coupons"
                subtitle="Save even more with exclusive coupon codes."
              />
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-6 sm:mt-10">
                {coupons.map((coupon, idx) => (
                  <ScrollReveal
                    key={coupon.id}
                    delay={idx * 100}
                    className="h-full"
                  >
                    <GlassCard className="!p-5 hover:border-blue-200 transition-all flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-black">
                            {coupon.discountText}
                          </span>
                          {coupon.store && (
                            <span className="text-xs text-gray-500 font-medium">
                              {coupon.store.name}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                          {coupon.title}
                        </h3>
                      </div>
                      <div className="mt-4">
                        {coupon.code ? (
                          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 border border-dashed border-gray-300">
                            <TagIcon size={14} className="text-gray-400" />
                            <code className="text-sm font-black text-gray-800 flex-1">
                              {coupon.code}
                            </code>
                          </div>
                        ) : (
                          <MagneticButton className="w-full">
                            <a
                              href={coupon.affiliateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-center gradient-btn py-2.5 rounded-xl text-sm font-bold"
                            >
                              Activate Deal
                            </a>
                          </MagneticButton>
                        )}
                      </div>
                    </GlassCard>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center mt-10 flex justify-center">
                <Link href="/coupons">
                  <MagneticButton>
                    <div className="px-8 py-4 rounded-full bg-white text-gray-900 font-bold border border-gray-200 shadow-sm hover:shadow-md transition-all">
                      View All Coupons
                    </div>
                  </MagneticButton>
                </Link>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 9. NEWSLETTER                                                     */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <ScrollReveal>
          <section id="newsletter">
            <div className="max-w-4xl mx-auto relative rounded-[2.5rem] overflow-hidden border border-white/60 p-12 text-center bg-white/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              {/* Aurora + Particles Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 -z-20" />
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md -z-10" />
              <Particles />

              <div className="relative z-10">
                <div className="text-5xl mb-6">📬</div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                  Never Miss a Price Drop
                </h2>
                <p className="text-gray-600 mb-10 max-w-xl mx-auto text-lg font-medium">
                  Join <AnimatedCounter value={50000} suffix="+" /> tech
                  enthusiasts. Get the best AI-verified deals and tech buying
                  guides delivered weekly.
                </p>
                <NewsletterForm />
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
