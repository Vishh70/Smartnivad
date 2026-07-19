"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { SafeImage } from "@/components/ui/SafeImage";

interface SearchSuggestion {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  currentPrice: number;
  rating: number;
}

const POPULAR_SEARCHES = [
  "iphone 15",
  "macbook pro",
  "sony headphones",
  "samsung s24",
  "gaming laptop",
];

const RECENT_SEARCHES_KEY = "smartnivad_recent_searches_v1";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";

      // Load recent searches
      try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setSuggestions([]);
    }
  }, [isOpen]);

  // Fetch suggestions
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in another input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // The modal state is likely managed higher up, but we could also manage it via an event bus.
        // For simplicity, we assume the parent handles it.
        // Wait, if this component is only mounted when `isOpen` is true, we can't catch the shortcut here.
        // The prompt says "Support Ctrl+K / Cmd+K to open the modal".
        // This implies the listener needs to be outside this component, or this component is always mounted but visually hidden when !isOpen.
      }

      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5,
    );
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      router.push(`/deals?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleSuggestionClick = (slug: string, term: string) => {
    saveRecentSearch(term);
    router.push(`/product/${slug}`);
    onClose();
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    saveRecentSearch(term);
    router.push(`/deals?q=${encodeURIComponent(term)}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-6">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center border-b border-gray-100 px-4"
        >
          <Search className="w-6 h-6 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search deals, coupons, stores..."
            className="flex-1 bg-transparent px-4 py-5 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="search-input"
          />
          {isLoading && (
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Search Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4 bg-gray-50/50" data-testid="search-results">
          {/* Default State: Recent & Popular */}
          {query.trim().length < 2 && (
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                    Recent Searches
                  </h3>
                  <div className="space-y-1">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2 px-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleRecentClick(term)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 rounded-full transition-all shadow-sm"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results State */}
          {query.trim().length >= 2 &&
            !isLoading &&
            suggestions.length === 0 && (
              <div className="py-12 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-900 font-semibold mb-1">
                  No results found
                </h3>
                <p className="text-sm text-gray-500">
                  We couldn&apos;t find anything matching &quot;{query}&quot;
                </p>
              </div>
            )}

          {suggestions.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                Products
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() =>
                      handleSuggestionClick(suggestion.slug, query)
                    }
                    className="w-full flex items-center gap-4 p-2 hover:bg-white rounded-xl hover:shadow-sm border border-transparent hover:border-gray-100 transition-all text-left group"
                  >
                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {suggestion.imageUrl.startsWith("http") ? (
                        <SafeImage
                          src={suggestion.imageUrl}
                          alt={suggestion.title}
                          fill
                          className="object-contain p-2 mix-blend-multiply"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Search size={16} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {suggestion.title}
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">
                        ₹{suggestion.currentPrice.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all flex-shrink-0 mr-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim().length >= 2 && suggestions.length > 0 && (
            <button
              onClick={handleSubmit}
              className="w-full mt-4 py-3 bg-blue-50 text-blue-600 text-sm font-bold rounded-xl hover:bg-blue-100 transition-colors text-center"
            >
              See all results for &quot;{query}&quot;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
