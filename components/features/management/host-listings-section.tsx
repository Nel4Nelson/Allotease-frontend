/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { HostListingsGridProps } from "@/types";
import { ServiceCard } from "@/components/features/shared";

export function HostListingsSection({
  listings,
  activeFilter,
  onFilterChange,
  isLoading,
}: HostListingsGridProps) {
  // Convert HostListing to ServiceItem format for compatibility
  const convertedListings = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    image: listing.image,
    date: {
      day: new Date(listing.createdDate).toLocaleDateString("en-US", {
        weekday: "long",
      }),
      time: `Created ${new Date(listing.createdDate).toLocaleDateString()}`,
    },
    pricing: listing.pricing,
    provider: {
      name: `${listing.stats.bookings} bookings`,
      followersCount: `${listing.stats.views} views`,
      verified: listing.status === "active",
    },
    location: listing.location,
  }));

  const getFilterDisplayName = () => {
    switch (activeFilter) {
      case "all":
        return "all your listings";
      case "event":
        return "your events";
      case "stay":
        return "your accommodations";
      case "car-park":
        return "your parking spaces";
      default:
        return "your listings";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading State */}
        <div className="animate-pulse">
          <div className="h-10 bg-gray-300 rounded w-48 mb-4" />
          <div className="h-6 bg-gray-300 rounded w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Service Type Tabs */}
      <div className="border border-[#8AAEA433] flex items-center justify-around w-fit rounded-lg h-[40px] bg-white shadow-sm">
        {[
          { value: "all", label: "All" },
          { value: "event", label: "Events" },
          { value: "stay", label: "Stays" },
          { value: "car-park", label: "Car Parks" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value as any)}
            className={`px-6 py-2 font-semibold text-sm transition-all duration-200 rounded-md ${
              activeFilter === option.value
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
          Manage {getFilterDisplayName()}
        </h2>

        <div className="flex items-center justify-between">
          <p className="text-[#71727A] text-sm">
            {listings.length}{" "}
            {activeFilter === "all"
              ? "listings"
              : activeFilter.replace("-", " ")}{" "}
            found
          </p>

          <button className="text-[#FF5B00] hover:text-[#E04E00] font-medium text-sm">
            + Add New{" "}
            {activeFilter === "all"
              ? "Listing"
              : activeFilter.replace("-", " ")}
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      {convertedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard items={convertedListings} />
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-[#71727A]">
            <svg
              className="mx-auto h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-medium mb-2">No listings found</h3>
            <p className="text-sm mb-4">
              Create your first{" "}
              {activeFilter === "all"
                ? "listing"
                : activeFilter.replace("-", " ")}{" "}
              to get started.
            </p>
            <button className="px-4 py-2 bg-[#FF5B00] text-white rounded-lg hover:bg-[#E04E00] transition-colors">
              Create{" "}
              {activeFilter === "all"
                ? "Listing"
                : activeFilter.replace("-", " ")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
