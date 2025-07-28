"use client";
import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface FallbackImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc: string;
  fallbackAlt?: string;
}

export function FallbackImage({ 
  src, 
  fallbackSrc, 
  alt, 
  fallbackAlt,
  ...props 
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={hasError ? (fallbackAlt || alt) : alt}
      onError={handleError}
    />
  );
}