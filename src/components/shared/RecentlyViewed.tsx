"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface ViewedDeal {
  id: string;
  slug: string;
  title: string;
  price: number;
  imageUrl: string;
}

export function useRecentlyViewed() {
  const [recentDeals, setRecentDeals] = useState<ViewedDeal[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      if (stored) {
        setRecentDeals(JSON.parse(stored));
      }
    } catch (e) {
      console.warn(
        "Failed to parse recently viewed deals from local storage. Clearing corrupted data.",
        e,
      );
      localStorage.removeItem("recentlyViewed");
    }
  }, []);

  const addDealToRecent = (deal: ViewedDeal) => {
    setRecentDeals((prev) => {
      // Remove if it already exists to move it to the front
      const filtered = prev.filter((d) => d.id !== deal.id);
      const updated = [deal, ...filtered].slice(0, 10); // Keep max 10
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
      return updated;
    });
  };

  return { recentDeals, addDealToRecent };
}

export function RecentlyViewedCarousel() {
  const { recentDeals } = useRecentlyViewed();

  if (recentDeals.length === 0) return null;

  return (
    <div className="py-8">
      <h3 className="text-xl font-bold mb-4">Recently Viewed</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
        {recentDeals.map((deal) => (
          <Link
            key={deal.id}
            href={`/deals/${deal.slug}`}
            className="snap-start flex-shrink-0 w-48 border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-32 w-full bg-slate-100">
              <Image
                src={deal.imageUrl}
                alt={deal.title}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="p-3">
              <p className="font-semibold text-sm line-clamp-2">{deal.title}</p>
              <p className="text-green-600 font-bold mt-1">₹{deal.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
