"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useProfileStore } from "@/stores/profile-store";
import { useAuthStore } from "@/stores/auth-store";

interface AllocationAdminCardProps {
  id: string;
  name: string;
  followerCount: string;
  avatarUrl: string;
  isFollowing?: boolean;
  onFollowClick?: (id: string) => void;
  className?: string;
}

export function AllocationAdminCard({
  id,
  name,
  followerCount,
  avatarUrl,
  isFollowing = false,
  onFollowClick,
  className = "",
}: AllocationAdminCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated } = useAuthStore();

  // Get current user's profile to check if they're trying to follow themselves
  const { getUserId, profile, fetchProfile } = useProfileStore();
  const currentUserId = getUserId();

  // Fetch profile if it doesn't exist and we haven't tried yet
  useEffect(() => {
  if (isAuthenticated && !profile && !currentUserId) {
    fetchProfile();
  }
}, [isAuthenticated, profile, currentUserId, fetchProfile]);

  // Check if this is the current user's own profile
  const isOwnProfile = currentUserId && currentUserId === id;

  const handleFollowClick = async () => {
    // Prevent self-follow - don't make API call
    if (isOwnProfile) {
      return;
    }

    if (onFollowClick && !isLoading) {
      setIsLoading(true);
      try {
        await onFollowClick(id);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    }
  };

  const handleMouseEnter = () => {
    // Show tooltip for own profile or when hovering over follow/unfollow button
    if (isOwnProfile || !isLoading) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Determine button text
  const getButtonText = () => {
    if (isLoading) return "...";
    if (isOwnProfile) return "You";
    if (isFollowing) return "Unfollow";
    return "Follow";
  };

  // Determine tooltip text
  const getTooltipText = () => {
    if (isOwnProfile) return "You can't follow yourself";
    if (isFollowing) return `Click to unfollow ${name}`;
    return `Click to follow ${name}`;
  };

  // Determine button style based on state
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: "51px",
      display: "flex",
      padding: "6px 12px",
      justifyContent: "center",
      alignItems: "center",
      gap: "15px",
      transition: "all 0.2s ease",
    };

    if (isOwnProfile) {
      return {
        ...baseStyle,
        border: "1px solid #D1D5DB",
        background: "#F9FAFB",
        cursor: "not-allowed",
      };
    }

    if (isLoading) {
      return {
        ...baseStyle,
        border: "1px solid var(--Orange-Red, #FF5B00)",
        background: "transparent",
        cursor: "wait",
        opacity: 0.6,
      };
    }

    return {
      ...baseStyle,
      border: "1px solid var(--Orange-Red, #FF5B00)",
      background: "transparent",
      cursor: "pointer",
    };
  };

  // Determine text color
  const getTextColor = () => {
    if (isOwnProfile) return "#9CA3AF";
    return "var(--Orange-Red, #FF5B00)";
  };

  return (
    <div
      className={`flex flex-col justify-center items-center flex-shrink-0 ${className}`}
      style={{
        display: "flex",
        width: "222px",
        height: "290px",
        minWidth: "200px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        flexShrink: 0,
        borderRadius: "20px",
        background: "#F2F4F7",
      }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Image
          src={avatarUrl}
          alt={`${name} avatar`}
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>

      {/* Name */}
      <h3
        style={{
          color: "var(--Title, #1F2024)",
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "140%",
          letterSpacing: "-0.36px",
          margin: 0,
          textAlign: "center",
        }}
      >
        {name}
      </h3>

      {/* Follower Count */}
      <p
        style={{
          color: "var(--Body, #71727A)",
          fontFamily: "var(--font-source-sans), sans-serif",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "142.745%",
          letterSpacing: "-0.32px",
          margin: 0,
          textAlign: "center",
        }}
      >
        {followerCount}
      </p>

      {/* Follow/Unfollow Button with Tooltip */}
      <div className="relative">
        <button
          onClick={handleFollowClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          disabled={isLoading}
          className={`transition-all ${
            !isOwnProfile && !isLoading
              ? isFollowing
                ? "hover:bg-red-50"
                : "hover:bg-orange-50"
              : ""
          }`}
          style={getButtonStyle()}
        >
          <span
            style={{
              color: getTextColor(),
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
          >
            {getButtonText()}
          </span>
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div
            className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm"
            style={{
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {getTooltipText()}
            {/* Tooltip Arrow */}
            <div
              className="absolute top-full left-1/2 transform -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: "5px solid #1F2937",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
