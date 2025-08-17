/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { FallbackImage } from "@/components/ui/fallback-image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserProfileFollowCardProps {
  avatarSrc?: string;
  userName: string;
  followerCount: string;
  className?: string;
}

export default function UserProfileFollowCard({
  avatarSrc,
  userName,
  followerCount,
  className = ""
}: UserProfileFollowCardProps) {
  return (
    <TooltipProvider>
      {/* Desktop Layout - Keep as is */}
      <div
        className={`hidden lg:flex w-full p-5 justify-center items-center gap-7 rounded-2xl border border-outline-on-system-teal bg-card-background backdrop-blur-[21px] ${className}`}
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
              src={avatarSrc || ""}
              fallbackSrc="/icons/encircle-star-orange-avatar.svg"
              alt={`${userName} avatar`}
              fallbackAlt="Default user avatar"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>

          <h3
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
            {userName}
          </h3>
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
          {followerCount}
        </span>

        {/* Follow Button with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex px-3 py-1.5 justify-center items-center gap-[15px] rounded-[51px] border border-orange-red"
              style={{
                borderRadius: "51px",
                border: "1px solid #FF5B00",
                padding: "6px 12px",
              }}
            >
              <span
                className="text-orange-red font-source-sans-pro text-lg font-semibold leading-normal"
                style={{
                  color: "#FF5B00",
                  fontFamily: "var(--font-source-sans), sans-serif",
                  fontSize: "18px",
                  fontWeight: 600,
                  lineHeight: "normal",
                }}
              >
                Follow
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>You can't follow yourself</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Mobile Layout - Avatar left, content vertically centered right */}
      <div
        className={`lg:hidden w-full p-5 flex items-center gap-4 rounded-2xl border border-outline-on-system-teal bg-card-background backdrop-blur-[21px] ${className}`}
        style={{
          border: "1px solid rgba(138, 174, 164, 0.20)",
          background: "rgba(242, 244, 247, 0.30)",
          backdropFilter: "blur(21px)",
        }}
      >
        {/* Avatar - Left side */}
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <FallbackImage
            src={avatarSrc || ""}
            fallbackSrc="/icons/encircle-star-orange-avatar.svg"
            alt={`${userName} avatar`}
            fallbackAlt="Default user avatar"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content container - Right side, vertically stacked and centered */}
        <div className="flex flex-col justify-center gap-2 flex-1">
          {/* Name */}
          <h3
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
            {userName}
          </h3>

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
            {followerCount}
          </span>

          {/* Follow button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="flex px-3 py-1.5 justify-center items-center gap-[15px] rounded-[51px] border border-orange-red w-fit"
                style={{
                  borderRadius: "51px",
                  border: "1px solid #FF5B00",
                  padding: "6px 12px",
                }}
              >
                <span
                  className="text-orange-red font-source-sans-pro text-lg font-semibold leading-normal"
                  style={{
                    color: "#FF5B00",
                    fontFamily: "var(--font-source-sans), sans-serif",
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: "normal",
                  }}
                >
                  Follow
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>You can't follow yourself</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}