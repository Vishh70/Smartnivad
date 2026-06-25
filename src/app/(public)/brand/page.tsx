import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { getBrands, getDeals } from "@/lib/data";

export const metadata = {
  title: "All Brands — TechDeals AI",
  description: "Browse deals from all major tech brands.",
};

export default async function BrandsPage() {
  const [brands, deals] = await Promise.all([
    getBrands(),
    getDeals(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeading title="Brand Hub" subtitle="Find the best deals from your favourite tech brands." />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-12">
        {brands.map(brand => {
          const brandDeals = deals.filter(d => d.brandId === brand.id);
          return (
            <Link key={brand.id} href={`/brand/${brand.slug}`}>
              <GlassCard className="text-center hover:border-[var(--color-primary)]/40 transition-all group h-full">
                <div className="text-5xl mb-3">🏷️</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[var(--color-primary)] transition-colors">{brand.name}</h3>
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">{brand.description}</p>
                <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full border border-[var(--color-primary)]/20">
                  {brandDeals.length} Deal{brandDeals.length !== 1 ? "s" : ""}
                </span>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
