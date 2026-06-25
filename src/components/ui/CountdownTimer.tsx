"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

export function CountdownTimer({ expiresAt, variant = "badge" }: { expiresAt: Date | string; variant?: "badge" | "inline" | "prominent" }) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; expired: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: true,
  });

  useEffect(() => {
    const end = new Date(expiresAt).getTime();
    
    const tick = () => {
      const now = Date.now();
      const dist = end - now;
      if (dist <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      setTimeLeft({
        hours: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((dist % (1000 * 60)) / 1000),
        expired: false,
      });
    };

    tick();
    const int = setInterval(tick, 1000);
    return () => clearInterval(int);
  }, [expiresAt]);

  if (timeLeft.expired) return null;

  const { hours, minutes, seconds } = timeLeft;
  const pad = (n: number) => n.toString().padStart(2, "0");

  const isUrgent = hours < 2;
  const isCritical = hours === 0 && minutes < 30;
  const urgentClass = isCritical ? "animate-[flashPulse_1s_ease-in-out_infinite]" : isUrgent ? "animate-[flashPulse_2s_ease-in-out_infinite]" : "";

  if (variant === "prominent") {
    return (
      <div className={`flex items-center gap-4 ${urgentClass}`}>
        <div className="flex items-center gap-2 text-red-600 font-black">
          <Timer size={20} className={isCritical ? "animate-pulse" : ""} />
          <span>Ends in:</span>
        </div>
        <div className="flex gap-2">
          <div className="bg-red-50 border border-red-100 text-red-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold">{pad(hours)}</div>
          <span className="text-red-300 font-bold text-xl self-center">:</span>
          <div className="bg-red-50 border border-red-100 text-red-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold">{pad(minutes)}</div>
          <span className="text-red-300 font-bold text-xl self-center">:</span>
          <div className="bg-red-50 border border-red-100 text-red-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold">{pad(seconds)}</div>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-1.5 text-red-600 text-xs font-bold ${urgentClass}`}>
        <Timer size={14} className={isCritical ? "animate-pulse" : ""} />
        <span>Ends in {pad(hours)}:{pad(minutes)}:{pad(seconds)}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold ${urgentClass}`}>
      <Timer size={14} className={isCritical ? "animate-pulse" : ""} />
      <span>{pad(hours)}:{pad(minutes)}:{pad(seconds)}</span>
    </div>
  );
}
