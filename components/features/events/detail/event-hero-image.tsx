"use client";
import React from "react";
import Image from "next/image";
import { EventHeroImageProps } from "@/types/event-details";

export function EventHeroImage({
  src,
  alt,
  className = "",
}: EventHeroImageProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="w-full h-[350px] relative rounded-2xl overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    </div>
  );
}
