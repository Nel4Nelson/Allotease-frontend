/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
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

interface EventsContentProps {
  className?: string;
}

export function EventsContent({ className = "" }: EventsContentProps) {
  const [selectedLocation, setSelectedLocation] = useState("awka-anambra");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // API state
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load events function
  const loadEvents = async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);

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
    } catch (error) {
      console.error("Failed to load events:", error);
      toast.error("Failed to load events. Please try again.");
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
    // TODO: Navigate to /events/{eventId}
    console.log("Navigate to event:", eventId);
    toast.success(`Event ${eventId} clicked! Navigation coming soon.`);
  };

  // Show different buttons based on state
  const showMoreButton = hasNextPage && !loading;
  const showCollapseButton = currentPage > 1 && !loading;

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        {/* Phase 1: Content Header */}
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

        {/* Phase 2: Location Selector */}
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

      {/* Phase 3: Event Cards */}
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

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="text-gray-500">Loading events...</div>
        </div>
      )}

      {/* No Events State */}
      {!loading && events.length === 0 && !isInitialLoad && (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="text-gray-500 mb-2">No events found</div>
          <div className="text-sm text-gray-400">
            Try adjusting your filters
          </div>
        </div>
      )}

      {/* Phase 4: Pagination Controls */}
      {events.length > 0 && (
        <div className="flex justify-center gap-4 pt-4">
          {showMoreButton && (
            <Button
              variant="signup-primary"
              size="allotease-md"
              onClick={handleShowMore}
              disabled={loading}
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
      )}
    </div>
  );
}
