"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDebouncedStaysFormStore } from "@/hooks/use-debounced-stay-store";
import { StaysService } from "@/services/stays-service";
import type { FacilityDetail } from "@/stores/stay-form-store";

interface StaysUnitsPreviewProps {
  className?: string;
}

export function StaysUnitsPreview({ className = "" }: StaysUnitsPreviewProps) {
  const { 
    units, 
    getFacilityDetails, 
    updateFacilitiesCache 
  } = useDebouncedStaysFormStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [unitsFacilitiesData, setUnitsFacilitiesData] = useState<Map<string, FacilityDetail[]>>(new Map());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Handle image load errors
  const handleImageError = (facilityId: string) => {
    setImageErrors(prev => new Set(prev).add(facilityId));
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format frequency for display
  const getFrequencyLabel = (frequency: string) => {
    const frequencyMap = {
      daily: 'Day',
      weekly: 'Week', 
      monthly: 'Month',
      yearly: 'Year'
    };
    return frequencyMap[frequency as keyof typeof frequencyMap] || frequency;
  };

  // Load facility details for all units
  useEffect(() => {
    const loadUnitsFacilities = async () => {
      if (!units || units.length === 0) {
        setUnitsFacilitiesData(new Map());
        return;
      }

      setIsLoading(true);

      try {
        const newUnitsFacilitiesData = new Map<string, FacilityDetail[]>();

        for (const unit of units) {
          if (unit.facilities && unit.facilities.length > 0) {
            // First, try to get from cache
            const cachedFacilities: FacilityDetail[] = [];
            const missingFacilityIds: string[] = [];

            unit.facilities.forEach(id => {
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
              fetchedFacilities = await StaysService.getFacilitiesDetails(missingFacilityIds);
              
              // Update cache with fetched data
              if (fetchedFacilities.length > 0) {
                updateFacilitiesCache(fetchedFacilities);
              }
            }

            // Combine cached and fetched data
            const allFacilities = [...cachedFacilities, ...fetchedFacilities];
            
            // Sort facilities to match unit.facilities order
            const sortedFacilities = unit.facilities
              .map(id => allFacilities.find(facility => facility._id === id))
              .filter((facility): facility is FacilityDetail => facility !== undefined);

            newUnitsFacilitiesData.set(unit.id, sortedFacilities);
          } else {
            newUnitsFacilitiesData.set(unit.id, []);
          }
        }

        setUnitsFacilitiesData(newUnitsFacilitiesData);

      } catch (err) {
        console.error("Failed to load units facilities:", err);
        // Set empty data on error
        setUnitsFacilitiesData(new Map());
      } finally {
        setIsLoading(false);
      }
    };

    loadUnitsFacilities();
  }, [units, getFacilityDetails, updateFacilitiesCache]);

  // Reset image errors when facilities data changes
  useEffect(() => {
    setImageErrors(new Set());
  }, [unitsFacilitiesData]);

  // Don't render section if no units
  if (!units || units.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-dark-slate)] mb-4">
            Availability
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-4 text-center">
            <p className="text-sm text-blue-700 font-medium">
              No accommodation units added yet
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Add units in the form to see availability options
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-dark-slate)] mb-1">
          Availability
        </h3>
        {isLoading && (
          <p className="text-sm text-gray-500">Loading accommodation details...</p>
        )}
      </div>

      {/* Date Picker Placeholder */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Available for booking</span>
      </div>

      {/* Units List */}
      <div className="space-y-4">
        {units.map((unit) => {
          const unitFacilities = unitsFacilitiesData.get(unit.id) || [];
          
          return (
            <div
              key={unit.id}
              className="bg-green-50 border border-green-200 rounded-[16px] p-6 relative"
            >
              {/* Unit Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-[var(--color-dark-slate)] mb-1">
                    {unit.title}
                  </h4>
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    {formatCurrency(unit.price)} / {getFrequencyLabel(unit.frequency)}
                  </div>
                </div>
                
                {/* Add Button */}
                <button
                  type="button"
                  className="w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors"
                  title="Select this accommodation"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              {/* Unit Description */}
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                {unit.description}
              </p>

              {/* Unit Facilities */}
              {unitFacilities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {unitFacilities.map((facility) => (
                    <div
                      key={facility._id}
                      className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1"
                    >
                      <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative">
                        {facility.icon && !imageErrors.has(facility._id) ? (
                          <Image
                            src={facility.icon}
                            alt={facility.name}
                            fill
                            className="object-cover"
                            sizes="16px"
                            onError={() => handleImageError(facility._id)}
                          />
                        ) : (
                          <svg className="w-full h-full text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-9a2 2 0 012-2h2a2 2 0 012 2v9M9 7h6m-6 4h6m-6 4h2" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {facility.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Loading state for unit facilities */}
              {isLoading && unit.facilities && unit.facilities.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {Array.from({ length: Math.min(3, unit.facilities.length) }).map((_, idx) => (
                    <div key={idx} className="animate-pulse">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="w-16 h-3 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Units Summary */}
      <div className="text-xs text-gray-500 text-center pt-2">
        {units.length} accommodation unit{units.length !== 1 ? 's' : ''} available
      </div>
    </div>
  );
}