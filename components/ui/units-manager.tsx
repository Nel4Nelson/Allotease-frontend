/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSelect } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";
import { UnitFacilitiesModal } from "@/components/ui/unit-facilities-modal";
import type { UnitData } from "@/stores/stay-form-store";
import type { FacilityDetail } from "@/stores/stay-form-store";

interface UnitsManagerProps {
  units: UnitData[];
  onAddUnit: (unit: Omit<UnitData, 'id'>) => void;
  onUpdateUnit: (unitId: string, updates: Partial<UnitData>) => void;
  onRemoveUnit: (unitId: string) => void;
  onAddUnitFacility: (unitId: string, facilityId: string) => void;
  onRemoveUnitFacility: (unitId: string, facilityId: string) => void;
  onUpdateCache: (facilities: FacilityDetail[]) => void;
  getFacilityDetails: (facilityId: string) => FacilityDetail | undefined;
  getUnitFacilities: (unitId: string) => string[];
  errors?: Record<string, any>;
}

// Frequency options for pricing
const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export function UnitsManager({
  units,
  onAddUnit,
  onUpdateUnit,
  onRemoveUnit,
  onAddUnitFacility,
  onRemoveUnitFacility,
  onUpdateCache,
  getFacilityDetails,
  getUnitFacilities,
  errors = {},
}: UnitsManagerProps) {
  const [currentUnit, setCurrentUnit] = useState({
    title: "",
    description: "",
    price: 0,
    frequency: "daily" as const,
    quantity: 1,
  });
  
  const [facilitiesModalState, setFacilitiesModalState] = useState<{
    isOpen: boolean;
    unitId: string;
    unitTitle: string;
  }>({
    isOpen: false,
    unitId: "",
    unitTitle: "",
  });

  // Generate next unit number for title placeholder
  const getNextUnitNumber = () => units.length + 1;

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
    const option = frequencyOptions.find(opt => opt.value === frequency);
    return option ? option.label : frequency;
  };

  // Handle adding a new unit
  const handleAddUnit = () => {
    if (
      currentUnit.title.trim() &&
      currentUnit.description.trim() &&
      currentUnit.price > 0 &&
      currentUnit.quantity > 0
    ) {
      onAddUnit({
        title: currentUnit.title.trim(),
        description: currentUnit.description.trim(),
        price: currentUnit.price,
        frequency: currentUnit.frequency,
        quantity: currentUnit.quantity,
        facilities: [], // Start with no facilities
      });

      // Reset form
      setCurrentUnit({
        title: "",
        description: "",
        price: 0,
        frequency: "daily",
        quantity: 1,
      });
    }
  };

  // Handle quantity change for existing units
  const handleQuantityChange = (unitId: string, delta: number) => {
    const unit = units.find(u => u.id === unitId);
    if (unit) {
      const newQuantity = Math.max(1, unit.quantity + delta);
      onUpdateUnit(unitId, { quantity: newQuantity });
    }
  };

  // Handle opening facilities modal
  const handleOpenFacilitiesModal = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    if (unit) {
      setFacilitiesModalState({
        isOpen: true,
        unitId,
        unitTitle: unit.title,
      });
    }
  };

  // Handle closing facilities modal
  const handleCloseFacilitiesModal = () => {
    setFacilitiesModalState({
      isOpen: false,
      unitId: "",
      unitTitle: "",
    });
  };

  // Get unit facility details for display
  const getUnitFacilityDetails = (unitId: string) => {
    const facilityIds = getUnitFacilities(unitId);
    return facilityIds
      .map(id => getFacilityDetails(id))
      .filter((facility): facility is FacilityDetail => facility !== undefined);
  };

  // Check if current unit form is valid
  const isCurrentUnitValid = () => {
    return (
      currentUnit.title.trim() &&
      currentUnit.description.trim() &&
      currentUnit.price > 0 &&
      currentUnit.quantity > 0
    );
  };

  return (
    <div className="space-y-6">
      {/* Existing Units Display */}
      {units.map((unit, index) => (
        <div
          key={unit.id}
          className="p-6 border border-gray-200 rounded-[16px] bg-gray-50 relative"
        >
          {/* Remove Unit Button */}
          <button
            type="button"
            onClick={() => onRemoveUnit(unit.id)}
            className="absolute top-4 right-4 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            title="Remove unit"
          >
            ×
          </button>

          {/* Unit Header */}
          <div className="flex items-start justify-between mb-4 pr-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-semibold text-[var(--color-dark-slate)]">
                  {index + 1}. {unit.title}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span className="font-medium">
                    {formatCurrency(unit.price)} / {getFrequencyLabel(unit.frequency)}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">
                {unit.description}
              </p>

              {/* Unit Facilities */}
              <div className="flex flex-wrap gap-2 mb-3">
                {getUnitFacilityDetails(unit.id).map((facility) => (
                  <div
                    key={facility._id}
                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1"
                  >
                    <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {facility.icon ? (
                        <img
                          src={facility.icon}
                          alt={facility.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300"></div>
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      {facility.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Facility Button */}
              <button
                type="button"
                onClick={() => handleOpenFacilitiesModal(unit.id)}
                className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add facility
              </button>
            </div>

            {/* Quantity Counter */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-[8px] px-2 py-1">
              <button
                type="button"
                onClick={() => handleQuantityChange(unit.id, -1)}
                disabled={unit.quantity <= 1}
                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span className="font-medium text-[var(--color-dark-slate)] min-w-[2rem] text-center">
                {unit.quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(unit.id, 1)}
                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add New Unit Form */}
      <div className="space-y-4 p-6 border border-gray-200 rounded-[16px] bg-white">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg font-semibold text-[var(--color-dark-slate)]">
            {getNextUnitNumber()}.
          </span>
          <h3 className="text-lg font-semibold text-[var(--color-dark-slate)]">
            Add New Accommodation Unit
          </h3>
        </div>

        {/* Unit Title */}
        <div>
          <FormInput
            placeholder={`Unit title* (e.g., Standard Twin Room x${getNextUnitNumber()})`}
            value={currentUnit.title}
            onChange={(e) =>
              setCurrentUnit({ ...currentUnit, title: e.target.value })
            }
            error={errors.title}
            required
          />
        </div>

        {/* Unit Description */}
        <div>
          <FormTextarea
            placeholder="Unit description* (describe the room features, amenities, size, etc.)"
            value={currentUnit.description}
            onChange={(e) =>
              setCurrentUnit({ ...currentUnit, description: e.target.value })
            }
            error={errors.description}
            required
            rows={3}
          />
        </div>

        {/* Price and Frequency Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormInput
              type="number"
              placeholder="Price* (NGN)"
              value={currentUnit.price || ""}
              onChange={(e) =>
                setCurrentUnit({
                  ...currentUnit,
                  price: e.target.value ? parseInt(e.target.value, 10) : 0,
                })
              }
              error={errors.price}
              required
              min="1"
              prefix="₦"
            />
          </div>
          <div>
            <FormSelect
              placeholder="Pricing frequency*"
              options={frequencyOptions}
              value={currentUnit.frequency}
              onValueChange={(value) =>
                setCurrentUnit({
                  ...currentUnit,
                  frequency: value as "daily" | "weekly" | "monthly" | "yearly",
                })
              }
              error={errors.frequency}
              required
            />
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-[var(--color-dark-slate)]">
            Available quantity:
          </span>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-[8px] px-3 py-2">
            <button
              type="button"
              onClick={() =>
                setCurrentUnit({
                  ...currentUnit,
                  quantity: Math.max(1, currentUnit.quantity - 1),
                })
              }
              disabled={currentUnit.quantity <= 1}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="font-medium text-[var(--color-dark-slate)] min-w-[2rem] text-center">
              {currentUnit.quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentUnit({
                  ...currentUnit,
                  quantity: currentUnit.quantity + 1,
                })
              }
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              +
            </button>
          </div>
        </div>

        {/* Add Unit Button */}
        <div className="flex justify-start">
          <Button
            type="button"
            variant="allotease-blur"
            size="allotease-sm"
            onClick={handleAddUnit}
            disabled={!isCurrentUnitValid()}
            className={`text-[var(--feature-accent-orange)] ${
              !isCurrentUnitValid() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={!isCurrentUnitValid() ? 'Please fill all required fields' : 'Add unit'}
          >
            Add Unit
          </Button>
        </div>
      </div>

      {/* Units Summary */}
      {units.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No accommodation units added yet.</p>
          <p className="text-xs mt-1">Add at least one unit to continue.</p>
        </div>
      )}

      {units.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          {units.length} unit{units.length !== 1 ? 's' : ''} added
        </div>
      )}

      {/* Unit Facilities Modal */}
      <UnitFacilitiesModal
        isOpen={facilitiesModalState.isOpen}
        onClose={handleCloseFacilitiesModal}
        unitId={facilitiesModalState.unitId}
        unitTitle={facilitiesModalState.unitTitle}
        selectedFacilities={getUnitFacilities(facilitiesModalState.unitId)}
        onAddFacility={onAddUnitFacility}
        onRemoveFacility={onRemoveUnitFacility}
        onUpdateCache={onUpdateCache}
        getFacilityDetails={getFacilityDetails}
      />
    </div>
  );
}