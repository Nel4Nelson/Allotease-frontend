/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import Image from "next/image";

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

  const handleFollowClick = () => {
    if (onFollowClick && !isFollowing) {
      onFollowClick(id);
    }
  };

  const handleMouseEnter = () => {
    if (isFollowing) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
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
          fontFamily: '"Space Grotesk"',
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
          fontFamily: '"Source Sans Pro"',
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

      {/* Follow Button with Tooltip */}
      <div className="relative">
        <button
          onClick={handleFollowClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          disabled={isFollowing}
          className={`transition-all ${
            isFollowing 
              ? "cursor-not-allowed opacity-60" 
              : "hover:bg-orange-50 cursor-pointer"
          }`}
          style={{
            borderRadius: "51px",
            border: `1px solid ${isFollowing ? "#B0B0B0" : "var(--Orange-Red, #FF5B00)"}`,
            display: "flex",
            padding: "6px 12px",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            background: isFollowing ? "#F5F5F5" : "transparent",
          }}
        >
          <span
            style={{
              color: isFollowing ? "#B0B0B0" : "var(--Orange-Red, #FF5B00)",
              fontFamily: '"Source Sans Pro"',
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
          >
            {isFollowing ? "Following" : "Follow"}
          </span>
        </button>

        {/* Tooltip */}
        {showTooltip && isFollowing && (
          <div
            className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm"
            style={{
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
              fontFamily: '"Source Sans Pro"',
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            You're already following {name}
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