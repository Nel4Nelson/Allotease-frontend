"use client";
import React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { StayDetailsBanner } from "@/components/ui/stay-details/stay-details-banner";
import { StayDetailsHeader } from "./stay-details-header";
import { UnitDetailsCard } from "./unit-details-card";
import { DataTable, ColumnConfig } from "@/components/ui/data-table";

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

  // Get unit data based on stayId and unitId
  const getUnitData = (stayId: string, unitId: string) => {
    // For now, return dummy data based on unitId
    const unitMap: { [key: string]: any } = {
      "standard-twin-1": {
        _id: "standard-twin-1",
        title: "Standard Twin Room",
        price: 195520,
        frequency: "Day",
        description: "Offering free toiletries and bathrobes, this double room includes a private bathroom with a walk-in shower, a bath and a hairdryer. The spacious air-conditioned double room offers a flat-screen TV with cable channels, soundproof walls, a minibar, a tea and coffee maker as well as sea views. The unit has 1 bed.",
        spacesLeft: 15,
        facilities: [
          { _id: "restaurant", name: "Restaurant" },
          { _id: "room-service", name: "Room service" },
        ],
      },
      "deluxe-suite-1": {
        _id: "deluxe-suite-1",
        title: "Deluxe Suite",
        price: 350000,
        frequency: "Day",
        description: "Spacious suite with separate living area, king-size bed, and premium amenities. Perfect for extended stays.",
        spacesLeft: 8,
        facilities: [
          { _id: "pool", name: "Outdoor swimming pool" },
          { _id: "jacuzzi", name: "Jacuzzi" },
          { _id: "balcony", name: "Private balcony" },
        ],
      },
      // Add more unit mappings as needed
    };

    return unitMap[unitId] || unitMap["standard-twin-1"]; // Default to standard twin if not found
  };

  const stayTitle = getStayTitle(stayId);
  const unitData = getUnitData(stayId, unitId);

  // Use the same placeholder image
  const stayImages = ["/images/stay-banner.svg"];

  // Unit-specific reservations data
  const unitReservationsData = [
    {
      id: "RES-1002",
      guest: "Kingsley Promise",
      room: "Classic King Room",
      dates: "May 31 - Jun 1",
      status: "Pending",
      avatar: "/icons/encircle-star-green-avatar.svg",
    },
    {
      id: "RES-1002",
      guest: "Kingsley Promise",
      room: "Classic King Room",
      dates: "May 31 - Jun 1",
      status: "Cancelled",
      avatar: "/icons/encircle-star-green-avatar.svg",
    },
    {
      id: "RES-1002",
      guest: "Kingsley Promise",
      room: "Classic King Room",
      dates: "May 31 - Jun 1",
      status: "Confirmed",
      avatar: "/icons/encircle-star-green-avatar.svg",
    },
    {
      id: "RES-1002",
      guest: "Kingsley Promise",
      room: "Classic King Room",
      dates: "May 31 - Jun 1",
      status: "Confirmed",
      avatar: "/icons/encircle-star-green-avatar.svg",
    },
    {
      id: "RES-1002",
      guest: "Kingsley Promise",
      room: "Classic King Room",
      dates: "May 31 - Jun 1",
      status: "Confirmed",
      avatar: "/icons/encircle-star-green-avatar.svg",
    },
  ];

  const reservationsColumns: ColumnConfig[] = [
    { key: "id", label: "Reservation ID", type: "text" },
    { key: "guest", label: "Guest", type: "guest" },
    { key: "room", label: "Room", type: "text" },
    { key: "dates", label: "Dates", type: "text" },
    { key: "status", label: "Status", type: "status" },
  ];

  const handleEditClick = () => {
    // TODO: Implement edit functionality for unit context
    console.log("Edit stay details clicked for stay:", stayId, "unit:", unitId);
  };

  const handleExportReservations = () => {
    // TODO: Implement export functionality for unit
    console.log("Export unit reservations table for stay:", stayId, "unit:", unitId);
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

      {/* Unit Details Card */}
      <UnitDetailsCard 
        unit={unitData}
      />

      {/* All Reservations Table */}
      <DataTable
        title="All Reservations"
        columns={reservationsColumns}
        data={unitReservationsData}
        variant="reservations"
        showSearch={true}
        showSort={true}
        showExport={true}
        searchPlaceholder="Search by address"
        onExport={handleExportReservations}
      />
    </div>
  );
}