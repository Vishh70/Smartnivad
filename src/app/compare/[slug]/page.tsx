import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChevronLeft, Trophy, Check, X, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Cache for 24 hours to ensure high SEO performance
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugs = slug.split("-vs-");
  if (slugs.length !== 2) return { title: "Compare Products - TechDeals AI" };

  return {
    title: `${slugs[0].replace(/-/g, ' ').toUpperCase()} vs ${slugs[1].replace(/-/g, ' ').toUpperCase()} - Which is better? | TechDeals AI`,
    description: `Comprehensive AI comparison between ${slugs[0].replace(/-/g, ' ')} and ${slugs[1].replace(/-/g, ' ')}. We compare battery, display, camera, performance, and value.`,
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugs = slug.split("-vs-");
  
  if (slugs.length !== 2) {
    notFound();
  }

  const [product1Slug, product2Slug] = slugs;

  const [product1, product2] = await Promise.all([
    prisma.deal.findUnique({ where: { slug: product1Slug }, include: { brand: true, store: true } }),
    prisma.deal.findUnique({ where: { slug: product2Slug }, include: { brand: true, store: true } })
  ]);

  if (!product1 || !product2) {
    notFound();
  }

  // Attempt to find a cached comparison
  let comparison = await prisma.comparisonSEO.findUnique({
    where: { slug }
  });

  // If no cached comparison exists, we generate one (mocked here for demo, normally calls Gemini)
  if (!comparison) {
    // Generate AI result JSON
    const aiResult = {
      winnerId: product1.rating >= product2.rating ? product1.id : product2.id,
      categories: [
        {
          name: "Display",
          p1Score: 90, p1Text: "Bright and vibrant OLED.",
          p2Score: 85, p2Text: "Standard AMOLED display.",
        },
        {
          name: "Performance",
          p1Score: 95, p1Text: "Industry-leading chipset.",
          p2Score: 92, p2Text: "Very fast, minimal lag.",
        },
        {
          name: "Battery Life",
          p1Score: 80, p1Text: "Average 1-day battery life.",
          p2Score: 88, p2Text: "Excellent endurance, 1.5 days.",
        },
        {
          name: "Value for Money",
          p1Score: product1.discount > 10 ? 95 : 85, p1Text: "Great discount currently available.",
          p2Score: product2.discount > 10 ? 95 : 85, p2Text: "Fair price for the specs.",
        }
      ]
    };

    comparison = await prisma.comparisonSEO.create({
      data: {
        slug,
        product1Id: product1.id,
        product2Id: product2.id,
        aiResult,
        winnerId: aiResult.winnerId,
      }
    });
  }

  const result = comparison.aiResult as any;
  const winner = result.winnerId === product1.id ? product1 : product2;

  return (
    <div className="w-full relative overflow-hidden bg-gray-50 pb-32">
      {/* Aurora Header */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-50 to-gray-50 -z-10" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <Link href="/compare" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ChevronLeft size={16} /> Back to Comparisons
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            {product1.title.split(" ").slice(0, 3).join(" ")} <span className="text-gray-400 font-medium px-2">vs</span> {product2.title.split(" ").slice(0, 3).join(" ")}
          </h1>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            Our AI analyzed specs, reviews, and price history to determine the best choice.
          </p>
        </div>

        {/* Side-by-Side Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[product1, product2].map((p, idx) => {
            const isWinner = winner.id === p.id;
            return (
              <GlassCard key={p.id} className={`p-8 relative ${isWinner ? 'ring-4 ring-blue-500 shadow-2xl scale-[1.02]' : 'opacity-90'}`}>
                {isWinner && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-black shadow-lg flex items-center gap-2">
                    <Trophy size={18} /> OVERALL WINNER
                  </div>
                )}
                <div className="relative w-full h-64 bg-white rounded-xl mb-6 p-4">
                  <Image src={p.imageUrl} alt={p.title} fill className="object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">{p.title}</h2>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-black text-blue-600">₹{p.currentPrice}</span>
                  {p.originalPrice > p.currentPrice && (
                    <span className="text-gray-400 line-through font-bold">₹{p.originalPrice}</span>
                  )}
                </div>
                <a href={p.affiliateUrl} target="_blank" rel="noopener noreferrer" className={`block w-full text-center py-4 rounded-xl font-bold text-lg transition-all ${isWinner ? 'gradient-btn text-white shadow-xl hover:shadow-2xl' : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50'}`}>
                  Get {isWinner ? 'Winner' : 'Alternative'}
                </a>
              </GlassCard>
            );
          })}
        </div>

        {/* Detailed AI Category Breakdown */}
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="AI Comparison Breakdown" subtitle="How they stack up across key categories." />
          
          <div className="mt-12 space-y-6">
            {result.categories.map((cat: any, i: number) => {
              const p1Wins = cat.p1Score >= cat.p2Score;
              return (
                <div key={i} className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">{cat.name}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 -translate-x-1/2" />
                    
                    {/* Product 1 Side */}
                    <div className={`text-center ${p1Wins ? '' : 'opacity-60'}`}>
                      <div className="text-4xl font-black text-gray-900 mb-2">{cat.p1Score}<span className="text-xl text-gray-400">/100</span></div>
                      <p className="text-sm text-gray-600 font-medium leading-relaxed">{cat.p1Text}</p>
                      {p1Wins && <div className="mt-4 inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600"><Check size={18} strokeWidth={3} /></div>}
                    </div>

                    {/* Product 2 Side */}
                    <div className={`text-center ${!p1Wins ? '' : 'opacity-60'}`}>
                      <div className="text-4xl font-black text-gray-900 mb-2">{cat.p2Score}<span className="text-xl text-gray-400">/100</span></div>
                      <p className="text-sm text-gray-600 font-medium leading-relaxed">{cat.p2Text}</p>
                      {!p1Wins && <div className="mt-4 inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600"><Check size={18} strokeWidth={3} /></div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
