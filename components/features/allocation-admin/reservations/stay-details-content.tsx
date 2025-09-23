"use client";
import React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { StayDetailsBanner } from "@/components/ui/stay-details/stay-details-banner";
import { StayDetailsHeader } from "./stay-details-header";
import { AvailableSpacesSection } from "./available-spaces-section";
import { DataTable, ColumnConfig } from "@/components/ui/data-table";

interface StayDetailsContentProps {
  stayId: string;
}

export function StayDetailsContent({ stayId }: StayDetailsContentProps) {
  // Get stay title based on stayId (for now using dummy logic)
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

  // For now, we'll use the placeholder image
  const stayImages = ["/images/stay-banner.svg"];

  // Dummy spaces data with varying counts
  const getSpacesForStay = (id: string) => {
    const baseSpaces = [
      {
        _id: "standard-twin-1",
        title: "Standard Twin Room",
        price: 195520,
        frequency: "Day",
        description: "Offering free toiletries and bathrobes, this double room includes a private bathroom with a walk-in shower, a bath and a hairdryer. The spacious air-conditioned double room offers a flat-screen TV with cable channels, soundproof walls, a minibar, a tea and coffee maker as well as sea views. The unit has 1 bed.",
        spacesLeft: 15,
        facilities: [
          { _id: "pool", name: "Outdoor swimming pool" },
          { _id: "jacuzzi", name: "Jacuzzi" },
        ],
      },
      {
        _id: "standard-twin-2",
        title: "Standard Twin Room",
        price: 195520,
        frequency: "Day",
        description: "Offering free toiletries and bathrobes, this double room includes a private bathroom with a walk-in shower, a bath and a hairdryer. The spacious air-conditioned double room offers a flat-screen TV with cable channels, soundproof walls, a minibar, a tea and coffee maker as well as sea views. The unit has 1 bed.",
        spacesLeft: 15,
        facilities: [
          { _id: "pool", name: "Outdoor swimming pool" },
          { _id: "jacuzzi", name: "Jacuzzi" },
        ],
      },
    ];

    // Vary the number of spaces based on stay ID
    if (id === "wintess-garden") {
      return [
        ...baseSpaces,
        {
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
        {
          _id: "family-room-1",
          title: "Family Room",
          price: 280000,
          frequency: "Day",
          description: "Large family room with multiple beds, suitable for families with children. Includes connecting bathroom and entertainment area.",
          spacesLeft: 5,
          facilities: [
            { _id: "pool", name: "Outdoor swimming pool" },
            { _id: "jacuzzi", name: "Jacuzzi" },
            { _id: "kitchen", name: "Kitchenette" },
          ],
        },
      ];
    } else if (id === "modern-downtown-apartment") {
      return [
        ...baseSpaces,
        {
          _id: "studio-apartment",
          title: "Studio Apartment",
          price: 120000,
          frequency: "Day",
          description: "Modern studio apartment with kitchenette, perfect for short stays in the city center.",
          spacesLeft: 12,
          facilities: [
            { _id: "kitchen", name: "Full kitchen" },
            { _id: "wifi", name: "High-speed WiFi" },
          ],
        },
      ];
    } else if (id === "beachfront-villa-paradise") {
      return [
        {
          _id: "ocean-view-villa",
          title: "Ocean View Villa",
          price: 500000,
          frequency: "Day",
          description: "Luxurious beachfront villa with panoramic ocean views, private beach access, and world-class amenities.",
          spacesLeft: 3,
          facilities: [
            { _id: "pool", name: "Private pool" },
            { _id: "beach", name: "Private beach access" },
            { _id: "spa", name: "In-villa spa services" },
          ],
        },
        {
          _id: "beach-cottage",
          title: "Beach Cottage",
          price: 300000,
          frequency: "Day",
          description: "Charming beach cottage steps away from the shore, perfect for romantic getaways.",
          spacesLeft: 6,
          facilities: [
            { _id: "beach", name: "Beach access" },
            { _id: "terrace", name: "Private terrace" },
          ],
        },
      ];
    }

    return baseSpaces;
  };

  const spaces = getSpacesForStay(stayId);

  // Reservations table data
  const reservationsData = [
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
    // TODO: Implement edit functionality
    console.log("Edit stay details clicked for:", stayId);
  };

  const handleExportReservations = () => {
    // TODO: Implement export functionality
    console.log("Export reservations table for:", stayId);
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

      {/* Available Spaces Section */}
      <AvailableSpacesSection 
        spaces={spaces}
        stayId={stayId}
      />

      {/* All Reservations Table */}
      <DataTable
        title="All Reservations"
        columns={reservationsColumns}
        data={reservationsData}
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