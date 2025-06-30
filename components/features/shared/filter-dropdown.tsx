"use client";
import React, { useState } from "react";

interface FilterOption {
  value: string;
  label: string;
}

const filterOptions: FilterOption[] = [
  { value: "all", label: "All Categories" },
  { value: "free", label: "Free Events" },
  { value: "paid", label: "Paid Events" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
];

export function FilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    setIsOpen(false);
    // Add filter logic here later
    console.log("Filter changed to:", value);
  };

  const selectedOption = filterOptions.find(
    (option) => option.value === selectedFilter
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-[#8AAEA433] rounded-lg bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm text-[#1F2024]">{selectedOption?.label}</span>
        <svg
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 256 256"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 w-48 bg-white border border-[#8AAEA433] rounded-lg shadow-lg z-10">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                selectedFilter === option.value
                  ? "text-[#FF5B00] bg-orange-50"
                  : "text-[#1F2024]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
