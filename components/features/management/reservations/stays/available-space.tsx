"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown, Check, Info, Star } from "lucide-react";
import SpaceCard from "./space-card";
// import SearchHeader from "@/app/manage/components/ui/SearchHeader";
import { StaysReservations } from "@/components/features";
import SearchHeader from "@/components/features/management/shared/search-header";
import { TransformedReservation } from "@/utils/stay-reservation-transformer";

type ExtraItem = {
  text: string;
  icon: React.ElementType;
};

export const dummyReservations: TransformedReservation[] = [
  {
    id: "RSV-001",
    guestName: "Jane Doe",
    roomType: "Deluxe Suite",
    dates: "2025-08-01 to 2025-08-05",
    status: "Confirmed",
  },
  {
    id: "RSV-002",
    guestName: "John Smith",
    roomType: "Standard Room",
    dates: "2025-08-10 to 2025-08-12",
    status: "Pending",
  },
  {
    id: "RSV-003",
    guestName: "Alice Johnson",
    roomType: "Executive Room",
    dates: "2025-08-15 to 2025-08-20",
    status: "Cancelled",
  },
];

const extraInfo: ExtraItem[] = [
  { text: "Extra feature description one.", icon: Check },
  { text: "Extra feature description two.", icon: Info },
  { text: "Another cool detail.", icon: Star },
];

const AvailableSpace = () => {
  const [open, setOpen] = useState(false);
  const toggleDropdown = () => setOpen(!open);

  const handleSearch = (value: string) => {
    console.log("Searching:", value);
    // TODO: filter table or perform search
  };

  const handleExport = () => {
    console.log("Exporting table...");
    // TODO: handle export logic
  };

  return (
    <div className="">
      {/* Header toggle */}
      <div
        className="flex items-center justify-between mb-4 w-full cursor-pointer font-source"
        onClick={toggleDropdown}
      >
        <h2>Available Spaces</h2>
        {open ? (
          <ChevronUp size={20} color="#71727A" />
        ) : (
          <ChevronDown size={20} color="#71727A" />
        )}
      </div>

      {/* When open, show content */}
      {open && (
        <>
          <div className="space-y-6">
            {/* Search + Sort/Export */}
            <SearchHeader
              onSearch={handleSearch}
              sortOptions={["Time", "Date", "Price"]}
              onExport={handleExport}
              showSort={true}
              showExport={true}
            />

            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-10">
              {[...Array(4)].map((_, index) => (
                <SpaceCard
                  key={index}
                  title="Standard Twin Room"
                  spacesLeft={15}
                  price="NGN 195,520 / Day"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac vehicula erat. Curabitur pulvinar, quam in dapibus facilisis, turpis eros facilisis odio, vel feugiat nisl nisl eget nisl. Suspendisse potenti."
                  extraInfo={extraInfo}
                />
              ))}
            </div>
          </div>

          {/* Reservation Table */}
          <div className="mt-8">
            <StaysReservations reservations={dummyReservations} />
          </div>
        </>
      )}
    </div>
  );
};

export default AvailableSpace;
