import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { getStores, getDeals, getCoupons } from "@/lib/data";

export const metadata = {
  title: "All Stores — TechDeals AI",
  description: "Browse deals and coupons from all major tech stores.",
};

export default async function StoresPage() {
  const [stores, deals, coupons] = await Promise.all([
    getStores(),
    getDeals(),
    getCoupons(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeading title="Store Hub" subtitle="Browse deals and coupons from every major retailer." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {stores.map(store => {
          const storeDeals   = deals.filter(d => d.storeId === store.id);
          const storeCoupons = coupons.filter(c => c.storeId === store.id);
          return (
            <Link key={store.id} href={`/store/${store.slug}`}>
              <GlassCard className="h-full hover:border-[var(--color-primary)]/40 transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">🏪</div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-gray-900">{storeDeals.length}</div>
                    <div className="text-xs text-gray-600">Active Deals</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {store.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{store.description}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 font-medium">
                    {storeCoupons.length} Coupon{storeCoupons.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-gray-500 group-hover:text-gray-900 transition-colors">View all deals →</span>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
