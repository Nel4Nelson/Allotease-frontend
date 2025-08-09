/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSelect } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";
import { useDebouncedStaysFormStore } from "@/hooks/use-debounced-stay-store";
import { EditUnitModal } from "@/components/ui/modals/edit-unit-modal";
import { UnitFacilityModal } from "@/components/ui/modals/unit-facility-modal";
import type { UnitData } from "@/stores/stay-form-store";

// Icons as React components
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 3.5V12.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.5 8H12.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3.5 8H12.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M7.5 16.874H3.75C3.58424 16.874 3.42527 16.8081 3.30806 16.6909C3.19085 16.5737 3.125 16.4147 3.125 16.249V12.7568C3.12472 12.6756 3.14044 12.5952 3.17128 12.5201C3.20211 12.445 3.24745 12.3768 3.30469 12.3193L12.6797 2.94427C12.7378 2.88521 12.8072 2.83832 12.8836 2.80631C12.9601 2.7743 13.0421 2.75781 13.125 2.75781C13.2079 2.75781 13.2899 2.7743 13.3664 2.80631C13.4428 2.83832 13.5122 2.88521 13.5703 2.94427L17.0547 6.42864C17.1137 6.4868 17.1606 6.55612 17.1927 6.63257C17.2247 6.70902 17.2411 6.79107 17.2411 6.87395C17.2411 6.95684 17.2247 7.03889 17.1927 7.11534C17.1606 7.19179 17.1137 7.26111 17.0547 7.31927L7.5 16.874Z"
      stroke="#1F2024"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.625 5L15 9.375"
      stroke="#1F2024"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.875 16.875H7.5"
      stroke="#1F2024"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AddFacilityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M10 2.5C14.1421 2.5 17.5 5.85786 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5Z"
      stroke="#FF5B00"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.875 10H13.125"
      stroke="#FF5B00"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 13.125V6.875"
      stroke="#FF5B00"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Frequency options
const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

// Main Unit Manager Component
export function UnitManager() {
  const store = useDebouncedStaysFormStore();

  // Extract values from store to avoid re-render issues
  const units = store.units || [];
  const addUnitToStore = store.addUnitToStore;
  const updateUnitInStore = store.updateUnitInStore;
 // const removeUnitFromStore = store.removeUnitFromStore;
  const getFacilityDetails = store.getFacilityDetails;
  const getUnitFacilities = store.getUnitFacilities;

  const [currentUnit, setCurrentUnit] = useState({
    title: "",
    description: "",
    price: 0,
    frequency: "daily" as "daily" | "weekly" | "monthly" | "yearly",
    quantity: 1,
  });

  const [editingUnit, setEditingUnit] = useState<UnitData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUnitForFacilities, setSelectedUnitForFacilities] = useState<
    string | null
  >(null);
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);

  // Add new unit
  const handleAddUnit = useCallback(() => {
    if (
      currentUnit.title.trim() &&
      currentUnit.description.trim() &&
      currentUnit.price > 0
    ) {
      addUnitToStore({
        title: currentUnit.title.trim(),
        description: currentUnit.description.trim(),
        price: currentUnit.price,
        frequency: currentUnit.frequency,
        quantity: currentUnit.quantity,
        facilities: [],
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
  }, [currentUnit, addUnitToStore]);

  // Edit unit
  const handleEditUnit = useCallback((unit: UnitData) => {
    setEditingUnit(unit);
    setIsEditModalOpen(true);
  }, []);

  // Update unit
  const handleUpdateUnit = useCallback(
    (unitId: string, updates: Partial<UnitData>) => {
      updateUnitInStore(unitId, updates);
    },
    [updateUnitInStore]
  );

  // Open facility modal for unit
  const handleAddFacilityToUnit = useCallback((unit: UnitData) => {
    setSelectedUnitForFacilities(unit.id);
    setIsFacilityModalOpen(true);
  }, []);

  // Format price display
  const formatPrice = (price: number, frequency: string) => {
    return `NGN ${price.toLocaleString()} / ${frequency}`;
  };

   const handleFrequencyChange = (value: string) => {
    setCurrentUnit(prev => ({ ...prev, frequency: value as any }));
  };

  const handleQuantityChange = (delta: number) => {
    setCurrentUnit(prev => ({ 
      ...prev, 
      quantity: Math.max(1, prev.quantity + delta) 
    }));
  };

   const handlePriceChange = (value: number) => {
    setCurrentUnit(prev => ({ ...prev, price: value }));
  };

  const canAddUnit =
    currentUnit.title.trim() &&
    currentUnit.description.trim() &&
    currentUnit.price > 0;

  return (
    <div className="space-y-6">
      {/* Description */}
      <p className="text-[#7A7A7A] font-source-sans-pro text-base font-normal leading-[160%] mb-4">
        This will be your event's title. Your title will be used to help create
        your event's summary, description, category, and tags – so be specific!
      </p>

      {/* Existing Units */}
      {units.map((unit) => (
        <div
          key={unit.id}
          style={{
            borderRadius: "12px",
            border:
              "1px solid var(--Outline-on-System-Teal, rgba(138, 174, 164, 0.20))",
            background:
              "var(--secondary-background, rgba(242, 244, 247, 0.50))",
            display: "flex",
            padding: "16px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "12px",
            alignSelf: "stretch",
          }}
        >
          {/* Header with name and edit button */}
          <div className="flex items-center justify-between w-full">
            <h3
              style={{
                color: "var(--Title, #1F2024)",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "142.745%",
                letterSpacing: "-0.36px",
              }}
            >
              {unit.title} × {unit.quantity}
            </h3>
            <button
              type="button"
              onClick={() => handleEditUnit(unit)}
              className="flex items-center gap-2 hover:bg-white/20 rounded transition-colors"
            >
              <span
                style={{
                  color: "var(--Title, #1F2024)",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                }}
              >
                Edit space
              </span>
              <EditIcon />
            </button>
          </div>

          {/* Price Badge */}
          <div
            style={{
              borderRadius: "4px",
              background:
                "var(--Outline-on-System-Teal, rgba(138, 174, 164, 0.20))",
              display: "flex",
              padding: "2px 8px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                color: "var(--System-Teal, #1F3A3A)",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "142.745%",
                letterSpacing: "-0.28px",
              }}
            >
              {formatPrice(unit.price, unit.frequency)}
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              color: "var(--Body, #71727A)",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "142.745%",
              letterSpacing: "-0.32px",
            }}
          >
            {unit.description}
          </p>

          {/* Unit Facilities */}
          {getUnitFacilities && getUnitFacilities(unit.id).length > 0 && (
            <div className="w-full">
              <h4
                className="text-sm font-medium mb-2"
                style={{
                  color: "var(--color-dark-slate)",
                  fontFamily: "var(--font-source-sans), sans-serif",
                }}
              >
                Unit facilities:
              </h4>
              <div className="flex flex-wrap gap-2">
                {getUnitFacilities(unit.id).map((facilityId) => {
                  const facilityDetails = getFacilityDetails
                    ? getFacilityDetails(facilityId)
                    : null;
                  if (!facilityDetails) return null;

                  return (
                    <div
                      key={facilityId}
                      className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded-md"
                    >
                      <Image
                        src={facilityDetails.icon}
                        alt={facilityDetails.name}
                        width={16}
                        height={16}
                        className="object-cover rounded"
                      />
                      <span
                        className="text-xs"
                        style={{
                          fontFamily: "var(--font-source-sans), sans-serif",
                          color: "var(--color-dark-slate)",
                        }}
                      >
                        {facilityDetails.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Facility Button */}
          <Button
            type="button"
            variant="ghost"
            size="allotease-sm"
            className="p-0 h-auto"
            leftIcon={<AddFacilityIcon />}
            onClick={() => handleAddFacilityToUnit(unit)}
          >
            <span
              style={{
                color: "var(--Orange-Red, #FF5B00)",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
              }}
            >
              Add facility
            </span>
          </Button>
        </div>
      ))}

      {/* Add New Unit Form */}
      <div className="space-y-4">
        {/* Title and Quantity Row */}
        <div className="flex items-start gap-2">
          <span className="text-[var(--color-dark-slate)] font-source-sans-pro text-lg font-semibold pt-3">
            {units.length + 1}.
          </span>
          <div className="flex-1">
            <FormInput
              placeholder="Name* e.g 2 bedroom flat"
              value={currentUnit.title}
              onChange={(e) =>
                setCurrentUnit((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>
        </div>

        {/* Description */}
        <FormTextarea
          placeholder="Description*"
          value={currentUnit.description}
          onChange={(e) =>
            setCurrentUnit((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />

        {/* Price, Frequency, and Quantity Row */}
        <div className="flex gap-4 items-center">
          {/* Price */}
          <div className="flex-1">
            <FormInput
              placeholder="NGN Price*"
              type="number"
              value={currentUnit.price || ""}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              required
            />
          </div>

          {/* Frequency */}
          <div className="flex-1">
            <FormSelect
              placeholder="Select frequency"
              options={frequencyOptions}
              value={currentUnit.frequency}
              onValueChange={handleFrequencyChange}
              required
            />
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              disabled={currentUnit.quantity <= 1}
              style={{
                borderRadius: "50%",
                border: "0.778px solid rgba(138, 174, 164, 0.50)",
                display: "flex",
                width: "28px",
                height: "28px",
                justifyContent: "center",
                alignItems: "center",
                background: "transparent",
                cursor: currentUnit.quantity <= 1 ? "not-allowed" : "pointer",
                opacity: currentUnit.quantity <= 1 ? 0.5 : 1,
                padding: 0,
              }}
            >
              <MinusIcon />
            </button>

            <span
              style={{
                color: "#20232A",
                textAlign: "center",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "16px",
                minWidth: "20px",
              }}
            >
              {currentUnit.quantity}
            </span>

            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              style={{
                borderRadius: "50%",
                border: "0.778px solid rgba(138, 174, 164, 0.50)",
                display: "flex",
                width: "28px",
                height: "28px",
                justifyContent: "center",
                alignItems: "center",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <PlusIcon />
            </button>
          </div>
        </div>

        {/* Add Space Button */}
        <Button
          type="button"
          variant="allotease-blur"
          size="allotease-sm"
          onClick={handleAddUnit}
          disabled={!canAddUnit}
          className={`text-[var(--feature-accent-orange)] ${
            !canAddUnit ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Add space
        </Button>
      </div>

      {/* Edit Unit Modal */}
      <EditUnitModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUnit(null);
        }}
        unit={editingUnit}
        onUpdate={handleUpdateUnit}
      />

      {/* Unit Facility Modal */}
      <UnitFacilityModal
        isOpen={isFacilityModalOpen}
        onClose={() => {
          setIsFacilityModalOpen(false);
          setSelectedUnitForFacilities(null);
        }}
        unitId={selectedUnitForFacilities}
        unitTitle={
          selectedUnitForFacilities
            ? units.find((u) => u.id === selectedUnitForFacilities)?.title
            : undefined
        }
      />
    </div>
  );
}
