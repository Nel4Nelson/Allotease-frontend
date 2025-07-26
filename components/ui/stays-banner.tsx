import React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useStaysFormStore } from "@/stores/stay-form-store";

interface StaysBannerProps {
  className?: string;
}

export function StaysBanner({ className = "" }: StaysBannerProps) {
  const { getImageFiles } = useStaysFormStore();
  const staysImages = getImageFiles();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [mainViewportRef, emblaMainApi] = useEmblaCarousel({ loop: false });
  const [thumbViewportRef, emblaThumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  // Convert Files to URLs
  const imageUrls = React.useMemo(() => {
    if (!staysImages || staysImages.length === 0) return [];
    return staysImages.map(file => URL.createObjectURL(file));
  }, [staysImages]);

  // Cleanup URLs when component unmounts
  React.useEffect(() => {
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

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

  if (staysImages && staysImages.length > 0 && imageUrls.length > 0) {
    return (
      <div className={`w-full ${className}`}>
        {/* Main Image Display */}
        <div className="overflow-hidden rounded-[24px] mb-4" ref={mainViewportRef}>
          <div className="flex">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 relative h-[400px]"
              >
                <Image
                  src={url}
                  alt={`Stay image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnail Carousel */}
        {imageUrls.length > 1 && (
          <div className="flex items-center justify-center gap-4">
            {/* Left Arrow */}
            <button
              onClick={() => emblaThumbApi?.scrollPrev()}
              className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 text-gray-600"
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
            <div className="overflow-hidden max-w-md" ref={thumbViewportRef}>
              <div className="flex gap-3">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className={`flex-[0_0_auto] cursor-pointer transition-all duration-200 ${
                      index === selectedIndex ? "opacity-100 scale-105" : "opacity-60 hover:opacity-80"
                    }`}
                    onClick={() => onThumbClick(index)}
                  >
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-orange-400 transition-colors">
                      <Image
                        src={url}
                        alt={`Stay thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
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
              className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 text-gray-600"
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

  // Placeholder state - shows when no images or after refresh
  return (
    <div
      className={`w-full h-[400px] relative overflow-hidden rounded-[24px] bg-gray-100 flex flex-col items-center justify-center ${className}`}
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
          Accommodation Images Preview
        </p>
        <p className="text-gray-500 font-source-sans-pro text-sm max-w-md">
          Please upload images in the stays creation page to see your image carousel here.
        </p>
      </div>
    </div>
  );
}