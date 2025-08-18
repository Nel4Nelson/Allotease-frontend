/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
import { EventDetailsPageSkeleton } from "@/components/ui/loading-skeletons/event-details-skeleton-page";

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

  const searchParams = useSearchParams();
  const { clearEventBookingData } = useEventBookingStore();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Use ref to track if callback has been processed to prevent duplicate toasts
  const callbackProcessedRef = useRef(false);

  const [state, setState] = useState<EventDetailsState>({
    event: null,
    availableCapacity: 0,
    loading: true,
    error: null,
  });

  // Clean URL parameters by removing booking-related query params
  const cleanUrlParameters = () => {
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);
    
    // Remove booking-related parameters
    params.delete('trxref');
    params.delete('reference');
    params.delete('booking');
    
    // Build new URL
    const newUrl = `${currentUrl.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    
    // Replace current URL without triggering navigation
    window.history.replaceState({}, '', newUrl);
  };

  // Handle booking callback - with duplicate prevention
  useEffect(() => {
    const type = searchParams.get("type");
    const trxref = searchParams.get("trxref");
    const reference = searchParams.get("reference");
    const booking = searchParams.get("booking");

    // Check if we have booking parameters and haven't processed them yet
    const hasPaymentParams = type === "events" && (trxref || reference);
    const hasFreeBookingParam = booking === "free";
    
    if ((hasPaymentParams || hasFreeBookingParam) && !callbackProcessedRef.current) {
      // Mark as processed immediately to prevent any duplicate processing
      callbackProcessedRef.current = true;
      
      // Clear booking data
      clearEventBookingData();
      
      // Show the success modal
      setShowSuccessModal(true);
      
      // Clean URL parameters immediately after processing
      cleanUrlParameters();
    }
  }, [searchParams, clearEventBookingData]);

  // Reset the processed flag when component unmounts or ID changes
  useEffect(() => {
    return () => {
      callbackProcessedRef.current = false;
    };
  }, [id]);

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

  // Handle success modal close
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Reset the processed flag after modal closes
    callbackProcessedRef.current = false;
  };

  // Loading state
  if (state.loading) {
    return <EventDetailsPageSkeleton />;
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
            className="text-gray-500 underline"
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

        {/* Mobile Layout - Single Column */}
        <div className="lg:hidden space-y-6">
          {/* Ticket Sales Badge */}
          <EventDetailsTicketSalesBadge
            eventDate={event.startTime}
          />

          {/* Event Title Section */}
          <EventDetailsTitle title={event.title} />

          {/* Registration Card - Mobile Position (after title) */}
          <div className="lg:sticky lg:top-8">
            <EventDetailsRegistrationCard
              event={event}
              availableCapacity={state.availableCapacity}
            />
          </div>

          {/* Event Description Section */}
          <EventDetailsDescription description={event.description} />

          {/* Date & Time Section */}
          <EventDetailsDateTime
            startTime={event.startTime}
            endTime={event.endTime}
          />

          {/* Location Section */}
          <EventDetailsLocation
            eventType={event.eventType}
            location={event.location}
          />

          {/* Event Details Section */}
          <EventDetailsEventDetails agenda={event.agenda} />

          {/* Categories Section */}
          <EventDetailsCategories tags={event.tags} />

          {/* Follow card Section */}
          <EventDetailsOrganizer ownerId={event.ownerId} />

          {/* Other Events Section - Mobile Position */}
          <EventDetailsOtherEvents currentEventId={event._id} />
        </div>

        {/* Desktop Layout - Two Column Grid (lg:block to show only on desktop) */}
        <div className="hidden lg:block">
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
              {/* Registration Card - Desktop Position */}
              <div className="lg:sticky lg:top-8">
                <EventDetailsRegistrationCard
                  event={event}
                  availableCapacity={state.availableCapacity}
                />
              </div>
            </div>
          </div>

          {/* Other Events Section - Full Width Below Grid (Desktop only) */}
          <EventDetailsOtherEvents currentEventId={event._id} />
        </div>
      </div>

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        type="events"
        showToast={true}
      />
    </>
  );
}