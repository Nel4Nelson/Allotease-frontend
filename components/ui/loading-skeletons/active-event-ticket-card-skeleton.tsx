"use client";
import React from "react";

interface ActiveEventTicketCardSkeletonProps {
  className?: string;
}

export function ActiveEventTicketCardSkeleton({
  className = "",
}: ActiveEventTicketCardSkeletonProps) {
  return (
    <div
      className={`flex items-stretch gap-4 rounded-3xl w-full ${className}`}
      style={{
        minHeight: "200px",
      }}
    >
      {/* Image Skeleton */}
      <div
        className="hidden lg:block relative overflow-hidden"
        style={{
          width: "280px",
          minWidth: "280px",
          height: "auto",
          borderRadius: "20px",
          backgroundColor: "#E5E7EB",
        }}
      >
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
          }}
        />
      </div>

      {/* Content Section Skeleton */}
      <div className="flex flex-col justify-between flex-1 py-2 gap-3">
        {/* Top Section */}
        <div className="space-y-3">
          {/* Title Skeleton */}
          <div className="space-y-2">
            <div
              className="relative overflow-hidden"
              style={{
                height: "24px",
                width: "85%",
                backgroundColor: "#E5E7EB",
                borderRadius: "6px",
              }}
            >
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                }}
              />
            </div>
            <div
              className="relative overflow-hidden"
              style={{
                height: "24px",
                width: "65%",
                backgroundColor: "#E5E7EB",
                borderRadius: "6px",
              }}
            >
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                  animationDelay: "0.1s",
                }}
              />
            </div>
          </div>

          {/* Date/Time Skeleton */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "20px",
              width: "55%",
              backgroundColor: "#E5E7EB",
              borderRadius: "6px",
            }}
          >
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                animationDelay: "0.2s",
              }}
            />
          </div>

          {/* Booking Summary Badge Skeleton */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "28px",
              width: "200px",
              backgroundColor: "#E5E7EB",
              borderRadius: "6px",
            }}
          >
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                animationDelay: "0.3s",
              }}
            />
          </div>

          {/* Status and Countdown Row Skeleton */}
          <div className="flex items-center gap-3">
            {/* Status Badge Skeleton */}
            <div
              className="relative overflow-hidden"
              style={{
                height: "26px",
                width: "70px",
                backgroundColor: "#E5E7EB",
                borderRadius: "54px",
              }}
            >
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                  animationDelay: "0.4s",
                }}
              />
            </div>

            {/* Countdown Skeleton */}
            <div
              className="relative overflow-hidden"
              style={{
                height: "14px",
                width: "150px",
                backgroundColor: "#E5E7EB",
                borderRadius: "6px",
              }}
            >
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                  animationDelay: "0.5s",
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Buttons Skeleton */}
        <div className="flex items-center gap-3">
          {/* View Event Button Skeleton */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "40px",
              width: "130px",
              backgroundColor: "#E5E7EB",
              borderRadius: "51px",
            }}
          >
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                animationDelay: "0.6s",
              }}
            />
          </div>

          {/* View Bookings Button Skeleton (optional) */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "40px",
              width: "150px",
              backgroundColor: "#E5E7EB",
              borderRadius: "51px",
            }}
          >
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                animationDelay: "0.7s",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActiveEventTicketCardSkeletonGridProps {
  count?: number;
  className?: string;
}

export function ActiveEventTicketCardSkeletonGrid({
  count = 3,
  className = "",
}: ActiveEventTicketCardSkeletonGridProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <ActiveEventTicketCardSkeleton key={index} />
      ))}
    </div>
  );
}