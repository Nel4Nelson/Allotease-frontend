/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import { EventDetailsBanner } from "@/components/ui/event-details/event-details-banner";
import { EventDetailsTicketSalesBadge } from "@/components/ui/event-details/event-details-ticket-sales-badge";
import { EventDetailsTitle } from "@/components/ui/event-details/event-details-title";
import { EventDetailsDescription } from "@/components/ui/event-details/event-details-description";
import { EventDetailsDateTime } from "@/components/ui/event-details/event-details-date-time";
import { EventService, Event } from "@/services/events-service";

interface EventDetailsPageProps {
  id: string;
  className?: string;
}

interface EventDetailsState {
  event: Event | null;
  availableCapacity: number;
  loading: boolean;
  error: string | null;
}

export function EventDetailsPage({
  id,
  className = "",
}: EventDetailsPageProps) {
  const [state, setState] = useState<EventDetailsState>({
    event: null,
    availableCapacity: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const response = await EventService.getEventById(id);

        if (response.status === "success") {
          setState((prev) => ({
            ...prev,
            event: response.data.event,
            availableCapacity: response.data.availableCapacity,
            loading: false,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            error: "Failed to load event details",
            loading: false,
          }));
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to load event details. Please try again.",
          loading: false,
        }));
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  // Loading state
  if (state.loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="w-full h-[360px] bg-gray-200 rounded-[24px] animate-pulse" />
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          </div>
          <div className="col-span-4">
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="text-red-600 text-lg font-semibold mb-2">
            {state.error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // No event found
  if (!state.event) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="text-gray-600 text-lg font-semibold mb-2">
            Event not found
          </div>
          <div className="text-gray-500">
            The event you're looking for doesn't exist or has been removed.
          </div>
        </div>
      </div>
    );
  }

  const { event } = state;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Event Banner - Full Width */}
      <EventDetailsBanner
        imageUrl={EventService.getEventCoverImage(event)}
        alt={event.title}
      />

      {/* Two Column Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Main Content (625px ≈ 64.8% ≈ 8 cols out of 12) */}
        <div className="col-span-8">
          {/* Ticket Sales Badge */}
          <EventDetailsTicketSalesBadge
            eventDate={event.startTime}
            className="mb-4"
          />

          {/* Event Title Section */}
          <div className="mb-2">
            <EventDetailsTitle title={event.title} />
          </div>

          {/* Event Description Section */}
          <div className="mb-4">
            <EventDetailsDescription description={event.description} />
          </div>

          {/* Date & Time Section */}
          <div className="mb-8">
            <EventDetailsDateTime
              startTime={event.startTime}
              endTime={event.endTime}
            />
          </div>

          {/* Location Section */}
          <div className="mb-8">
            {/* Location component will go here */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Location</h3>
              <p className="text-gray-600">Location component coming soon...</p>
            </div>
          </div>

          {/* Event Details Section */}
          <div className="mb-8">
            {/* Event Details component will go here */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Event Details</h3>
              <p className="text-gray-600">
                Event details component coming soon...
              </p>
            </div>
          </div>

          {/* Categories Section */}
          <div className="mb-8">
            {/* Categories component will go here */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Categories</h3>
              <p className="text-gray-600">
                Categories component coming soon...
              </p>
            </div>
          </div>

          {/* Follow card Section */}
          <div className="mb-8">
            {/* UserProfileFollowCard will go here */}
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Organizer</h3>
              <p className="text-gray-600">
                Follow card component coming soon...
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Registration Sidebar (remaining space ≈ 35.2% ≈ 4 cols out of 12) */}
        <div className="col-span-4">
          {/* Registration Card */}
          <div className="sticky top-8">
            {/* Registration content will go here */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Register for Event</h3>
              <p className="text-gray-600 text-sm">
                Registration form will be implemented here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
