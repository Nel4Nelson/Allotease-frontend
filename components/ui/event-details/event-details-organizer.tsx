/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FallbackImage } from "@/components/ui/fallback-image"; // Import your FallbackImage component
import { apiClient } from "@/services/api-client";
import { useAuthStore } from "@/stores/auth-store";

interface Organizer {
  _id: string;
  firstname: string;
  lastname: string;
  avatar?: string;
  followersCount?: number;
  followingCount?: number;
}

interface OrganizerResponse {
  status: string;
  message?: string;
  data: {
    items: Organizer[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPages: number;
    totalCount: number;
    limit: number;
    page: number;
  };
}

interface FollowStatusResponse {
  status: string;
  message?: string;
  data: Array<{
    _id: string;
    email: string;
    firstname: string;
    lastname: string;
    followersCount: number;
    avatar?: string;
  }>;
}

interface EventDetailsOrganizerProps {
  ownerId?: string;
  className?: string;
}

export function EventDetailsOrganizer({
  ownerId,
  className = "",
}: EventDetailsOrganizerProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, checkTokenExpiry } = useAuthStore();
  
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch organizer data
  const fetchOrganizer = async () => {
    if (!ownerId) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get<OrganizerResponse>(
        `/users/allocators/?allocatorId=${ownerId}`
      );

      if (response.status === "success" && response.data.items.length > 0) {
        setOrganizer(response.data.items[0]); // Get the first item from the array
      } else {
        setError("Failed to load organizer information");
      }
    } catch (error) {
      console.error("Error fetching organizer:", error);
      setError("Failed to load organizer information");
    }
  };

  // Check follow status
  const checkFollowStatus = async () => {
    if (!isAuthenticated || !ownerId) return;

    // Verify token is still valid before making API call
    if (!checkTokenExpiry()) {
      return;
    }

    try {
      const response = await apiClient.get<FollowStatusResponse>("/users/follow/");
      
      if (response.status === "success" && Array.isArray(response.data)) {
        // Check if the current organizer is in the followed users list
        const isFollowingUser = response.data.some(user => user._id === ownerId);
        setIsFollowing(isFollowingUser);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
      // Don't set error state for follow status check failure
      setIsFollowing(false); // Default to not following on error
    }
  };

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      // Navigate to sign in
      router.push("/signin");
      return;
    }

    // Verify token is still valid before making API call
    if (!checkTokenExpiry()) {
      router.push("/signin");
      return;
    }

    if (!organizer || followLoading) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        await apiClient.delete(`/users/follow/${organizer._id}`);
        setIsFollowing(false);
        // Update the local organizer data to reflect the follower count change
        setOrganizer(prev => prev ? {
          ...prev,
          followersCount: (prev.followersCount || 0) > 0 ? (prev.followersCount || 0) - 1 : 0
        } : null);
      } else {
        // Follow
        await apiClient.post(`/users/follow/${organizer._id}`);
        setIsFollowing(true);
        // Update the local organizer data to reflect the follower count change
        setOrganizer(prev => prev ? {
          ...prev,
          followersCount: (prev.followersCount || 0) + 1
        } : null);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      // Revert the follow status on error
      setIsFollowing(!isFollowing);
      // Optionally show a toast or error message
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // Wait for auth store to finish loading/rehydrating
      if (authLoading) {
        return;
      }

      setLoading(true);
      await fetchOrganizer();
      
      if (isAuthenticated) {
        await checkFollowStatus();
      }
      
      setLoading(false);
    };

    loadData();
  }, [ownerId, isAuthenticated, authLoading]);

  // Show loading while auth is still loading or component data is loading
  if (authLoading || loading) {
    return (
      <div className={className}>
        <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
          Organizer
        </h3>
        <div className="flex w-full p-5 justify-center items-center gap-7 rounded-2xl border animate-pulse">
          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  // Error or no organizer data
  if (error || !organizer) {
    return (
      <div className={className}>
        <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
          Organizer
        </h3>
        <div className="text-center py-6">
          <p className="text-[var(--body-text,#6B7280)] font-source-sans-pro text-base font-normal leading-[142.745%] tracking-[-0.32px]">
            {error || "No organizer information available for this event."}
          </p>
        </div>
      </div>
    );
  }

  // Format follower count
  const formatFollowerCount = (count?: number): string => {
    if (!count || count === 0) return "0 followers";
    if (count === 1) return "1 follower";
    if (count < 1000) return `${count} followers`;
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k followers`;
    return `${(count / 1000000).toFixed(1)}m followers`;
  };

  // Get display name
  const getDisplayName = (organizer: Organizer): string => {
    return `${organizer.firstname} ${organizer.lastname}`.trim();
  };

  // Get button text and tooltip
  const getButtonText = () => {
    if (followLoading) return "...";
    return isFollowing ? "Following" : "Follow";
  };

  const getTooltipText = () => {
    if (!isAuthenticated) return "Sign in to follow organizers";
    if (isFollowing) return "Click to unfollow";
    return "Click to follow";
  };

  return (
    <div className={className}>
      <h3 className="text-[var(--Title,#1F2024)] font-space-grotesk text-xl font-bold leading-[140%] tracking-[-0.4px] mb-4">
        Organizer
      </h3>

      <TooltipProvider>
        <div
          className="flex w-full p-5 justify-center items-center gap-7 rounded-2xl border border-outline-on-system-teal bg-card-background backdrop-blur-[21px]"
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
                src={organizer.avatar || "/icons/encircle-star-orange-avatar.svg"}
                fallbackSrc="/icons/encircle-star-orange-avatar.svg"
                alt={`${getDisplayName(organizer)} avatar`}
                fallbackAlt={`${getDisplayName(organizer)} default avatar`}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>

            <h4
              className="text-title font-space-grotesk text-lg font-bold leading-[140%] tracking-[-0.36px]"
              style={{
                color: "#1F2024",
                fontFamily: '"Space Grotesk"',
                fontSize: "18px",
                fontWeight: 700,
                lineHeight: "140%",
                letterSpacing: "-0.36px",
              }}
            >
              {getDisplayName(organizer)}
            </h4>
          </div>

          {/* Spacer - flex-1 pushes the followers and button to the right */}
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
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`flex px-3 py-1.5 justify-center items-center gap-[15px] rounded-[51px] border transition-colors ${
                  isFollowing
                    ? "border-gray-400 bg-gray-100"
                    : "border-orange-red"
                } ${followLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                style={{
                  borderRadius: "51px",
                  border: isFollowing ? "1px solid #9CA3AF" : "1px solid #FF5B00",
                  padding: "6px 12px",
                  backgroundColor: isFollowing ? "#F3F4F6" : "transparent",
                }}
              >
                <span
                  className={`font-source-sans-pro text-lg font-semibold leading-normal ${
                    isFollowing ? "text-gray-600" : "text-orange-red"
                  }`}
                  style={{
                    color: isFollowing ? "#4B5563" : "#FF5B00",
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
        </div>
      </TooltipProvider>
    </div>
  );
}