import React from "react";

interface EventDetailsTicketSalesBadgeSkeletonProps {
  className?: string;
}

export function EventDetailsTicketSalesBadgeSkeleton({
  className = "",
}: EventDetailsTicketSalesBadgeSkeletonProps) {
  return (
    <div
      className={`bg-gray-200 rounded-full animate-pulse ${className}`}
      style={{
        height: "32px",
        width: "180px",
      }}
    />
  );
}
