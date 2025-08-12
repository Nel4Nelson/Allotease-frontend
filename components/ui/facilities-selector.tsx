"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { useDebouncedStaysFormStore } from "@/hooks/use-debounced-stay-store";
import { FacilitiesModal } from "@/components/ui/modals/facilities-modal";
import { FacilitiesService } from "@/services/facilities-service";
import { debounce } from "lodash";
import type { FacilityDetail } from "@/stores/stay-form-store";

// Main Facilities Selector Component
export function FacilitiesSelector() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<FacilityDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasInitiallyFetched, setHasInitiallyFetched] = useState(false);

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    selectedFacilities,
    addFacilityToSelection,
    removeFacilityFromSelection,
    updateFacilitiesCache,
    getFacilityDetails,
  } = useDebouncedStaysFormStore();

  // Fetch facilities from API using the service
  const fetchFacilities = async (query: string) => {
    setIsLoading(true);
    setError("");

    try {
      const facilities = await FacilitiesService.searchFacilities({ query });
      setSuggestions(facilities);
      setShowSuggestions(true);
      // Update cache with fetched facilities
      updateFacilitiesCache(facilities);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setError("Failed to fetch facilities. Please try again.");
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all facilities (for initial load on focus)
  const fetchAllFacilities = async () => {
    setIsLoading(true);
    setError("");

    try {
      const facilities = await FacilitiesService.searchFacilities(); // No query = get all
      setSuggestions(facilities);
      setShowSuggestions(true);
      setHasInitiallyFetched(true);
      // Update cache with fetched facilities
      updateFacilitiesCache(facilities);
    } catch (error) {
      console.error("Error fetching all facilities:", error);
      setError("Failed to fetch facilities. Please try again.");
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function for typed queries
  const debouncedSearch = debounce((query: string) => {
    if (!query.trim()) {
      // If query is empty, fetch all facilities
      fetchAllFacilities();
    } else {
      // If query has content, search with query
      fetchFacilities(query);
    }
  }, 300);

  // Handle input focus - fetch all facilities
  const handleInputFocus = () => {
    if (!hasInitiallyFetched) {
      fetchAllFacilities();
    } else {
      // If already fetched, just show existing suggestions
      setShowSuggestions(true);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (facility: FacilityDetail) => {
    if (!selectedFacilities.includes(facility._id)) {
      addFacilityToSelection(facility._id);
    }
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle facility removal
  const handleFacilityRemove = (facilityId: string) => {
    removeFacilityFromSelection(facilityId);
  };

  // Handle add facility from modal
  const handleAddFacility = async (facilityName: string, facilityIcon?: File | string) => {
    try {
      // Create the facility using the service
      const newFacility = await FacilitiesService.createFacility({
        name: facilityName,
        icon: facilityIcon,
      });

      // Add to selection and cache
      addFacilityToSelection(newFacility._id);
      updateFacilitiesCache([newFacility]);

      console.log("Successfully added new facility:", newFacility);
    } catch (error) {
      console.error("Failed to create facility:", error);
      throw error; // Re-throw to let modal handle the error
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get selected facility details for display
  const getSelectedFacilityDetails = (facilityId: string) => {
    return getFacilityDetails(facilityId);
  };

  return (
    <div>
      {/* Search Input */}
      <div className="relative mb-4">
        <FormInput
          ref={inputRef}
          label="Search facilities"
          placeholder="Search for facilities..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          className="w-full"
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--feature-accent-orange)]"></div>
          </div>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((facility) => (
              <div
                key={facility._id}
                onClick={() => handleSuggestionSelect(facility)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={facility.icon}
                    alt={facility.name}
                    width={24}
                    height={24}
                    className="object-cover rounded"
                  />
                  <span className="font-source-sans-pro text-sm text-[var(--color-dark-slate)]">
                    {facility.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {showSuggestions &&
          suggestions.length === 0 &&
          searchQuery.trim() &&
          !isLoading && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3"
            >
              <p className="text-gray-500 text-sm font-source-sans-pro">
                No facilities found. Try a different search term.
              </p>
            </div>
          )}
      </div>

      {/* Error message */}
      {error && (
        <p
          className="text-red-500 text-sm font-source-sans-pro mb-4"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Selected facilities list */}
      {selectedFacilities.length > 0 && (
        <div className="mb-4 space-y-2">
          {selectedFacilities.map((facilityId) => {
            const facilityDetails = getSelectedFacilityDetails(facilityId);
            if (!facilityDetails) return null;

            return (
              <div
                key={facilityId}
                className="flex items-center gap-1 p-2 bg-gray-50 rounded-md"
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Image
                  src={facilityDetails.icon}
                  alt={facilityDetails.name}
                  width={20}
                  height={20}
                  className="object-cover rounded"
                />
                <span className="font-source-sans-pro text-sm text-[var(--color-dark-slate)] flex-grow">
                  {facilityDetails.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleFacilityRemove(facilityId)}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label={`Remove ${facilityDetails.name}`}
                >
                  <svg
                    className="w-4 h-4"
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
              </div>
            );
          })}
        </div>
      )}

      {/* Add facility button */}
      <Button
        type="button"
        onClick={() => setIsModalOpen(true)}
        variant="allotease-blur"
        size="allotease-sm"
        className="text-[var(--Orange-Red,#FF5B00)] font-semibold"
      >
        Add facility
      </Button>

      {/* Add Facility Modal */}
      <FacilitiesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddFacility={handleAddFacility}
      />
    </div>
  );
}