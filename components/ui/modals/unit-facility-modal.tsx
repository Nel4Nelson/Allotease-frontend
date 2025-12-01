/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { useDebouncedStaysFormStore } from "@/hooks/use-debounced-stay-store";
import type { FacilityDetail } from "@/stores/stay-form-store";

interface UnitFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: string | null;
  unitTitle?: string;
}

export function UnitFacilityModal({
  isOpen,
  onClose,
  unitId,
  unitTitle,
}: UnitFacilityModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const store = useDebouncedStaysFormStore();

  // Extract functions and data from store
  const selectedFacilities = store.selectedFacilities || [];
  const getFacilityDetails = store.getFacilityDetails;
  const addFacilityToUnit = store.addFacilityToUnit;
  const removeFacilityFromUnit = store.removeFacilityFromUnit;
  const getUnitFacilities = store.getUnitFacilities;

  // Get unit facilities with proper reactivity
  const unitFacilities = useMemo(() => {
    if (!unitId || !getUnitFacilities) return [];
    return getUnitFacilities(unitId);
  }, [unitId, getUnitFacilities, store.units]); // Add store.units as dependency

  // Get all stay facilities with their details
  const allStayFacilities = useMemo(() => {
    if (!getFacilityDetails) return [];
    return selectedFacilities
      .map((facilityId) => getFacilityDetails(facilityId))
      .filter(Boolean) as FacilityDetail[];
  }, [selectedFacilities, getFacilityDetails]);

  // Filter facilities based on search query
  const filteredFacilities = useMemo(() => {
    if (!searchQuery.trim()) {
      return allStayFacilities;
    }
    return allStayFacilities.filter((facility) =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allStayFacilities]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle facility toggle
  const handleFacilityToggle = (facility: FacilityDetail) => {
    if (!unitId) return;

    const isSelected = unitFacilities.includes(facility._id);

    if (isSelected) {
      removeFacilityFromUnit?.(unitId, facility._id);
    } else {
      addFacilityToUnit?.(unitId, facility._id);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Reset search when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      // Focus the input after a short delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Check if stay has any facilities
  const hasStayFacilities = selectedFacilities.length > 0;
  const selectedCount = unitFacilities.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Modal */}
      <div
        className="relative"
        style={{
          borderRadius: "20px",
          background: "rgba(242, 244, 247, 0.60)",
          boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.04)",
          backdropFilter: "blur(83.3499984741211px)",
          display: "flex",
          width: "600px",
          maxWidth: "90vw",
          padding: "32px",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-3 hover:bg-black/5 rounded-full transition-colors z-20"
          style={{
            minWidth: "44px",
            minHeight: "44px",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Background Gradient Container */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.6,
            background:
              "linear-gradient(354deg, #FFF 24.04%, rgba(255, 243, 230, 0.35) 59.41%, #D5FFEB 113.97%)",
            filter: "blur(18.285715103149414px)",
            borderRadius: "20px",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 w-full">
          {/* Title */}
          <div className="space-y-2">
            <h2
              style={{
                color: "var(--Title, #1F2024)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "140%",
                letterSpacing: "-0.4px",
                margin: 0,
              }}
            >
              Add facilities to {unitTitle || "unit"}
            </h2>

            {/* Subtitle with count */}
            <p
              style={{
                color: "#7A7A7A",
                textAlign: "center",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
                margin: 0,
              }}
            >
              {selectedCount > 0
                ? `${selectedCount} ${
                    selectedCount === 1 ? "facility" : "facilities"
                  } selected from your accommodation's facilities.`
                : "Select facilities from your accommodation's general facilities to add to this unit."}
            </p>
          </div>

          {/* Content */}
          <div className="w-full space-y-6">
            {!hasStayFacilities ? (
              /* No Stay Facilities Message */
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{
                    color: "var(--Title, #1F2024)",
                    fontFamily: "var(--font-source-sans), sans-serif",
                  }}
                >
                  No facilities available
                </h3>
                <p
                  className="text-sm mb-6"
                  style={{
                    color: "#7A7A7A",
                    fontFamily: "var(--font-source-sans), sans-serif",
                  }}
                >
                  Please add facilities to your accommodation first before
                  adding them to individual units.
                </p>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="signup-primary"
                    size="allotease-md"
                    style={{
                      background: "#FF5B06",
                      borderRadius: "51px",
                      padding: "12px 24px",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: 600,
                      fontFamily: "var(--font-source-sans), sans-serif",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Search Input */}
                <div className="space-y-1">
                  <FormInput
                    ref={inputRef}
                    label="Search facilities"
                    placeholder="Search available facilities..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full"
                  />
                </div>

                {/* Facilities Pills */}
                <div className="space-y-4">
                  {/* Helper text when no facilities selected */}
                  {selectedCount === 0 && (
                    <p
                      className="text-xs text-gray-500 text-center mb-3"
                      style={{
                        fontFamily: "var(--font-source-sans), sans-serif",
                      }}
                    >
                      Click on any facility below to add it to this unit
                    </p>
                  )}

                  {filteredFacilities.length > 0 ? (
                    <div className="flex flex-wrap gap-3 overflow-y-auto p-2">
                      {filteredFacilities.map((facility) => {
                        const isSelected = unitFacilities.includes(
                          facility._id
                        );

                        return (
                          <div
                            key={facility._id}
                            onClick={() => handleFacilityToggle(facility)}
                            className={`
                              relative flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer transition-all
                              ${
                                isSelected
                                  ? "text-white"
                                  : "bg-white/60 border border-gray-200 hover:bg-white/80 text-gray-600"
                              }
                            `}
                            style={
                              isSelected
                                ? {
                                    background: "#FF5B06",
                                    color: "white",
                                  }
                                : {}
                            }
                          >
                            {/* Facility Icon with Fallback */}
                            <FallbackImage
                              src={facility.icon || "/icons/facilities.png"}
                              fallbackSrc="/icons/default-facility.svg"
                              alt={facility.name}
                              width={16}
                              height={16}
                              className="object-contain flex-shrink-0"
                            />

                            {/* Facility Name */}
                            <span
                              className="text-sm font-medium whitespace-nowrap"
                              style={{
                                fontFamily:
                                  "var(--font-source-sans), sans-serif",
                              }}
                            >
                              {facility.name}
                            </span>

                            {/* Remove Icon for Selected */}
                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFacilityToggle(facility);
                                }}
                                className="ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors flex-shrink-0"
                                aria-label={`Remove ${facility.name}`}
                              >
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* No filtered facilities */
                    <div className="text-center py-2">
                      <p
                        className="text-sm text-gray-500"
                        style={{
                          fontFamily: "var(--font-source-sans), sans-serif",
                        }}
                      >
                        {searchQuery.trim()
                          ? `No facilities found matching "${searchQuery}".`
                          : "No facilities available."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Done Button */}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="signup-primary"
                    size="allotease-md"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#E54A00";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#FF5B06";
                    }}
                  >
                    Done
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}