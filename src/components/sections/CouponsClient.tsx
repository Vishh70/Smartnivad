"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink, Clock, Tag, Laptop, Smartphone, Headphones, Gamepad2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import type { CouponWithRelations, PrismaCategory, PrismaStore } from "@/types";

const getIcon = (name: string | null) => {
  switch (name) {
    case "Laptop": return <Laptop size={13} />;
    case "Smartphone": return <Smartphone size={13} />;
    case "Headphones": return <Headphones size={13} />;
    case "Gamepad2": return <Gamepad2 size={13} />;
    default: return <Tag size={13} />;
  }
};

function CouponCard({ coupon, store, cat }: { coupon: CouponWithRelations; store: PrismaStore | undefined; cat: PrismaCategory | undefined }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const daysLeft = coupon.expiresAt
    ? Math.ceil((new Date(coupon.expiresAt).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <GlassCard className="flex flex-col gap-0 !p-0 overflow-hidden group">
      {/* Top colour strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {cat && (
            <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/20 font-medium">
              {getIcon(cat.icon)} {cat.name}
            </span>
          )}
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 font-bold">
            {coupon.discountText}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">{coupon.title}</h3>

        {/* Description */}
        {coupon.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{coupon.description}</p>
        )}

        {/* Store + Expiry */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <span className="font-medium text-gray-700">{store?.name ?? "Store"}</span>
          {daysLeft !== null && (
            <span className={`flex items-center gap-1 ${daysLeft <= 1 ? "text-red-400" : "text-gray-600"}`}>
              <Clock size={11} />
              {daysLeft <= 0 ? "Expires today!" : `${daysLeft}d left`}
            </span>
          )}
        </div>
      </div>

      {/* Code + CTA */}
      <div className="px-5 pb-5 flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-[var(--color-primary)]/50 hover:border-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-all group"
        >
          <span className="font-mono text-sm font-bold text-gray-900 tracking-widest">{coupon.code}</span>
          <span className={`text-xs font-medium transition-colors ${copied ? "text-green-400" : "text-[var(--color-primary)]"}`}>
            {copied ? <><Check size={14} className="inline"/> Copied!</> : <><Copy size={14} className="inline"/> Copy</>}
          </span>
        </button>
        {coupon.affiliateUrl && (
          <a href={coupon.affiliateUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center w-11 rounded-xl bg-[var(--color-primary)] hover:bg-purple-500 text-gray-900 transition-colors">
            <ExternalLink size={16} />
          </a>
        )}
      </div>

      {/* Terms */}
      {coupon.terms && (
        <p className="text-xs text-gray-600 px-5 pb-4 border-t border-[var(--color-glass-border)] pt-3">
          T&amp;C: {coupon.terms}
        </p>
      )}
    </GlassCard>
  );
}

export function CouponsClient({ coupons, stores, categories }: { coupons: CouponWithRelations[]; stores: PrismaStore[]; categories: PrismaCategory[] }) {
  const [activeStore, setActiveStore] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const filtered = coupons.filter(c => {
    const storeMatch = !activeStore || (c.storeId ?? "") === activeStore;
    const catMatch = !activeCategory || (c.categoryId ?? "") === activeCategory;
    return storeMatch && catMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12 p-12 rounded-3xl bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 border border-[var(--color-glass-border)] relative overflow-hidden">
        <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 -z-10" />
        <div className="text-5xl mb-4">🎟️</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Coupons & Promo Codes</h1>
        <p className="text-gray-700 text-xl max-w-2xl mx-auto">
          Verified promo codes for top stores. Click to copy — no fake discounts, ever.
        </p>
      </div>

      {/* Store Filter Tabs */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Filter by Store</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveStore("")}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${!activeStore ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-gray-900" : "bg-black/5 border-[var(--color-glass-border)] text-gray-700 hover:text-gray-900"}`}>
            All Stores
          </button>
          {stores.map(s => (
            <button key={s.id} onClick={() => setActiveStore(activeStore === s.id ? "" : s.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${activeStore === s.id ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-gray-900" : "bg-black/5 border-[var(--color-glass-border)] text-gray-700 hover:text-gray-900"}`}>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mb-10">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Filter by Category</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveCategory("")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${!activeCategory ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-gray-900" : "bg-black/5 border-[var(--color-glass-border)] text-gray-700 hover:text-gray-900"}`}>
            <Tag size={13} /> All
          </button>
          {categories.slice(0, 6).map(c => (
            <button key={c.id} onClick={() => setActiveCategory(activeCategory === c.id ? "" : c.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${activeCategory === c.id ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-gray-900" : "bg-black/5 border-[var(--color-glass-border)] text-gray-700 hover:text-gray-900"}`}>
              {getIcon(c.icon)} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 text-sm">{filtered.length} coupon{filtered.length !== 1 ? "s" : ""} available</p>
      </div>

      {/* Coupon Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(coupon => {
            const store = stores.find(s => s.id === coupon.storeId);
            const cat = categories.find(c => c.id === coupon.categoryId);
            return <CouponCard key={coupon.id} coupon={coupon} store={store} cat={cat} />
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-gray-600 text-lg">No coupons match your current filters.</p>
          <button onClick={() => { setActiveStore(""); setActiveCategory(""); }} className="mt-4 text-[var(--color-primary)] hover:underline text-sm">
            Clear filters
          </button>
        </div>
      )}

      {/* Store Hub Links */}
      <div className="mt-20 pt-10 border-t border-[var(--color-glass-border)]">
        <SectionHeading title="Browse Store Hubs" subtitle="See all deals and coupons for each store." />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          {stores.map(s => (
            <Link key={s.id} href={`/store/${s.slug}`}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-black/5 border border-[var(--color-glass-border)] hover:border-[var(--color-primary)]/50 hover:bg-black/10 transition-all text-center group">
              <div className="text-4xl">🏪</div>
              <span className="text-gray-900 font-semibold text-sm">{s.name}</span>
              <span className="text-xs text-gray-500 group-hover:text-[var(--color-primary)] transition-colors">View Deals →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
