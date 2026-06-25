import { HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlassCard({ children, className = "", ...props }: GlassCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/80 border border-gray-100 shadow-sm sm:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-500 ${className}`}
      {...props}
    >
      <div className="relative z-10 p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
}
