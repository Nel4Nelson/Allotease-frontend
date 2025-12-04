/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { StayDetailsBanner } from "@/components/ui/stay-details/stay-details-banner";
import { StaysService, GetStayByIdResponse } from "@/services/stays-service";
import { RatingService, ReviewAllocator } from "@/services/rating-service";
import { StayDetailsTitle } from "@/components/ui/stay-details/stay-details-title";
import { StayDetailsDescription } from "@/components/ui/stay-details/stay-details-description";
import { StayDetailsLocation } from "@/components/ui/stay-details/stay-details-location";
import { StayDetailsAmenities } from "@/components/ui/stay-details/stay-details-amenities";
import { StayDetailsAvailability } from "@/components/ui/stay-details/stay-details-availability";
import { StayDetailsReservationCard } from "@/components/ui/stay-details/stay-details-reservation-card";
import { ReviewBadge } from "@/components/ui/review-badge";
import { EventDetailsOrganizer } from "@/components/ui/event-details/event-details-organizer";
import { StayDetailsGuestReviews } from "@/components/ui/stay-details/stay-details-guest-reviews";
import { StayDetailsOtherStays } from "@/components/ui/stay-details/stay-details-other-stays";
import { useBookingStore } from "@/stores/booking-store";
import { BookingSuccessModal } from "@/components/ui/modals/booking-success-modal";
import { EventDetailsPageSkeleton } from "@/components/ui/loading-skeletons/event-details-skeleton-page";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { BackButton } from "../auth/shared/back-button";

interface StayDetailsPageProps {
  id: string;
  className?: string;
}

interface StayDetailsState {
  stayData: GetStayByIdResponse | null;
  reviewsData: ReviewAllocator | null;
  loading: boolean;
  reviewsLoading: boolean;
  error: string | null;
}

export function StayDetailsPage({ id, className = "" }: StayDetailsPageProps) {
  const searchParams = useSearchParams();
  const { clearBookingData } = useBookingStore();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Use ref to track if callback has been processed to prevent duplicate toasts
  const callbackProcessedRef = useRef(false);

  const [state, setState] = useState<StayDetailsState>({
    stayData: null,
    reviewsData: null,
    loading: true,
    reviewsLoading: false,
    error: null,
  });

  // Clean URL parameters by removing booking-related query params
  const cleanUrlParameters = () => {
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);

    // Remove booking-related parameters
    params.delete('trxref');
    params.delete('reference');


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

    // Check if we have booking parameters and haven't processed them yet
    const hasPaymentParams = type === "stays" && (trxref || reference);

    if (hasPaymentParams && !callbackProcessedRef.current) {
      // Mark as processed immediately to prevent any duplicate processing
      callbackProcessedRef.current = true;

      // Clear booking data
      clearBookingData();

      // Show the success modal
      setShowSuccessModal(true);

      // Clean URL parameters immediately after processing
      cleanUrlParameters();
    }
  }, [searchParams, clearBookingData]);

  // Reset the processed flag when component unmounts or ID changes
  useEffect(() => {
    return () => {
      callbackProcessedRef.current = false;
    };
  }, [id]);

  useEffect(() => {
    const fetchStayData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const response = await StaysService.getStayById(id);

        if (response.status === "success") {
          setState((prev) => ({
            ...prev,
            stayData: response,
            loading: false,
          }));

          // Fetch reviews for the stay owner (allocator)
          await fetchReviewsData(response.data.stay.ownerId);
        } else {
          setState((prev) => ({
            ...prev,
            error: "Failed to load stay details",
            loading: false,
          }));
        }
      } catch (error) {
        console.error("Error fetching stay:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to load stay details. Please try again.",
          loading: false,
        }));
      }
    };

    const fetchReviewsData = async (ownerId: string) => {
      try {
        setState((prev) => ({ ...prev, reviewsLoading: true }));

        const allocatorData = await RatingService.getAllocatorRating(ownerId);

        setState((prev) => ({
          ...prev,
          reviewsData: allocatorData,
          reviewsLoading: false,
        }));
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setState((prev) => ({
          ...prev,
          reviewsLoading: false,
        }));
        // Don't show error for reviews - it's not critical
      }
    };

    if (id) {
      fetchStayData();
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
            className="text-gray-600 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // No stay found
  if (!state.stayData) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="text-gray-600 text-lg font-semibold mb-2">
            Stay not found
          </div>
          <div className="text-gray-500">
            The accommodation you're looking for doesn't exist or has been
            removed.
          </div>
        </div>
      </div>
    );
  }

  const { stay, stayFacilities, stayUnits } = state.stayData.data;

  // Helper function to render rating section with tooltip
  const renderRatingSection = () => {
    if (state.reviewsLoading) {
      return (
        <div className="flex items-center gap-3">
          <div className="w-16 h-6 bg-gray-200 rounded-xl animate-pulse" />
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      );
    }

    const displayData = RatingService.getRatingDisplayData(state.reviewsData);

    return displayData.hasRating ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-3 cursor-help">
            <ReviewBadge rating={displayData.rating} />
            <div className="flex items-center gap-2">
              <span
                style={{
                  color: "#667085",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "140%",
                  letterSpacing: "-0.28px",
                }}
              >
                {displayData.reviewsText}
              </span>
              {/* Info icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400"
              >
                <path
                  d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8.00004C14.6667 4.31814 11.6819 1.33337 8 1.33337C4.3181 1.33337 1.33333 4.31814 1.33333 8.00004C1.33333 11.6819 4.3181 14.6667 8 14.6667Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 10.6667V8.00004"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 5.33337H8.00667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs leading-relaxed">
            This rating reflects the host's overall performance across all their properties and events, not just this specific accommodation.
          </p>
        </TooltipContent>
      </Tooltip>
    ) : (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 text-gray-500 text-sm cursor-help">
            <span>{displayData.reviewsText}</span>
            {/* Info icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400"
            >
              <path
                d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8.00004C14.6667 4.31814 11.6819 1.33337 8 1.33337C4.3181 1.33337 1.33333 4.31814 1.33333 8.00004C1.33333 11.6819 4.3181 14.6667 8 14.6667Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10.6667V8.00004"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 5.33337H8.00667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs leading-relaxed">
            This host hasn't received any reviews yet across their properties and events.
          </p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <>
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center">
          <BackButton />
        </div>
        {/* Stay Banner - Full Width */}
        <StayDetailsBanner images={stay.images} title={stay.title} />

        {/* Mobile Layout - Single Column */}
        <div className="lg:hidden space-y-6">
          {/* Stay Title Section */}
          <StayDetailsTitle title={stay.title} />

          {/* Rating & Reviews Section */}
          <div>
            {renderRatingSection()}
          </div>

          {/* Reservation Card - Mobile Position (after title) */}
          <div className="lg:sticky lg:top-8">
            <StayDetailsReservationCard
              stay={stay}
              stayUnits={stayUnits}
            />
          </div>

          {/* Stay Description Section */}
          <StayDetailsDescription description={stay.description} />

          {/* Location Section */}
          <StayDetailsLocation stay={stay} />

          {/* Amenities Section */}
          <StayDetailsAmenities facilitiesData={stayFacilities} />

          {/* Room Types Section */}
          <StayDetailsAvailability
            units={stayUnits}
            facilitiesData={stayFacilities}
          />

          {/* Follow card Section */}
          <EventDetailsOrganizer ownerId={stay.ownerId} showTitle={false} />

          {/* Guest Reviews Section - Mobile Position */}
          <StayDetailsGuestReviews ownerId={stay.ownerId} />

          {/* Other Stays Section - Mobile Position */}
          <StayDetailsOtherStays currentStayId={stay._id} />
        </div>

        {/* Desktop Layout - Two Column Grid (lg:block to show only on desktop) */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Main Content (625px ≈ 64.8% ≈ 8 cols out of 12) */}
            <div className="col-span-8">
              {/* Stay Title Section */}
              <div className="mb-2">
                <StayDetailsTitle title={stay.title} />
              </div>

              {/* Rating & Reviews Section */}
              <div className="mb-4">
                {renderRatingSection()}
              </div>

              {/* Stay Description Section */}
              <div className="mb-8">
                <StayDetailsDescription description={stay.description} />
              </div>

              {/* Location Section */}
              <div className="mb-8">
                <StayDetailsLocation stay={stay} />
              </div>

              {/* Amenities Section */}
              <div className="mb-8">
                <StayDetailsAmenities facilitiesData={stayFacilities} />
              </div>

              {/* Room Types Section */}
              <div className="mb-8">
                <StayDetailsAvailability
                  units={stayUnits}
                  facilitiesData={stayFacilities}
                />
              </div>

              {/* Follow card Section */}
              <div className="mb-8">
                <EventDetailsOrganizer ownerId={stay.ownerId} showTitle={false} />
              </div>
            </div>

            {/* Right Column - Booking Sidebar (remaining space ≈ 35.2% ≈ 4 cols out of 12) */}
            <div className="col-span-4">
              {/* Reservation Card - Desktop Position */}
              <div className="lg:sticky lg:top-8">
                <StayDetailsReservationCard
                  stay={stay}
                  stayUnits={stayUnits}
                />
              </div>
            </div>
          </div>

          {/* Guest Reviews Section - Full Width Below Grid (Desktop only) */}
          <StayDetailsGuestReviews ownerId={stay.ownerId} />

          {/* Other Stays Section - Full Width Below Grid (Desktop only) */}
          <StayDetailsOtherStays currentStayId={stay._id} />
        </div>
      </div>

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        type="stays"
        showToast={true}
      />
    </>
  );
}