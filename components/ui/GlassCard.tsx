import { HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlassCard({ children, className = "", ...props }: GlassCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[var(--color-glass-surface)] border border-[var(--color-glass-border)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] group ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-5 pointer-events-none" />
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
}
