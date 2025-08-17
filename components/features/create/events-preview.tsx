/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, Suspense } from "react";
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
import { useProfileStore } from "@/stores/profile-store";
import { EventService } from "@/services/events-service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EventLocation } from "@/components/ui/event-location";
import { EventPreviewRegistrationCard } from "@/components/ui/event-preview-registration-card";
import { EventCreationSuccessModal } from "@/components/ui/modals/event-creation-success-modal";

interface EventsPreviewProps {
  className?: string;
}

function EventsPreviewContent({ className = "" }: EventsPreviewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { formData, isFormComplete, getMissingFields, resetForm } =
    useEventFormStore();

  const { 
    isLoading: profileLoading, 
    fetchProfile, 
    getFullName, 
    getFollowersCount, 
    getAvatarUrl 
  } = useProfileStore();

  const isComplete = isFormComplete();
  const missingFields = getMissingFields();

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Format followers count
  const formatFollowersCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M Followers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K Followers`;
    } else {
      return `${count} Followers`;
    }
  };

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

        // Show success modal instead of immediate redirect
        setShowSuccessModal(true);
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

  // Handle success modal close (just close modal, stay on page)
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  // Handle success modal "Close Window" button (redirect to homepage)
  const handleSuccessModalCloseWindow = () => {
    setShowSuccessModal(false);
    const eventType = searchParams.get("type") || "events";
    router.push(`/?type=${eventType}`);
  };

  // Registration Card Component for reuse
  const RegistrationCard = () => (
    <div className="lg:sticky lg:top-8">
      <EventPreviewRegistrationCard />
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Event Banner - Full Width */}
      <EventBanner />

      {/* Mobile Layout - Single Column */}
      <div className="lg:hidden space-y-6">
        {/* Ticket Sales Badge */}
        <TicketSalesBadge />

        {/* Event Title Section */}
        <EventTitle />

        {/* Registration Card - Mobile Position (after title) */}
        <RegistrationCard />

        {/* Event Description Section */}
        <EventDescription />

        {/* Date & Time Section */}
        <EventDateTime />

        {/* Location Section */}
        <EventLocation />

        {/* Event Details Section */}
        <EventDetails />

        {/* Categories Section */}
        <EventCategories />

        {/* Follow card Section - Dynamic from Profile Store */}
        {profileLoading ? (
          // Loading skeleton that mirrors UserProfileFollowCard layout
          <div
            className="flex w-full p-5 justify-center items-center gap-7 rounded-2xl border animate-pulse"
            style={{
              border: "1px solid rgba(138, 174, 164, 0.20)",
              background: "rgba(242, 244, 247, 0.30)",
              backdropFilter: "blur(21px)",
            }}
          >
            {/* Avatar and Name Container Skeleton */}
            <div className="flex items-center gap-4">
              {/* Avatar skeleton */}
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              
              {/* Name skeleton */}
              <div className="h-5 bg-gray-300 rounded w-32"></div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Followers count skeleton */}
            <div className="h-4 bg-gray-300 rounded w-20"></div>

            {/* Follow button skeleton */}
            <div
              className="flex px-3 py-1.5 justify-center items-center gap-[15px] rounded-[51px] border bg-gray-200"
              style={{
                borderRadius: "51px",
                border: "1px solid #E5E5E5",
                padding: "6px 12px",
              }}
            >
              <div className="h-5 bg-gray-300 rounded w-12"></div>
            </div>
          </div>
        ) : (
          <UserProfileFollowCard
            avatarSrc={getAvatarUrl()}
            userName={getFullName() || "Event Creator"}
            followerCount={formatFollowersCount(getFollowersCount())}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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

      {/* Desktop Layout - Two Column Grid (lg:block to show only on desktop) */}
      <div className="hidden lg:block">
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
              <EventLocation />
            </div>

            {/* Event Details Section */}
            <div className="mb-8">
              <EventDetails />
            </div>

            {/* Categories Section */}
            <div className="mb-8">
              <EventCategories />
            </div>

            {/* Follow card Section - Dynamic from Profile Store */}
            <div className="mb-8">
              {profileLoading ? (
                // Loading skeleton that mirrors UserProfileFollowCard layout
                <div
                  className="flex w-full p-5 justify-center items-center gap-7 rounded-2xl border animate-pulse"
                  style={{
                    border: "1px solid rgba(138, 174, 164, 0.20)",
                    background: "rgba(242, 244, 247, 0.30)",
                    backdropFilter: "blur(21px)",
                  }}
                >
                  {/* Avatar and Name Container Skeleton */}
                  <div className="flex items-center gap-4">
                    {/* Avatar skeleton */}
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                    
                    {/* Name skeleton */}
                    <div className="h-5 bg-gray-300 rounded w-32"></div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Followers count skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-20"></div>

                  {/* Follow button skeleton */}
                  <div
                    className="flex px-3 py-1.5 justify-center items-center gap-[15px] rounded-[51px] border bg-gray-200"
                    style={{
                      borderRadius: "51px",
                      border: "1px solid #E5E5E5",
                      padding: "6px 12px",
                    }}
                  >
                    <div className="h-5 bg-gray-300 rounded w-12"></div>
                  </div>
                </div>
              ) : (
                <UserProfileFollowCard
                  avatarSrc={getAvatarUrl()}
                  userName={getFullName() || "Event Creator"}
                  followerCount={formatFollowersCount(getFollowersCount())}
                />
              )}
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
            {/* Registration Card - Desktop Position */}
            <RegistrationCard />
          </div>
        </div>
      </div>

      {/* Event Creation Success Modal */}
      <EventCreationSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        onCloseWindow={handleSuccessModalCloseWindow}
      />
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