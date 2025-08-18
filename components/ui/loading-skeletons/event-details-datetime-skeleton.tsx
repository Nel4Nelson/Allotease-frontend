import React from "react";

interface EventDetailsDateTimeSkeletonProps {
  className?: string;
}

export function EventDetailsDateTimeSkeleton({
  className = "",
}: EventDetailsDateTimeSkeletonProps) {
  return (
    <div className={className}>
      {/* Section Title Skeleton */}
      <div
        className="bg-gray-200 rounded animate-pulse mb-4"
        style={{
          height: "28px",
          width: "120px",
        }}
      />

      {/* Date & Time Info Skeleton */}
      <div className="flex items-center gap-3">
        {/* Icon Skeleton */}
        <div
          className="bg-gray-200 rounded animate-pulse"
          style={{
            width: "20px",
            height: "20px",
          }}
        />

        {/* Date Text Skeleton */}
        <div
          className="bg-gray-200 rounded animate-pulse"
          style={{
            height: "23px",
            width: "280px",
          }}
        />
      </div>
    </div>
  );
}
