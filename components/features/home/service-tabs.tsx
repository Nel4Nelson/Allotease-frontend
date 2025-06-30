"use client";
import React from "react";
import { serviceTabs } from "@/data/navigation";
import { ServiceTabsProps } from "@/types/navigation";
import { FilterDropdown } from "@/components/features/shared/filter-dropdown";
import { LocationSelector } from "@/components/features/shared/location-selector";

export function ServiceTabs({ activeTab, onTabChange }: ServiceTabsProps) {
  const getTabDisplayName = (tabId: string) => {
    switch (tabId) {
      case "stays":
        return "accommodations";
      case "events":
        return "events";
      case "car-parks":
        return "parking spaces";
      default:
        return tabId.replace("-", " ");
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Type Tabs */}
      <div className="border border-[#8AAEA433] flex items-center justify-around w-fit rounded-lg h-[40px] bg-white shadow-sm">
        {serviceTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-2 font-semibold text-sm transition-all duration-200 rounded-md ${
              activeTab === tab.id
                ? "text-[#FF5B00] bg-orange-50"
                : "text-[#71727A] hover:text-[#1F2024] hover:bg-gray-50"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Section Header with Location and Filters */}
      <div>
        <h2 className="text-[#1F2024] font-bold text-lg md:text-3xl mb-4">
          Available {getTabDisplayName(activeTab)} in your location
        </h2>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <LocationSelector />
          <FilterDropdown />
        </div>
      </div>
    </div>
  );
}
