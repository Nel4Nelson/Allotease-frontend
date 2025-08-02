// components/modals/WithdrawalModalContent.tsx
"use client";
import React, { useState } from "react";

interface WithdrawalModalContentProps {
  withdrawalAmount: string;
  setWithdrawalAmount: (amount: string) => void;
  onSubmit: () => Promise<void>;
  isWithdrawing: boolean;
  isValidWithdrawAmount: (amount: string) => boolean;
}

export function WithdrawalModalContent({
  withdrawalAmount,
  setWithdrawalAmount,
  onSubmit,
  isWithdrawing,
  isValidWithdrawAmount,
}: WithdrawalModalContentProps) {
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [inputError, setInputError] = useState("");

  // Handle input change with validation
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWithdrawalAmount(value);

    // Clear error when user starts typing
    if (inputError) {
      setInputError("");
    }
  };

  // Handle input blur for validation
  const handleInputBlur = () => {
    if (withdrawalAmount && !isValidWithdrawAmount(withdrawalAmount)) {
      setInputError("Invalid withdrawal amount");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!withdrawalAmount) {
      setInputError("Please enter an amount");
      return;
    }

    if (!isValidWithdrawAmount(withdrawalAmount)) {
      setInputError("Invalid withdrawal amount");
      return;
    }

    try {
      await onSubmit();
    } catch (error) {
      setInputError("Withdrawal failed. Please try again.");
      console.error(error);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Enter" &&
      !isWithdrawing &&
      withdrawalAmount &&
      isValidWithdrawAmount(withdrawalAmount)
    ) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  const isButtonDisabled = isWithdrawing || !withdrawalAmount;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
      {/* Currency Dropdown */}
      <div className="relative mb-4 w-full max-w-[320px]">
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="w-full h-11 px-3 rounded-lg border border-[#8AAEA433] bg-[#F2F4F780] appearance-none text-[#1F2024] outline-none focus:ring-2 focus:ring-[#FF5B00] focus:border-transparent transition-all text-base font-normal"
          disabled={isWithdrawing}
        >
          <option value="NGN">NGN </option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        {/* Dropdown Arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="#71727A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Amount Input */}
      <div className="relative mb-2 w-full max-w-[320px]">
        <input
          type="number"
          step="0.01"
          min="0"
          value={withdrawalAmount}
          onChange={handleAmountChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyPress}
          disabled={isWithdrawing}
          className={`appearance-none
    [&::-webkit-inner-spin-button]:appearance-none
    [&::-webkit-outer-spin-button]:appearance-none w-full h-11 px-3 rounded-lg border outline-none focus:ring-2 focus:border-transparent transition-all text-base font-normal ${
      inputError
        ? "border-red-500 bg-red-50 focus:ring-red-200"
        : "border-[#8AAEA433] bg-[#F2F4F780] focus:ring-[#FF5B00]"
    }`}
        />
        {!withdrawalAmount && !inputError && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-base font-normal text-[#71727A]">
            Amount to withdraw
            <span className="text-[#FF5B00]">*</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {inputError && (
        <div className="mb-4 w-full max-w-[320px]">
          <p className="text-red-500 text-sm font-medium">{inputError}</p>
        </div>
      )}

      {/* Amount Helper Text */}
      {withdrawalAmount && isValidWithdrawAmount(withdrawalAmount) && (
        <div className="mb-4 w-full max-w-[320px]">
          <p className="text-green-600 text-sm font-medium">
            ✓ Valid amount: {selectedCurrency}{" "}
            {parseFloat(withdrawalAmount).toLocaleString()}
          </p>
        </div>
      )}

      {/* Make Withdrawal Button */}
      <button
        type="submit"
        disabled={isButtonDisabled}
        className={`transition-all duration-200 transform w-[158px] h-[35px] px-3 py-1.5 rounded-[51px] font-semibold text-base sm:text-lg text-white  mt-2 ${
          isButtonDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#FF5B00] hover:bg-[#E04F00] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        }`}
      >
        {isWithdrawing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm sm:text-base">Processing...</span>
          </div>
        ) : (
          "Make Withdrawal"
        )}
      </button>
    </form>
  );
}
