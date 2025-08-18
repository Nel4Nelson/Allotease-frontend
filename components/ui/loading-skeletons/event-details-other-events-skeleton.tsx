import React from "react";

interface EventDetailsOtherEventsSkeletonProps {
  className?: string;
  eventCount?: number;
}

export function EventDetailsOtherEventsSkeleton({
  className = "",
  eventCount = 3,
}: EventDetailsOtherEventsSkeletonProps) {
  return (
    <section className={`py-12 ${className}`}>
      {/* Header Skeleton */}
      <div className="mb-8">
        {/* Title Skeleton */}
        <div
          className="bg-gray-200 rounded animate-pulse mb-2"
          style={{
            height: "31px",
            width: "320px",
          }}
        />

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div
            className="bg-gray-200 rounded animate-pulse"
            style={{
              height: "23px",
              width: "100%",
              maxWidth: "600px",
            }}
          />
          <div
            className="bg-gray-200 rounded animate-pulse"
            style={{
              height: "23px",
              width: "70%",
              maxWidth: "420px",
            }}
          />
        </div>
      </div>

      {/* Carousel Skeleton */}
      <div className="relative">
        {/* Left Navigation Skeleton */}
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 rounded-[51px] animate-pulse"
          style={{
            width: "48px",
            height: "48px",
          }}
        />

        {/* Event Cards Container */}
        <div className="flex gap-6 px-16">
          {" "}
          {/* Padding to account for navigation buttons */}
          {Array(eventCount)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex-none animate-pulse"
                style={{ width: "300px" }}
              >
                {/* Event Card Skeleton */}
                <div className="space-y-3">
                  {/* Banner Image Skeleton */}
                  <div
                    className="bg-gray-200 rounded-[24px]"
                    style={{
                      height: "176px",
                      width: "100%",
                    }}
                  />

                  {/* Badge Skeleton */}
                  <div
                    className="bg-gray-200 rounded-full"
                    style={{
                      height: "24px",
                      width: "80px",
                    }}
                  />

                  {/* Title Skeleton */}
                  <div className="space-y-2">
                    <div
                      className="bg-gray-200 rounded"
                      style={{
                        height: "20px",
                        width: "90%",
                      }}
                    />
                    <div
                      className="bg-gray-200 rounded"
                      style={{
                        height: "20px",
                        width: "70%",
                      }}
                    />
                  </div>

                  {/* Date/Time Skeleton */}
                  <div
                    className="bg-gray-200 rounded"
                    style={{
                      height: "18px",
                      width: "60%",
                    }}
                  />

                  {/* Organizer Info Skeleton */}
                  <div className="flex items-center gap-2">
                    <div
                      className="bg-gray-200 rounded-full"
                      style={{
                        width: "24px",
                        height: "24px",
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

                  {/* Follower Count Skeleton */}
                  <div
                    className="bg-gray-200 rounded"
                    style={{
                      height: "16px",
                      width: "100px",
                    }}
                  />
                </div>
              </div>
            ))}
        </div>

        {/* Right Navigation Skeleton */}
        <div
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 rounded-[51px] animate-pulse"
          style={{
            width: "48px",
            height: "48px",
          }}
        />
      </div>
    </section>
  );
}
