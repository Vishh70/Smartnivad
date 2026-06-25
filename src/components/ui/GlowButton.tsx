import { ButtonHTMLAttributes, ReactNode } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export function GlowButton({ children, variant = "primary", className = "", ...props }: GlowButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-full transition-all duration-300 hover:-translate-y-1";
  
  const variants = {
    primary: "gradient-btn shadow-lg hover:shadow-[0_10px_25px_rgba(37,99,235,0.3)]",
    secondary: "bg-white/60 text-gray-900 border border-gray-200 backdrop-blur-md hover:bg-white hover:shadow-md",
    outline: "bg-transparent text-gray-900 border border-gray-200 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)] hover:text-blue-600",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
