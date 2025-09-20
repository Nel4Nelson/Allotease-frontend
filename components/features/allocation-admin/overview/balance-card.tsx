"use client";
import { EyeClosedIcon, EyeOpenIcon, WithdrawalHistoryIcon } from "@/components/icons";
import React, { useState } from "react";

interface BalanceCardProps {
  balance: string;
  onWithdrawalHistoryClick?: () => void;
}

export function BalanceCard({ balance, onWithdrawalHistoryClick }: BalanceCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const formatHiddenBalance = (balance: string) => {
    // Count non-comma, non-N characters and replace with asterisks
    const cleanBalance = balance.replace(/[N,]/g, '');
    return 'N' + '*'.repeat(cleanBalance.length);
  };

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
          {isBalanceVisible ? balance : formatHiddenBalance(balance)}
        </div>
      </div>
    </div>
  );
}