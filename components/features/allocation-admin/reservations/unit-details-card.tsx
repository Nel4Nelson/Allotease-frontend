"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AddFacilityIcon, EditIcon } from "@/components/icons";


// Types for the unit data
interface UnitFacility {
  _id: string;
  name: string;
  icon?: string;
}

interface Unit {
  _id: string;
  title: string;
  price: number;
  frequency: string;
  description: string;
  spacesLeft: number;
  facilities: UnitFacility[];
}

interface UnitDetailsCardProps {
  unit: Unit;
  className?: string;
}

export function UnitDetailsCard({ unit, className = "" }: UnitDetailsCardProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Handle image load errors
  const handleImageError = (facilityId: string) => {
    setImageErrors((prev) => new Set(prev).add(facilityId));
  };

  // Format price
  const formatPrice = (price: number, frequency: string) => {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    });
    return `${formatter.format(price)} / ${frequency}`;
  };

  const handleAddFacility = () => {
    // TODO: Implement add facility functionality
    console.log("Add facility clicked for unit:", unit._id);
  };

  const handleEditUnit = () => {
    // TODO: Implement edit unit functionality
    console.log("Edit unit clicked for unit:", unit._id);
  };

  return (
    <div
      className={`flex flex-col justify-center items-start gap-2 p-4 rounded-xl w-full ${className}`}
      style={{
        border: "1px solid rgba(138, 174, 164, 0.20)",
        background: "rgba(242, 244, 247, 0.50)",
      }}
    >
      {/* Header with Title and Spaces Left Badge */}
      <div className="flex items-center justify-between w-full">
        <h4
          className="font-source-sans text-lg font-semibold leading-[142.745%] tracking-[-0.36px] m-0"
          style={{ color: "#1F2024" }}
        >
          {unit.title}
        </h4>

        {/* Spaces Left Badge */}
        <div
          className="flex px-3 py-1.5 justify-center items-center gap-2 rounded-[51px]"
          style={{
            background: "rgba(242, 244, 247, 0.60)",
            backdropFilter: "blur(21px)",
          }}
        >
          <span
            className="font-source-sans text-base font-semibold"
            style={{ color: "#71727A" }}
          >
            {unit.spacesLeft} Spaces left
          </span>
        </div>
      </div>

      {/* Price Badge */}
      <div
        className="flex px-2 py-0.5 justify-center items-center gap-2.5 rounded"
        style={{
          background: "rgba(138, 174, 164, 0.20)",
        }}
      >
        <span
          className="font-source-sans text-sm font-semibold leading-[142.745%] tracking-[-0.28px]"
          style={{ color: "#1F3A3A" }}
        >
          {formatPrice(unit.price, unit.frequency)}
        </span>
      </div>

      {/* Description */}
      <p
        className="font-source-sans text-base font-normal leading-[142.745%] tracking-[-0.32px] m-0"
        style={{ color: "#71727A" }}
      >
        {unit.description}
      </p>

      {/* Facilities */}
      {unit.facilities.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {unit.facilities.map((facility) => (
            <div key={facility._id} className="flex items-center gap-2">
              {/* Facility Icon */}
              <div className="w-4 h-4 flex-shrink-0 relative">
                {facility.icon && !imageErrors.has(facility._id) ? (
                  <Image
                    src={facility.icon}
                    alt={facility.name}
                    fill
                    className="object-contain"
                    sizes="16px"
                    onError={() => handleImageError(facility._id)}
                  />
                ) : (
                  <svg
                    className="w-4 h-4 text-gray-400"
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
              <span
                className="font-source-sans text-sm font-normal"
                style={{ color: "#71727A" }}
              >
                {facility.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-6 mt-4">
        {/* Add Facility Button */}
        <Button
          type="button"
          variant="ghost"
          size="allotease-sm"
          className="p-0 h-auto"
          leftIcon={<AddFacilityIcon />}
          onClick={handleAddFacility}
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

        {/* Edit Space Button */}
        <button
          type="button"
          onClick={handleEditUnit}
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
    </div>
  );
}