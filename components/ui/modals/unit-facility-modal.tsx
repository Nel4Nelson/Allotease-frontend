/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
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

export function UnitFacilityModal({ isOpen, onClose, unitId, unitTitle }: UnitFacilityModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const store = useDebouncedStaysFormStore();
  
  // Extract functions and data from store
  const selectedFacilities = store.selectedFacilities || [];
  const getFacilityDetails = store.getFacilityDetails;
  const addFacilityToUnit = store.addFacilityToUnit;
  const removeFacilityFromUnit = store.removeFacilityFromUnit;
  const getUnitFacilities = store.getUnitFacilities;

  // Get unit facilities
  const unitFacilities = useMemo(() => {
    if (!unitId || !getUnitFacilities) return [];
    return getUnitFacilities(unitId);
  }, [unitId, getUnitFacilities]);

  // Get available facilities (stay facilities that aren't already in unit)
  const availableFacilities = useMemo(() => {
    if (!getFacilityDetails) return [];
    return selectedFacilities
      .filter(facilityId => !unitFacilities.includes(facilityId))
      .map(facilityId => getFacilityDetails(facilityId))
      .filter(Boolean) as FacilityDetail[];
  }, [selectedFacilities, unitFacilities, getFacilityDetails]);

  // Filter facilities based on search query
  const filteredFacilities = useMemo(() => {
    if (!searchQuery.trim()) {
      return availableFacilities;
    }
    return availableFacilities.filter(facility =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, availableFacilities]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  // Handle facility selection
  const handleFacilitySelect = (facility: FacilityDetail) => {
    if (unitId && addFacilityToUnit) {
      addFacilityToUnit(unitId, facility._id);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  // Handle facility removal from unit
  const handleFacilityRemove = (facilityId: string) => {
    if (unitId && removeFacilityFromUnit) {
      removeFacilityFromUnit(unitId, facilityId);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Reset search when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setShowSuggestions(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Check if stay has any facilities
  const hasStayFacilities = selectedFacilities.length > 0;

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
          width: "666px",
          padding: "20px",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors z-20"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Background Gradient Container */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.6,
            background: "linear-gradient(354deg, #FFF 24.04%, rgba(255, 243, 230, 0.35) 59.41%, #D5FFEB 113.97%)",
            filter: "blur(18.285715103149414px)",
            borderRadius: "20px",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 w-full">
          {/* Title */}
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
            Add facilities to {unitTitle || 'unit'}
          </h2>

          {/* Subtitle */}
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
            Select facilities from your accommodation's general facilities to add to this unit.
          </p>

          {/* Content */}
          <div className="w-full space-y-4">
            {!hasStayFacilities ? (
              /* No Stay Facilities Message */
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
                  No facilities available
                </h3>
                <p 
                  className="text-sm mb-4"
                  style={{
                    color: "#7A7A7A",
                    fontFamily: "var(--font-source-sans), sans-serif",
                  }}
                >
                  Please add facilities to your accommodation first before adding them to individual units.
                </p>
                <Button
                  type="button"
                  onClick={onClose}
                  variant="signup-primary"
                  size="allotease-md"
                >
                  Close
                </Button>
              </div>
            ) : (
              <>
                {/* Search Input */}
                <div className="relative">
                  <FormInput
                    ref={inputRef}
                    label="Search facilities"
                    placeholder="Search available facilities..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleInputFocus}
                    className="w-full"
                  />

                  {/* Suggestions dropdown */}
                  {showSuggestions && filteredFacilities.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto"
                    >
                      {filteredFacilities.map((facility) => (
                        <div
                          key={facility._id}
                          onClick={() => handleFacilitySelect(facility)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={facility.icon}
                              alt={facility.name}
                              width={20}
                              height={20}
                              className="object-cover rounded"
                            />
                            <span 
                              className="text-sm"
                              style={{
                                fontFamily: "var(--font-source-sans), sans-serif",
                                color: "var(--color-dark-slate)",
                              }}
                            >
                              {facility.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No available facilities message */}
                  {showSuggestions && filteredFacilities.length === 0 && searchQuery.trim() && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3"
                    >
                      <p 
                        className="text-sm text-gray-500"
                        style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
                      >
                        No facilities found matching "{searchQuery}".
                      </p>
                    </div>
                  )}
                </div>

                {/* Current unit facilities */}
                {unitFacilities.length > 0 && (
                  <div className="space-y-3">
                    <h3 
                      className="text-sm font-medium text-left"
                      style={{
                        color: "var(--color-dark-slate)",
                        fontFamily: "var(--font-source-sans), sans-serif",
                      }}
                    >
                      Current facilities in this unit:
                    </h3>
                    <div className="space-y-2">
                      {unitFacilities.map((facilityId) => {
                        const facilityDetails = getFacilityDetails ? getFacilityDetails(facilityId) : null;
                        if (!facilityDetails) return null;

                        return (
                          <div
                            key={facilityId}
                            className="flex items-center gap-3 p-2 bg-white/50 rounded-md"
                          >
                            <Image
                              src={facilityDetails.icon}
                              alt={facilityDetails.name}
                              width={20}
                              height={20}
                              className="object-cover rounded"
                            />
                            <span 
                              className="flex-grow text-sm"
                              style={{
                                fontFamily: "var(--font-source-sans), sans-serif",
                                color: "var(--color-dark-slate)",
                              }}
                            >
                              {facilityDetails.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleFacilityRemove(facilityId)}
                              className="text-red-500 hover:text-red-700 p-1"
                              aria-label={`Remove ${facilityDetails.name}`}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* No more facilities available */}
                {availableFacilities.length === 0 && unitFacilities.length > 0 && (
                  <div className="text-center py-4">
                    <p 
                      className="text-sm text-gray-500"
                      style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
                    >
                      All available facilities have been added to this unit.
                    </p>
                  </div>
                )}

                {/* Done Button */}
                <Button
                  type="button"
                  onClick={onClose}
                  variant="signup-primary"
                  size="allotease-md"
                  className="w-full"
                >
                  Done
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}