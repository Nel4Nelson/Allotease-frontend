"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  SearchIcon,
  ChevronDownIcon,
  ViewReservationsIcon,
  PencilIcon,
} from "@/components/icons";
import { TimeSortFilter } from "@/components/ui/filters/time-sort-filter";

// Types for the available space data
interface SpaceFacility {
  _id: string;
  name: string;
  icon?: string;
}

interface Space {
  _id: string;
  title: string;
  price: number;
  frequency: string;
  description: string;
  spacesLeft: number;
  facilities: SpaceFacility[];
}

interface AvailableSpacesSectionProps {
  spaces: Space[];
  stayId?: string;
  className?: string;
}

export function AvailableSpacesSection({
  spaces,
  stayId,
  className = "",
}: AvailableSpacesSectionProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("newest");
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Handle image load errors
  const handleImageError = (facilityId: string) => {
    setImageErrors((prev) => new Set(prev).add(facilityId));
  };

  // Handle View Reservations navigation
  const handleViewReservations = (spaceId: string) => {
    if (stayId) {
      router.push(
        `/allocation-admin/dashboard/reservations/stays/${stayId}/${spaceId}`
      );
    } else {
      console.log("View reservations for space:", spaceId);
    }
  };

  // Format price
  const formatPrice = (price: number, frequency: string) => {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    });
    return `${formatter.format(price)} / ${frequency}`;
  };

  // Filter and sort spaces based on search and sort criteria
  const filteredSpaces = spaces.filter((space) =>
    space.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`w-full rounded-xl transition-all duration-300 ${className}`}
      style={{
        border: "1px solid rgba(138, 174, 164, 0.20)",
        background: "rgba(242, 244, 247, 0.50)",
        padding: isExpanded ? "20px 16px" : "20px 16px",
        minHeight: isExpanded ? "auto" : "68px",
      }}
    >
      {/* Header - Always Visible */}
      <div
        className="flex w-full justify-between items-center gap-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3
          className="font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px]"
          style={{ color: "#1F2024" }}
        >
          Available Spaces
        </h3>

        <div
          className={`transition-transform duration-200 ${
            isExpanded ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDownIcon />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Search and Filter Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3 h-10 max-w-[200px] px-3 flex-1 rounded-full border border-gray-300/20 bg-gray-100/50">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-gray-600 font-source-sans text-base placeholder:text-gray-500"
                style={{ color: "#71727A" }}
              />
            </div>

            {/* Sort Filter */}
            <TimeSortFilter value={sortValue} onValueChange={setSortValue} />
          </div>

          {/* Spaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSpaces.map((space) => (
              <div
                key={space._id}
                className="flex flex-col justify-center items-start gap-2 p-4 rounded-xl transition-colors"
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
                    {space.title}
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
                      {space.spacesLeft} Spaces left
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
                    {formatPrice(space.price, space.frequency)}
                  </span>
                </div>

                {/* Description */}
                <p
                  className="font-source-sans text-base font-normal leading-[142.745%] tracking-[-0.32px] m-0"
                  style={{ color: "#71727A" }}
                >
                  {space.description}
                </p>

                {/* Facilities */}
                {space.facilities.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {space.facilities.map((facility) => (
                      <div
                        key={facility._id}
                        className="flex items-center gap-2"
                      >
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
                <div className="flex items-center justify-center gap-4 w-full mt-4">
                  {/* View Reservations Button */}
                  <button
                    onClick={() => handleViewReservations(space._id)}
                    className="flex px-3 py-1.5 justify-center items-center gap-2 rounded-[51px] transition-colors hover:opacity-80"
                    style={{
                      background: "rgba(242, 244, 247, 0.50)",
                      border: "1px solid var(--Orange-Red, #FF5B00)",
                      backdropFilter: "blur(21px)",
                    }}
                  >
                    <span
                      className="font-source-sans text-base font-semibold"
                      style={{ color: "#FF5B00" }}
                    >
                      View reservations
                    </span>
                    <ViewReservationsIcon />
                  </button>

                  {/* Edit Space Button */}
                  <button
                    onClick={() => console.log("Edit space:", space._id)}
                    className="flex px-3 py-1.5 justify-center items-center gap-2 rounded-[51px] transition-colors hover:opacity-80"
                    style={{
                      background: "rgba(242, 244, 247, 0.60)",
                      backdropFilter: "blur(21px)",
                    }}
                  >
                    <span
                      className="font-source-sans text-base font-semibold"
                      style={{ color: "#1F2024" }}
                    >
                      Edit space
                    </span>
                    <PencilIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No spaces available */}
          {filteredSpaces.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchQuery
                  ? "No spaces match your search"
                  : "No spaces available"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
