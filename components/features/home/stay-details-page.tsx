/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
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
  const [state, setState] = useState<StayDetailsState>({
    stayData: null,
    reviewsData: null,
    loading: true,
    reviewsLoading: false,
    error: null,
  });

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

  // Loading state
  if (state.loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="w-full h-[400px] bg-gray-200 rounded-[24px] animate-pulse" />
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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stay Banner - Full Width */}
      <StayDetailsBanner images={stay.images} title={stay.title} />

      {/* Two Column Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Main Content (625px ≈ 64.8% ≈ 8 cols out of 12) */}
        <div className="col-span-8">
          {/* Stay Title Section */}
          <div className="mb-2">
            <StayDetailsTitle title={stay.title} />
          </div>

          {/* Rating & Reviews Section */}
          <div className="mb-4">
            {state.reviewsLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-16 h-6 bg-gray-200 rounded-xl animate-pulse" />
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : (
              (() => {
                const displayData = RatingService.getRatingDisplayData(
                  state.reviewsData
                );

                return displayData.hasRating ? (
                  <div className="flex items-center gap-3">
                    <ReviewBadge rating={displayData.rating} />
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
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    {displayData.reviewsText}
                  </div>
                );
              })()
            )}
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
          {/* Reservation Card */}
          <StayDetailsReservationCard stayId={stay._id} units={stayUnits} />
        </div>
      </div>

      {/* Guest Reviews Section - Full Width Below Grid */}
      <StayDetailsGuestReviews ownerId={stay.ownerId} />

      {/* Other Stays Section - Full Width Below Grid */}
      <StayDetailsOtherStays currentStayId={stay._id} />
    </div>
  );
}
