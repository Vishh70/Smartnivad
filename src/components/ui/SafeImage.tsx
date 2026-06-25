"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

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
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      onError={() => setImageSrc(fallbackSrc)}
    />
  );
}
