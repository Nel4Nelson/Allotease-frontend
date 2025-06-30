"use client";
import React from "react";
import { Eye, EyeSlash } from "phosphor-react";
import { WithdrawalBalanceCardProps } from "@/types";
import { formatCurrency } from "@/data";

export function WithdrawalBalanceCard({
  balance,
  availableAmount,
  onToggleVisibility,
  onWithdraw,
  isLoading,
}: WithdrawalBalanceCardProps) {
  return (
    <div className="max-w-[250px] flex flex-col items-start">
      <div className="bg-white p-4 rounded-lg border border-gray-200 w-full">
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-[#FF5B00] transition-colors mb-2"
          onClick={onToggleVisibility}
        >
          <p className="text-[#71727A] text-sm">
            Your {balance.currency} Balance
          </p>
          {balance.isVisible ? <Eye size={16} /> : <EyeSlash size={16} />}
        </div>

        <h3 className="text-2xl text-[#1F2024] font-bold">
          {balance.isVisible
            ? formatCurrency(balance.amount, balance.currency)
            : "••••••••"}
        </h3>

        {balance.isVisible && availableAmount !== balance.amount && (
          <p className="text-xs text-[#71727A] mt-1">
            {formatCurrency(availableAmount, balance.currency)} available
          </p>
        )}
      </div>

      <button
        onClick={onWithdraw}
        disabled={isLoading || availableAmount <= 0}
        className="font-semibold text-white text-sm bg-[#FF5B00] hover:bg-[#E04E00] px-4 py-2 rounded-full border border-[#FF5B00] mt-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : "Withdraw"}
      </button>
    </div>
  );
}
