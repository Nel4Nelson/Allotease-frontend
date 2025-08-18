"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StaysBanner } from "@/components/ui/stays-banner";
import { StaysTitle } from "@/components/ui/stay-title";
import { StaysDescription } from "@/components/ui/stay-description";
import { StaysLocation } from "@/components/ui/stays-location";
import { StaysFacilitiesPreview } from "@/components/ui/stay-facilities-preview";
import { StaysUnitsPreview } from "@/components/ui/stays-units-preview";
import { CreateStaysModal } from "@/components/ui/modals/create-stays-modal";
import { useDebouncedStaysFormStore } from "@/hooks/use-debounced-stay-store";
import { useProfileStore } from "@/stores/profile-store";
import UserProfileFollowCard from "@/components/ui/user-profile-follow-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StaysPreviewReservationCard } from "@/components/ui/stay-reservation-card-preview";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface StaysPreviewProps {
  className?: string;
}

// Component that uses useSearchParams
function StaysPreviewContent({ className = "" }: StaysPreviewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Shared date range state - lifted up from child components
  const [sharedDateRange, setSharedDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const { isFormComplete, getMissingFields } = useDebouncedStaysFormStore();

  const {
    isLoading: profileLoading,
    fetchProfile,
    getFullName,
    getFollowersCount,
    getAvatarUrl,
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

  const handleCreateStays = () => {
    if (isComplete) {
      setIsCreateModalOpen(true);
    }
  };

  const handleCreateSuccess = () => {
    // Redirect to homepage with type parameter
    const stayType = searchParams.get("type") || "stays";
    router.push(`/?type=${stayType}`);
  };

  // Shared date range change handler
  const handleSharedDateRangeChange = (range: DateRange) => {
    setSharedDateRange(range);
  };

  // Reservation Card Component for reuse
  const ReservationCard = () => (
    <div className="lg:sticky lg:top-8">
      <StaysPreviewReservationCard
        dateRange={sharedDateRange}
        onDateRangeChange={handleSharedDateRangeChange}
      />
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stays Banner - Full Width */}
      <StaysBanner />

      {/* Mobile Layout - Single Column */}
      <div className="lg:hidden space-y-6">
        {/* Stays Title Section */}
        <StaysTitle />

        {/* Reservation Card - Mobile Position (after title) */}
        <ReservationCard />

        {/* Stays Description Section */}
        <StaysDescription />

        {/* Location Section */}
        <StaysLocation />

        {/* Popular Facility Section */}
        <StaysFacilitiesPreview />

        {/* Available Units Section - with shared date range */}
        <StaysUnitsPreview
          dateRange={sharedDateRange}
          onDateRangeChange={handleSharedDateRangeChange}
        />

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
            userName={getFullName() || "Stay Creator"}
            followerCount={formatFollowersCount(getFollowersCount())}
          />
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            size="allotease-md"
            onClick={handleReturnClick}
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
                    onClick={handleCreateStays}
                    disabled={!isComplete}
                    className={
                      !isComplete ? "cursor-not-allowed opacity-50" : ""
                    }
                  >
                    Create Stays
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
            {/* Stays Title Section */}
            <div className="mb-2">
              <StaysTitle />
            </div>

            {/* Stays Description Section */}
            <div className="mb-4">
              <StaysDescription />
            </div>

            {/* Location Section */}
            <div className="mb-8">
              <StaysLocation />
            </div>

            {/* Popular Facility Section */}
            <div className="mb-8">
              <StaysFacilitiesPreview />
            </div>

            {/* Available Units Section - with shared date range */}
            <div className="mb-8">
              <StaysUnitsPreview
                dateRange={sharedDateRange}
                onDateRangeChange={handleSharedDateRangeChange}
              />
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
                  userName={getFullName() || "Stay Creator"}
                  followerCount={formatFollowersCount(getFollowersCount())}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                size="allotease-md"
                onClick={handleReturnClick}
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
                        onClick={handleCreateStays}
                        disabled={!isComplete}
                        className={
                          !isComplete ? "cursor-not-allowed opacity-50" : ""
                        }
                      >
                        Create Stays
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

          {/* Right Column - Reservation Sidebar (remaining space ≈ 35.2% ≈ 4 cols out of 12) */}
          <div className="col-span-4">
            {/* Reservation Card - Desktop Position */}
            <ReservationCard />
          </div>
        </div>
      </div>

      {/* Create Stays Modal */}
      <CreateStaysModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}

// Main component that wraps the useSearchParams component in Suspense
export function StaysPreview({ className = "" }: StaysPreviewProps) {
  return (
    <Suspense fallback={<div>Loading preview...</div>}>
      <StaysPreviewContent className={className} />
    </Suspense>
  );
}
