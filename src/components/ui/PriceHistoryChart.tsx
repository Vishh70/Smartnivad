"use client";

import { useState, useEffect } from "react";

interface PricePoint {
  price: number;
  capturedAt: string;
}

interface PriceStats {
  current: number;
  lowest: number;
  highest: number;
  average: number;
}

interface PriceHistoryChartProps {
  dealId: string;
  currentPrice: number;
}

export function PriceHistoryChart({ dealId, currentPrice }: PriceHistoryChartProps) {
  const [period, setPeriod] = useState<"30d" | "90d" | "1y">("30d");
  const [data, setData] = useState<PricePoint[]>([]);
  const [stats, setStats] = useState<PriceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/deals/${dealId}/price-history?period=${period}`)
      .then(r => r.json())
      .then(res => {
        setData(res.history || []);
        setStats(res.stats || null);
      })
      .catch(() => {
        setData([]);
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, [dealId, period]);

  const periods: { id: "30d" | "90d" | "1y"; label: string }[] = [
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "90 Days" },
    { id: "1y", label: "1 Year" },
  ];

  // SVG Chart dimensions
  const W = 500;
  const H = 160;
  const PAD = 20;

  // Build path from data
  const prices = data.length ? data.map(d => d.price) : [currentPrice];
  const minP = Math.min(...prices) * 0.95;
  const maxP = Math.max(...prices) * 1.05;
  const range = maxP - minP || 1;

  const points = prices.map((p, i) => {
    const x = PAD + (i / Math.max(prices.length - 1, 1)) * (W - 2 * PAD);
    const y = PAD + (1 - (p - minP) / range) * (H - 2 * PAD);
    return { x, y };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = pathD + ` L ${points[points.length - 1].x} ${H - PAD} L ${points[0].x} ${H - PAD} Z`;

  // Average line
  const avgY = stats ? PAD + (1 - (stats.average - minP) / range) * (H - 2 * PAD) : H / 2;

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900">Price History</h3>
        <div className="flex gap-1 bg-gray-100 rounded-full p-1">
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                period === p.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-[160px] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-[160px] flex flex-col items-center justify-center text-gray-400">
          <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M3 12h4l3-9 4 18 3-9h4" />
          </svg>
          <p className="text-sm font-medium mt-2">No price data yet</p>
          <p className="text-xs">Price tracking will begin automatically</p>
        </div>
      ) : (
        <>
          {/* SVG Chart */}
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[160px]" preserveAspectRatio="none">
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path d={areaD} fill="url(#priceGradient)" className="opacity-0" style={{ animation: "fadeInUp 0.5s ease-out 1s forwards" }} />
            {/* Line */}
            <path 
              d={pathD} 
              fill="none" 
              stroke="#2563EB" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeDasharray="1000"
              strokeDashoffset="1000"
              style={{ animation: "drawLine 1.5s ease-out forwards" }}
            />
            {/* Average dashed line */}
            <line x1={PAD} y1={avgY} x2={W - PAD} y2={avgY} stroke="#6B7280" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
            {/* Current price dot */}
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="5" fill="#2563EB" stroke="white" strokeWidth="2" />
            {/* Lowest price dot */}
            {(() => {
              const lowestIdx = prices.indexOf(Math.min(...prices));
              return (
                <circle cx={points[lowestIdx].x} cy={points[lowestIdx].y} r="4" fill="#22C55E" stroke="white" strokeWidth="2" />
              );
            })()}
          </svg>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <StatBox label="Lowest Ever" value={fmt(stats?.lowest ?? 0)} color="text-green-600" bg="bg-green-50" />
            <StatBox label="Current" value={fmt(stats?.current ?? currentPrice)} color="text-blue-600" bg="bg-blue-50" />
            <StatBox label="Average" value={fmt(stats?.average ?? 0)} color="text-gray-600" bg="bg-gray-50" />
          </div>
        </>
      )}
    </div>
  );
}

function StatBox({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <div className={`${bg} rounded-xl p-3 text-center`}>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm font-black ${color}`}>{value}</p>
    </div>
  );
}
