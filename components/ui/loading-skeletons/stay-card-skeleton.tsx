import React from "react";

interface StayCardSkeletonProps {
  className?: string;
}

export function StayCardSkeleton({ className = "" }: StayCardSkeletonProps) {
  return (
    <div
      className={`flex flex-col animate-pulse ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
        flex: "1 0 0",
      }}
    >
      {/* Banner Image Skeleton */}
      <div
        className="bg-gray-200"
        style={{
          borderRadius: "24px",
          height: "176px",
          alignSelf: "stretch",
        }}
      />

      <div style={{ width: "100%" }}>
        {/* Title Skeleton */}
        <div
          className="bg-gray-200 rounded"
          style={{
            height: "25px",
            width: "70%",
            marginBottom: "8px",
          }}
        />

        {/* Location Skeleton */}
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <div
            className="bg-gray-200 rounded-full"
            style={{
              width: "16px",
              height: "16px",
            }}
          />
          <div
            className="bg-gray-200 rounded"
            style={{
              height: "16px",
              width: "120px",
            }}
          />
        </div>
      </div>

      {/* Divider Skeleton */}
      <div
        className="bg-gray-100"
        style={{
          height: "1px",
          width: "100%",
          margin: "4px 0",
        }}
      />

      {/* Review Section Skeleton */}
      <div className="flex items-center gap-2">
        <div
          className="bg-gray-200 rounded"
          style={{
            width: "60px",
            height: "24px",
          }}
        />
        <div
          className="bg-gray-200 rounded"
          style={{
            width: "80px",
            height: "16px",
          }}
        />
      </div>

      {/* Description Skeleton - Multiple lines */}
      <div style={{ width: "100%", alignSelf: "stretch" }}>
        <div className="space-y-2">
          <div
            className="bg-gray-200 rounded"
            style={{
              height: "14px",
              width: "100%",
            }}
          />
          <div
            className="bg-gray-200 rounded"
            style={{
              height: "14px",
              width: "90%",
            }}
          />
          <div
            className="bg-gray-200 rounded"
            style={{
              height: "14px",
              width: "75%",
            }}
          />
        </div>
      </div>

      {/* Reservation Button Skeleton */}
      <div
        className="bg-gray-200 rounded-full"
        style={{
          height: "40px",
          width: "140px",
          marginTop: "8px",
        }}
      />
    </div>
  );
}

// Grid skeleton for multiple cards - Now Responsive
interface StaysGridSkeletonProps {
  count?: number;
  className?: string;
}

export function StaysGridSkeleton({ count = 6, className = "" }: StaysGridSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full ${className}`}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <StayCardSkeleton key={index} />
        ))}
    </div>
  );
}