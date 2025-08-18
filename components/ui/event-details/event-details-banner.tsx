import React from "react";
import Image from "next/image";

interface EventDetailsBannerProps {
  imageUrl?: string;
  alt?: string;
  className?: string;
}

export function EventDetailsBanner({
  imageUrl,
  alt = "Event banner",
  className = "",
}: EventDetailsBannerProps) {
  const [imageDimensions, setImageDimensions] = React.useState<{
    width: number;
    height: number;
  } | null>(null);
  const [screenWidth, setScreenWidth] = React.useState<number>(0);

  // Track screen width for responsive calculations
  React.useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial screen width
    updateScreenWidth();

    // Add event listener for resize
    window.addEventListener('resize', updateScreenWidth);
    
    return () => window.removeEventListener('resize', updateScreenWidth);
  }, []);

  // Get image dimensions to calculate proper height
  React.useEffect(() => {
    if (!imageUrl) return;

    const img = document.createElement("img");
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = () => {
      // Handle image load error
      setImageDimensions({ width: 16, height: 9 }); // Default aspect ratio
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Calculate responsive height based on screen size and image aspect ratio
  const containerHeight = React.useMemo(() => {
    if (!imageDimensions || !screenWidth) return 360; // Default height
    
    let containerWidth: number;
    let minHeight: number;
    let maxHeight: number;

    // Responsive container width calculation
    if (screenWidth < 640) {
      // Mobile (sm breakpoint)
      containerWidth = screenWidth - 32; // Account for padding
      minHeight = 150;
      maxHeight = 250;
    } else if (screenWidth < 768) {
      // Small tablet (md breakpoint)
      containerWidth = screenWidth - 48;
      minHeight = 180;
      maxHeight = 280;
    } else if (screenWidth < 1024) {
      // Tablet (lg breakpoint)
      containerWidth = screenWidth * 0.8;
      minHeight = 200;
      maxHeight = 350;
    } else {
      // Desktop (xl breakpoint and above)
      containerWidth = 600;
      minHeight = 200;
      maxHeight = 500;
    }
    
    const aspectRatio = imageDimensions.height / imageDimensions.width;
    const calculatedHeight = containerWidth * aspectRatio;
    
    // Set reasonable min/max heights based on screen size
    return Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
  }, [imageDimensions, screenWidth]);

  // Calculate responsive placeholder height
  const placeholderHeight = React.useMemo(() => {
    if (!screenWidth) return 360;
    
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

  if (imageUrl) {
    return (
      <div
        className={`w-full relative overflow-hidden rounded-[24px] ${className}`}
        style={{ height: `${containerHeight}px` }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 600px"
        />
      </div>
    );
  }

  // Placeholder state - shows when no image is provided
  return (
    <div
      className={`w-full relative overflow-hidden rounded-[24px] bg-gray-100 flex flex-col items-center justify-center ${className}`}
      style={{ height: `${placeholderHeight}px` }}
    >
      {/* Placeholder Image */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-300 rounded-lg mb-3 sm:mb-4 flex items-center justify-center">
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Helpful Message */}
      <div className="text-center px-4 sm:px-6 md:px-8">
        <p className="text-gray-600 font-source-sans-pro text-sm sm:text-base font-medium mb-1 sm:mb-2">
          Event Banner
        </p>
        <p className="text-gray-500 font-source-sans-pro text-xs sm:text-sm max-w-xs sm:max-w-md">
          No banner image available for this event.
        </p>
      </div>
    </div>
  );
}