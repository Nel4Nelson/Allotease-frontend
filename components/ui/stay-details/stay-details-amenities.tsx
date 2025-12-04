"use client";
import React, { useState } from "react";
import Image from "next/image";
import type { StayFacility } from "@/services/stays-service";

interface StayDetailsAmenitiesProps {
  facilitiesData: StayFacility[];
  className?: string;
}

export function StayDetailsAmenities({
  facilitiesData,
  className = "",
}: StayDetailsAmenitiesProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Handle image load errors
  const handleImageError = (facilityId: string) => {
    setImageErrors((prev) => new Set(prev).add(facilityId));
  };

  // Don't render section if no facilities
  if (!facilitiesData || facilitiesData.length === 0) {
    return (
      <div className={className}>
        <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
          Popular facilities
        </h3>
        <p className="text-gray-500 text-sm">
          No facilities information available
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Section Title */}
      <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
        Popular facilities
      </h3>

      {/* Facilities Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
        {facilitiesData.map((facility) => (
          <div key={facility._id} className="flex items-center gap-3">
            {/* Facility Icon */}
            <div className="w-5 h-5 flex-shrink-0 relative">
              {facility.icon && !imageErrors.has(facility._id) ? (
                <Image
                  src={facility.icon}
                  alt={facility.name}
                  fill
                  className="object-contain"
                  sizes="20px"
                  onError={() => handleImageError(facility._id)}
                />
              ) : (
                <Image
                  src="/icons/facilities.png"
                  alt={facility.name}
                  fill
                  className="object-contain"
                  sizes="20px"
                  onError={() => handleImageError(facility._id)}
                />
              )}
            </div>

            {/* Facility Name */}
            <span className="text-[var(--Body,#71727A)] font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px]">
              {facility.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
