"use client";
import React, { useState } from "react";
import Image from "next/image";
import type { StayUnit, StayFacility } from "@/services/stays-service";
import { useBookingStore } from "@/stores/booking-store";
import { CheckIcon, PlusIcon } from "@/components/icons";

interface StayDetailsAvailabilityProps {
  units: StayUnit[];
  facilitiesData: StayFacility[];
  className?: string;
}

export function StayDetailsAvailability({
  units,
  facilitiesData,
  className = "",
}: StayDetailsAvailabilityProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const { isUnitSelected, addUnit, removeUnit } = useBookingStore();

  // Handle image load errors
  const handleImageError = (facilityId: string) => {
    setImageErrors((prev) => new Set(prev).add(facilityId));
  };

  // Get unit availability
  const getAvailability = (unit: StayUnit) => {
    const available = unit.quantity - unit.totalBooked;

    if (available <= 0) {
      return { available: 0, status: "unavailable" as const };
    } else if (available <= 5) {
      return { available, status: "limited" as const };
    } else {
      return { available, status: "available" as const };
    }
  };

  // Handle unit selection
  const handleUnitToggle = (unitId: string, frequency: string) => {
    if (isUnitSelected(unitId)) {
      removeUnit(unitId);
    } else {
      addUnit(unitId, frequency);
    }
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
  const getUnitFacilities = (unit: StayUnit) => {
    return facilitiesData.filter((facility) =>
      unit.facilities.includes(facility._id)
    );
  };

  return (
    <div className={className}>
      {/* Section Title */}
      <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
        Availability
      </h3>

      {/* Info Text */}
      <div className="mb-6">
        <p className="text-[var(--Body,#71727A)] font-source-sans-pro text-sm font-normal">
          Select room types below. Each room will have its own booking dates and duration settings in the reservation card.
        </p>
      </div>

      {/* Units List */}
      <div className="space-y-4">
        {units.map((unit) => {
          const isSelected = isUnitSelected(unit._id);
          const { available, status } = getAvailability(unit);
          const unitFacilities = getUnitFacilities(unit);

          return (
            <div
              key={unit._id}
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
              onClick={() => handleUnitToggle(unit._id, unit.frequency)}
            >
              {/* Header with Title, Remaining Units, and Selection Button */}
              <div className="flex items-start justify-between w-full gap-3">
                <div className="flex-1">
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
                    {unit.title}
                  </h4>
                </div>

                {/* Right side: Remaining units and selection button */}
                <div className="flex items-center gap-3">
                  {/* Remaining Units Badge */}
                  <div
                    style={{
                      borderRadius: "6px",
                      background:
                        status === "unavailable"
                          ? "rgba(239, 68, 68, 0.15)"
                          : status === "limited"
                            ? "rgba(251, 191, 36, 0.15)"
                            : "rgba(34, 197, 94, 0.15)",
                      padding: "4px 8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        color:
                          status === "unavailable"
                            ? "#DC2626"
                            : status === "limited"
                              ? "#F59E0B"
                              : "#16A34A",
                        fontFamily: "var(--font-source-sans), sans-serif",
                        fontSize: "12px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "140%",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {status === "unavailable"
                        ? "Fully Booked"
                        : `${available} ${available === 1 ? "unit" : "units"} left`}
                    </span>
                  </div>

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
                      handleUnitToggle(unit._id, unit.frequency);
                    }}
                  >
                    {isSelected ? <CheckIcon /> : <PlusIcon />}
                  </button>
                </div>
              </div>

              {/* Price Badge */}
              <div
                style={{
                  borderRadius: "4px",
                  background: available
                    ? "rgba(138, 174, 164, 0.20)"
                    : "rgba(200, 200, 200, 0.20)",
                  display: "flex",
                  padding: "2px 8px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    color: available ? "#1F3A3A" : "#9CA3AF",
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
                  color: available ? "#71727A" : "#9CA3AF",
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
                      <span
                        className="font-source-sans-pro text-sm font-normal"
                        style={{
                          color: available ? "#71727A" : "#9CA3AF",
                        }}
                      >
                        {facility.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Selection Indicator Text */}
              {isSelected && available ? (
                <div className="mt-2">
                  <p className="text-[#15BA6B] font-source-sans-pro text-sm font-medium">
                    ✓ Selected - Configure dates and duration in the reservation card
                  </p>
                </div>
              ) : ""}
            </div>
          );
        })}
      </div>

      {/* No units available */}
      {units.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No room types available</p>
        </div>
      )}
    </div>
  );
}