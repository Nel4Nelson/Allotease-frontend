"use client";
import React from "react";
import { WithdrawalHistoryIcon } from "@/components/icons";

interface BalanceLoadingSkeletonProps {
  showWithdrawalHistory?: boolean;
  onWithdrawalHistoryClick?: () => void;
}

export function BalanceLoadingSkeleton({ 
  showWithdrawalHistory = false,
  onWithdrawalHistoryClick 
}: BalanceLoadingSkeletonProps) {
  return (
    <div className="relative h-[180px] sm:h-[221px] px-4 sm:px-[10px] flex flex-col justify-center items-center rounded-2xl bg-[#2F4F4F]">
      {/* Withdrawal History Button Skeleton (Allocation Admin only) */}
      {showWithdrawalHistory && (
        <button
          onClick={onWithdrawalHistoryClick}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2 opacity-50"
          disabled
        >
          <span className="hidden sm:inline font-source-sans text-sm sm:text-base text-[rgba(213,255,235,0.5)]">
            Withdrawal History
          </span>
          <WithdrawalHistoryIcon  />
        </button>
      )}

      {/* Balance Section Skeleton */}
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        {/* Your NGN Balance Text Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-3 sm:h-4 w-24 sm:w-28 bg-[rgba(213,255,235,0.1)] rounded animate-pulse" />
          <div className="h-4 sm:h-5 w-4 sm:w-5 bg-[rgba(213,255,235,0.1)] rounded animate-pulse" />
        </div>

        {/* Balance Amount Skeleton */}
        <div className="h-5 sm:h-6 w-32 sm:w-40 bg-[rgba(213,255,235,0.1)] rounded animate-pulse" />
      </div>
    </div>
  );
}