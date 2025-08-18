import React from "react";

interface EventDetailsCategoriesSkeletonProps {
  className?: string;
  tagCount?: number;
}

export function EventDetailsCategoriesSkeleton({ 
  className = "",
  tagCount = 4
}: EventDetailsCategoriesSkeletonProps) {
  // Predefined widths for variety in tag sizes
  const tagWidths = ["80px", "120px", "95px", "110px", "75px", "135px"];

  return (
    <div className={className}>
      {/* Section Title Skeleton */}
      <div
        className="bg-gray-200 rounded animate-pulse mb-4"
        style={{
          height: "28px",
          width: "120px",
        }}
      />

      {/* Category Tags Skeleton */}
      <div className="flex flex-wrap gap-3">
        {Array(tagCount)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-full animate-pulse"
              style={{
                height: "32px",
                width: tagWidths[index % tagWidths.length],
              }}
            />
          ))}
      </div>
    </div>
  );
}