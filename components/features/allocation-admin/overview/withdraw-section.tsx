"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useProfileData } from "@/hooks/use-profile";
import { FallbackImage } from "@/components/ui/fallback-image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface WithdrawSectionProps {
  onWithdraw?: () => void;
}

export function WithdrawSection({ onWithdraw }: WithdrawSectionProps) {
  const { fullName, avatarUrl, isLoading } = useProfileData();

  const handleWithdrawClick = () => {
    onWithdraw?.();
  };

  return (
    <div className="absolute -bottom-[35px] left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] sm:w-[444px] max-w-[444px]">
      <div className="flex justify-between items-center gap-2 bg-white rounded-lg border border-gray-100 px-3 sm:px-6 py-3 sm:py-5 shadow-sm">
        {/* Left Section: Avatar + Name */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-[32px] h-[32px] sm:w-[35px] sm:h-[35px] flex justify-center items-center flex-shrink-0 rounded-full overflow-hidden">
            {isLoading ? (
              <Skeleton circle width={32} height={32} className="sm:w-[35px] sm:h-[35px]" />
            ) : (
              <FallbackImage
                src={avatarUrl}
                fallbackSrc="/icons/encircle-star-green-avatar.svg"
                alt="Allocation Admin"
                fallbackAlt="Default Admin Avatar"
                width={35}
                height={35}
                className="object-cover w-full h-full"
              />
            )}
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0 overflow-hidden font-space-grotesk text-[13px] sm:text-[14px] font-bold leading-[140%] tracking-[-0.28px] text-[#1F2024] truncate">
            {isLoading ? (
              <Skeleton width={100} height={16} />
            ) : (
              fullName || "Allocation Admin"
            )}
          </div>
        </div>

        {/* Right Section: Withdraw Button */}
        <Button
          variant="signup-primary"
          size="allotease-sm"
          onClick={handleWithdrawClick}
          disabled={isLoading}
          className="whitespace-nowrap text-sm sm:text-base px-3 sm:px-4 flex-shrink-0"
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
}