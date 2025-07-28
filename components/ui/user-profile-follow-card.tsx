/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface UserProfileFollowCardProps {
  avatarSrc: string;
  userName: string;
  followerCount: string;
  className?: string;
}

export function UserProfileFollowCard({
  avatarSrc,
  userName,
  followerCount,
  className = "",
}: UserProfileFollowCardProps) {
  return (
    <TooltipProvider>
      <div
        className={`flex w-full p-5 justify-center items-center gap-7 rounded-2xl border border-outline-on-system-teal bg-card-background backdrop-blur-[21px] ${className}`}
        style={{
          border: "1px solid rgba(138, 174, 164, 0.20)",
          background: "rgba(242, 244, 247, 0.30)",
          backdropFilter: "blur(21px)",
        }}
      >
        {/* Avatar and Name Container */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={avatarSrc}
              alt={`${userName} avatar`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>

          <h3
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
            fontFamily: '"Source Sans Pro"',
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
                  fontFamily: '"Source Sans Pro"',
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
    </TooltipProvider>
  );
}

export default UserProfileFollowCard;
