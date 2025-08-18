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
  const [isSelecting, setIsSelecting] = useState(false); // Prevent race conditions

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    selectedFacilities,
    addFacilityToSelection,
    removeFacilityFromSelection,
    updateFacilitiesCache,
    getFacilityDetails,
    loadMissingFacilities, // New method to load missing facility details
  } = useDebouncedStaysFormStore();

  // Fetch facilities from API using the service
  const fetchFacilities = async (query: string = "") => {
    if (isSelecting) return; // Prevent fetch during selection
    
    setIsLoading(true);
    setError("");

    try {
      const facilities = await FacilitiesService.searchFacilities(
        query ? { query } : undefined
      );
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

  // Debounced search function for typed queries
  const debouncedSearch = debounce((query: string) => {
    fetchFacilities(query);
  }, 300);

  // Handle input focus - always fetch facilities
  const handleInputFocus = () => {
    if (!isSelecting) {
      // Always fetch on focus to ensure fresh data
      fetchFacilities(searchQuery);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle suggestion selection with race condition prevention
  const handleSuggestionSelect = async (facility: FacilityDetail) => {
    if (isSelecting) return; // Prevent multiple rapid clicks
    
    setIsSelecting(true);
    
    try {
      if (!selectedFacilities.includes(facility._id)) {
        addFacilityToSelection(facility._id);
      }
      
      // Clear search and close suggestions
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
      
      // Focus back to input for better UX
      if (inputRef.current) {
        inputRef.current.blur();
      }
    } finally {
      // Add delay to prevent rapid successive selections
      setTimeout(() => {
        setIsSelecting(false);
      }, 200);
    }
  };

  // Handle facility removal
  const handleFacilityRemove = (facilityId: string) => {
    if (isSelecting) return;
    removeFacilityFromSelection(facilityId);
  };

  // Handle add facility from modal
  const handleAddFacility = async (
    facilityName: string,
    facilityIcon?: File | string
  ) => {
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

  // Load missing facility details on component mount (fixes refresh issue)
  useEffect(() => {
    const loadMissingDetails = async () => {
      const missingFacilities = selectedFacilities.filter(
        (facilityId) => !getFacilityDetails(facilityId)
      );

      if (missingFacilities.length > 0) {
        try {
          await loadMissingFacilities(missingFacilities);
        } catch (error) {
          console.error("Failed to load missing facility details:", error);
        }
      }
    };

    loadMissingDetails();
  }, [selectedFacilities, getFacilityDetails, loadMissingFacilities]);

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
        {showSuggestions && suggestions.length > 0 && !isSelecting && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((facility) => (
              <div
                key={facility._id}
                onClick={() => handleSuggestionSelect(facility)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                style={{ 
                  pointerEvents: isSelecting ? 'none' : 'auto',
                  opacity: isSelecting ? 0.7 : 1
                }}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={facility.icon}
                    alt={facility.name}
                    width={24}
                    height={24}
                    className="object-contain !bg-transparent"
                    style={{ backgroundColor: "transparent" }}
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
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedFacilities.map((facilityId) => {
            const facilityDetails = getSelectedFacilityDetails(facilityId);
            
            // Show loading state for missing facility details
            if (!facilityDetails) {
              return (
                <div
                  key={facilityId}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full animate-pulse"
                >
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  <span className="font-source-sans-pro text-sm text-gray-400">
                    Loading...
                  </span>
                </div>
              );
            }

            return (
              <div
                key={facilityId}
                className="relative inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full hover:shadow-md transition-all duration-200"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(229, 229, 229, 0.8)",
                }}
              >
                <Image
                  src={facilityDetails.icon}
                  alt={facilityDetails.name}
                  width={16}
                  height={16}
                  className="object-contain flex-shrink-0"
                  style={{ backgroundColor: "transparent" }}
                />
                <span className="font-source-sans-pro text-sm text-[var(--color-dark-slate)] font-medium pr-2">
                  {facilityDetails.name}
                </span>
                
                {/* Remove button positioned at top-right */}
                <button
                  type="button"
                  onClick={() => handleFacilityRemove(facilityId)}
                  disabled={isSelecting}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors disabled:opacity-50 shadow-sm"
                  aria-label={`Remove ${facilityDetails.name}`}
                  style={{
                    fontSize: "10px",
                    lineHeight: "1",
                  }}
                >
                  ×
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