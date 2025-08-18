import React from "react";

interface EventDetailsEventDetailsSkeletonProps {
  className?: string;
  itemCount?: number;
}

export function EventDetailsEventDetailsSkeleton({
  className = "",
  itemCount = 3,
}: EventDetailsEventDetailsSkeletonProps) {
  return (
    <div className={className}>
      {/* Section Title Skeleton */}
      <div
        className="bg-gray-200 rounded animate-pulse mb-6"
        style={{
          height: "28px",
          width: "140px",
        }}
      />

      {/* Agenda Items Skeleton */}
      <div className="space-y-6">
        {Array(itemCount)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Clock Icon Skeleton */}
              <div
                className="bg-gray-200 rounded animate-pulse mt-1 flex-shrink-0"
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />

              {/* Content Skeleton */}
              <div className="flex-1 min-w-0">
                {/* Title with inline time badges */}
                <div className="flex items-start gap-3 mb-2">
                  {/* Time badges */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Start Time Badge */}
                    <div
                      className="bg-gray-200 rounded animate-pulse"
                      style={{
                        height: "28px",
                        width: "60px",
                      }}
                    />

                    {/* End Time Badge */}
                    <div
                      className="bg-gray-200 rounded animate-pulse"
                      style={{
                        height: "28px",
                        width: "60px",
                      }}
                    />
                  </div>

                  {/* Agenda Title */}
                  <div
                    className="bg-gray-200 rounded animate-pulse flex-1 mt-0.5"
                    style={{
                      height: "23px",
                      width: "80%",
                    }}
                  />
                </div>

                {/* Agenda Description */}
                <div className="space-y-2">
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
                      width: "85%",
                    }}
                  />
                  <div
                    className="bg-gray-200 rounded animate-pulse"
                    style={{
                      height: "23px",
                      width: "70%",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
