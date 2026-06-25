"use client";

import Link from "next/link";
import { Star, Clock, Heart } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { DealScore } from "@/components/ui/DealScore";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { formatNumber } from "@/lib/format";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { toggleSavedDeal } from "@/app/(public)/actions";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { SafeImage } from "@/components/ui/SafeImage";

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

export function ProductCard({
  product,
  initialSaved = false,
}: DealCardProps & { initialSaved?: boolean }) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      window.location.href = "/login";
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

  const imageUrl = product.imageUrl || product.image_url || "";
  const affiliateUrl = product.affiliateUrl || product.affiliate_link || "#";
  const priceLabel = product.currentPrice
    ? `₹${formatNumber(product.currentPrice)}`
    : product.price_text || "Check Price";
  const origLabel = product.originalPrice
    ? `₹${formatNumber(product.originalPrice)}`
    : undefined;
  const discPct = product.discount ?? 0;
  const ago = freshness(product.createdAt);
  const hasExpiry =
    product.expiresAt && new Date(product.expiresAt).getTime() > Date.now();

  return (
    <SpotlightCard className="h-full rounded-[20px] shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <GlassCard className="product-card flex flex-col h-full group relative overflow-hidden !border-none !shadow-none !p-3 sm:!p-4 bg-white">
        {/* Absolute Top Right - Discount */}
        {discPct > 0 && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md">
            -{discPct}%
          </div>
        )}

        {/* Absolute Top Left - Wishlist */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-30 flex gap-1">
          <button
            aria-label="Save to wishlist"
            className={`bg-white/90 backdrop-blur-md p-1.5 w-8 h-8 sm:p-2 sm:w-9 sm:h-9 flex items-center justify-center rounded-full shadow-sm transition-colors duration-300 ${isSaved ? "text-red-500" : "text-gray-400"}`}
            onClick={handleSave}
            disabled={isPending}
            title="Save to wishlist"
          >
            {isPending ? (
              <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart
                size={14}
                className={isSaved ? "fill-current text-red-500" : ""}
              />
            )}
          </button>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="flex-1 flex flex-col cursor-pointer mt-8 sm:mt-10"
        >
          {/* Image */}
          <div className="relative w-full h-[120px] sm:h-[170px] rounded-[14px] sm:rounded-[18px] overflow-hidden mb-2 sm:mb-3 bg-[#F8FAFC] flex items-center justify-center">
            {imageUrl.startsWith("http") ? (
              <SafeImage
                src={imageUrl}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-contain p-2 sm:p-4 mix-blend-multiply"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADwAQCdASoKAAoAAgA0p3DdpsW0r+QA/v2oP/5wB/84A/78IAAA"
              />
            ) : (
              <div className="text-gray-400 text-xs font-medium">No Image</div>
            )}
            {/* AI Score Badge - Overlaid on Image */}
            <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl p-0.5 sm:p-1 shadow-sm scale-75 sm:scale-100 origin-bottom-left">
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

          {/* Title */}
          <h3 className="text-[13px] sm:text-[16px] font-[700] text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.floor(product.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200"
                }
              />
            ))}
            <span className="text-[11px] text-gray-500 ml-1 font-medium">
              {product.rating}
            </span>
          </div>

          {/* Price */}
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 sm:gap-x-2 gap-y-0.5 mb-1.5 sm:mb-2">
            <span className="min-w-0 text-[18px] sm:text-[26px] font-bold text-gray-900 leading-none tracking-tight">
              {priceLabel}
            </span>
            {origLabel && (
              <span className="min-w-0 text-[11px] sm:text-[13px] text-gray-400 line-through font-medium">
                {origLabel}
              </span>
            )}
          </div>

          {/* Store / Freshness */}
          <div className="flex items-center gap-1.5 sm:gap-3 mb-3 sm:mb-4">
            {product.store?.name && (
              <span className="text-[10px] sm:text-[12px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md max-w-[80px] sm:max-w-none truncate">
                {product.store.name}
              </span>
            )}
            {ago && !hasExpiry && (
              <div
                className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400 font-medium shrink-0"
                suppressHydrationWarning
              >
                <Clock size={10} className="sm:w-3 sm:h-3" />
                <span suppressHydrationWarning>{ago}</span>
              </div>
            )}
          </div>

          {/* Countdown Timer */}
          {hasExpiry && (
            <div className="mb-4">
              <CountdownTimer expiresAt={product.expiresAt!} variant="inline" />
            </div>
          )}
        </Link>

        {/* CTA Button */}
        <div className="mt-auto">
          {affiliateUrl === "#" ? (
            <span className="flex items-center justify-center w-full h-[38px] sm:h-[48px] rounded-[10px] sm:rounded-[14px] bg-gray-50 text-[13px] sm:text-[14px] font-semibold text-gray-400">
              Unavailable
            </span>
          ) : (
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full h-[38px] sm:h-[48px] rounded-[10px] sm:rounded-[14px] bg-gradient-to-b from-[#4F46E5] to-[#2563EB] text-white text-[13px] sm:text-[15px] font-bold shadow-[0_8px_20px_rgba(37,99,235,0.2)] hover:scale-[1.02] transition-transform"
            >
              Get Deal
            </a>
          )}
        </div>
      </GlassCard>
    </SpotlightCard>
  );
}
