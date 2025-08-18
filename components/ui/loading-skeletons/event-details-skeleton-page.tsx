import React from "react";
import { EventDetailsBannerSkeleton } from "./event-details-banner-skeleton";
import { EventDetailsTicketSalesBadgeSkeleton } from "./event-details-badge-skeleton";
import { EventDetailsTitleSkeleton } from "./event-details-title-skeleton";
import { EventDetailsDescriptionSkeleton } from "./event-details-description-skeleton";
import { EventDetailsDateTimeSkeleton } from "./event-details-datetime-skeleton";
import { EventDetailsLocationSkeleton } from "./event-details-location-skeleton";
import { EventDetailsEventDetailsSkeleton } from "./event-details-event-details-skeleton";
import { EventDetailsCategoriesSkeleton } from "./event-details-categories-skeleton";
import { EventDetailsRegistrationCardSkeleton } from "./event-details-registration-card-skeleton";

interface EventDetailsPageSkeletonProps {
  className?: string;
}

export function EventDetailsPageSkeleton({
  className = "",
}: EventDetailsPageSkeletonProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Event Banner - Full Width */}
      <EventDetailsBannerSkeleton />

      {/* Mobile Layout - Single Column */}
      <div className="lg:hidden space-y-6">
        {/* Ticket Sales Badge */}
        <EventDetailsTicketSalesBadgeSkeleton />

        {/* Event Title Section */}
        <EventDetailsTitleSkeleton />

        {/* Registration Card - Mobile Position (after title) */}
        <div className="lg:sticky lg:top-8">
          <EventDetailsRegistrationCardSkeleton />
        </div>

        {/* Event Description Section */}
        <EventDetailsDescriptionSkeleton />

        {/* Date & Time Section */}
        <EventDetailsDateTimeSkeleton />

        {/* Location Section */}
        <EventDetailsLocationSkeleton />

        {/* Event Details Section */}
        <EventDetailsEventDetailsSkeleton />

        {/* Categories Section */}
        <EventDetailsCategoriesSkeleton />

      </div>

      {/* Desktop Layout - Two Column Grid (lg:block to show only on desktop) */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Main Content (625px ≈ 64.8% ≈ 8 cols out of 12) */}
          <div className="col-span-8">
            {/* Ticket Sales Badge */}
            <EventDetailsTicketSalesBadgeSkeleton className="mb-4" />

            {/* Event Title Section */}
            <div className="mb-2">
              <EventDetailsTitleSkeleton />
            </div>

            {/* Event Description Section */}
            <div className="mb-4">
              <EventDetailsDescriptionSkeleton />
            </div>

            {/* Date & Time Section */}
            <div className="mb-8">
              <EventDetailsDateTimeSkeleton />
            </div>

            {/* Location Section */}
            <div className="mb-8">
              <EventDetailsLocationSkeleton />
            </div>

            {/* Event Details Section */}
            <div className="mb-8">
              <EventDetailsEventDetailsSkeleton />
            </div>

            {/* Categories Section */}
            <div className="mb-8">
              <EventDetailsCategoriesSkeleton />
            </div>
          </div>

          {/* Right Column - Registration Sidebar (remaining space ≈ 35.2% ≈ 4 cols out of 12) */}
          <div className="col-span-4">
            {/* Registration Card - Desktop Position */}
            <div className="lg:sticky lg:top-8">
              <EventDetailsRegistrationCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
