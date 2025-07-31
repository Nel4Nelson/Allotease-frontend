/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  StaysService,
  Stay,
  GetStaysParams,
} from "@/services/stays-service";
import { LeftArrowIcon, RightArrowIcon } from "@/components/icons";
import { StayCard } from "../stays-card";

interface StayDetailsOtherStaysProps {
  currentStayId: string;
  className?: string;
}

export function StayDetailsOtherStays({
  currentStayId,
  className = "",
}: StayDetailsOtherStaysProps) {
  const [stays, setStays] = useState<Stay[]>([]);
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

  // Load other stays
  const loadOtherStays = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: GetStaysParams = {
        page: 1,
        limit: 10, // Get more stays to filter out current one
      };

      const response = await StaysService.getAllStays(params);

      if (response.status === "success") {
        // Filter out the current stay and take first 6
        const otherStays = response.data.items
          .filter((stay) => stay._id !== currentStayId)
          .slice(0, 6);

        setStays(otherStays);
      } else {
        setError("Failed to load other stays");
      }
    } catch (error) {
      console.error("Failed to load other stays:", error);
      setError("Failed to load other stays");
    } finally {
      setLoading(false);
    }
  };

  // Load stays on mount
  useEffect(() => {
    if (currentStayId) {
      loadOtherStays();
    }
  }, [currentStayId]);

  // Handle stay card click
  const handleStayClick = (stayId: string) => {
    // Navigate to the stay details page
    window.location.href = `/${stayId}?type=stays`;
  };

  // Format stay data for StayCard props
  const formatStayForCard = (stay: Stay) => {
    return {
      title: stay.title,
      location: StaysService.formatStayLocation(stay.location),
      rating: StaysService.getMockRating(), // Using mock rating as per existing service
      reviewCount: StaysService.getMockReviewCount(), // Using mock review count
      description: stay.description,
      imageUrl: StaysService.getStayBannerImage(stay),
    };
  };

  // Don't render if loading
  if (loading) {
    return (
      <div className={`my-8 ${className}`}>
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
            Other stays you may like
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
            Suggestions based on browse history.
          </p>
        </div>
        <div className="flex gap-6">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex-none animate-pulse"
                style={{ width: "300px" }}
              >
                <div className="bg-gray-200 rounded-[24px] h-[176px] mb-2" />
                <div className="bg-gray-200 h-5 rounded mb-2 w-48" />
                <div className="bg-gray-200 h-4 rounded mb-4 w-32" />
                <div className="w-full h-px bg-gray-200 mb-4" />
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gray-200 h-6 rounded-xl w-12" />
                  <div className="bg-gray-200 h-4 rounded w-20" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="bg-gray-200 h-4 rounded" />
                  <div className="bg-gray-200 h-4 rounded w-3/4" />
                </div>
                <div className="bg-gray-200 h-10 rounded-[51px]" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (error || stays.length === 0) {
    return null; // Don't show section if there are no other stays
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
          Other stays you may like
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
          Suggestions based on browse history.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative">
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
        <div className="overflow-hidden w-full mt-4" ref={emblaRef}>
          <div className="flex gap-6">
            {stays.map((stay) => {
              const stayCardProps = formatStayForCard(stay);
              return (
                <div
                  key={stay._id}
                  className="flex-none"
                  style={{ width: "300px" }}
                >
                  <StayCard
                    {...stayCardProps}
                    onClick={() => handleStayClick(stay._id)}
                  />
                </div>
              );
            })}
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