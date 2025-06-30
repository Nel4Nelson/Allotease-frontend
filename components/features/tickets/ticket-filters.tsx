/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { TicketFiltersProps } from "@/types/tickets";

const serviceTypeOptions = [
  { value: "all", label: "Events", count: 0 },
  { value: "event", label: "Events", count: 0 },
  { value: "stay", label: "Stays", count: 0 },
  { value: "car-park", label: "Car Parks", count: 0 },
];

export function TicketFilters({
  activeFilter,
  onFilterChange,
}: TicketFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Service Type Tabs */}
      <div className="border border-[#8AAEA433] flex items-center justify-around w-fit rounded-lg h-[40px] bg-white shadow-sm">
        {serviceTypeOptions.slice(0, 3).map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange({ type: option.value as any })}
            className={`px-6 py-2 font-semibold text-sm transition-all duration-200 rounded-md ${
              activeFilter.type === option.value
                ? "text-[#FF5B00] bg-orange-50"
                : "text-[#71727A] hover:text-[#1F2024] hover:bg-gray-50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Section Header */}
      <div>
        <h2 className="text-[#1F2024] font-bold text-lg md:text-3xl mb-2">
          {activeFilter.type === "all"
            ? "All your tickets"
            : activeFilter.type === "event"
            ? "Your event tickets"
            : activeFilter.type === "stay"
            ? "Your accommodation bookings"
            : "Your parking reservations"}
        </h2>
        <p className="text-[#71727A] text-sm">
          Find details about the{" "}
          {activeFilter.type === "all"
            ? "services"
            : activeFilter.type.replace("-", " ")}{" "}
          you have booked.
        </p>
      </div>
    </div>
  );
}
