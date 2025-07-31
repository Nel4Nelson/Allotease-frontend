/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  EventService,
  Event,
  GetEventsParams,
} from "@/services/events-service";
import { EventCard } from "@/components/ui/event-card";
import { LeftArrowIcon, RightArrowIcon } from "@/components/icons";

interface EventDetailsOtherEventsProps {
  currentEventId: string;
  className?: string;
}

export function EventDetailsOtherEvents({
  currentEventId,
  className = "",
}: EventDetailsOtherEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
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

  // Load other events
  const loadOtherEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: GetEventsParams = {
        page: 1,
        limit: 10, // Get more events to filter out current one
      };

      const response = await EventService.getAllEvents(params);

      if (response.status === "success") {
        // Filter out the current event and take first 6
        const otherEvents = response.data.items
          .filter((event) => event._id !== currentEventId)
          .slice(0, 6);

        setEvents(otherEvents);
      } else {
        setError("Failed to load other events");
      }
    } catch (error) {
      console.error("Failed to load other events:", error);
      setError("Failed to load other events");
    } finally {
      setLoading(false);
    }
  };

  // Load events on mount
  useEffect(() => {
    if (currentEventId) {
      loadOtherEvents();
    }
  }, [currentEventId]);

  // Handle event card click
  const handleEventClick = (eventId: string) => {
    // Navigate to the event details page
    window.location.href = `/${eventId}?type=events`;
  };

  // Don't render if loading or no events
  if (loading) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="mb-8">
          <h2
            style={{
              color: "var(--Title, #1F2024)",
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
            Other events you may like
          </h2>
          <p
            style={{
              color: "var(--Body, #71727A)",
              fontFamily: "var(--font-source-sans), sans-serif",

              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "142.745%",
              letterSpacing: "-0.32px",
              margin: 0,
            }}
          >
            Get to know the peers in the room. An interactive activity to get
            conversations going before we head into lunch.
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
                <div className="bg-gray-200 h-4 rounded mb-2" />
                <div className="bg-gray-200 h-4 rounded w-2/3 mb-2" />
                <div className="bg-gray-200 h-6 rounded w-16 mb-2" />
                <div className="bg-gray-200 h-4 rounded w-3/4" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (error || events.length === 0) {
    return null; // Don't show section if there are no other events
  }

  return (
    <section className={`py-12 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h2
          style={{
            color: "var(--Title, #1F2024)",
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
          Other events you may like
        </h2>
        <p
          style={{
            color: "var(--Body, #71727A)",
            fontFamily: "var(--font-source-sans), sans-serif",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "142.745%",
            letterSpacing: "-0.32px",
            margin: 0,
          }}
        >
          Get to know the peers in the room. An interactive activity to get
          conversations going before we head into lunch.
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
            border: "1px solid var(--Orange-Red, #FF5B00)",
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
            {events.map((event) => (
              <div
                key={event._id}
                className="flex-none"
                style={{ width: "300px" }}
              >
                <EventCard
                  title={event.title}
                  dateTime={EventService.formatEventDateTime(event.startTime)}
                  imageUrl={EventService.getEventCoverImage(event)}
                  badgeText={EventService.formatEventPrice(event.price)}
                  organizerName="Flend Worldwide"
                  followerCount="117.5K Followers"
                  onClick={() => handleEventClick(event._id)}
                />
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
            border: "1px solid var(--Orange-Red, #FF5B00)",
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
