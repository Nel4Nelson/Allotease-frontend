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
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-9a2 2 0 012-2h2a2 2 0 012 2v9M9 7h6m-6 4h6m-6 4h2"
                  />
                </svg>
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
