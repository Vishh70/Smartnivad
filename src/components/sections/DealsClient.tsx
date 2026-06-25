"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Laptop,
  Smartphone,
  Headphones,
  Gamepad2,
  Tag,
} from "lucide-react";
import { ProductCard } from "@/components/sections/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type {
  DealWithRelations,
  PrismaBrand,
  PrismaCategory,
  PrismaStore,
} from "@/types";

const SORT_OPTIONS = [
  { label: "Most Popular", value: "popular" },
  { label: "Newest First", value: "newest" },
  { label: "Biggest Discount", value: "discount" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

interface DealsClientProps {
  deals: DealWithRelations[];
  categories: PrismaCategory[];
  stores: PrismaStore[];
  brands: PrismaBrand[];
}

export function DealsClient({
  deals,
  categories,
  stores,
  brands,
}: DealsClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [store, setStore] = useState("");
  const [brand, setBrand] = useState("");
  const [dealType, setDealType] = useState("");
  const [minDiscount, setMinDiscount] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState("popular");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let d = [...deals];
    if (search)
      d = d.filter(
        (x) =>
          x.title.toLowerCase().includes(search.toLowerCase()) ||
          x.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
      );
    if (category) d = d.filter((x) => x.categoryId === category);
    if (store) d = d.filter((x) => x.storeId === store);
    if (brand) d = d.filter((x) => x.brandId === brand);
    if (dealType) d = d.filter((x) => x.dealType === dealType);
    if (minDiscount) d = d.filter((x) => (x.discount ?? 0) >= minDiscount);
    d = d.filter((x) => x.currentPrice <= maxPrice);
    switch (sort) {
      case "popular":
        d.sort((a, b) => b.views - a.views);
        break;
      case "newest":
        d.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "discount":
        d.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
        break;
      case "price-asc":
        d.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case "price-desc":
        d.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case "rating":
        d.sort((a, b) => b.rating - a.rating);
        break;
    }
    return d;
  }, [
    search,
    category,
    store,
    brand,
    dealType,
    minDiscount,
    maxPrice,
    sort,
    deals,
  ]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setStore("");
    setBrand("");
    setDealType("");
    setMinDiscount(0);
    setMaxPrice(5000);
    setSort("popular");
  };
  const hasFilters =
    search ||
    category ||
    store ||
    brand ||
    dealType ||
    minDiscount > 0 ||
    maxPrice < 5000;

  const getIcon = (name: string | null) => {
    switch (name) {
      case "Laptop":
        return <Laptop size={18} />;
      case "Smartphone":
        return <Smartphone size={18} />;
      case "Headphones":
        return <Headphones size={18} />;
      case "Gamepad2":
        return <Gamepad2 size={18} />;
      default:
        return <Tag size={18} />;
    }
  };

  const FilterPanel = () => (
    <aside className="w-full space-y-6">
      {/* Search */}
      <div>
        <label
          htmlFor="deal-search"
          className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 block"
        >
          Search
        </label>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="deal-search"
            name="q"
            placeholder="Keyword, brand, tag…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/5 border border-[var(--color-glass-border)] text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
      </div>

      {/* Deal Type */}
      <div>
        <label className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 block">
          Deal Type
        </label>
        <div className="flex gap-2 flex-wrap">
          {["", "LIVE", "HOT"].map((t) => (
            <button
              key={t}
              onClick={() => setDealType(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${dealType === t ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-gray-900" : "bg-black/5 border-[var(--color-glass-border)] text-gray-700 hover:text-gray-900"}`}
            >
              {t || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="deal-category"
          className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 block"
        >
          Category
        </label>
        <div className="relative">
          <select
            id="deal-category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-[var(--color-glass-border)] text-gray-900 text-sm focus:outline-none focus:border-[var(--color-primary)] appearance-none cursor-pointer transition-colors"
          >
            <option value="" className="bg-white text-gray-900">
              All Categories
            </option>
            {categories.map((c) => (
              <option
                key={c.id}
                value={c.id}
                className="bg-white text-gray-900"
              >
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Store */}
      <div>
        <label
          htmlFor="deal-store"
          className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 block"
        >
          Store
        </label>
        <div className="relative">
          <select
            id="deal-store"
            name="store"
            value={store}
            onChange={(e) => setStore(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-[var(--color-glass-border)] text-gray-900 text-sm focus:outline-none focus:border-[var(--color-primary)] appearance-none cursor-pointer transition-colors"
          >
            <option value="" className="bg-white text-gray-900">
              All Stores
            </option>
            {stores.map((s) => (
              <option
                key={s.id}
                value={s.id}
                className="bg-white text-gray-900"
              >
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Brand */}
      <div>
        <label
          htmlFor="deal-brand"
          className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 block"
        >
          Brand
        </label>
        <div className="relative">
          <select
            id="deal-brand"
            name="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-[var(--color-glass-border)] text-gray-900 text-sm focus:outline-none focus:border-[var(--color-primary)] appearance-none cursor-pointer transition-colors"
          >
            <option value="" className="bg-white text-gray-900">
              All Brands
            </option>
            {brands.map((b) => (
              <option
                key={b.id}
                value={b.id}
                className="bg-white text-gray-900"
              >
                {b.name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Min Discount */}
      <div>
        <label
          htmlFor="deal-min-discount"
          className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 flex justify-between"
        >
          Min Discount{" "}
          <span className="text-[var(--color-primary)]">{minDiscount}%+</span>
        </label>
        <input
          id="deal-min-discount"
          name="minDiscount"
          type="range"
          min={0}
          max={80}
          step={5}
          value={minDiscount}
          onChange={(e) => setMinDiscount(+e.target.value)}
          className="w-full accent-[var(--color-primary)] cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>80%+</span>
        </div>
      </div>

      {/* Max Price */}
      <div>
        <label
          htmlFor="deal-max-price"
          className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2 flex justify-between"
        >
          Max Price{" "}
          <span className="text-[var(--color-primary)]">
            ₹{maxPrice.toLocaleString()}
          </span>
        </label>
        <input
          id="deal-max-price"
          name="maxPrice"
          type="range"
          min={50}
          max={5000}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          className="w-full accent-[var(--color-primary)] cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹50</span>
          <span>₹5,000</span>
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-sm font-medium"
        >
          <X size={15} /> Clear All Filters
        </button>
      )}
    </aside>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 pb-12">
      {/* Page Header */}
      <div className="mb-10">
        <SectionHeading
          as="h1"
          title="Deal Finder"
          subtitle="Filter thousands of AI-curated deals in real time."
        />
        <div className="flex overflow-x-auto hide-scrollbar snap-x gap-2 mt-6 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:pb-0">
          {categories.slice(0, 6).map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(category === c.id ? "" : c.id)}
              className={`shrink-0 snap-center flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${category === c.id ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-gray-900" : "bg-black/5 border-[var(--color-glass-border)] text-gray-700 hover:text-gray-900"}`}
            >
              {getIcon(c.icon)} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden sticky top-16 z-40 bg-white/90 backdrop-blur-xl py-3 -mx-4 px-4 sm:mx-0 sm:px-0 mb-4 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium transition-colors"
        >
          <SlidersHorizontal size={16} /> Filters{" "}
          {hasFilters && (
            <span className="bg-[var(--color-primary)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
        <div className="relative flex-1">
          <select
            aria-label="Sort deals"
            name="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm focus:outline-none appearance-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option
                key={o.value}
                value={o.value}
                className="bg-white text-gray-900"
              >
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto p-6 border-l border-gray-200 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Filter Deals</h3>
              <button
                aria-label="Close filters"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 bg-[rgba(255,255,255,0.02)] border border-[var(--color-glass-border)] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal size={16} /> Filters
              </h3>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  <X size={14} className="inline" /> Clear
                </button>
              )}
            </div>
            <FilterPanel />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Sort + Count */}
          <div className="hidden lg:flex justify-between items-center mb-6">
            <p className="text-gray-600 text-sm">
              {filtered.length} deal{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="relative">
              <select
                aria-label="Sort deals"
                name="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 rounded-xl bg-black/5 border border-[var(--color-glass-border)] text-gray-900 text-sm focus:outline-none appearance-none pr-8 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option
                    key={o.value}
                    value={o.value}
                    className="bg-white text-gray-900"
                  >
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                size={14}
              />
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
              {filtered.map((deal) => (
                <ProductCard key={deal.id} product={deal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No deals found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or clearing them.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Browse by Store */}
      <div className="mt-24 pt-12 border-t border-[var(--color-glass-border)]">
        <SectionHeading
          title="Browse by Store"
          subtitle="Find deals from your favourite retailers."
        />
        <div className="flex flex-wrap gap-4 mt-8">
          {stores.map((s) => (
            <Link
              key={s.id}
              href={`/store/${s.slug}`}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/5 border border-[var(--color-glass-border)] hover:border-[var(--color-primary)]/50 hover:bg-black/10 transition-all text-gray-900 font-medium group"
            >
              <span className="text-2xl">🏪</span>
              <span>{s.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
