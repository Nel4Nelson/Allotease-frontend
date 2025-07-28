"use client";
import React, { useEffect, useState } from "react";
import { useDebouncedStaysFormStore } from "@/hooks/use-debounced-stay-store";
import { StaysService } from "@/services/stays-service";
import type { FacilityDetail } from "@/stores/stay-form-store";

interface StaysFacilitiesPreviewProps {
  className?: string;
}

export function StaysFacilitiesPreview({
  className = "",
}: StaysFacilitiesPreviewProps) {
  const { selectedFacilities, getFacilityDetails, updateFacilitiesCache } =
    useDebouncedStaysFormStore();

  const [isLoading, setIsLoading] = useState(false);
  const [facilitiesData, setFacilitiesData] = useState<FacilityDetail[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load facility details for preview
  useEffect(() => {
    const loadFacilityDetails = async () => {
      if (!selectedFacilities || selectedFacilities.length === 0) {
        setFacilitiesData([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // First, try to get from cache
        const cachedFacilities: FacilityDetail[] = [];
        const missingFacilityIds: string[] = [];

        selectedFacilities.forEach((id) => {
          const cached = getFacilityDetails(id);
          if (cached) {
            cachedFacilities.push(cached);
          } else {
            missingFacilityIds.push(id);
          }
        });

        // Fetch missing facility details
        let fetchedFacilities: FacilityDetail[] = [];
        if (missingFacilityIds.length > 0) {
          fetchedFacilities = await StaysService.getFacilitiesDetails(
            missingFacilityIds
          );

          // Update cache with fetched data
          if (fetchedFacilities.length > 0) {
            updateFacilitiesCache(fetchedFacilities);
          }
        }

        // Combine cached and fetched data
        const allFacilities = [...cachedFacilities, ...fetchedFacilities];

        // Sort facilities to match selectedFacilities order
        const sortedFacilities = selectedFacilities
          .map((id) => allFacilities.find((facility) => facility._id === id))
          .filter(
            (facility): facility is FacilityDetail => facility !== undefined
          );

        setFacilitiesData(sortedFacilities);
      } catch (err) {
        console.error("Failed to load facility details:", err);
        setError("Failed to load facility information");

        // Fallback: show cached data only
        const cachedOnly = selectedFacilities
          .map((id) => getFacilityDetails(id))
          .filter(
            (facility): facility is FacilityDetail => facility !== undefined
          );

        setFacilitiesData(cachedOnly);
      } finally {
        setIsLoading(false);
      }
    };

    loadFacilityDetails();
  }, [selectedFacilities, getFacilityDetails, updateFacilitiesCache]);

  // Don't render section if no facilities selected
  if (!selectedFacilities || selectedFacilities.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-dark-slate)] mb-1">
          Popular facilities
        </h3>
        {isLoading && (
          <p className="text-sm text-gray-500">
            Loading facility information...
          </p>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Facilities Grid */}
      <div className="flex flex-wrap gap-3">
        {isLoading ? (
          // Loading skeleton
          <>
            {selectedFacilities.slice(0, 6).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  <div className="w-16 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          // Actual facilities
          <>
            {facilitiesData.map((facility) => (
              <div
                key={facility._id}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                {/* Facility Icon */}
                <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {facility.icon ? (
                    <img
                      src={facility.icon}
                      alt={facility.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to icon placeholder if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.innerHTML = `
                          <svg class="w-full h-full text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-9a2 2 0 012-2h2a2 2 0 012 2v9M9 7h6m-6 4h6m-6 4h2" />
                          </svg>
                        `;
                      }}
                    />
                  ) : (
                    <svg
                      className="w-full h-full text-gray-500"
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
                <span className="text-sm font-medium text-[var(--color-dark-slate)]">
                  {facility.name}
                </span>
              </div>
            ))}

            {/* Show missing facilities as placeholders */}
            {selectedFacilities.length > facilitiesData.length && (
              <>
                {selectedFacilities
                  .filter((id) => !facilitiesData.find((f) => f._id === id))
                  .map((missingId) => (
                    <div
                      key={missingId}
                      className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-full px-3 py-2 opacity-60"
                      title="Facility information unavailable"
                    >
                      <div className="w-4 h-4 rounded-full bg-gray-400 flex-shrink-0">
                        <svg
                          className="w-full h-full text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">
                        Unknown facility
                      </span>
                    </div>
                  ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Show count and status */}
      <div className="text-xs text-gray-500">
        {facilitiesData.length > 0 && (
          <span>
            Showing {facilitiesData.length} of {selectedFacilities.length}{" "}
            facilities
            {facilitiesData.length < selectedFacilities.length &&
              " (some unavailable)"}
          </span>
        )}
      </div>
    </div>
  );
}
