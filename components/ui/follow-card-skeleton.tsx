import React from "react";

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return (
    <div
      className={`flex flex-col justify-center items-center flex-shrink-0 animate-pulse ${className}`}
      style={{
        display: "flex",
        width: "222px",
        height: "290px",
        minWidth: "200px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        flexShrink: 0,
        borderRadius: "20px",
        background: "#F2F4F7",
      }}
    >
      {/* Avatar Skeleton */}
      <div
        className="bg-gray-300 rounded-full"
        style={{ width: "80px", height: "80px" }}
      />

      {/* Name Skeleton */}
      <div
        className="bg-gray-300 rounded"
        style={{ width: "120px", height: "20px" }}
      />

      {/* Follower Count Skeleton */}
      <div
        className="bg-gray-300 rounded"
        style={{ width: "100px", height: "16px" }}
      />

      {/* Button Skeleton */}
      <div
        className="bg-gray-300 rounded-full"
        style={{ width: "80px", height: "32px" }}
      />
    </div>
  );
}
