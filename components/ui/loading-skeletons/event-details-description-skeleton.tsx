import React from "react";

interface EventDetailsDescriptionSkeletonProps {
  className?: string;
}

export function EventDetailsDescriptionSkeleton({
  className = "",
}: EventDetailsDescriptionSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Multiple lines to simulate paragraph text */}
      <div
        className="bg-gray-200 rounded animate-pulse"
        style={{
          height: "23px",
          width: "100%",
        }}
      />
      <div
        className="bg-gray-200 rounded animate-pulse"
        style={{
          height: "23px",
          width: "95%",
        }}
      />
      <div
        className="bg-gray-200 rounded animate-pulse"
        style={{
          height: "23px",
          width: "88%",
        }}
      />
      <div
        className="bg-gray-200 rounded animate-pulse"
        style={{
          height: "23px",
          width: "92%",
        }}
      />
      <div
        className="bg-gray-200 rounded animate-pulse"
        style={{
          height: "23px",
          width: "75%",
        }}
      />
    </div>
  );
}
