"use client";

import { useState } from "react";
import {
  CreditCard,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { formatNumber } from "@/lib/format";
import { BestOfferResult } from "@/lib/offers/types";

interface CardOffersSectionProps {
  offerResult: BestOfferResult;
  productPrice?: number;
  storeName?: string;
}

export function CardOffersSection({
  offerResult,
  storeName,
}: CardOffersSectionProps) {
  const [showAllOffers, setShowAllOffers] = useState(false);
  const { bestOffer, allEvaluations, eligibleCount, disclaimer } = offerResult;

  if (!bestOffer && eligibleCount === 0) {
    return null;
  }

  const isAmazon = storeName?.toLowerCase().includes("amazon");

  return (
    <div className="mb-8 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white border border-blue-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <CreditCard size={18} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-1.5">
              Smart Card Savings Engine
              <Sparkles size={16} className="text-amber-500 fill-amber-500" />
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Verified partner bank discounts &amp; cashback recommendations
            </p>
          </div>
        </div>
        {eligibleCount > 1 && (
          <button
            onClick={() => setShowAllOffers(!showAllOffers)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-white/80 border border-blue-200 px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1"
          >
            {showAllOffers ? "Collapse" : `View all (${eligibleCount})`}
            {showAllOffers ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
        )}
      </div>

      {/* Best Offer Highlight Box */}
      {bestOffer && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-100 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                ★ Best Recommended Offer
              </span>
              <h4 className="text-sm sm:text-base font-bold text-gray-900 mt-1">
                {bestOffer.offer.bankName} — {bestOffer.offer.cardName}
              </h4>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-500 font-medium block">
                Estimated Effective Price:
              </span>
              <span className="text-xl sm:text-2xl font-black text-green-600">
                ₹{formatNumber(bestOffer.effectivePrice)}
              </span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 space-y-1 border border-gray-100">
            <div className="flex items-center gap-2 text-green-800 font-semibold">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>{bestOffer.breakdown}</span>
            </div>
            {bestOffer.monthlyEmi && (
              <div className="text-gray-500 pl-5">
                Eligible for EMI starting at ₹
                {formatNumber(bestOffer.monthlyEmi)}/month
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expandable All Offers List */}
      {showAllOffers && (
        <div className="mt-4 pt-4 border-t border-blue-100 space-y-3">
          <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            All Compatible Card &amp; Bank Offers
          </h5>
          <div className="space-y-2">
            {allEvaluations.map((evalResult) => (
              <div
                key={evalResult.offer.id}
                className={`p-3 rounded-xl border text-xs transition-colors ${
                  evalResult.isEligible
                    ? "bg-white border-gray-200"
                    : "bg-gray-50/60 border-gray-100 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    {evalResult.offer.bankName} ({evalResult.offer.cardName})
                  </span>
                  {evalResult.isEligible ? (
                    <span className="font-black text-green-600">
                      Effective: ₹{formatNumber(evalResult.effectivePrice)}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-medium">
                      Ineligible
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  {evalResult.isEligible
                    ? evalResult.breakdown
                    : evalResult.rejectionReason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimers & Disclosures */}
      <div className="mt-4 pt-3 border-t border-blue-100/70 flex flex-col gap-1 text-[11px] text-gray-500">
        <p className="flex items-start gap-1.5 leading-snug">
          <ShieldCheck size={14} className="text-blue-600 shrink-0 mt-0.5" />
          <span>{disclaimer}</span>
        </p>
        {isAmazon && (
          <p className="text-[10px] text-gray-400 mt-1 font-medium pl-5">
            As an Amazon Associate we earn from qualifying purchases.
          </p>
        )}
      </div>
    </div>
  );
}
