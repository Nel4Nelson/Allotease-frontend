/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDebouncedStaysFormStore } from "@/hooks/use-debounced-stay-store";
import { FacilitiesModal } from "@/components/ui/modals/facilities-modal";
import { FacilitiesService } from "@/services/facilities-service";
import { PREDEFINED_FACILITIES, FACILITY_CATEGORIES } from "@/constants/facilities";
import toast from "react-hot-toast";

interface MatchedFacility {
    name: string;
    category: string;
    icon?: string;
    id?: string; // Backend ID (undefined if not yet created)
    exists: boolean; // Whether it exists in backend
    isCreating?: boolean; // Loading state for auto-creation
}

export function FacilitiesBadgeSelector() {
    const [facilitiesByCategory, setFacilitiesByCategory] = useState<
        Record<string, MatchedFacility[]>
    >({});
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(FACILITY_CATEGORIES) // All expanded by default
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        selectedFacilities,
        addFacilityToSelection,
        removeFacilityFromSelection,
        updateFacilitiesCache,
    } = useDebouncedStaysFormStore();

    // Load and match facilities from backend
    useEffect(() => {
        loadAndMatchFacilities();
    }, []);

    const loadAndMatchFacilities = async () => {
        setIsLoading(true);
        try {
            // Fetch all facilities from backend (no query = all facilities)
            const allBackendFacilities = await FacilitiesService.searchFacilities();

            // Update cache with fetched facilities
            updateFacilitiesCache(allBackendFacilities);

            // Match predefined facilities with backend
            const matched = PREDEFINED_FACILITIES.map((predefined) => {
                const backendMatch = allBackendFacilities.find(
                    (bf) => bf.name.toLowerCase().trim() === predefined.name.toLowerCase().trim()
                );

                return {
                    name: predefined.name,
                    category: predefined.category,
                    icon: backendMatch?.icon || predefined.icon,
                    id: backendMatch?._id,
                    exists: !!backendMatch,
                    isCreating: false,
                };
            });

            // Group by category
            const grouped = FACILITY_CATEGORIES.reduce(
                (acc, category) => {
                    acc[category] = matched.filter((f) => f.category === category);
                    return acc;
                },
                {} as Record<string, MatchedFacility[]>
            );

            setFacilitiesByCategory(grouped);
        } catch (error) {
            console.error("Failed to load facilities:", error);
            toast.error("Failed to load facilities. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle category expansion
    const toggleCategory = (category: string) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(category)) {
                next.delete(category);
            } else {
                next.add(category);
            }
            return next;
        });
    };

    // Auto-create facility if it doesn't exist
    const createFacilityIfNeeded = async (
        facility: MatchedFacility
    ): Promise<string> => {
        if (facility.exists && facility.id) {
            return facility.id;
        }

        // Mark as creating
        setFacilitiesByCategory((prev) => ({
            ...prev,
            [facility.category]: prev[facility.category].map((f) =>
                f.name === facility.name ? { ...f, isCreating: true } : f
            ),
        }));

        try {
            // Create the facility
            const created = await FacilitiesService.createFacility({
                name: facility.name,
                icon: facility.icon,
            });

            // Update cache
            updateFacilitiesCache([created]);

            // Update local state to mark as existing
            setFacilitiesByCategory((prev) => ({
                ...prev,
                [facility.category]: prev[facility.category].map((f) =>
                    f.name === facility.name
                        ? {
                            ...f,
                            id: created._id,
                            exists: true,
                            isCreating: false,
                            icon: created.icon || f.icon,
                        }
                        : f
                ),
            }));

            return created._id;
        } catch (error) {
            console.error("Failed to create facility:", error);

            // Reset creating state
            setFacilitiesByCategory((prev) => ({
                ...prev,
                [facility.category]: prev[facility.category].map((f) =>
                    f.name === facility.name ? { ...f, isCreating: false } : f
                ),
            }));

            throw error;
        }
    };

    // Handle facility toggle (select/deselect)
    const handleFacilityToggle = async (facility: MatchedFacility) => {
        // If already selected, just remove
        if (facility.id && selectedFacilities.includes(facility.id)) {
            removeFacilityFromSelection(facility.id);
            return;
        }

        try {
            // Create if needed, then select
            const facilityId = await createFacilityIfNeeded(facility);
            addFacilityToSelection(facilityId);
        } catch (error) {
            toast.error(`Failed to add ${facility.name}. Please try again.`);
        }
    };

    // Handle custom facility creation from modal
    const handleAddCustomFacility = async (
        facilityName: string,
        facilityIcon?: File | string
    ) => {
        try {
            const newFacility = await FacilitiesService.createFacility({
                name: facilityName,
                icon: facilityIcon,
            });

            // Add to selection and cache
            addFacilityToSelection(newFacility._id);
            updateFacilitiesCache([newFacility]);

            toast.success("Custom facility added successfully!");
        } catch (error) {
            console.error("Failed to create custom facility:", error);
            throw error;
        }
    };

    // Check if facility is selected
    const isFacilitySelected = (facility: MatchedFacility): boolean => {
        return !!facility.id && selectedFacilities.includes(facility.id);
    };

    // Get selected count for category
    const getSelectedCountForCategory = (category: string): number => {
        const categoryFacilities = facilitiesByCategory[category] || [];
        return categoryFacilities.filter((f) => isFacilitySelected(f)).length;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-gray-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--feature-accent-orange)]"></div>
                    <span className="font-source-sans-pro text-sm">Loading facilities...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Facility Categories */}
            {FACILITY_CATEGORIES.map((category) => {
                const facilities = facilitiesByCategory[category] || [];
                const isExpanded = expandedCategories.has(category);
                const selectedCount = getSelectedCountForCategory(category);

                return (
                    <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Category Header */}
                        <button
                            type="button"
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <svg
                                    className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-90" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                                <h3 className="font-source-sans-pro text-base font-semibold text-[var(--color-dark-slate)]">
                                    {category}
                                </h3>
                                {selectedCount > 0 && (
                                    <span className="px-2 py-0.5 bg-[var(--feature-accent-orange)] text-white text-xs font-semibold rounded-full">
                                        {selectedCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm text-gray-500 font-source-sans-pro">
                                {facilities.length} facilities
                            </span>
                        </button>

                        {/* Category Facilities */}
                        {isExpanded && (
                            <div className="p-4 bg-white">
                                <div className="flex flex-wrap gap-2">
                                    {facilities.map((facility) => {
                                        const isSelected = isFacilitySelected(facility);
                                        const isDisabled = facility.isCreating;

                                        return (
                                            <button
                                                key={facility.name}
                                                type="button"
                                                onClick={() => handleFacilityToggle(facility)}
                                                disabled={isDisabled}
                                                className={`
                          relative inline-flex items-center gap-2 px-3 py-2 rounded-full
                          border transition-all duration-200
                          ${isSelected
                                                        ? "bg-[var(--feature-accent-orange)] border-[var(--feature-accent-orange)] text-white"
                                                        : "bg-white border-gray-300 text-[var(--color-dark-slate)] hover:border-[var(--feature-accent-orange)] hover:bg-orange-50"
                                                    }
                          ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        `}
                                            >
                                                {/* Icon if available */}
                                                {facility.icon && (
                                                    <Image
                                                        src={facility.icon}
                                                        alt={facility.name}
                                                        width={16}
                                                        height={16}
                                                        className="object-contain flex-shrink-0"
                                                        style={{
                                                            filter: isSelected ? "brightness(0) invert(1)" : "none",
                                                        }}
                                                    />
                                                )}

                                                {/* Facility Name */}
                                                <span className="font-source-sans-pro text-sm font-medium">
                                                    {facility.name}
                                                </span>

                                                {/* Loading spinner for creating */}
                                                {facility.isCreating && (
                                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                )}

                                                {/* Checkmark for selected */}
                                                {isSelected && !facility.isCreating && (
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
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Add Custom Facility Button */}
            <div className="pt-2">
                <Button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    variant="allotease-blur"
                    size="allotease-sm"
                    className="text-[var(--Orange-Red,#FF5B00)] font-semibold"
                >
                    + Add Custom Facility
                </Button>
            </div>

            {/* Custom Facility Modal */}
            <FacilitiesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddFacility={handleAddCustomFacility}
            />
        </div>
    );
}