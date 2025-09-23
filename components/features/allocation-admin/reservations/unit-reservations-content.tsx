"use client";
import React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { StayDetailsBanner } from "@/components/ui/stay-details/stay-details-banner";
import { StayDetailsHeader } from "./stay-details-header";

interface UnitReservationsContentProps {
  stayId: string;
  unitId: string;
}

export function UnitReservationsContent({ stayId, unitId }: UnitReservationsContentProps) {
  // Get stay title based on stayId (using same logic as main stay details)
  const getStayTitle = (id: string) => {
    const titleMap: { [key: string]: string } = {
      "wintess-garden": "Wintess Garden",
      "modern-downtown-apartment": "Modern Downtown Apartment",
      "beachfront-villa-paradise": "Beachfront Villa Paradise",
      "mountain-view-cabin": "Mountain View Cabin",
      "family-garden-house": "Family Garden House",
      "historic-loft-space": "Historic Loft Space",
    };
    return titleMap[id] || "Stay Details";
  };

  const stayTitle = getStayTitle(stayId);

  // Use the same placeholder image
  const stayImages = ["/images/stay-banner.svg"];

  const handleEditClick = () => {
    // TODO: Implement edit functionality for unit context
    console.log("Edit stay details clicked for stay:", stayId, "unit:", unitId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb className="" />
      
      {/* Stay Banner */}
      <StayDetailsBanner 
        images={stayImages}
        title={stayTitle}
      />

      {/* Stay Header with Title and Edit Button */}
      <StayDetailsHeader 
        stayTitle={stayTitle}
        onEditClick={handleEditClick}
      />
      
      {/* TODO: Add unit-specific content, reservations details, and management features */}
    </div>
  );
}