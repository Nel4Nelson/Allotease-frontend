"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/stores/profile-store";
import { FallbackImage } from "@/components/ui/fallback-image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface WithdrawSectionProps {
  onWithdraw?: () => void;
}

export function WithdrawSection({ onWithdraw }: WithdrawSectionProps) {
  const { profile, isLoading, getFullName, getAvatarUrl, fetchProfile } =
    useProfileStore();

  // Fetch profile on mount if needed
  useEffect(() => {
    if (!profile && !isLoading) {
      fetchProfile();
    }
  }, [profile, isLoading, fetchProfile]);

  const handleWithdrawClick = () => {
    onWithdraw?.();
  };

  return (
    <div className="absolute -bottom-[35px] left-1/2 transform -translate-x-1/2">
      <div className="flex justify-between items-center bg-white rounded-lg border border-gray-100 w-[444px] px-6 py-5">
        {/* Left Section: Avatar + Name */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex justify-center items-center flex-shrink-0 rounded-full overflow-hidden">
            {isLoading ? (
              <Skeleton circle width={35} height={35} />
            ) : (
              <FallbackImage
                src={getAvatarUrl()}
                fallbackSrc="/icons/encircle-star-green-avatar.svg"
                alt="Allocation Admin"
                fallbackAlt="Default Admin Avatar"
                width={35}
                height={35}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Name */}
          <div className="flex-1 overflow-hidden font-space-grotesk text-[14px] font-bold leading-[140%] tracking-[-0.28px] text-[#1F2024] line-clamp-1">
            {isLoading ? (
              <Skeleton width={120} height={16} />
            ) : (
              getFullName() || "Allocation Admin"
            )}
          </div>
        </div>

        {/* Right Section: Withdraw Button */}
        <Button
          variant="signup-primary"
          size="allotease-sm"
          onClick={handleWithdrawClick}
          disabled={isLoading}
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
}
