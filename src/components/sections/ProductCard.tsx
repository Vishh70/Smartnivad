"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Heart } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { DealScore } from "@/components/ui/DealScore";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { formatNumber } from "@/lib/format";
import { useSession, signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { toggleSavedDeal } from "@/app/(public)/actions";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

interface DealCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string;
    image_url?: string;
    currentPrice?: number;
    originalPrice?: number;
    price_text?: string;
    discount?: number;
    rating: number;
    affiliateUrl?: string;
    affiliate_link?: string;
    dealType?: string;
    isTrending?: boolean;
    createdAt?: Date | string;
    storeId?: string;
    expiresAt?: Date | string | null;
    store?: { name: string } | null;
    brand?: { name: string } | null;
  };
}

function freshness(createdAt?: Date | string): string {
  if (!createdAt) return "";
  const ms = Date.now() - new Date(createdAt).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  return `${Math.floor(hr / 24)} d ago`;
}

const DEAL_TYPE_STYLES: Record<string, string> = {
  HOT:  "bg-red-500 text-white",
  LIVE: "bg-green-500 text-white",
  EXPIRED: "bg-gray-400 text-white",
};

export function ProductCard({ product, initialSaved = false }: DealCardProps & { initialSaved?: boolean }) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      signIn("google");
      return;
    }
    setIsSaved(!isSaved);
    startTransition(async () => {
      const res = await toggleSavedDeal(product.id);
      if (!res?.success) {
        setIsSaved(isSaved);
      }
    });
  };

  const imageUrl    = product.imageUrl || product.image_url || "";
  const affiliateUrl = product.affiliateUrl || product.affiliate_link || "#";
  const priceLabel  = product.currentPrice
    ? `₹${formatNumber(product.currentPrice)}`
    : product.price_text || "Check Price";
  const origLabel   = product.originalPrice
    ? `₹${formatNumber(product.originalPrice)}`
    : undefined;
  const discPct     = product.discount ?? 0;
  const dealBadge   = product.dealType as string | undefined;
  const ago         = freshness(product.createdAt);
  const hasExpiry   = product.expiresAt && new Date(product.expiresAt).getTime() > Date.now();

  return (
    <SpotlightCard className="h-full rounded-2xl">
      <GlassCard className="product-card flex flex-col h-full group relative overflow-hidden !border-none !shadow-none !p-3 sm:!p-4 md:!p-6">
        {/* Discount Badge */}
        {discPct > 0 && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md">
            -{discPct}%
          </div>
        )}

        {/* Deal Type Badge */}
        {dealBadge && (
          <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md ${DEAL_TYPE_STYLES[dealBadge] ?? "bg-gray-500 text-white"}`}>
            {dealBadge}
          </div>
        )}

        <div className="absolute top-9 sm:top-12 right-2 sm:right-3 z-30 flex gap-1">
          <button
            aria-label="Save to wishlist"
            className={`bg-white/90 backdrop-blur-md p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full shadow-sm transition-colors duration-300 ${isSaved ? "text-red-500" : "text-gray-400"}`}
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? (
              <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart size={13} className={isSaved ? "fill-current" : ""} />
            )}
          </button>
        </div>

        <Link href={`/product/${product.slug}`} className="flex-1 flex flex-col cursor-pointer">
          {/* Image - Compact on mobile */}
          <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden mb-2 sm:mb-4 bg-gray-50">
            {imageUrl.startsWith("http") ? (
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-contain p-2"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADwAQCdASoKAAoAAgA0p3DdpsW0r+QA/v2oP/5wB/84A/78IAAA"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs font-medium">
                No Image
              </div>
            )}
            {/* AI Score overlay */}
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 z-10">
              <div className="bg-white/90 backdrop-blur-md rounded-lg p-0.5 sm:p-1 shadow-sm">
                <DealScore
                  discount={discPct}
                  rating={product.rating}
                  hasBrand={!!product.brand}
                  createdAt={product.createdAt}
                  storeName={product.store?.name}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Title - Compact on mobile */}
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Stars - Smaller on mobile */}
          <div className="flex items-center gap-0.5 mb-1.5 sm:mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}
              />
            ))}
            <span className="text-[10px] sm:text-xs text-gray-500 ml-1 font-medium">{product.rating}</span>
          </div>

          {/* Price - Compact */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1">
            <span className="text-base sm:text-xl font-black text-gray-900">{priceLabel}</span>
            {origLabel && (
              <span className="text-[10px] sm:text-sm text-gray-400 line-through font-medium">{origLabel}</span>
            )}
          </div>

          {/* Countdown Timer */}
          {hasExpiry && (
            <div className="mb-1.5 sm:mb-3">
              <CountdownTimer expiresAt={product.expiresAt!} variant="inline" />
            </div>
          )}

          {/* Freshness */}
          {ago && !hasExpiry && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-4 font-medium" suppressHydrationWarning>
              <Clock size={10} />
              <span suppressHydrationWarning>{ago}</span>
            </div>
          )}
        </Link>

        {/* CTA - Compact */}
        <div className="mt-auto pt-2 sm:pt-4 border-t border-gray-100">
          {affiliateUrl === "#" ? (
            <span className="block w-full rounded-full bg-gray-50 px-4 py-3 sm:px-6 text-center text-xs sm:text-sm font-semibold text-gray-400">
              Unavailable
            </span>
          ) : (
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-full gradient-btn px-4 py-3 sm:px-6 text-center text-xs sm:text-sm font-bold"
            >
              Get Deal
            </a>
          )}
        </div>
      </GlassCard>
    </SpotlightCard>
  );
}
