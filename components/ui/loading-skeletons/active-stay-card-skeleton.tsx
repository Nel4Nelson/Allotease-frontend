"use client";
import React from "react";

interface ActiveStayCardSkeletonProps {
  className?: string;
}

export function ActiveStayCardSkeleton({
  className = "",
}: ActiveStayCardSkeletonProps) {
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

        {/* Fake carousel indicators */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "6px",
            padding: "8px 12px",
            borderRadius: "20px",
            background: "rgba(0, 0, 0, 0.1)",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />
          ))}
        </div>

        {/* Fake image counter */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            padding: "4px 10px",
            borderRadius: "12px",
            background: "rgba(0, 0, 0, 0.1)",
            width: "45px",
            height: "20px",
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
                width: "80%",
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
                width: "60%",
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

          {/* Location Skeleton */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "20px",
              width: "45%",
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

          {/* Price Badge Skeleton */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "28px",
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
                width: "120px",
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

        {/* Bottom Action Button Skeleton */}
        <div>
          <div
            className="relative overflow-hidden"
            style={{
              height: "40px",
              width: "120px",
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
        </div>
      </div>
    </div>
  );
}

interface ActiveStayCardSkeletonGridProps {
  count?: number;
  className?: string;
}

export function ActiveStayCardSkeletonGrid({
  count = 3,
  className = "",
}: ActiveStayCardSkeletonGridProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <ActiveStayCardSkeleton key={index} />
      ))}
    </div>
  );
}