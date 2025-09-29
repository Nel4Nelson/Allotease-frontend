"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";
import { useWithdraw, useValidateWithdrawal } from "@/hooks/use-withdrawal";
import { useFormattedBalance } from "@/hooks/use-balance";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Currency options (for future expansion)
const currencyOptions = [
  {
    value: "NGN",
    label: "NGN",
  },
];

export function WithdrawalModal({ isOpen, onClose }: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  
  const { mutate: withdraw, isPending: isSubmitting } = useWithdraw();
  const { balance, isLoading: isBalanceLoading } = useFormattedBalance();
  const { validateWithdrawAmount, formatAmount } = useValidateWithdrawal();

  const handleSubmit = async () => {
    const withdrawAmount = parseFloat(amount);
    
    if (!withdrawAmount || isNaN(withdrawAmount)) {
      return;
    }

    // Validate amount against available balance
    const validation = validateWithdrawAmount(withdrawAmount, balance);
    if (!validation.isValid) {
      // Error will be shown in validation state
      return;
    }

    // Process withdrawal
    withdraw(
      { amount: withdrawAmount },
      {
        onSuccess: () => {
          // Reset form and close modal
          setAmount("");
          setSelectedCurrency("NGN");
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAmount("");
      setSelectedCurrency("NGN");
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Validation logic
  const withdrawAmount = parseFloat(amount);
  const hasValidAmount = !isNaN(withdrawAmount) && withdrawAmount > 0;
  const validation = hasValidAmount 
    ? validateWithdrawAmount(withdrawAmount, balance)
    : { isValid: false };
  
  const isFormValid = validation.isValid && !isBalanceLoading;
  const hasError = amount && hasValidAmount && !validation.isValid;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Modal */}
      <div
        className="relative"
        style={{
          borderRadius: "20px",
          background: "rgba(242, 244, 247, 0.60)",
          boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.04)",
          backdropFilter: "blur(83.3499984741211px)",
          display: "flex",
          width: "600px",
          maxWidth: "90vw",
          padding: "32px",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-3 hover:bg-black/5 rounded-full transition-colors disabled:opacity-50 z-20"
          style={{ 
            minWidth: "44px", 
            minHeight: "44px",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
            background: "transparent",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer"
          }}
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Background Gradient Container */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.6,
            background:
              "linear-gradient(354deg, #FFF 24.04%, rgba(255, 243, 230, 0.35) 59.41%, #D5FFEB 113.97%)",
            filter: "blur(18.285715103149414px)",
            borderRadius: "20px",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center  w-full">
          {/* Title */}
          <h2
            style={{
              color: "var(--Title, #1F2024)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "140%",
              letterSpacing: "-0.4px",
              margin: 0,
            }}
          >
            Withdrawal
          </h2>

          {/* Form */}
          <div className="w-full space-y-4 mt-4">
            {/* Currency Selection */}
            <div className="space-y-1">
              <FormSelect
                placeholder="Select currency"
                options={currencyOptions}
                value={selectedCurrency}
                onValueChange={setSelectedCurrency}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Amount Input */}
            <div className="space-y-1">
              <FormInput
                label=""
                placeholder="Amount to withdraw*"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required={true}
                disabled={isSubmitting || isBalanceLoading}
                error={hasError ? validation.error : undefined}
                min="0"
                step="0.01"
              />
            </div>

            {/* Available Balance Info */}
            <div className="text-sm text-gray-600 text-left">
              {isBalanceLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  <span>Loading balance...</span>
                </div>
              ) : (
                <span>Available Balance: {formatAmount(balance)}</span>
              )}
            </div>

            {/* Make Withdrawal Button */}
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                loading={isSubmitting}
                variant="signup-primary"
                size="allotease-md"
                style={{
                  background: isFormValid && !isSubmitting ? "#FF5B06" : "#ccc",
                  borderRadius: "51px",
                  padding: "12px 24px",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: 600,
                  fontFamily: "var(--font-source-sans), sans-serif",
                  border: "none",
                  cursor: isFormValid && !isSubmitting ? "pointer" : "not-allowed",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (isFormValid && !isSubmitting) {
                    e.currentTarget.style.background = "#E54A00";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isFormValid && !isSubmitting) {
                    e.currentTarget.style.background = "#FF5B06";
                  }
                }}
              >
                {isSubmitting ? "Processing..." : "Make Withdrawal"}
              </Button>
            </div>
          </div>

          {/* Powered by Allotease */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <p
              style={{
                color: "#71727A",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "160%",
              }}
            >
              Powered by
            </p>
            <Link href="/" className="flex items-center group">
              <Image
                src="/images/brand-logo/logo-black.svg"
                alt="Allotease Logo"
                height={32}
                width={50}
                priority
                className="transition-transform group-hover:scale-105 w-auto"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}