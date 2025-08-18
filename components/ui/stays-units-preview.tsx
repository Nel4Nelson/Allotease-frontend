"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useDebouncedStaysFormStore } from "@/hooks/use-debounced-stay-store";
import { CheckIcon, PlusIcon } from "@/components/icons";
import { DateRangeSelector } from "@/components/ui/date-range-selector";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface StaysUnitsPreviewProps {
  className?: string;
}

interface StaysUnitsPreviewProps {
  className?: string;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function StaysUnitsPreview({ 
  className = "", 
  dateRange, 
  onDateRangeChange 
}: StaysUnitsPreviewProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());

  const { units, getFacilityDetails, getUnitFacilities } = useDebouncedStaysFormStore();

  // Handle image load errors
  const handleImageError = (facilityId: string) => {
    setImageErrors((prev) => new Set(prev).add(facilityId));
  };

  // Handle unit selection (for preview purposes)
  const handleUnitToggle = (unitId: string) => {
    setSelectedUnits((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(unitId)) {
        newSet.delete(unitId);
      } else {
        newSet.add(unitId);
      }
      return newSet;
    });
  };

  // Check if unit is selected
  const isUnitSelected = (unitId: string) => {
    return selectedUnits.has(unitId);
  };

  // Format price
  const formatPrice = (price: number, frequency: string) => {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    });
    return `${formatter.format(price)} / ${frequency}`;
  };

  // Get facilities for a unit
  const getUnitFacilitiesData = (unitId: string) => {
    const unitFacilityIds = getUnitFacilities(unitId);
    return unitFacilityIds
      .map(facilityId => getFacilityDetails(facilityId))
      .filter((facility): facility is NonNullable<typeof facility> => facility !== undefined);
  };

  return (
    <div className={className}>
      {/* Section Title */}
      <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
        Availability
      </h3>

      {/* Synchronized Date Range Selector */}
      <div className="mb-6">
        <div className="space-y-2 lg:w-[220px]">
          <DateRangeSelector
            value={dateRange}
            onChange={onDateRangeChange}
            placeholder="check-in and check-out"
          />
        </div>
      </div>

      {/* Units List */}
      <div className="space-y-4">
        {units.map((unit) => {
          const isSelected = isUnitSelected(unit.id);
          const unitFacilities = getUnitFacilitiesData(unit.id);

          return (
            <div
              key={unit.id}
              style={{
                display: "flex",
                padding: "16px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "8px",
                alignSelf: "stretch",
                borderRadius: "12px",
                border: isSelected
                  ? "1px solid rgba(21, 186, 107, 0.20)"
                  : "1px solid rgba(138, 174, 164, 0.20)",
                background: isSelected
                  ? "#E3F5EB"
                  : "rgba(242, 244, 247, 0.50)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => handleUnitToggle(unit.id)}
            >
              {/* Header with Title and Selection Button */}
              <div className="flex items-center justify-between w-full">
                <h4
                  style={{
                    color: "#1F2024",
                    fontFamily: "var(--font-source-sans), sans-serif",
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "142.745%",
                    letterSpacing: "-0.36px",
                    margin: 0,
                  }}
                >
                  {unit.title} × {unit.quantity}
                </h4>

                {/* Selection Button */}
                <button
                  style={{
                    borderRadius: "39.667px",
                    border: isSelected
                      ? "0.778px solid #15BA6B"
                      : "0.778px solid rgba(138, 174, 164, 0.50)",
                    background: isSelected
                      ? "rgba(255, 255, 255, 0.70)"
                      : "rgba(242, 244, 247, 0.50)",
                    backdropFilter: isSelected
                      ? "blur(16.33333396911621px)"
                      : "none",
                    display: "flex",
                    width: "28px",
                    height: "28px",
                    padding: "4.667px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "11.667px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnitToggle(unit.id);
                  }}
                >
                  {isSelected ? <CheckIcon /> : <PlusIcon />}
                </button>
              </div>

              {/* Price Badge */}
              <div
                style={{
                  borderRadius: "4px",
                  background: "rgba(138, 174, 164, 0.20)",
                  display: "flex",
                  padding: "2px 8px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    color: "#1F3A3A",
                    fontFamily: "var(--font-source-sans), sans-serif",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "142.745%",
                    letterSpacing: "-0.28px",
                  }}
                >
                  {formatPrice(unit.price, unit.frequency)}
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  color: "#71727A",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "142.745%",
                  letterSpacing: "-0.32px",
                  margin: 0,
                }}
              >
                {unit.description}
              </p>

              {/* Unit Facilities */}
              {unitFacilities.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {unitFacilities.map((facility) => (
                    <div key={facility._id} className="flex items-center gap-2">
                      {/* Facility Icon */}
                      <div className="w-4 h-4 flex-shrink-0 relative">
                        {facility.icon && !imageErrors.has(facility._id) ? (
                          <Image
                            src={facility.icon}
                            alt={facility.name}
                            fill
                            className="object-contain"
                            sizes="16px"
                            onError={() => handleImageError(facility._id)}
                          />
                        ) : (
                          <svg
                            className="w-4 h-4 text-gray-400"
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
                      <span className="text-[var(--Body,#71727A)] font-source-sans-pro text-sm font-normal">
                        {facility.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No units available */}
      {units.length === 0 && (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 
            className="text-lg font-semibold mb-2"
            style={{
              color: "var(--Title, #1F2024)",
              fontFamily: "var(--font-source-sans), sans-serif",
            }}
          >
            No units available
          </h3>
          <p 
            className="text-sm"
            style={{
              color: "#7A7A7A",
              fontFamily: "var(--font-source-sans), sans-serif",
            }}
          >
            Add accommodation units to see them in the preview.
          </p>
        </div>
      )}
    </div>
  );
}