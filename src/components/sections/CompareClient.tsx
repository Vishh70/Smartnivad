"use client";

import { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { Star, Plus, X, CheckCircle, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatNumber } from "@/lib/format";
import type { DealWithRelations, PrismaCategory } from "@/types";

interface CompareClientProps {
  deals: DealWithRelations[];
  categories: PrismaCategory[];
}

export function CompareClient({ deals, categories }: CompareClientProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const addDeal = (id: string) => {
    if (selected.length < 3 && !selected.includes(id))
      setSelected((p) => [...p, id]);
  };
  const removeDeal = (id: string) =>
    setSelected((p) => p.filter((x) => x !== id));

  const compareDeals = deals.filter((d) => selected.includes(d.id));

  const rows = [
    {
      label: "Price",
      render: (d: DealWithRelations) => `₹${formatNumber(d.currentPrice)}`,
    },
    {
      label: "Original",
      render: (d: DealWithRelations) => (
        <span className="line-through text-gray-500">
          ₹{formatNumber(d.originalPrice)}
        </span>
      ),
    },
    {
      label: "Discount",
      render: (d: DealWithRelations) => (
        <span className="text-green-400 font-bold">{d.discount}% OFF</span>
      ),
    },
    {
      label: "Rating",
      render: (d: DealWithRelations) => (
        <span className="flex items-center gap-1 justify-center">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          {d.rating}
        </span>
      ),
    },
    {
      label: "Category",
      render: (d: DealWithRelations) =>
        categories.find((c) => c.id === d.categoryId)?.name ?? "—",
    },
    { label: "Views", render: (d: DealWithRelations) => formatNumber(d.views) },
    {
      label: "Deal Type",
      render: (d: DealWithRelations) => (
        <span
          className={`font-bold text-xs px-2.5 py-1 rounded-full ${d.dealType === "HOT" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}
        >
          {d.dealType}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeading
        title="Product Comparison"
        subtitle="Select up to 3 products and compare them side-by-side."
      />

      {/* Product Selector */}
      <div className="mt-10">
        <p className="text-sm text-gray-600 mb-4">
          {selected.length === 0 && "Choose products to compare below."}
          {selected.length > 0 &&
            selected.length < 3 &&
            `${3 - selected.length} more slot${3 - selected.length !== 1 ? "s" : ""} available.`}
          {selected.length === 3 && "Comparison table is ready! Scroll down."}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {deals.map((deal) => {
            const isSelected = selected.includes(deal.id);
            return (
              <button
                key={deal.id}
                onClick={() =>
                  isSelected ? removeDeal(deal.id) : addDeal(deal.id)
                }
                disabled={!isSelected && selected.length >= 3}
                className={`relative flex flex-col items-center p-4 rounded-2xl border text-sm font-medium transition-all text-center ${
                  isSelected
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-gray-900"
                    : selected.length >= 3
                      ? "border-[var(--color-glass-border)] bg-white/2 text-gray-600 cursor-not-allowed opacity-50"
                      : "border-[var(--color-glass-border)] bg-black/5 text-gray-700 hover:border-[var(--color-primary)]/40 hover:text-gray-900"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                    <X size={12} className="text-gray-900" />
                  </div>
                )}
                {!isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/10 flex items-center justify-center">
                    <Plus size={12} className="text-gray-600" />
                  </div>
                )}
                <div className="relative w-14 h-14 rounded-xl overflow-hidden mb-2 bg-black/5">
                  {deal.imageUrl?.startsWith("http") && (
                    <SafeImage
                      src={deal.imageUrl}
                      alt={deal.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <span className="line-clamp-2 leading-tight">{deal.title}</span>
                <span className="mt-1 text-[var(--color-primary)] font-bold">
                  ₹{deal.currentPrice}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      {compareDeals.length >= 2 && (
        <div className="mt-16">
          <SectionHeading title="Side-by-Side Comparison" />
          <div className="mt-8 overflow-x-auto">
            <div className="min-w-[640px]">
              {/* Product Headers */}
              <div
                className={`grid gap-4 mb-6 ${compareDeals.length === 2 ? "grid-cols-[200px_1fr_1fr]" : "grid-cols-[200px_1fr_1fr_1fr]"}`}
              >
                <div />
                {compareDeals.map((d) => (
                  <GlassCard key={d.id} className="text-center !p-4 relative">
                    <button
                      onClick={() => removeDeal(d.id)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-400"
                    >
                      <X size={15} />
                    </button>
                    <div className="relative w-20 h-20 mx-auto rounded-xl overflow-hidden mb-3 bg-black/5">
                      {d.imageUrl?.startsWith("http") && (
                        <SafeImage
                          src={d.imageUrl}
                          alt={d.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2">
                      {d.title}
                    </h3>
                    {d.affiliateUrl !== "#" ? (
                      <a
                        href={d.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white"
                      >
                        Get Deal
                      </a>
                    ) : null}
                  </GlassCard>
                ))}
              </div>

              {/* Spec Rows */}
              {rows.map((row, i) => (
                <div
                  key={i}
                  className={`grid gap-4 mb-2 ${compareDeals.length === 2 ? "grid-cols-[200px_1fr_1fr]" : "grid-cols-[200px_1fr_1fr_1fr]"}`}
                >
                  <div className="flex items-center px-4 py-3 rounded-xl bg-white/3 text-sm text-gray-600 font-semibold border border-[var(--color-glass-border)]">
                    {row.label}
                  </div>
                  {compareDeals.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-center px-4 py-3 rounded-xl bg-black/5 border border-[var(--color-glass-border)] text-gray-900 text-sm font-medium"
                    >
                      {row.render(d)}
                    </div>
                  ))}
                </div>
              ))}

              {/* Pros Row */}
              <div
                className={`grid gap-4 mt-6 ${compareDeals.length === 2 ? "grid-cols-[200px_1fr_1fr]" : "grid-cols-[200px_1fr_1fr_1fr]"}`}
              >
                <div className="flex items-start px-4 py-3 rounded-xl bg-green-900/20 text-sm text-green-400 font-semibold border border-green-500/20">
                  <CheckCircle size={16} className="mr-2 mt-0.5 shrink-0" />{" "}
                  Pros
                </div>
                {compareDeals.map((d) => (
                  <div
                    key={d.id}
                    className="px-4 py-3 rounded-xl bg-green-900/10 border border-green-500/20 text-sm text-gray-700"
                  >
                    <ul className="space-y-1">
                      {(d.pros ?? "")
                        .split("\n")
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((p: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5 shrink-0">
                              ✓
                            </span>
                            {p}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Cons Row */}
              <div
                className={`grid gap-4 mt-3 ${compareDeals.length === 2 ? "grid-cols-[200px_1fr_1fr]" : "grid-cols-[200px_1fr_1fr_1fr]"}`}
              >
                <div className="flex items-start px-4 py-3 rounded-xl bg-red-900/20 text-sm text-red-400 font-semibold border border-red-500/20">
                  <XCircle size={16} className="mr-2 mt-0.5 shrink-0" /> Cons
                </div>
                {compareDeals.map((d) => (
                  <div
                    key={d.id}
                    className="px-4 py-3 rounded-xl bg-red-900/10 border border-red-500/20 text-sm text-gray-700"
                  >
                    <ul className="space-y-1">
                      {(d.cons ?? "")
                        .split("\n")
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((c: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-red-400 mt-0.5 shrink-0">
                              ×
                            </span>
                            {c}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA if not enough selected */}
      {compareDeals.length < 2 && (
        <div className="text-center mt-16 py-16 border border-dashed border-[var(--color-glass-border)] rounded-3xl">
          <div className="text-6xl mb-4">⚖️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Select at least 2 products to compare
          </h3>
          <p className="text-gray-600 mb-6">
            Choose from the grid above to start your side-by-side comparison.
          </p>
          <Link href="/deals">
            <GlowButton variant="primary">Browse All Deals</GlowButton>
          </Link>
        </div>
      )}
    </div>
  );
}
