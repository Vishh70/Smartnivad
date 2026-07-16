"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

export function WishlistButton({
  dealId,
  className = "",
}: {
  dealId: string;
  className?: string;
}) {
  const { isSaved, addDeal, removeDeal } = useWishlist();
  const saved = isSaved(dealId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeDeal(dealId);
    } else {
      addDeal(dealId);
    }
  };

  return (
    <button
      aria-label="Save to wishlist"
      className={`flex items-center justify-center transition-colors duration-300 active:scale-90 ${className} ${
        saved ? "text-red-500" : "text-gray-400 hover:text-gray-600"
      }`}
      onClick={handleToggle}
      title={saved ? "Remove from wishlist" : "Save to wishlist"}
    >
      <Heart
        size={18}
        className={`transition-all duration-300 ${saved ? "fill-current text-red-500 scale-110" : ""}`}
      />
    </button>
  );
}
