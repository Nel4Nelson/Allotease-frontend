import React from "react";

interface EventDetailsRegistrationCardSkeletonProps {
  className?: string;
}

export function EventDetailsRegistrationCardSkeleton({
  className = "",
}: EventDetailsRegistrationCardSkeletonProps) {
  return (
    <div
      className={`
        sticky top-4 lg:top-8 
        w-full max-w-sm mx-auto lg:max-w-none
        mb-6 lg:mb-0
        flex flex-col 
        rounded-2xl 
        border border-[rgba(138,174,164,0.20)]
        bg-[rgba(242,244,247,0.30)]
        backdrop-blur-[21px]
        overflow-hidden
        animate-pulse
        ${className}
      `}
    >
      {/* Header Section Skeleton */}
      <div className="bg-[rgba(242,244,247,0.80)] backdrop-blur-[21px] flex py-4 lg:py-5 flex-col items-center gap-1">
        <div
          className="bg-gray-300 rounded"
          style={{
            height: "28px",
            width: "120px",
          }}
        />
      </div>

      {/* Content Section Skeleton */}
      <div className="flex flex-col p-4 lg:p-6 xl:px-6 xl:pt-8 xl:pb-5 gap-3 lg:gap-4">
        {/* Event Info Skeleton */}
        <div className="space-y-3">
          {/* Price Skeleton */}
          <div
            className="bg-gray-300 rounded"
            style={{
              height: "36px",
              width: "150px",
            }}
          />

          {/* Event Type/Status Skeleton */}
          <div
            className="bg-gray-300 rounded"
            style={{
              height: "20px",
              width: "100px",
            }}
          />

          {/* Capacity Info Skeleton */}
          <div
            className="bg-gray-300 rounded"
            style={{
              height: "18px",
              width: "140px",
            }}
          />
        </div>

        {/* Divider */}
        <div
          className="bg-gray-200"
          style={{
            height: "1px",
            width: "100%",
            margin: "8px 0",
          }}
        />

        {/* Quantity Selector Skeleton */}
        <div className="space-y-2">
          <div
            className="bg-gray-300 rounded"
            style={{
              height: "20px",
              width: "80px",
            }}
          />

          <div className="flex items-center gap-2">
            {/* Minus button */}
            <div
              className="bg-gray-300 rounded-full"
              style={{
                width: "32px",
                height: "32px",
              }}
            />

            {/* Quantity display */}
            <div
              className="bg-gray-300 rounded"
              style={{
                height: "24px",
                width: "40px",
              }}
            />

            {/* Plus button */}
            <div
              className="bg-gray-300 rounded-full"
              style={{
                width: "32px",
                height: "32px",
              }}
            />
          </div>
        </div>

        {/* Register Button Skeleton */}
        <div
          className="bg-gray-300 rounded-[51px]"
          style={{
            width: "100%",
            height: "48px",
            marginTop: "16px",
          }}
        />
      </div>
    </div>
  );
}
