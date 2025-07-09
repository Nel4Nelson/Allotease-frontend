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
}

export function WithdrawalBalance({
  balance,
  currency = "NGN",
  lastUpdated,
  onWithdraw,
}: WithdrawalBalanceProps) {
  const [showBalance, setShowBalance] = useState(false);

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-12 py-4">
      {/* Balance Display */}
      <div className="max-w-[200px] flex flex-col items-start">
        <div className="mb-4">
          <div
            className="flex items-center gap-2 cursor-pointer mb-2"
            onClick={() => setShowBalance(!showBalance)}
          >
            <p className="text-[#71727A] text-sm">Your {currency} Balance</p>
            {showBalance ? (
              <Eye size={16} className="text-[#71727A]" />
            ) : (
              <EyeSlash size={16} className="text-[#71727A]" />
            )}
          </div>

          <h3 className="text-2xl text-[#1F2024] font-bold font-source">
            {showBalance ? formatBalance(balance) : "••••••••"}
          </h3>
        </div>

        <Button
          onClick={onWithdraw}
          className="font-semibold text-white text-sm bg-[#FF5B00] hover:bg-[#E04F00] px-6 py-2 rounded-full"
        >
          Withdraw
        </Button>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <p className="font-source text-sm text-[#71727A] hidden md:block">
          Last Updated {lastUpdated}
        </p>
      )}
    </div>
  );
}
