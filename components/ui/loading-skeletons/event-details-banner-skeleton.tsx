import React from "react";

interface EventDetailsBannerSkeletonProps {
  className?: string;
}

export function EventDetailsBannerSkeleton({
  className = "",
}: EventDetailsBannerSkeletonProps) {
  const [screenWidth, setScreenWidth] = React.useState<number>(0);

  // Track screen width for responsive calculations
  React.useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial screen width
    updateScreenWidth();

    // Add event listener for resize
    window.addEventListener("resize", updateScreenWidth);

    return () => window.removeEventListener("resize", updateScreenWidth);
  }, []);

  // Calculate responsive skeleton height
  const skeletonHeight = React.useMemo(() => {
    if (!screenWidth) return 360; // Default height

    if (screenWidth < 640) {
      return 200; // Mobile
    } else if (screenWidth < 768) {
      return 250; // Small tablet
    } else if (screenWidth < 1024) {
      return 300; // Tablet
    } else {
      return 360; // Desktop
    }
  }, [screenWidth]);

  return (
    <div
      className={`w-full relative overflow-hidden rounded-[24px] bg-gray-200 animate-pulse ${className}`}
      style={{ height: `${skeletonHeight}px` }}
    >
      {/* Responsive gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
    </div>
  );
}
