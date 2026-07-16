export const revalidate = 3600; // 1 hour ISR caching

import { notFound } from "next/navigation";
import { Star, CheckCircle, XCircle, Share2, Info, Tag } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/sections/ProductCard";
import { DealScoreDetailed } from "@/components/ui/DealScore";
import dynamic from "next/dynamic";
import { PriceDropAlert } from "@/components/ui/PriceDropAlert";
import { SafeImage } from "@/components/ui/SafeImage";

const PriceHistoryChart = dynamic(() =>
  import("@/components/ui/PriceHistoryChart").then(
    (mod) => mod.PriceHistoryChart,
  ),
);
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { getDealBySlug, getDealsByCategory } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getDealBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title:
      product.seoTitle ||
      `${product.title} - Best Deals & Reviews | SmartNivad`,
    description: product.seoDesc || product.description,
    keywords: product.tags?.length ? product.tags : undefined,
    openGraph: {
      title: product.seoTitle || product.title,
      description: product.seoDesc || product.description,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle || product.title,
      description: product.seoDesc || product.description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getDealBySlug(slug);

  if (!product) notFound();

  const relatedProductsRaw = await getDealsByCategory(product.categoryId);
  const relatedProducts = relatedProductsRaw
    .filter((p) => p.id !== product.id)
    .slice(0, 8);

  const prosList = product.pros ? product.pros.split("\n").filter(Boolean) : [];
  const consList = product.cons ? product.cons.split("\n").filter(Boolean) : [];

  const priceLabel = `₹${formatNumber(product.currentPrice)}`;
  const origLabel = product.originalPrice
    ? `₹${formatNumber(product.originalPrice)}`
    : "";
  const categoryName = product.category?.name ?? "Tech";
  const hasExpiry =
    product.expiresAt && new Date(product.expiresAt).getTime() > Date.now();

  return (
    <div className="min-h-screen py-10 pb-36 lg:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.title,
            image: product.imageUrl,
            description: product.aiSummary ?? product.description,
            brand: {
              "@type": "Brand",
              name: product.brand?.name ?? "Unknown",
            },
            offers: {
              "@type": "Offer",
              url: product.affiliateUrl,
              priceCurrency: "INR",
              price: product.currentPrice,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              bestRating: "5",
              worstRating: "1",
              ratingCount: product.views || 1,
            },
          }),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Image (Sticky on Desktop) */}
          <div className="lg:col-span-5 h-fit lg:sticky lg:top-24 space-y-4 sm:space-y-6">
            <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-white/60 border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.06)] group p-4 sm:p-8 flex items-center justify-center backdrop-blur-xl">
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-50 text-red-600 border border-red-200 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md z-10 flex items-center gap-1">
                <Tag size={12} /> {product.dealType ?? "Deal"}
              </div>
              <button
                aria-label="Share deal"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-500 hover:text-blue-600 p-3 rounded-full backdrop-blur-md transition-all z-10 shadow-sm"
              >
                <Share2 size={20} />
              </button>
              {product.imageUrl?.startsWith("http") ? (
                <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-105">
                  <SafeImage
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center text-gray-400 w-full h-full font-medium">
                  No Image Available
                </div>
              )}
            </div>

            {/* Social Sharing */}
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/20 rounded-2xl py-3.5 font-bold text-sm transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                Tweet Deal
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/20 rounded-2xl py-3.5 font-bold text-sm transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.201.535 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.564-10.563 5.826 0 10.564 4.738 10.564 10.561s-4.738 10.563-10.564 10.563z" />
                </svg>
                WhatsApp
              </button>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-7 flex flex-col pt-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-tight tracking-tight">
              {product.title}
            </h1>

            <div className="flex items-center space-x-3 mb-6">
              <div className="flex bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl border border-amber-200 items-center">
                <Star
                  size={16}
                  className="fill-amber-400 text-amber-400 mr-1"
                />
                <span className="font-bold text-sm">{product.rating}</span>
              </div>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-500 font-medium">
                AI-Verified Review
              </span>
            </div>

            {/* AI Deal Score */}
            <div className="mb-6 bg-white/60 backdrop-blur-xl border border-gray-100 rounded-2xl p-5 shadow-sm">
              <DealScoreDetailed
                discount={product.discount}
                rating={product.rating}
                hasBrand={!!product.brand}
                createdAt={product.createdAt}
                storeName={product.store?.name}
              />
            </div>

            {/* Price Box */}
            <GlassCard className="!p-6 mb-6 border-l-4 border-l-blue-600">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider font-bold">
                    Deal Price
                  </p>
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-2">
                    <span className="text-3xl sm:text-4xl font-black text-gray-900">
                      {priceLabel}
                    </span>
                    {origLabel && (
                      <span className="text-base sm:text-xl text-gray-400 line-through">
                        {origLabel}
                      </span>
                    )}
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                      {product.discount}% OFF
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 text-blue-600 text-sm px-4 py-2 rounded-xl flex items-center gap-2 font-medium">
                  <Info size={16} />
                  <span>External affiliate link</span>
                </div>
              </div>

              {/* Countdown */}
              {hasExpiry && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <CountdownTimer
                    expiresAt={product.expiresAt!}
                    variant="prominent"
                  />
                </div>
              )}

              <div className="mt-6">
                {product.affiliateUrl !== "#" ? (
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-2xl gradient-btn px-6 py-5 text-center text-xl font-bold tracking-wide shadow-xl hover:-translate-y-1 transition-all"
                  >
                    GET DEAL NOW
                  </a>
                ) : (
                  <p className="rounded-xl bg-gray-50 px-4 py-3 text-center text-sm text-gray-500 font-medium">
                    This deal link is not available yet.
                  </p>
                )}
                <p className="text-xs text-center text-gray-400 mt-3">
                  We earn from qualifying purchases. Prices subject to change.
                </p>
              </div>
            </GlassCard>

            {/* Price History Chart & Alert */}
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PriceHistoryChart
                  dealId={product.id}
                  currentPrice={product.currentPrice}
                />
              </div>
              <div>
                <PriceDropAlert
                  dealId={product.id}
                  currentPrice={product.currentPrice}
                />
              </div>
            </div>

            {/* AI Summary Box */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="gradient-text">✦ AI Summary</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 shadow-sm">
                {product.aiSummary ?? product.description}
              </p>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <GlassCard className="!p-6 !bg-green-50/50 !border-green-200">
                <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                  <CheckCircle className="mr-2" size={20} /> Why Buy It
                </h3>
                <ul className="space-y-3">
                  {prosList.map((pro, idx) => (
                    <li
                      key={idx}
                      className="text-gray-700 flex items-start font-medium"
                    >
                      <span className="text-green-500 mr-3 mt-0.5 font-bold">
                        ✓
                      </span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard className="!p-6 !bg-red-50/50 !border-red-200">
                <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center">
                  <XCircle className="mr-2" size={20} /> Reasons to Avoid
                </h3>
                <ul className="space-y-3">
                  {consList.map((con, idx) => (
                    <li
                      key={idx}
                      className="text-gray-700 flex items-start font-medium"
                    >
                      <span className="text-red-500 mr-3 mt-0.5 font-bold">
                        ×
                      </span>
                      {con}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            {/* Specifications */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                About This Product
              </h3>
              <div className="w-full border border-gray-100 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-xl shadow-sm">
                <table className="w-full text-left text-gray-700">
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <th className="px-6 py-4 font-bold w-1/3 text-gray-500 text-sm">
                        Brand
                      </th>
                      <td className="px-6 py-4 font-semibold">
                        {product.brand?.name ?? "—"}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <th className="px-6 py-4 font-bold w-1/3 text-gray-500 text-sm">
                        Category
                      </th>
                      <td className="px-6 py-4 font-semibold capitalize">
                        {categoryName}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <th className="px-6 py-4 font-bold w-1/3 text-gray-500 text-sm">
                        Rating
                      </th>
                      <td className="px-6 py-4 font-semibold">
                        {product.rating} / 5.0
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <th className="px-6 py-4 font-bold w-1/3 text-gray-500 text-sm">
                        Total Views
                      </th>
                      <td className="px-6 py-4 font-semibold">
                        {formatNumber(product.views)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Related Deals */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-16 border-t border-gray-100">
            <SectionHeading
              title="Related Deals"
              subtitle="Other popular offers right now."
            />
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-8 sm:mt-12">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-[calc(70px+env(safe-area-inset-bottom))] lg:bottom-0 left-0 w-full z-[60] bg-white/90 backdrop-blur-2xl border-t border-gray-200 p-3 sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4">
            <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-gray-50">
              {product.imageUrl?.startsWith("http") && (
                <SafeImage
                  src={product.imageUrl}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <p className="text-gray-900 font-bold line-clamp-1">
                {product.title}
              </p>
              <p className="text-blue-600 font-black text-lg">{priceLabel}</p>
            </div>
          </div>
          <div className="flex-1 sm:flex-none flex justify-end">
            {product.affiliateUrl !== "#" && (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl gradient-btn px-8 py-3 text-center text-lg font-bold shadow-lg sm:w-64"
              >
                GET DEAL
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
