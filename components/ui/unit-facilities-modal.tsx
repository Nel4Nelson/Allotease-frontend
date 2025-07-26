/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { FacilitiesSelector } from "@/components/ui/facilities-selector";
import { Button } from "@/components/ui/button";
import type { FacilityDetail } from "@/stores/stay-form-store";

interface UnitFacilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: string;
  unitTitle: string;
  selectedFacilities: string[];
  onAddFacility: (unitId: string, facilityId: string) => void;
  onRemoveFacility: (unitId: string, facilityId: string) => void;
  onUpdateCache: (facilities: FacilityDetail[]) => void;
  getFacilityDetails: (facilityId: string) => FacilityDetail | undefined;
}

export function UnitFacilitiesModal({
  isOpen,
  onClose,
  unitId,
  unitTitle,
  selectedFacilities,
  onAddFacility,
  onRemoveFacility,
  onUpdateCache,
  getFacilityDetails,
}: UnitFacilitiesModalProps) {
  const [hasChanges, setHasChanges] = useState(false);

  // Handle facility add with change tracking
  const handleAddFacility = (facilityId: string) => {
    onAddFacility(unitId, facilityId);
    setHasChanges(true);
  };

  // Handle facility remove with change tracking
  const handleRemoveFacility = (facilityId: string) => {
    onRemoveFacility(unitId, facilityId);
    setHasChanges(true);
  };

  // Handle modal close
  const handleClose = () => {
    setHasChanges(false);
    onClose();
  };

  // Handle save and close
  const handleSave = () => {
    setHasChanges(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-[24px] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-dark-slate)]">
              Add extra facility to space
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Add facilities specific to "{unitTitle}"
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            title="Close modal"
          >
            <svg
              className="w-4 h-4 text-gray-600"
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
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            Select additional facilities and amenities that are specifically
            available for this accommodation unit. These will be displayed
            alongside the unit details.
          </p>
        </div>

        {/* Facilities Selector */}
        <div className="mb-6">
          <FacilitiesSelector
            selectedFacilities={selectedFacilities}
            onAddFacility={handleAddFacility}
            onRemoveFacility={handleRemoveFacility}
            onUpdateCache={onUpdateCache}
            getFacilityDetails={getFacilityDetails}
            required={false}
            className="border-0 p-0"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            size="allotease-sm"
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="signup-primary"
            size="allotease-sm"
            onClick={handleSave}
            className={hasChanges ? "" : "opacity-75"}
          >
            {hasChanges ? "Save Changes" : "Done"}
          </Button>
        </div>

        {/* Selected facilities summary */}
        {selectedFacilities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {selectedFacilities.length} facilit
              {selectedFacilities.length === 1 ? "y" : "ies"} selected for this
              unit
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
