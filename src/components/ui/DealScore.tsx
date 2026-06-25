"use client";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface DealScoreProps {
  discount: number;
  rating: number;
  hasBrand: boolean;
  createdAt?: Date | string;
  storeName?: string;
  size?: "sm" | "md" | "lg";
}

function computeScore({
  discount,
  rating,
  hasBrand,
  createdAt,
  storeName,
}: DealScoreProps): number {
  // Discount: 30%
  const discountWeight = Math.min(discount / 50, 1) * 30;

  // Rating: 25%
  const ratingWeight = (rating / 5) * 25;

  // Brand Trust: 15%
  const brandWeight = hasBrand ? 15 : 7.5;

  // Freshness: 10%
  let freshnessWeight = 3;
  if (createdAt) {
    const hoursAgo = (Date.now() - new Date(createdAt).getTime()) / 3600000;
    if (hoursAgo < 24) freshnessWeight = 10;
    else if (hoursAgo < 168) freshnessWeight = 7;
    else freshnessWeight = 3;
  }

  // Store Trust: 10%
  const trustedStores = ["amazon", "flipkart", "croma", "reliance digital", "tata cliq", "vijay sales"];
  const storeWeight = storeName && trustedStores.some(s => storeName.toLowerCase().includes(s)) ? 10 : 5;

  // Review Volume: 5% (proxy via rating > 0)
  const reviewWeight = rating > 0 ? 5 : 1;

  // Price History: 5% (proxy via discount existing)
  const historyWeight = discount > 0 ? 5 : 1;

  return Math.min(Math.round(discountWeight + ratingWeight + brandWeight + freshnessWeight + storeWeight + reviewWeight + historyWeight), 100);
}

function getScoreColor(score: number): string {
  if (score >= 85) return "#22C55E";
  if (score >= 70) return "#2563EB";
  if (score >= 50) return "#F59E0B";
  return "#EF4444";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Great Deal";
  if (score >= 65) return "Good";
  if (score >= 50) return "Fair";
  return "Low";
}

export function DealScore({ discount, rating, hasBrand, createdAt, storeName, size = "sm" }: DealScoreProps) {
  const score = computeScore({ discount, rating, hasBrand, createdAt, storeName });
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const sizes = {
    sm: { box: "w-14 h-14", text: "text-lg", label: "text-[9px]", ring: 20, stroke: 3 },
    md: { box: "w-20 h-20", text: "text-2xl", label: "text-[10px]", ring: 28, stroke: 3.5 },
    lg: { box: "w-28 h-28", text: "text-4xl", label: "text-xs", ring: 40, stroke: 4 },
  };
  const s = sizes[size];
  const circumference = 2 * Math.PI * s.ring;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1" title={`AI Score: ${score}/100 — ${label}`}>
      <div className={`${s.box} relative flex items-center justify-center`}>
        {/* Background ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox={`0 0 ${(s.ring + s.stroke) * 2} ${(s.ring + s.stroke) * 2}`}>
          <circle
            cx={s.ring + s.stroke}
            cy={s.ring + s.stroke}
            r={s.ring}
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={s.stroke}
          />
          <circle
            cx={s.ring + s.stroke}
            cy={s.ring + s.stroke}
            r={s.ring}
            fill="none"
            stroke={color}
            strokeWidth={s.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        {/* Score number */}
        <span className={`${s.text} font-black text-gray-900 relative z-10`} suppressHydrationWarning>
          <AnimatedCounter value={score} />
        </span>
      </div>
      <span className={`${s.label} font-bold uppercase tracking-wider`} style={{ color }}>
        {label}
      </span>
    </div>
  );
}

// Detailed breakdown for product pages
export function DealScoreDetailed(props: DealScoreProps) {
  const score = computeScore(props);
  const checks = [
    { label: "Discount Quality", pass: props.discount >= 10 },
    { label: "User Ratings", pass: props.rating >= 3.5 },
    { label: "Brand Trust", pass: props.hasBrand },
    { label: "Store Reputation", pass: !!props.storeName },
  ];

  return (
    <div className="flex items-center gap-6">
      <DealScore {...props} size="lg" />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-gray-900 mb-1">AI Score: {score}/100</p>
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-2 text-sm">
            <span className={c.pass ? "text-green-500" : "text-gray-400"}>{c.pass ? "✓" : "○"}</span>
            <span className={c.pass ? "text-gray-800 font-medium" : "text-gray-500"}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
