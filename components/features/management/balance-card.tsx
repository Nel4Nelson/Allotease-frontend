"use client";
import React from "react";
import { Eye, EyeSlash } from "phosphor-react";
import { BalanceCardProps } from "@/types";

export function BalanceCard({ balance, onToggleVisibility }: BalanceCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency === "NGN" ? "NGN" : "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-[#2F4F4F] h-[14rem] p-4 rounded-2xl relative">
      {/* Header with Withdrawal History Link */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <p className="text-[#D5FFEB80] text-sm hidden md:block">
          Withdrawal History
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#D5FFEB80"
          viewBox="0 0 256 256"
          className="cursor-pointer hover:fill-[#D5FFEB]"
        >
          <path d="M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm56-64V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V48A16,16,0,0,1,56,32H92.26a47.92,47.92,0,0,1,71.48,0H200A16,16,0,0,1,216,48ZM96,64h64a32,32,0,0,0-64,0ZM200,48H173.25A47.93,47.93,0,0,1,176,64v8a8,8,0,0,1-8,8H88a8,8,0,0,1-8-8V64a47.93,47.93,0,0,1,2.75-16H56V216H200Z" />
        </svg>
      </div>

      {/* Balance Display */}
      <div className="h-[70%] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div
            className="text-[#D5FFEB80] flex items-center gap-2 cursor-pointer hover:text-[#D5FFEB] transition-colors mb-2"
            onClick={onToggleVisibility}
          >
            <p className="text-sm">Your {balance.currency} Balance</p>
            {balance.isVisible ? <Eye size={16} /> : <EyeSlash size={16} />}
          </div>

          <h3 className="text-2xl md:text-3xl text-white font-bold font-source">
            {balance.isVisible
              ? formatCurrency(balance.amount, balance.currency)
              : "••••••••"}
          </h3>

          {/* Pending Amount */}
          {balance.pendingAmount &&
            balance.pendingAmount > 0 &&
            balance.isVisible && (
              <p className="text-[#D5FFEB80] text-xs mt-1">
                {formatCurrency(balance.pendingAmount, balance.currency)}{" "}
                pending
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
