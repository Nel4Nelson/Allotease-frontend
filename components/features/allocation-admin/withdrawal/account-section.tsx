"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { EyeOpenIcon, EyeClosedIcon, PencilIcon } from "@/components/icons";

interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  branchCode: string;
  swiftCode: string;
}

interface AccountSectionProps {
  balance: string;
  lastUpdated: string;
  bankDetails: BankDetails;
  onWithdraw?: () => void;
  onEditBankDetails?: () => void;
  className?: string;
}

export function AccountSection({
  balance,
  lastUpdated,
  bankDetails,
  onWithdraw,
  onEditBankDetails,
  className = "",
}: AccountSectionProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const formatHiddenBalance = (balance: string) => {
    const cleanBalance = balance.replace(/[N,]/g, "");
    return "N" + "*".repeat(cleanBalance.length);
  };

  const bankDetailsItems = [
    { label: "Account Holder Name", value: bankDetails.accountHolderName },
    { label: "Bank Name", value: bankDetails.bankName },
    { label: "Account Number/IBAN", value: bankDetails.accountNumber },
    { label: "Branch Code", value: bankDetails.branchCode },
    { label: "SWIFT/BIC Code", value: bankDetails.swiftCode },
  ];

  return (
    <div className={className}>
      {/* Your Account Title */}
      <h1 className="text-[#1F2024] font-space-grotesk text-[28px] font-bold leading-[140%] tracking-[-0.56px] mb-6">
        Your Account
      </h1>

      {/* Main Container */}
      <div className="flex items-center gap-10 border-y border-[rgba(138,174,164,0.20)] pt-0">
        {/* Left Side - Balance Section */}
        <div className="flex flex-col justify-between items-start w-[227px] min-h-full space-y-6">
          {/* Balance Info */}
          <div className="space-y-3">
            {/* Your NGN Balance Text with Eye Icon */}
            <div className="flex items-center gap-1">
              <span className="text-[#71727A] font-source-sans text-base font-normal">
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
            <div className="text-[#1F2024] font-space-grotesk text-2xl font-bold leading-[14px]">
              {isBalanceVisible ? balance : formatHiddenBalance(balance)}
            </div>

            {/* Withdraw Button */}
            <Button
              onClick={onWithdraw}
              variant="signup-primary"
              size="allotease-sm"
            >
              Withdraw
            </Button>
          </div>

          {/* Last Updated */}
          <div className="mt-6">
            <span className="text-[#71727A] font-source-sans text-sm font-normal leading-[14px]">
              {lastUpdated}
            </span>
          </div>
        </div>

        {/* Right Side - Bank Details */}
        <div className="flex flex-col items-start gap-2.5 flex-1 p-6 bg-[rgba(242,244,247,0.50)]">
          {/* Bank Details Header */}
          <div className="flex items-center gap-1 mb-4">
            <h2 className="text-[#1F2024] font-space-grotesk text-[28px] font-bold leading-[140%] tracking-[-0.56px]">
              Bank Details
            </h2>
            <button
              onClick={onEditBankDetails}
              className="hover:opacity-80 transition-opacity"
              aria-label="Edit bank details"
            >
              <PencilIcon />
            </button>
          </div>

          {/* Bank Details Items */}
          <div className="space-y-4 w-full">
            {bankDetailsItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center w-full"
              >
                <span className="text-[#1F2024] font-source-sans text-sm font-semibold leading-[14px]">
                  {item.label}
                </span>
                <span className="text-[#71727A] font-source-sans text-sm font-normal leading-[14px]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
