import { notFound } from "next/navigation";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProductCard } from "@/components/sections/ProductCard";
import { getBrands, getDealsByBrand } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brands = await getBrands();
  const brand = brands.find(b => b.slug === slug);
  if (!brand) return { title: "Brand Not Found" };
  return {
    title: `${brand.name} Deals — TechDeals AI`,
    description: `Find the best AI-curated ${brand.name} deals available right now.`,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brands = await getBrands();
  const brand = brands.find(b => b.slug === slug);
  if (!brand) notFound();

  const deals = await getDealsByBrand(brand.id);
  const topDeal = [...deals].sort((a, b) => (b.discount || 0) - (a.discount || 0))[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Brand Hero */}
      <GlassCard className="mb-12 !p-8 sm:!p-12 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent -z-0" />
        <div className="text-8xl shrink-0 relative z-10">🏷️</div>
        <div className="flex-1 text-center sm:text-left relative z-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{brand.name}</h1>
          <p className="text-gray-700 text-lg mb-5">{brand.description}</p>
          <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
            <span className="px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 font-semibold text-sm">
              {deals.length} Active Deals
            </span>
            {topDeal && topDeal.discount && topDeal.discount > 0 ? (
              <span className="px-4 py-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold text-sm">
                Up to {topDeal.discount}% Off
              </span>
            ) : null}
          </div>
        </div>
      </GlassCard>

      {/* Deals Grid */}
      <SectionHeading title={`Latest ${brand.name} Deals`} subtitle="AI-curated offers sorted by best discount." />
      {deals.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mt-6 sm:mt-10">
          {[...deals].sort((a, b) => (b.discount || 0) - (a.discount || 0)).map(deal => (
            <ProductCard key={deal.id} product={deal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          No active deals for {brand.name} right now. Check back soon!
        </div>
      )}

      {/* Other Brands */}
      <div className="mt-20 pt-10 border-t border-[var(--color-glass-border)]">
        <SectionHeading title="Other Top Brands" />
        <div className="flex flex-wrap gap-4 mt-8">
          {brands.filter(b => b.id !== brand.id).map(b => (
            <Link key={b.id} href={`/brand/${b.slug}`}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black/5 border border-[var(--color-glass-border)] hover:border-[var(--color-primary)]/40 hover:bg-black/10 transition-all text-gray-900 font-medium text-sm">
              🏷️ {b.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
