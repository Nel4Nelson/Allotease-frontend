/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { EventDetailsBanner } from "@/components/ui/event-details/event-details-banner";
import { EventDetailsTicketSalesBadge } from "@/components/ui/event-details/event-details-ticket-sales-badge";
import { EventDetailsTitle } from "@/components/ui/event-details/event-details-title";
import { EventDetailsDateTime } from "@/components/ui/event-details/event-details-date-time";
import { EventService, Event } from "@/services/events-service";
import { EventDetailsLocation } from "@/components/ui/event-details/event-details-location";
import { EventDetailsDescription } from "@/components/ui/event-details/event-details-description";
import { EventDetailsEventDetails } from "@/components/ui/event-details/event-details-event-details";
import { EventDetailsCategories } from "@/components/ui/event-details/event-details-categories";
import { EventDetailsOrganizer } from "@/components/ui/event-details/event-details-organizer";
import { EventDetailsOtherEvents } from "@/components/ui/event-details/event-details-other-events";
import { EventDetailsRegistrationCard } from "@/components/ui/event-details/event-details-registration-card";
import { useEventBookingStore } from "@/stores/event-booking-store";
import { BookingSuccessModal } from "@/components/ui/modals/booking-success-modal";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearEventBookingData } = useEventBookingStore();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [state, setState] = useState<EventDetailsState>({
    event: null,
    availableCapacity: 0,
    loading: true,
    error: null,
  });

  // Handle payment callback
  useEffect(() => {
    const type = searchParams.get("type");
    const trxref = searchParams.get("trxref");
    const reference = searchParams.get("reference");

    if (type === "events") {
      if (trxref || reference) {
        // Payment successful
        clearEventBookingData();
        toast.success("Event registration completed successfully!");
        setShowSuccessModal(true);
      }
    }
  }, [searchParams, clearEventBookingData, router]);

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

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

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
    <>
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
              <EventDetailsLocation
                eventType={event.eventType}
                location={event.location}
              />
            </div>

            {/* Event Details Section */}
            <div className="mb-8">
              <EventDetailsEventDetails agenda={event.agenda} />
            </div>

            {/* Categories Section */}
            <div className="mb-8">
              <EventDetailsCategories tags={event.tags} />
            </div>

            {/* Follow card Section */}
            <div className="mb-8">
              <EventDetailsOrganizer ownerId={event.ownerId} />
            </div>
          </div>

          {/* Right Column - Registration Sidebar (remaining space ≈ 35.2% ≈ 4 cols out of 12) */}
          <div className="col-span-4">
            {/* Registration Card */}
            <EventDetailsRegistrationCard
              event={event}
              availableCapacity={state.availableCapacity}
            />
          </div>
        </div>

        {/* Other Events Section - Full Width Below Grid */}
        <EventDetailsOtherEvents currentEventId={event._id} />
      </div>

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        type="events"
      />
    </>
  );
}
