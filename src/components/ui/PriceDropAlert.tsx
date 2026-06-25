"use client";

import { useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { GlassCard } from "./GlassCard";

interface PriceDropAlertProps {
  dealId: string;
  currentPrice: number;
}

export function PriceDropAlert({ dealId, currentPrice }: PriceDropAlertProps) {
  const { data: session } = useSession();
  const [targetPrice, setTargetPrice] = useState(currentPrice * 0.9); // default 10% drop
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      window.location.href = "/login";
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId, targetPrice }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <GlassCard className="p-4 flex flex-col items-center justify-center text-center bg-green-50/50 border-green-200">
        <CheckCircle2 size={32} className="text-green-500 mb-2" />
        <h4 className="font-bold text-gray-900 mb-1">Alert Set!</h4>
        <p className="text-sm text-gray-600 font-medium">
          We&apos;ll email you when the price drops to ₹{targetPrice}.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-10 -mt-10" />

      <div className="flex items-center gap-2 mb-3 relative z-10">
        <Bell size={18} className="text-blue-600" />
        <h4 className="font-bold text-gray-900">Price Drop Alert</h4>
      </div>

      <p className="text-xs font-medium text-gray-500 mb-4 relative z-10">
        Get notified instantly when this product hits your target price.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 relative z-10"
      >
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">
            ₹
          </span>
          <input
            id={`price-alert-${dealId}`}
            name="targetPrice"
            aria-label="Target price"
            type="number"
            required
            min={1}
            max={currentPrice}
            value={targetPrice}
            onChange={(e) => setTargetPrice(Number(e.target.value))}
            className="w-full pl-7 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="gradient-btn px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm disabled:opacity-50 whitespace-nowrap"
        >
          {status === "loading" ? "Saving..." : "Notify Me"}
        </button>
      </form>

      {status === "error" && (
        <p className="text-xs text-red-500 mt-2 font-bold text-center">
          Failed to set alert. Please try again.
        </p>
      )}
    </GlassCard>
  );
}
