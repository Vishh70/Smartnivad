import { ButtonHTMLAttributes, ReactNode } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export function GlowButton({ children, variant = "primary", className = "", ...props }: GlowButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 hover:-translate-y-1";
  
  const variants = {
    primary: "bg-[var(--color-primary)] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.7)]",
    secondary: "bg-[var(--color-secondary)] text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.7)]",
    outline: "bg-transparent text-white border border-[var(--color-glass-border)] hover:border-[var(--color-primary)] hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:text-[var(--color-primary)]",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
