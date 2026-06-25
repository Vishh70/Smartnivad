import { notFound } from "next/navigation";
import { getCategories, getDealsByCategory } from "@/lib/data";
import { ProductCard } from "@/components/sections/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Laptop, Smartphone, Headphones, Gamepad2, Tag } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} Deals & Offers — TechDeals AI`,
    description: category.description ?? `Find the best AI-curated deals on ${category.name}.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const categoryDeals = await getDealsByCategory(category.id);

  const getIcon = (name: string | null) => {
    switch (name) {
      case "Laptop": return <Laptop size={48} />;
      case "Smartphone": return <Smartphone size={48} />;
      case "Headphones": return <Headphones size={48} />;
      case "Gamepad2": return <Gamepad2 size={48} />;
      default: return <Tag size={48} />;
    }
  };

  return (
    <div className="w-full min-min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Category Header Banner */}
      <div className="mb-12 text-center p-12 rounded-3xl bg-[rgba(255,255,255,0.03)] border border-[var(--color-glass-border)] backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 blur-2xl -z-10" />
        <div className="flex justify-center mb-4 text-gray-700">
          {getIcon(category.icon)}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          {category.name} Deals
        </h1>
        <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">{category.description}</p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button className="px-6 py-2 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/50 hover:bg-[#25D366]/30 transition-all text-sm font-medium">
            📲 Join WhatsApp Alerts
          </button>
          <button className="px-6 py-2 rounded-full bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/30 transition-all text-sm font-medium">
            ✈️ Join Telegram Channel
          </button>
        </div>
      </div>

      <SectionHeading title={`Latest in ${category.name}`} subtitle={`${categoryDeals.length} deals available.`} />

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-8 sm:mt-12">
        {categoryDeals.length > 0 ? (
          categoryDeals.map(deal => (
            <ProductCard key={deal.id} product={deal} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-20">
            No deals found for this category right now. Check back soon!
          </div>
        )}
      </div>

      {categoryDeals.length > 0 && (
        <div className="mt-16 flex justify-center items-center gap-2">
          <button disabled className="px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] text-gray-500 cursor-not-allowed border border-[var(--color-glass-border)]">
            &laquo; Previous
          </button>
          <button className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium">1</button>
          <button className="px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] text-gray-700 hover:bg-[rgba(255,255,255,0.1)] border border-[var(--color-glass-border)] transition-colors">
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
}
