/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FormInput } from "@/components/ui/form-input";
import { StaysService } from "@/services/stays-service";
import type { FacilityDetail } from "@/stores/stay-form-store";
import { debounce } from "lodash";

interface FacilitiesSelectorProps {
  selectedFacilities: string[]; // Array of facility IDs
  onAddFacility: (facilityId: string) => void;
  onRemoveFacility: (facilityId: string) => void;
  onUpdateCache: (facilities: FacilityDetail[]) => void;
  getFacilityDetails: (facilityId: string) => FacilityDetail | undefined;
  error?: string;
  required?: boolean;
  className?: string;
}

export function FacilitiesSelector({
  selectedFacilities = [],
  onAddFacility,
  onRemoveFacility,
  onUpdateCache,
  getFacilityDetails,
  error,
  required = false,
  className = "",
}: FacilitiesSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<FacilityDetail[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Ensure component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        const results = await StaysService.searchFacilities(query);

        // Filter out already selected facilities
        const filteredResults = results.filter(
          (facility) => !selectedFacilities.includes(facility._id)
        );

        setSuggestions(filteredResults);
        setShowSuggestions(filteredResults.length > 0);

        // Update cache with search results
        if (results.length > 0) {
          onUpdateCache(results);
        }
      } catch (error) {
        console.error("Facility search failed:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [selectedFacilities, onUpdateCache]
  );

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      debouncedSearch(query.trim());
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
    }
  };

  // Handle facility selection from suggestions
  const handleFacilitySelect = (facility: FacilityDetail) => {
    onAddFacility(facility._id);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);

    // Focus back to search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle facility removal
  const handleFacilityRemove = (facilityId: string) => {
    onRemoveFacility(facilityId);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    if (mounted) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mounted]);

  // Get selected facility details for display
  const getSelectedFacilityDetails = () => {
    return selectedFacilities
      .map((id) => getFacilityDetails(id))
      .filter((facility): facility is FacilityDetail => facility !== undefined);
  };

  if (!mounted) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-[12px]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selected Facilities Display */}
      {selectedFacilities.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--color-dark-slate)]">
            Selected facilities ({selectedFacilities.length})
          </p>
          <div className="flex flex-wrap gap-3">
            {getSelectedFacilityDetails().map((facility) => (
              <div
                key={facility._id}
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-[12px] px-4 py-3 group hover:bg-gray-100 transition-colors"
              >
                {/* Facility Icon */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {facility.icon ? (
                    <img
                      src={facility.icon}
                      alt={facility.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-gray-500"
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
                    </div>
                  )}
                </div>

                {/* Facility Name */}
                <span className="text-sm font-medium text-[var(--color-dark-slate)] flex-1">
                  {facility.name}
                </span>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleFacilityRemove(facility._id)}
                  className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove facility"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <FormInput
          ref={searchInputRef}
          placeholder="Search facilities (e.g., Swimming pool, WiFi, Gym)*"
          value={searchQuery}
          onChange={handleSearchChange}
          error={error}
          required={required}
          className="w-full"
        />

        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((facility, index) => (
              <button
                key={facility._id}
                type="button"
                onClick={() => handleFacilitySelect(facility)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 flex items-center gap-3"
              >
                {/* Facility Icon */}
                <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {facility.icon ? (
                    <img
                      src={facility.icon}
                      alt={facility.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-gray-500"
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
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {facility.name}
                  </div>
                </div>

                {/* Add icon */}
                <div className="text-blue-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No results message */}
        {showSuggestions &&
          suggestions.length === 0 &&
          searchQuery.length >= 2 &&
          !isSearching && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg p-4 text-center text-gray-500 text-sm">
              No facilities found for "{searchQuery}"
            </div>
          )}
      </div>

      {/* Help text */}
      <div className="text-xs text-gray-500">
        Type to search and select facilities available in your accommodation.
        {selectedFacilities.length === 0 && required && (
          <span className="text-red-500 ml-1">
            At least one facility is required.
          </span>
        )}
      </div>
    </div>
  );
}
