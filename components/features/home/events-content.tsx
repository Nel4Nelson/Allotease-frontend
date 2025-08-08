/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ContentHeader } from "@/components/ui/content-header";
import { SectionTitle } from "@/components/ui/section-title";
import { VariantSelect } from "@/components/ui/variant-select";
import { EventCard } from "@/components/ui/event-card";
import { Button } from "@/components/ui/button";
import {
  EventService,
  Event,
  GetEventsParams,
} from "@/services/events-service";
import { StaysGridSkeleton } from "@/components/ui/loading-skeletons/stay-card-skeleton";
import { NetworkError, EmptyState, OfflineState } from "@/components/ui/network-error";
import { useIsOnline } from "@/hooks/use-network-status";

interface EventsContentProps {
  className?: string;
}

export function EventsContent({ className = "" }: EventsContentProps) {
  const router = useRouter();
  const isOnline = useIsOnline();
  
  const [selectedLocation, setSelectedLocation] = useState("awka-anambra");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // API state
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load events function with error handling
  const loadEvents = async (page: number = 1, append: boolean = false) => {
    // Don't attempt to load if offline
    if (!isOnline) {
      setError("offline");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params: GetEventsParams = {
        page,
        limit: 6,
        ...(selectedCategory &&
          selectedCategory !== "all" && { query: selectedCategory }),
      };

      const response = await EventService.getAllEvents(params);

      if (response.status === "success") {
        const newEvents = response.data.items;

        if (append) {
          // Append new events to existing ones
          setEvents((prev) => [...prev, ...newEvents]);
        } else {
          // Replace events (for filters or initial load)
          setEvents(newEvents);
        }

        setCurrentPage(response.data.page);
        setHasNextPage(response.data.hasNextPage);
      }
    } catch (error: any) {
      console.error("Failed to load events:", error);
      
      // Set appropriate error message
      if (!isOnline) {
        setError("offline");
      } else if (error?.response?.status >= 500) {
        setError("server");
        toast.error("Server error. Please try again later.");
      } else if (error?.response?.status >= 400) {
        setError("request");
        toast.error("Failed to load events. Please try again.");
      } else {
        setError("network");
      }
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadEvents(1, false);
  }, []);

  // Reload when filters change
  useEffect(() => {
    if (!isInitialLoad) {
      setCurrentPage(1);
      loadEvents(1, false);
    }
  }, [selectedCategory, selectedLocation, isInitialLoad]);

  // Reload when connection status changes
  useEffect(() => {
    if (isOnline && error === "offline" && !isInitialLoad) {
      loadEvents(currentPage, false);
    }
  }, [isOnline]);

  // Show more events
  const handleShowMore = () => {
    if (hasNextPage && !loading) {
      loadEvents(currentPage + 1, true);
    }
  };

  // Collapse back to first 6
  const handleCollapse = () => {
    setCurrentPage(1);
    loadEvents(1, false);
  };

  // Handle event card click
  const handleEventClick = (eventId: string) => {
    router.push(`/${eventId}?type=events`);
  };

  // Retry handler
  const handleRetry = () => {
    setError(null);
    loadEvents(currentPage, false);
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedLocation("awka-anambra");
    setCurrentPage(1);
    loadEvents(1, false);
  };

  // Show different buttons based on state
  const showMoreButton = hasNextPage && !loading && !error;
  const showCollapseButton = currentPage > 1 && !loading && !error;

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <ContentHeader
          title={<SectionTitle>Available events in your location</SectionTitle>}
          action={
            <VariantSelect
              variant="glass"
              placeholder="Category"
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              options={[
                { value: "all", label: "All Categories" },
                { value: "workshop", label: "Workshop" },
                { value: "conference", label: "Conference" },
                { value: "seminar", label: "Seminar" },
                { value: "networking", label: "Networking" },
                { value: "Bitcoin", label: "Bitcoin" },
                { value: "Pool", label: "Pool Party" },
                { value: "Ethereum", label: "Ethereum" },
              ]}
            />
          }
        />

        <VariantSelect
          variant="ghost"
          icon="/icons/location.svg"
          iconAlt="Location"
          value={selectedLocation}
          onValueChange={setSelectedLocation}
          options={[
            { value: "awka-anambra", label: "Awka, Anambra" },
            { value: "lagos-lagos", label: "Lagos, Lagos" },
            { value: "abuja-fct", label: "Abuja, FCT" },
            { value: "port-harcourt-rivers", label: "Port Harcourt, Rivers" },
            { value: "kano-kano", label: "Kano, Kano" },
            { value: "ibadan-oyo", label: "Ibadan, Oyo" },
          ]}
        />
      </div>

      {/* Loading State - Show skeleton on initial load */}
      {loading && isInitialLoad && (
        <StaysGridSkeleton count={6} />
      )}

      {/* Offline State */}
      {!loading && !isOnline && events.length === 0 && (
        <OfflineState />
      )}

      {/* Error State */}
      {!loading && error && error !== "offline" && events.length === 0 && (
        <NetworkError
          message={
            error === "server" 
              ? "Server is temporarily unavailable"
              : "Unable to load events"
          }
          onRetry={handleRetry}
        />
      )}

      {/* Empty State */}
      {!loading && !error && events.length === 0 && !isInitialLoad && (
        <EmptyState
          title="No events found"
          message={
            selectedCategory !== "all" 
              ? "No events match your selected filters. Try adjusting your search criteria."
              : "No events available in this location."
          }
          actionLabel={selectedCategory !== "all" ? "Clear Filters" : undefined}
          onAction={selectedCategory !== "all" ? handleClearFilters : undefined}
        />
      )}

      {/* Events Grid */}
      {events.length > 0 && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
            className="w-full"
          >
            {events.map((event) => (
              <EventCard
                key={event._id}
                title={event.title}
                dateTime={EventService.formatEventDateTime(event.startTime)}
                imageUrl={EventService.getEventCoverImage(event)}
                badgeText={EventService.formatEventPrice(event.price)}
                organizerName="Flend Worldwide"
                followerCount="117.5K Followers"
                onClick={() => handleEventClick(event._id)}
              />
            ))}
          </div>

          {/* Loading more indicator */}
          {loading && !isInitialLoad && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Loading more events...</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            {showMoreButton && (
              <Button
                variant="signup-primary"
                size="allotease-md"
                onClick={handleShowMore}
                disabled={loading || !isOnline}
                loading={loading}
              >
                Show More
              </Button>
            )}

            {showCollapseButton && (
              <Button
                variant="allotease-blur"
                size="allotease-md"
                onClick={handleCollapse}
                disabled={loading}
              >
                Collapse
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}