"use client";
import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EyeSlash } from "phosphor-react";

interface WithdrawalBalanceProps {
  balance: number;
  currency?: string;
  lastUpdated?: string;
  onWithdraw?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function WithdrawalBalance({
  balance,
  currency = "NGN",
  lastUpdated,
  onWithdraw,
  isLoading = false,
  error = null,
}: WithdrawalBalanceProps) {
  const [showBalance, setShowBalance] = useState(false);

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderBalance = () => {
    if (isLoading) {
      return <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>;
    }

    if (!showBalance) {
      return "••••••••";
    }

    return formatBalance(balance);
  };

  return (
    <div className="flex flex-col gap-20">
      {/* Balance Display */}
      <div className="max-w-[200px] flex flex-col items-start">
        <div className="mb-4">
          <div
            className="flex items-center gap-2 cursor-pointer mb-2"
            onClick={() => !isLoading && setShowBalance(!showBalance)}
          >
            <p className="text-[#71727A] text-sm">Your {currency} Balance</p>
            {isLoading ? (
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            ) : showBalance ? (
              <Eye size={16} className="text-[#71727A]" />
            ) : (
              <EyeSlash size={16} className="text-[#71727A]" />
            )}
          </div>

          <div className="flex flex-col">
            <h3 className="text-2xl text-[#1F2024] font-bold font-space-grotesk">
              {renderBalance()}
            </h3>

            {/* Error Message */}
            {error && showBalance && (
              <p className="text-red-500 text-xs mt-1">Error loading balance</p>
            )}
          </div>
        </div>

        <Button
          onClick={onWithdraw}
          disabled={isLoading}
          className={`font-semibold text-white text-sm px-6 py-2 rounded-full transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#FF5B00] hover:bg-[#E04F00]"
          }`}
        >
          {isLoading ? "Loading..." : "Withdraw"}
        </Button>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="flex flex-col gap-1">
          <p className="font-source text-sm text-[#71727A] hidden md:block">
            Last Updated {lastUpdated}
          </p>
          {isLoading && (
            <div className="h-3 bg-gray-200 rounded animate-pulse w-24 hidden md:block"></div>
          )}
        </div>
      )}
    </div>
  );
}
