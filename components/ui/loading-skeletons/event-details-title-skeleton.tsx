import React from "react";

interface EventDetailsTitleSkeletonProps {
  className?: string;
}

export function EventDetailsTitleSkeleton({
  className = "",
}: EventDetailsTitleSkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main title line */}
      <div
        className="bg-gray-200 rounded animate-pulse"
        style={{
          height: "39px",
          width: "85%",
        }}
      />
      {/* Second line for longer titles */}
      <div
        className="bg-gray-200 rounded animate-pulse"
        style={{
          height: "39px",
          width: "60%",
        }}
      />
    </div>
  );
}
