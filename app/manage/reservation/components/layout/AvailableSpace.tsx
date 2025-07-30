"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown, Check, Info, Star } from "lucide-react";
import SpaceCard from "../ui/SpaceCard";
// import SearchHeader from "@/app/manage/components/ui/SearchHeader";
import { StaysReservations } from "@/components/features";

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
    <div className="w-full">
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
            <StaysReservations reservations={} />
          </div>
        </>
      )}
    </div>
  );
};

export default AvailableSpace;
