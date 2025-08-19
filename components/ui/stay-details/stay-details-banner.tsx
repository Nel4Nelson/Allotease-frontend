import React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

interface StayDetailsBannerProps {
  images: string[];
  title: string;
  className?: string;
}

export function StayDetailsBanner({ 
  images, 
  title, 
  className = "" 
}: StayDetailsBannerProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [mainViewportRef, emblaMainApi] = useEmblaCarousel({ loop: false });
  const [thumbViewportRef, emblaThumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
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

  // Get image dimensions to calculate proper height (using first image)
  React.useEffect(() => {
    if (!images || images.length === 0) return;

    const img = document.createElement('img');
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height
      });
    };
    img.src = images[0];
  }, [images]);

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
      minHeight = 200;
      maxHeight = 300;
    } else if (screenWidth < 768) {
      // Small tablet (md breakpoint)
      containerWidth = screenWidth - 48;
      minHeight = 250;
      maxHeight = 350;
    } else if (screenWidth < 1024) {
      // Tablet (lg breakpoint)
      containerWidth = screenWidth * 0.8;
      minHeight = 280;
      maxHeight = 400;
    } else {
      // Desktop (xl breakpoint and above)
      containerWidth = 600; // Your perfect desktop width
      minHeight = 300;
      maxHeight = 500;
    }
    
    const aspectRatio = imageDimensions.height / imageDimensions.width;
    const calculatedHeight = containerWidth * aspectRatio;
    
    // Set reasonable min/max heights based on screen size
    return Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
  }, [imageDimensions, screenWidth]);

  // Calculate responsive placeholder height
  const placeholderHeight = React.useMemo(() => {
    if (!screenWidth) return 400;
    
    if (screenWidth < 640) {
      return 250; // Mobile
    } else if (screenWidth < 768) {
      return 300; // Small tablet
    } else if (screenWidth < 1024) {
      return 350; // Tablet
    } else {
      return 400; // Desktop
    }
  }, [screenWidth]);

  // Calculate responsive thumbnail dimensions
  const thumbnailDimensions = React.useMemo(() => {
    if (!screenWidth) return { width: 64, height: 48 };
    
    if (screenWidth < 640) {
      return { width: 48, height: 36 }; // Mobile - smaller thumbnails
    } else if (screenWidth < 768) {
      return { width: 56, height: 42 }; // Small tablet
    } else {
      return { width: 64, height: 48 }; // Desktop
    }
  }, [screenWidth]);

  // Handle thumbnail click
  const onThumbClick = React.useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbApi]
  );

  // Update selected index when main carousel scrolls
  const onSelect = React.useCallback(() => {
    if (!emblaMainApi || !emblaThumbApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbApi, setSelectedIndex]);

  // Set up event listeners
  React.useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  if (images && images.length > 0) {
    return (
      <div className={`w-full ${className}`}>
        {/* Main Image Display */}
        <div 
          className="overflow-hidden rounded-[24px] mb-4" 
          ref={mainViewportRef}
          style={{ height: `${containerHeight}px` }}
        >
          <div className="flex">
            {images.map((imageUrl, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 relative"
                style={{ height: `${containerHeight}px` }}
              >
                <Image
                  src={imageUrl}
                  alt={`${title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 600px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnail Carousel */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {/* Left Arrow */}
            <button
              onClick={() => emblaThumbApi?.scrollPrev()}
              className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
              aria-label="Previous image"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Thumbnails Container */}
            <div className="overflow-hidden max-w-xs sm:max-w-md md:max-w-lg" ref={thumbViewportRef}>
              <div className="flex gap-2 sm:gap-3">
                {images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`flex-[0_0_auto] cursor-pointer transition-all duration-200 ${
                      index === selectedIndex ? "opacity-100 scale-105" : "opacity-60 hover:opacity-80"
                    }`}
                    onClick={() => onThumbClick(index)}
                  >
                    <div 
                      className="relative rounded-lg overflow-hidden border-2 border-transparent hover:border-orange-400 transition-colors"
                      style={{ 
                        width: `${thumbnailDimensions.width}px`, 
                        height: `${thumbnailDimensions.height}px` 
                      }}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${title} - Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes={`${thumbnailDimensions.width}px`}
                      />
                      {index === selectedIndex && (
                        <div className="absolute inset-0 border-2 border-orange-500 rounded-lg" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => emblaThumbApi?.scrollNext()}
              className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
              aria-label="Next image"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Placeholder state - shows when no images are available
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

      {/* No Images Message */}
      <div className="text-center px-4 sm:px-6 md:px-8">
        <p className="text-gray-600 font-source-sans-pro text-sm sm:text-base font-medium mb-1 sm:mb-2">
          No Images Available
        </p>
        <p className="text-gray-500 font-source-sans-pro text-xs sm:text-sm max-w-xs sm:max-w-md">
          Images for this accommodation are not currently available.
        </p>
      </div>
    </div>
  );
}