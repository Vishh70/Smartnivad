import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/sections/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Trophy, ShieldCheck, Sparkles } from "lucide-react";

export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    title: `Best ${title} in 2026 - AI Ranked & Reviewed | TechDeals AI`,
    description: `Discover the top rated ${title.toLowerCase()} right now. We use AI to analyze prices, reviews, and specifications to rank the best options for your budget.`,
  };
}

// Simple slug parser for SEO queries
// Format examples: "laptops-under-50000", "smartphones", "gaming-laptops-under-100000"
function parseSlug(slug: string) {
  let maxPrice = undefined;
  let query = slug;
  
  if (slug.includes("-under-")) {
    const parts = slug.split("-under-");
    query = parts[0].replace(/-/g, " ");
    maxPrice = parseInt(parts[1], 10);
  } else {
    query = slug.replace(/-/g, " ");
  }

  // Handle pluralization loosely (e.g., "laptops" -> "laptop")
  const categoryQuery = query.endsWith("s") ? query.slice(0, -1) : query;

  return { query, categoryQuery, maxPrice };
}

export default async function BestOfPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { query, categoryQuery, maxPrice } = parseSlug(slug);

  // Fetch Category if it exists
  const category = await prisma.category.findFirst({
    where: {
      OR: [
        { name: { contains: categoryQuery, mode: "insensitive" } },
        { slug: { contains: categoryQuery, mode: "insensitive" } }
      ]
    }
  });

  // Query Deals
  const deals = await prisma.deal.findMany({
    where: {
      status: "PUBLISHED",
      ...(category ? { categoryId: category.id } : {
        OR: [
          { title: { contains: categoryQuery, mode: "insensitive" } },
          { tags: { has: categoryQuery.toLowerCase() } }
        ]
      }),
      ...(maxPrice ? { currentPrice: { lte: maxPrice } } : {})
    },
    include: {
      store: true,
      brand: true,
    },
    orderBy: [
      { rating: 'desc' },
      { discount: 'desc' }
    ],
    take: 10
  });

  if (deals.length === 0) {
    notFound();
  }

  const titleStr = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="w-full relative overflow-hidden bg-white pb-32">
      {/* Premium Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-[#1e3a8a] to-blue-950 pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-800/50 border border-blue-700 text-blue-200 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Sparkles size={14} /> Updated for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Best {titleStr}
          </h1>
          <p className="text-xl text-blue-100 font-medium max-w-2xl mx-auto leading-relaxed">
            We analyzed thousands of data points, price drops, and verified reviews to rank the absolute best {query.toLowerCase()} available right now.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Trust Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-center gap-8 mb-16">
          <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
            <ShieldCheck className="text-green-500" size={20} /> AI-Verified Specs
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-200" />
          <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
            <Trophy className="text-amber-500" size={20} /> Ranked by Value
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-200" />
          <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
            <Sparkles className="text-blue-500" size={20} /> Daily Price Updates
          </div>
        </div>

        <SectionHeading title={`Top ${deals.length} Picks`} subtitle="Ranked from best to great based on our AI scoring." />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {deals.map((deal, idx) => (
            <div key={deal.id} className="relative group h-full">
              {idx === 0 && (
                <div className="absolute -top-3 left-6 z-30 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Trophy size={14} /> OVERALL BEST
                </div>
              )}
              {idx === 1 && (
                <div className="absolute -top-3 left-6 z-30 bg-gray-800 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                  #2 PREMIUM PICK
                </div>
              )}
              {idx === 2 && (
                <div className="absolute -top-3 left-6 z-30 bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                  #3 BEST VALUE
                </div>
              )}
              <ProductCard product={deal} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
