import React from "react";

interface EventDetailsLocationSkeletonProps {
  className?: string;
}

export function EventDetailsLocationSkeleton({
  className = "",
}: EventDetailsLocationSkeletonProps) {
  return (
    <div className={className}>
      {/* Section Title Skeleton */}
      <div
        className="bg-gray-200 rounded animate-pulse mb-4"
        style={{
          height: "28px", 
          width: "100px",
        }}
      />

      {/* Location Info Skeleton */}
      <div className="flex items-start gap-3 mb-4">
        {/* Icon Skeleton */}
        <div
          className="bg-gray-200 rounded animate-pulse mt-1"
          style={{
            width: "20px",
            height: "21px",
          }}
        />

        <div className="flex-1">
          {/* Address Line Skeleton */}
          <div
            className="bg-gray-200 rounded animate-pulse mb-1"
            style={{
              height: "23px",
              width: "70%",
            }}
          />

          {/* City, State Line Skeleton */}
          <div
            className="bg-gray-200 rounded animate-pulse"
            style={{
              height: "23px",
              width: "50%",
            }}
          />
        </div>
      </div>

      {/* Map Skeleton */}
      <div
        className="bg-gray-200 rounded-[24px] animate-pulse relative overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "565px",
          height: "198px",
        }}
      >
        {/* Map placeholder elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" />

        {/* Simulate map controls */}
        <div className="absolute top-4 right-4">
          <div className="space-y-1">
            <div
              className="bg-gray-300 rounded"
              style={{ width: "24px", height: "24px" }}
            />
            <div
              className="bg-gray-300 rounded"
              style={{ width: "24px", height: "24px" }}
            />
          </div>
        </div>

        {/* Simulate marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className="bg-gray-400 rounded-full"
            style={{ width: "12px", height: "12px" }}
          />
        </div>
      </div>
    </div>
  );
}
