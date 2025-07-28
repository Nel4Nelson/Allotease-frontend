/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EventBanner } from "@/components/ui/event-banner";
import { TicketSalesBadge } from "@/components/ui/ticket-sales-badge";
import { EventTitle } from "@/components/ui/event-title";
import { EventDescription } from "@/components/ui/event-description";
import { EventDateTime } from "@/components/ui/event-date-time";
import { EventDetails } from "@/components/ui/event-details";
import { EventCategories } from "@/components/ui/event-categories";
import UserProfileFollowCard from "@/components/ui/user-profile-follow-card";
import { Button } from "@/components/ui/button";
import { useEventFormStore } from "@/stores/event-form-store";
import { EventService } from "@/services/events-service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StaysLocation } from "@/components/ui/event-location";

interface EventsPreviewProps {
  className?: string;
}

// Component that uses useSearchParams
function EventsPreviewContent({ className = "" }: EventsPreviewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { formData, isFormComplete, getMissingFields, resetForm } =
    useEventFormStore();

  const isComplete = isFormComplete();
  const missingFields = getMissingFields();

  const handleReturnClick = () => {
    // Get the current type parameter and preserve it
    const currentType = searchParams.get("type");
    if (currentType) {
      router.push(`/allocation-admin/create?type=${currentType}`);
    } else {
      router.push("/allocation-admin/create");
    }
  };

  const handleCreateEvent = async () => {
    if (!isComplete) {
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Validate data one more time
      const validationErrors = EventService.validateEventData(formData as any);
      if (validationErrors.length > 0) {
        setError(
          `Please fix the following issues: ${validationErrors.join(", ")}`
        );
        setIsCreating(false);
        return;
      }

      // Create the event
      const response = await EventService.createEvent(formData as any);

      if (response.status === "success") {
        // Clear the form data
        resetForm();

        // Redirect to homepage with type parameter
        const eventType = searchParams.get("type") || "events";
        router.push(`/?type=${eventType}`);
      } else {
        setError("Failed to create event. Please try again.");
      }
    } catch (error: any) {
      console.error("Event creation failed:", error);

      // Handle different types of errors
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error?.message) {
        setError(error.message);
      } else {
        setError("Failed to create event. Please try again.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Event Banner - Full Width */}
      <EventBanner />

      {/* Two Column Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Main Content (625px ≈ 64.8% ≈ 8 cols out of 12) */}
        <div className="col-span-8">
          {/* Ticket Sales Badge */}
          <TicketSalesBadge className="mb-4" />

          {/* Event Title Section */}
          <div className="mb-2">
            <EventTitle />
          </div>

          {/* Event Description Section */}
          <div className="mb-4">
            <EventDescription />
          </div>

          {/* Date & Time Section */}
          <div className="mb-8">
            <EventDateTime />
          </div>

          {/* Location Section */}
          <div className="mb-8">
            <StaysLocation />
          </div>

          {/* Event Details Section */}
          <div className="mb-8">
            <EventDetails />
          </div>

          {/* Categories Section */}
          <div className="mb-8">
            <EventCategories />
          </div>

          {/* Follow card Section */}
          <div className="mb-8">
            <UserProfileFollowCard
              avatarSrc="/icons/encircle-star-orange-avatar.svg"
              userName="Flend Worldwide"
              followerCount="117.5K Followers"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              size="allotease-md"
              onClick={handleReturnClick}
              disabled={isCreating}
              className="text-(--body-text) hover:text-(--color-dark-slate)"
            >
              Return
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      type="button"
                      variant="signup-primary"
                      size="allotease-md"
                      onClick={handleCreateEvent}
                      disabled={!isComplete || isCreating}
                      loading={isCreating}
                      className={
                        !isComplete ? "cursor-not-allowed opacity-50" : ""
                      }
                    >
                      {isCreating ? "Creating..." : "Create Event"}
                    </Button>
                  </div>
                </TooltipTrigger>
                {!isComplete && (
                  <TooltipContent side="top" className="max-w-xs p-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">
                        Complete these fields:
                      </p>
                      <ul className="text-xs space-y-1">
                        {missingFields.map((field, index) => (
                          <li key={index}>• {field}</li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
          
        </div>

        {/* Right Column - Registration Sidebar (remaining space ≈ 35.2% ≈ 4 cols out of 12) */}
        <div className="col-span-4">
          {/* Registration Card */}
          <div className="sticky top-8">
            {/* Registration content will go here */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps the useSearchParams component in Suspense
export function EventsPreview({ className = "" }: EventsPreviewProps) {
  return (
    <Suspense fallback={<div>Loading preview...</div>}>
      <EventsPreviewContent className={className} />
    </Suspense>
  );
}