"use client";

import { useState } from "react";
import { ProductCard } from "@/components/sections/ProductCard";

type Deal = React.ComponentProps<typeof ProductCard>["product"];

interface HomeFeedTabsProps {
  hotDeals: Deal[];
  liveDeals: Deal[];
  trendingDeals: Deal[];
}

export function HomeFeedTabs({ hotDeals, liveDeals, trendingDeals }: HomeFeedTabsProps) {
  const [activeTab, setActiveTab] = useState<"HOT" | "LIVE" | "TRENDING">("LIVE");

  const tabs: { id: "HOT" | "LIVE" | "TRENDING"; label: string; count: number }[] = [
    { id: "LIVE", label: "🟢 Live Deals", count: liveDeals.length },
    { id: "HOT", label: "🔥 Hot Deals", count: hotDeals.length },
    { id: "TRENDING", label: "📈 Trending", count: trendingDeals.length },
  ];

  let displayDeals: Deal[] = [];
  if (activeTab === "LIVE") displayDeals = liveDeals;
  if (activeTab === "HOT") displayDeals = hotDeals;
  if (activeTab === "TRENDING") displayDeals = trendingDeals;

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex max-w-full gap-2 overflow-x-auto rounded-full border border-[var(--color-glass-border)] bg-black/5 p-1.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-2.5 sm:px-6 rounded-full text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-[var(--color-primary)] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
              }`}
            >
              {tab.label} <span className="opacity-60 text-xs ml-1">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {displayDeals.map(deal => (
          <ProductCard key={deal.id} product={deal} />
        ))}
      </div>
      
      {displayDeals.length === 0 && (
        <div className="text-center text-gray-500 py-12">No deals found in this category.</div>
      )}
    </div>
  );
}
