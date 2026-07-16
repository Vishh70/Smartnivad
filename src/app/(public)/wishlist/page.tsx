"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/sections/ProductCard";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

interface WishlistDeal {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  rating: number;
  affiliateUrl: string;
  dealType: string;
  isTrending: boolean;
  createdAt: string;
  expiresAt: string | null;
  store: { name: string } | null;
  brand: { name: string } | null;
}

export default function WishlistPage() {
  const { savedDealIds, totalSaved } = useWishlist();
  const [deals, setDeals] = useState<WishlistDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (savedDealIds.length === 0) {
      setDeals([]);
      setIsLoading(false);
      return;
    }

    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/wishlist-deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: savedDealIds }),
        });
        if (res.ok) {
          const data = await res.json();
          setDeals(data);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist deals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, [savedDealIds]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Heart size={24} className="text-white fill-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              My Wishlist
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {totalSaved} {totalSaved === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[20px] h-[320px] sm:h-[380px] animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && deals.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Heart size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 max-w-md mb-8">
              Start adding deals you love by tapping the heart icon on any
              product card. They&apos;ll appear here so you can find them later.
            </p>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-[#4F46E5] to-[#2563EB] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Browse Deals <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* Deal Grid */}
        {!isLoading && deals.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {deals.map((deal) => (
              <ProductCard key={deal.id} product={deal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
