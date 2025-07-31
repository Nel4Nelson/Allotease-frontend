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

  // Calculate dynamic height based on image aspect ratio
  const containerHeight = React.useMemo(() => {
    if (!imageDimensions) return 360; // Default height

    // Assume container width is around 600px (adjust based on your actual container width)
    const containerWidth = 600;
    const aspectRatio = imageDimensions.height / imageDimensions.width;
    const calculatedHeight = containerWidth * aspectRatio;

    // Set reasonable min/max heights to prevent extreme cases
    return Math.min(Math.max(calculatedHeight, 200), 500);
  }, [imageDimensions]);

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
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  // Placeholder state - shows when no image is provided
  return (
    <div
      className={`w-full h-[360px] relative overflow-hidden rounded-[24px] bg-gray-100 flex flex-col items-center justify-center ${className}`}
    >
      {/* Placeholder Image */}
      <div className="w-24 h-24 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-400"
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
      <div className="text-center px-8">
        <p className="text-gray-600 font-source-sans-pro text-base font-medium mb-2">
          Event Banner
        </p>
        <p className="text-gray-500 font-source-sans-pro text-sm max-w-md">
          No banner image available for this event.
        </p>
      </div>
    </div>
  );
}
