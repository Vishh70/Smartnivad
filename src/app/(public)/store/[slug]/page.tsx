import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { ProductCard } from "@/components/sections/ProductCard";
import { getStores, getDealsByStore, getCoupons } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stores = await getStores();
  const store = stores.find((s) => s.slug === slug);
  if (!store) return { title: "Store Not Found" };
  return {
    title: `${store.name} Deals & Coupons — SmartNivad`,
    description: `Find the best deals and verified coupon codes for ${store.name}.`,
  };
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stores = await getStores();
  const store = stores.find((s) => s.slug === slug);
  if (!store) notFound();

  const [deals, allCoupons] = await Promise.all([
    getDealsByStore(store.id),
    getCoupons(),
  ]);

  const coupons = allCoupons.filter((c) => c.storeId === store.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 pb-12">
      {/* Store Hero */}
      <GlassCard className="mb-12 !p-8 sm:!p-12 flex flex-col sm:flex-row items-center gap-8">
        <div className="text-8xl shrink-0">🏪</div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {store.name}
          </h1>
          <p className="text-gray-700 text-lg mb-4">{store.description}</p>
          <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
            <span className="px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 font-semibold text-sm">
              {deals.length} Active Deals
            </span>
            <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-semibold text-sm">
              {coupons.length} Coupons
            </span>
          </div>
        </div>
        {store.website && (
          <a href={store.website} target="_blank" rel="noopener noreferrer">
            <GlowButton
              variant="secondary"
              className="flex items-center gap-2 shrink-0"
            >
              <ExternalLink size={16} /> Visit Store
            </GlowButton>
          </a>
        )}
      </GlassCard>

      {/* Active Coupons */}
      {coupons.length > 0 && (
        <div className="mb-16">
          <SectionHeading
            title={`${store.name} Coupons`}
            subtitle="Verified promo codes — click to copy."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {coupons.map((coupon) => (
              <GlassCard key={coupon.id} className="!p-0 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-bold text-gray-900 leading-snug flex-1 mr-3 line-clamp-2">
                      {coupon.title}
                    </h3>
                    <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg border border-green-400/20 shrink-0">
                      {coupon.discountText}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <div className="flex-1 flex items-center justify-between px-4 py-2 rounded-xl border-2 border-dashed border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5 font-mono text-sm font-bold text-gray-900 tracking-widest">
                      {coupon.code}
                    </div>
                    <Link
                      href="/coupons"
                      className="flex items-center justify-center w-11 rounded-xl bg-[var(--color-primary)] text-white text-xs hover:bg-purple-500 transition-colors font-semibold"
                    >
                      Copy
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Active Deals */}
      <div>
        <SectionHeading
          title={`Latest ${store.name} Deals`}
          subtitle="All active offers from this store."
        />
        {deals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mt-6 sm:mt-10">
            {deals.map((deal) => (
              <ProductCard key={deal.id} product={deal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            No deals from this store right now.
          </div>
        )}
      </div>

      {/* Other Stores */}
      <div className="mt-20 pt-10 border-t border-[var(--color-glass-border)]">
        <SectionHeading title="Explore Other Stores" />
        <div className="flex flex-wrap gap-4 mt-8">
          {stores
            .filter((s) => s.id !== store.id)
            .map((s) => (
              <Link
                key={s.id}
                href={`/store/${s.slug}`}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black/5 border border-[var(--color-glass-border)] hover:border-[var(--color-primary)]/40 hover:bg-black/10 transition-all text-gray-900 font-medium text-sm"
              >
                🏪 {s.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
