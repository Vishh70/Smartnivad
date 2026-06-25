"use client";

import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="transition-all duration-250 ease-out will-change-transform"
      style={{
        opacity: mounted ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
