"use client";
import React from "react";
import Image from "next/image";
import { EventLocationProps } from "@/types/event-details";
import { MapPin } from "lucide-react";

export function EventLocation({ location }: EventLocationProps) {
  return (
    <div className="py-6 border-b border-gray-200">
      <h3 className="text-[#1F2024] font-bold text-xl mb-4">Location</h3>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#FF5B00] flex-shrink-0" />
          <h4 className="text-[#1F2024] font-semibold">{location.venue}</h4>
        </div>

        <p className="text-[#71727A] pl-7">{location.address}</p>
      </div>

      {/* Map */}
      {location.mapImage && (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200">
          <Image
            src={location.mapImage}
            alt={`Map showing ${location.venue} location`}
            width={900}
            height={300}
            className="w-full h-[300px] object-cover"
          />

          {/* Map Overlay with venue info */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <p className="text-sm font-medium text-[#1F2024]">
              {location.venue}
            </p>
            <p className="text-xs text-[#71727A]">{location.city}</p>
          </div>
        </div>
      )}
    </div>
  );
}
