"use client";
import { EyeClosedIcon, EyeOpenIcon, WithdrawalHistoryIcon } from "@/components/icons";
import { useFormattedBalance } from "@/hooks/use-balance";
import React, { useState } from "react";

interface BalanceCardProps {
  onWithdrawalHistoryClick?: () => void;
}

function BalanceLoadingSkeleton() {
  return (
    <div className="relative h-[221px] px-[10px] flex flex-col justify-center items-center rounded-2xl bg-[#2F4F4F]">
      {/* Withdrawal History Button Skeleton */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="h-4 w-32 bg-[rgba(213,255,235,0.1)] rounded animate-pulse" />
        <div className="h-5 w-5 bg-[rgba(213,255,235,0.1)] rounded animate-pulse" />
      </div>

      {/* Balance Section Skeleton */}
      <div className="flex flex-col items-center gap-3">
        {/* Your NGN Balance Text Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-28 bg-[rgba(213,255,235,0.1)] rounded animate-pulse" />
          <div className="h-5 w-5 bg-[rgba(213,255,235,0.1)] rounded animate-pulse" />
        </div>

        {/* Balance Amount Skeleton */}
        <div className="h-6 w-40 bg-[rgba(213,255,235,0.1)] rounded animate-pulse" />
      </div>
    </div>
  );
}

function BalanceErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="relative h-[221px] px-[10px] flex flex-col justify-center items-center rounded-2xl bg-[#2F4F4F]">
      <div className="flex flex-col items-center gap-2">
        <div className="text-center">
          <h3 className="text-white font-space-grotesk text-lg font-semibold">
            Unable to Load Balance
          </h3>
          <p className="text-[rgba(213,255,235,0.7)] text-sm">
            Please check your connection and try again
          </p>
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-white text-[#2F4F4F] rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export function BalanceCard({ onWithdrawalHistoryClick }: BalanceCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  
  const {
    formattedBalance,
    isLoading,
    isError,
    error,
    refetch,
  } = useFormattedBalance();

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const formatHiddenBalance = (balance: string) => {
    // Count non-comma, non-N characters and replace with asterisks
    const cleanBalance = balance.replace(/[N,]/g, '');
    return 'N' + '*'.repeat(cleanBalance.length);
  };

  // Loading state
  if (isLoading) {
    return <BalanceLoadingSkeleton />;
  }

  // Error state
  if (isError) {
    return <BalanceErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="relative h-[221px] px-[10px] flex flex-col justify-center items-center rounded-2xl bg-[#2F4F4F]">
      {/* Withdrawal History - Absolute positioned */}
      <button
        onClick={onWithdrawalHistoryClick}
        className="absolute top-4 right-4 flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <span className="font-source-sans text-base text-[rgba(213,255,235,0.5)]">
          Withdrawal History
        </span>
        <WithdrawalHistoryIcon />
      </button>

      {/* Balance Section - Centered */}
      <div className="flex flex-col items-center gap-3">
        {/* Your NGN Balance Text */}
        <div className="flex items-center gap-2">
          <span className="font-source-sans text-base text-[rgba(213,255,235,0.5)]">
            Your NGN Balance
          </span>
          <button
            onClick={toggleBalanceVisibility}
            className="hover:opacity-80 transition-opacity"
            aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
          >
            {isBalanceVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
        </div>

        {/* Balance Amount */}
        <div className="text-white font-space-grotesk text-2xl font-bold leading-[14px]">
          {isBalanceVisible ? formattedBalance : formatHiddenBalance(formattedBalance)}
        </div>
      </div>
    </div>
  );
}