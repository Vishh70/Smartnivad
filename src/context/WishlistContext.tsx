"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface WishlistContextType {
  savedDealIds: string[];
  addDeal: (id: string) => void;
  removeDeal: (id: string) => void;
  isSaved: (id: string) => boolean;
  totalSaved: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "smartnivad_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [savedDealIds, setSavedDealIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const localData = localStorage.getItem(STORAGE_KEY);
      if (localData) {
        setSavedDealIds(JSON.parse(localData));
      }
    } catch (e) {
      console.error("Failed to parse wishlist from local storage", e);
    }
    setIsHydrated(true);
  }, []);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage whenever state changes (but only after hydration to prevent overwriting)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDealIds));
    }
  }, [savedDealIds, isHydrated]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const addDeal = (id: string) => {
    setSavedDealIds((prev) => {
      if (!prev.includes(id)) {
        showToast("Added to Wishlist ❤️");
        return [...prev, id];
      }
      return prev;
    });
  };

  const removeDeal = (id: string) => {
    setSavedDealIds((prev) => prev.filter((savedId) => savedId !== id));
    showToast("Removed from Wishlist 💔");
  };

  const isSaved = (id: string) => savedDealIds.includes(id);

  // Prevent hydration mismatches by returning empty/default state during SSR
  const totalSaved = isHydrated ? savedDealIds.length : 0;

  return (
    <WishlistContext.Provider
      value={{ savedDealIds, addDeal, removeDeal, isSaved, totalSaved }}
    >
      {children}
      {/* Tiny Custom Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full shadow-lg transition-all animate-in fade-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
