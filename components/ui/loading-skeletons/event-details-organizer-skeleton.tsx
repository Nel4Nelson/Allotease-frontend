import React from "react";

interface EventDetailsOrganizerSkeletonProps {
  className?: string;
}

export function EventDetailsOrganizerSkeleton({ 
  className = "" 
}: EventDetailsOrganizerSkeletonProps) {
  return (
    <div className={className}>
      {/* Section Title Skeleton */}
      <div
        className="bg-gray-200 rounded animate-pulse mb-4"
        style={{
          height: "28px", // Matches text-xl font-bold
          width: "100px", // Width for "Organizer"
        }}
      />

      {/* Organizer Card Skeleton */}
      <div
        className="flex w-full p-5 justify-center items-center gap-7 rounded-2xl border animate-pulse"
        style={{
          border: "1px solid rgba(138, 174, 164, 0.20)",
          background: "rgba(242, 244, 247, 0.30)",
          backdropFilter: "blur(21px)",
        }}
      >
        {/* Avatar and Name Container Skeleton */}
        <div className="flex items-center gap-4">
          {/* Avatar skeleton */}
          <div
            className="bg-gray-300 rounded-full"
            style={{
              width: "48px",
              height: "48px",
            }}
          />
          
          {/* Name skeleton */}
          <div
            className="bg-gray-300 rounded"
            style={{
              height: "25px", // Matches text-lg font-bold
              width: "140px",
            }}
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Followers count skeleton */}
        <div
          className="bg-gray-300 rounded"
          style={{
            height: "20px", // Matches text-sm
            width: "90px",
          }}
        />

        {/* Follow button skeleton */}
        <div
          className="bg-gray-200 rounded-[51px] border"
          style={{
            height: "36px",
            width: "80px",
            border: "1px solid #E5E5E5",
          }}
        />
      </div>
    </div>
  );
}