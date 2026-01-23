"use client";
import { EyeClosedIcon, EyeOpenIcon, WithdrawalHistoryIcon } from "@/components/icons";
import { BalanceLoadingSkeleton } from "@/components/ui/loading-skeletons/balance-card-loading-skeleton";
import { useFormattedBalance } from "@/hooks/use-balance";
import React, { useState } from "react";

interface BalanceCardProps {
  onWithdrawalHistoryClick?: () => void;
}

function BalanceErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="relative h-[180px] sm:h-[221px] px-4 sm:px-[10px] flex flex-col justify-center items-center rounded-2xl bg-[#2F4F4F]">
      {/* Withdrawal History Button - Even in error state */}
      <button
        onClick={onRetry}
        className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <span className="hidden sm:inline font-source-sans text-sm sm:text-base text-[rgba(213,255,235,0.5)]">
          Withdrawal History
        </span>
        <WithdrawalHistoryIcon />
      </button>

      <div className="flex flex-col items-center gap-2">
        <div className="text-center">
          <h3 className="text-white font-space-grotesk text-base sm:text-lg font-semibold">
            Unable to Load Balance
          </h3>
          <p className="text-[rgba(213,255,235,0.7)] text-xs sm:text-sm">
            Please check your connection and try again
          </p>
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-white text-[#2F4F4F] rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
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
    return (
      <BalanceLoadingSkeleton 
        showWithdrawalHistory={true}
        onWithdrawalHistoryClick={onWithdrawalHistoryClick}
      />
    );
  }

  // Error state
  if (isError) {
    return <BalanceErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="relative h-[180px] sm:h-[221px] px-4 sm:px-[10px] flex flex-col justify-center items-center rounded-2xl bg-[#2F4F4F]">
      {/* Withdrawal History - Absolute positioned */}
      <button
        onClick={onWithdrawalHistoryClick}
        className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <span className="hidden sm:inline font-source-sans text-sm sm:text-base text-[rgba(213,255,235,0.5)]">
          Withdrawal History
        </span>
        <WithdrawalHistoryIcon  />
      </button>

      {/* Balance Section - Centered */}
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        {/* Your NGN Balance Text */}
        <div className="flex items-center gap-2">
          <span className="font-source-sans text-sm sm:text-base text-[rgba(213,255,235,0.5)]">
            Your NGN Balance
          </span>
          <button
            onClick={toggleBalanceVisibility}
            className="hover:opacity-80 transition-opacity p-1"
            aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
          >
            {isBalanceVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
        </div>

        {/* Balance Amount */}
        <div className="text-white font-space-grotesk text-xl sm:text-2xl font-bold leading-tight sm:leading-[14px]">
          {isBalanceVisible ? formattedBalance : formatHiddenBalance(formattedBalance)}
        </div>
      </div>
    </div>
  );
}