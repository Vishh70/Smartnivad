"use client";

import { useEffect, useRef, ReactNode, MouseEvent } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  return (
    <div className={`spotlight-card ${className}`}>
      {children}
    </div>
  );
}
