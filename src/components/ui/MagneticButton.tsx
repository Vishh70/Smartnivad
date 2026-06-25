"use client";

import { ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className = "",
  onClick,
}: MagneticButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative transition-all duration-500 cubic-bezier(0.25, 1, 0.5, 1) hover:scale-105 will-change-transform ${className}`}
    >
      {children}
    </button>
  );
}
