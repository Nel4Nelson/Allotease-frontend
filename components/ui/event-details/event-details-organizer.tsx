/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FallbackImage } from "@/components/ui/fallback-image";
import { AuthModal } from "@/components/ui/modals/auth-modal";
import { useAuthStore } from "@/stores/auth-store";
import { useProfileStore } from "@/stores/profile-store";
import { useAllocators, useFollowToggle } from "@/hooks/use-allocators";
import { AllocatorService, Allocator } from "@/services/allocator-service";
import { toast } from "react-hot-toast";
import { useIsOnline } from "@/hooks/use-network-status";

interface EventDetailsOrganizerProps {
  ownerId?: string;
  className?: string;
  showTitle?: boolean;
  title?: string;
}

export function EventDetailsOrganizer({
  ownerId,
  className = "",
  showTitle = true,
  title = "Organizer",
}: EventDetailsOrganizerProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [organizer, setOrganizer] = useState<Allocator | null>(null);

  const { isAuthenticated } = useAuthStore();
  const { profile } = useProfileStore();
  const isOnline = useIsOnline();

  // Fetch organizer data using the centralized hook
  const { data, isLoading, isError, refetch } = useAllocators({
    allocatorId: ownerId,
    limit: 1,
  });

  // Use the centralized follow toggle mutation
  const followToggleMutation = useFollowToggle();

  // Update local organizer state when data changes
  useEffect(() => {
    if (data?.data?.items && data.data.items.length > 0) {
      setOrganizer(data.data.items[0]);
    } else {
      setOrganizer(null);
    }
  }, [data]);

  // Handle follow/unfollow using the centralized pattern
  const handleFollowToggle = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Don't allow follow actions when offline
    if (!isOnline) {
      toast.error("You're offline. Please check your connection.");
      return;
    }

    // Check if user is trying to follow themselves
    if (profile?._id === organizer?._id) {
      toast.error("You can't follow yourself");
      return;
    }

    if (!organizer) return;

    // Update local state optimistically BEFORE the mutation
    const previousFollowStatus = organizer.isFollowing;
    const previousFollowersCount = organizer.followersCount;

    setOrganizer((prev) =>
      prev
        ? {
            ...prev,
            isFollowing: !prev.isFollowing,
            followersCount: prev.isFollowing
              ? prev.followersCount - 1
              : prev.followersCount + 1,
          }
        : null
    );

    try {
      await followToggleMutation.mutateAsync({
        userId: organizer._id,
        isFollowing: previousFollowStatus || false,
      });
    } catch (error: any) {
      // Revert the optimistic update on error
      setOrganizer((prev) =>
        prev
          ? {
              ...prev,
              isFollowing: previousFollowStatus,
              followersCount: previousFollowersCount,
            }
          : null
      );

      // If it's an auth error, show the modal
      if (
        error.message === "User must be authenticated" ||
        error?.response?.status === 401
      ) {
        setShowAuthModal(true);
      }
    }
  };

  // Format follower count using the centralized service
  const formatFollowerCount = (count?: number): string => {
    return AllocatorService.formatFollowerCount(count || 0);
  };

  // Get display name using the centralized service
  const getDisplayName = (): string => {
    if (!organizer) return "";
    return AllocatorService.formatAllocatorName(organizer);
  };

  // Get button text and tooltip
  const getButtonText = () => {
    if (followToggleMutation.isPending) return "...";
    return organizer?.isFollowing ? "Following" : "Follow";
  };

  const getTooltipText = () => {
    if (isOwnProfile()) return "You can't follow yourself";
    if (!isAuthenticated) return "Sign in to follow";
    if (organizer?.isFollowing) return "Click to unfollow";
    return "Click to follow";
  };

  // Check if the organizer is the current user
  const isOwnProfile = (): boolean => {
    return profile?._id === organizer?._id;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={className}>
        {showTitle && (
          <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
            {title}
          </h3>
        )}

        {/* Desktop Loading Skeleton */}
        <div className="hidden lg:flex w-full p-5 justify-center items-center gap-7 rounded-2xl border animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="h-5 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="flex-1" />
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>

        {/* Mobile Loading Skeleton */}
        <div className="lg:hidden w-full p-5 flex items-center gap-4 rounded-2xl border animate-pulse">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
          <div className="flex flex-col justify-center gap-2 flex-1">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className={className}>
        {showTitle && (
          <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
            {title}
          </h3>
        )}
        <div className="text-center py-6">
          <p className="text-[var(--body-text,#6B7280)] font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px] mb-4">
            Failed to load organizer information
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle no organizer found
  if (!organizer) {
    return (
      <div className={className}>
        {showTitle && (
          <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
            {title}
          </h3>
        )}
        <div className="text-center py-6">
          <p className="text-[var(--body-text,#6B7280)] font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px]">
            No organizer information available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {showTitle && (
        <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
          {title}
        </h3>
      )}

      <TooltipProvider>
        {/* Desktop Layout */}
        <div
          className="hidden lg:flex w-full p-5 justify-center items-center gap-7 rounded-2xl border border-outline-on-system-teal bg-card-background backdrop-blur-[21px]"
          style={{
            border: "1px solid rgba(138, 174, 164, 0.20)",
            background: "rgba(242, 244, 247, 0.30)",
            backdropFilter: "blur(21px)",
          }}
        >
          {/* Avatar and Name Container */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <FallbackImage
                src={AllocatorService.getAllocatorAvatar(organizer)}
                fallbackSrc="/icons/encircle-star-orange-avatar.svg"
                alt={`${getDisplayName()} avatar`}
                fallbackAlt={`${getDisplayName()} default avatar`}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>

            <h4
              className="text-title font-space-grotesk text-lg font-bold leading-[140%] tracking-[-0.36px]"
              style={{
                color: "#1F2024",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                lineHeight: "140%",
                letterSpacing: "-0.36px",
              }}
            >
              {getDisplayName()}
            </h4>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Followers Count */}
          <span
            className="text-body font-source-sans-pro text-sm font-normal leading-[142.745%] tracking-[-0.28px]"
            style={{
              color: "#71727A",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "142.745%",
              letterSpacing: "-0.28px",
            }}
          >
            {formatFollowerCount(organizer.followersCount)}
          </span>

          {/* Follow Button with Tooltip */}
          {!isOwnProfile() && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleFollowToggle}
                  disabled={followToggleMutation.isPending || !isOnline}
                  className={`flex px-3 py-1.5 justify-center items-center gap-[15px] rounded-[51px] border transition-colors ${
                    organizer.isFollowing
                      ? "border-gray-400 bg-gray-100"
                      : "border-orange-red"
                  } ${
                    followToggleMutation.isPending || !isOnline
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:opacity-80"
                  }`}
                  style={{
                    borderRadius: "51px",
                    border: organizer.isFollowing
                      ? "1px solid #9CA3AF"
                      : "1px solid #FF5B00",
                    padding: "6px 12px",
                    backgroundColor: organizer.isFollowing
                      ? "#F3F4F6"
                      : "transparent",
                  }}
                >
                  <span
                    className={`font-source-sans-pro text-lg font-semibold leading-normal ${
                      organizer.isFollowing
                        ? "text-gray-600"
                        : "text-orange-red"
                    }`}
                    style={{
                      color: organizer.isFollowing ? "#4B5563" : "#FF5B00",
                      fontFamily: "var(--font-source-sans), sans-serif",
                      fontSize: "18px",
                      fontWeight: 600,
                      lineHeight: "normal",
                    }}
                  >
                    {getButtonText()}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getTooltipText()}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Mobile Layout */}
        <div
          className="lg:hidden w-full p-5 flex items-center gap-4 rounded-2xl border border-outline-on-system-teal bg-card-background backdrop-blur-[21px]"
          style={{
            border: "1px solid rgba(138, 174, 164, 0.20)",
            background: "rgba(242, 244, 247, 0.30)",
            backdropFilter: "blur(21px)",
          }}
        >
          {/* Avatar - Left side */}
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <FallbackImage
              src={AllocatorService.getAllocatorAvatar(organizer)}
              fallbackSrc="/icons/encircle-star-orange-avatar.svg"
              alt={`${getDisplayName()} avatar`}
              fallbackAlt={`${getDisplayName()} default avatar`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content container - Right side, vertically stacked and centered */}
          <div className="flex flex-col justify-center gap-2 flex-1">
            {/* Name */}
            <h4
              className="text-title font-space-grotesk text-lg font-bold leading-[140%] tracking-[-0.36px]"
              style={{
                color: "#1F2024",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                lineHeight: "140%",
                letterSpacing: "-0.36px",
              }}
            >
              {getDisplayName()}
            </h4>

            {/* Followers count */}
            <span
              className="text-body font-source-sans-pro text-sm font-normal leading-[142.745%] tracking-[-0.28px]"
              style={{
                color: "#71727A",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "142.745%",
                letterSpacing: "-0.28px",
              }}
            >
              {formatFollowerCount(organizer.followersCount)}
            </span>

            {/* Follow button */}
            {!isOwnProfile() && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleFollowToggle}
                    disabled={followToggleMutation.isPending || !isOnline}
                    className={`flex px-3 py-1.5 justify-center items-center gap-[15px] rounded-[51px] border transition-colors w-fit ${
                      organizer.isFollowing
                        ? "border-gray-400 bg-gray-100"
                        : "border-orange-red"
                    } ${
                      followToggleMutation.isPending || !isOnline
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:opacity-80"
                    }`}
                    style={{
                      borderRadius: "51px",
                      border: organizer.isFollowing
                        ? "1px solid #9CA3AF"
                        : "1px solid #FF5B00",
                      padding: "6px 12px",
                      backgroundColor: organizer.isFollowing
                        ? "#F3F4F6"
                        : "transparent",
                    }}
                  >
                    <span
                      className={`font-source-sans-pro text-lg font-semibold leading-normal ${
                        organizer.isFollowing
                          ? "text-gray-600"
                          : "text-orange-red"
                      }`}
                      style={{
                        color: organizer.isFollowing ? "#4B5563" : "#FF5B00",
                        fontFamily: "var(--font-source-sans), sans-serif",
                        fontSize: "18px",
                        fontWeight: 600,
                        lineHeight: "normal",
                      }}
                    >
                      {getButtonText()}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getTooltipText()}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </TooltipProvider>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectUrl={
          typeof window !== "undefined" ? window.location.pathname : "/"
        }
      />
    </div>
  );
}
