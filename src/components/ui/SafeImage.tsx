"use client";

import Image, { type ImageProps } from "next/image";
import { useState, useEffect } from "react";

const FALLBACK_IMAGE =
  "https://placehold.co/800x600/f8fafc/2563eb?text=SmartNivad";

type SafeImageProps = ImageProps & {
  fallbackSrc?: string;
};

export function SafeImage({
  src,
  fallbackSrc = FALLBACK_IMAGE,
  alt,
  ...props
}: SafeImageProps) {
  // If we are in a CI environment, use the local placeholder immediately
  // to avoid external network timeouts during automated tests (Lighthouse/Playwright)
  const isCI = process.env.NEXT_PUBLIC_CI === "true";
  const [imageSrc, setImageSrc] = useState(isCI ? "/images/placeholder.png" : src);

  // If the src prop changes dynamically, update the state, but still respect CI mode
  useEffect(() => {
    setImageSrc(isCI ? "/images/placeholder.png" : src);
  }, [src, isCI]);

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      onError={() => setImageSrc(fallbackSrc)}
    />
  );
}
