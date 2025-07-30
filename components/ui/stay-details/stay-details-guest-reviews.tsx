/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { RatingService, Review } from "@/services/rating-service";
import { ReviewCard } from "@/components/ui/review-card";
import { LeftArrowIcon, RightArrowIcon } from "@/components/icons";

interface StayDetailsGuestReviewsProps {
  ownerId: string;
  className?: string;
}

export function StayDetailsGuestReviews({
  ownerId,
  className = "",
}: StayDetailsGuestReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Embla carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    skipSnaps: false,
    breakpoints: {
      "(min-width: 768px)": {
        slidesToScroll: 3, // Show 3 cards at once on desktop
      },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Navigation functions
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Update scroll button states
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Setup embla event listeners
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Load reviews
  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await RatingService.getReviewsByAllocator(ownerId, {
        page: 1,
        limit: 10, // Get up to 10 reviews for the carousel
      });

      if (response.status === "success") {
        // Sort reviews by newest first
        const sortedReviews = RatingService.sortReviews(
          response.data.reviews,
          "newest"
        );
        setReviews(sortedReviews);
      } else {
        setError("Failed to load reviews");
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // Load reviews on mount
  useEffect(() => {
    if (ownerId) {
      loadReviews();
    }
  }, [ownerId]);

  // Don't render if loading or no reviews
  if (loading) {
    return (
      <div className={`my-8 ${className}`}>
        <div className="mb-8">
          <h2
            style={{
              color: "#1F2024",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "28px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "110%",
              letterSpacing: "-0.56px",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            Guest Reviews
          </h2>
          <p
            style={{
              color: "#71727A",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "142.745%",
              letterSpacing: "-0.32px",
              margin: 0,
            }}
          >
            Hear what others think of the place.
          </p>
        </div>
        <div className="mt-4 flex gap-6">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex-none animate-pulse"
                style={{ width: "300px" }}
              >
                <div
                  className="bg-gray-200 rounded-[12px] p-4"
                  style={{ height: "180px" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-1 w-24" />
                      <div className="h-3 bg-gray-300 rounded w-16" />
                    </div>
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="flex gap-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 bg-gray-300 rounded"
                          />
                        ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded" />
                    <div className="h-3 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-300 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (error || reviews.length === 0) {
    return null; // Don't show section if there are no reviews
  }

  return (
    <section className={`my-10 ${className}`}>
      {/* Header */}
      <div>
        <h2
          style={{
            color: "#1F2024",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "28px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "110%",
            letterSpacing: "-0.56px",
            margin: 0,
            marginBottom: "8px",
          }}
        >
          Guest Reviews
        </h2>
        <p
          style={{
            color: "#71727A",
            fontFamily: "var(--font-source-sans), sans-serif",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "142.745%",
            letterSpacing: "-0.32px",
            margin: 0,
          }}
        >
          Hear what others think of the place.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative mt-4">
        {/* Left Navigation */}
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 transition-all hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderRadius: "51px",
            border: "1px solid #FF5B00",
            display: "flex",
            padding: "12px",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            background: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <LeftArrowIcon />
        </button>

        {/* Carousel Container */}
        <div className="overflow-hidden w-full" ref={emblaRef}>
          <div className="flex gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="flex-none"
                style={{ width: "300px" }}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Navigation */}
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 transition-all hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderRadius: "51px",
            border: "1px solid #FF5B00",
            display: "flex",
            padding: "12px",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            background: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <RightArrowIcon />
        </button>
      </div>
    </section>
  );
}
