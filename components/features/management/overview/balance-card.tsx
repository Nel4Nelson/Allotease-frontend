"use client";
import { Eye, EyeSlash } from "phosphor-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BalanceCardProps {
  balance: number;
  currency?: string;
  formattedBalance?: string;
  onWithdraw?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function BalanceCard({
  balance,
  currency = "NGN",
  formattedBalance,
  onWithdraw,
  isLoading = false,
  error = null,
}: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(false);

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDisplayBalance = () => {
    if (formattedBalance) return formattedBalance;
    return formatBalance(balance);
  };

  const renderBalance = () => {
    if (isLoading) {
      return <div className="h-6 bg-gray-300 rounded animate-pulse w-32"></div>;
    }

    if (!showBalance) {
      return "••••••••";
    }

    return getDisplayBalance();
  };

  return (
    <div className="bg-[#2F4F4F] h-[14rem] p-4 rounded-2xl relative">
      {/* Withdrawal History Button */}
      <div className="flex justify-end items-center gap-1 mb-4">
        <p className="text-[#D5FFEB80] hidden md:block text-sm">
          Withdrawal History
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#D5FFEB80"
          viewBox="0 0 256 256"
        >
          <path d="M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm56-64V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V48A16,16,0,0,1,56,32H92.26a47.92,47.92,0,0,1,71.48,0H200A16,16,0,0,1,216,48ZM96,64h64a32,32,0,0,0-64,0ZM200,48H173.25A47.93,47.93,0,0,1,176,64v8a8,8,0,0,1-8,8H88a8,8,0,0,1-8-8V64a47.93,47.93,0,0,1,2.75-16H56V216H200Z" />
        </svg>
      </div>

      {/* Balance Display */}
      <div className="h-[70%] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div
            className="text-[#D5FFEB80] flex items-center gap-2 cursor-pointer mb-2"
            onClick={() => setShowBalance(!showBalance)}
          >
            <p className="text-sm">Your {currency} Balance</p>
            {showBalance ? <Eye size={16} /> : <EyeSlash size={16} />}
          </div>

          <div className="flex flex-col items-center min-h-[32px]">
            <h3 className="text-2xl text-white font-bold font-source">
              {renderBalance()}
            </h3>

            {/* Error Message */}
            {error && showBalance && (
              <p className="text-red-400 text-xs mt-1">Error loading balance</p>
            )}
          </div>
        </div>
      </div>

      {/* Withdrawal Card - Positioned Absolutely */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-[90%] max-w-[400px]">
        <div className="flex justify-between items-center shadow-md bg-white rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-full bg-[#FF5B00] border-2 border-[#BC4300] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h5 className="font-semibold text-[#1F2024]">Flend Worldwide</h5>
          </div>
          <Button
            onClick={onWithdraw}
            disabled={isLoading}
            className={`font-semibold text-white text-sm px-4 py-2 rounded-full transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#FF5B00] hover:bg-[#E04F00]"
            }`}
          >
            {isLoading ? "Loading..." : "Withdraw"}
          </Button>
        </div>
      </div>
    </div>
  );
}
