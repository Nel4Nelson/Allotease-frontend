"use client";
import React, { useState, useRef, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export function OtpInput({
  length = 6,
  onComplete,
  disabled = false,
  error = false,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  useEffect(() => {
    // Call onComplete when OTP is fully entered
    const otpValue = otp.join("");
    if (otpValue.length === length) {
      onComplete(otpValue);
    }
  }, [otp, length, onComplete]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    // Handle single digit input
    if (value.length === 1) {
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus next input
      if (index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    // Handle paste scenario
    if (value.length > 1) {
      const pastedData = value.slice(0, length);
      const newOtpArray = pastedData.split("").slice(0, length);

      // Fill remaining with empty strings
      while (newOtpArray.length < length) {
        newOtpArray.push("");
      }

      setOtp(newOtpArray);

      // Focus last filled input or next empty one
      const nextIndex = Math.min(pastedData.length, length - 1);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        // Clear current input
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    const newOtp = [...otp];
    for (let i = 0; i < length; i++) {
      newOtp[i] = pasteData[i] || "";
    }

    setOtp(newOtp);

    // Focus appropriate input
    const focusIndex = Math.min(pasteData.length, length - 1);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-12 h-12 sm:w-14 sm:h-14 
            text-center text-lg sm:text-xl font-bold font-source-sans-pro
            border-2 rounded-lg
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500/20"
                : "border-[var(--input-border)] text-[var(--input-text)] focus:border-[var(--input-border-focus)] focus:ring-[var(--input-border-focus)]/20"
            }
            ${
              digit
                ? "bg-[var(--input-background)] border-[var(--input-border-focus)]"
                : "bg-[var(--input-background)]"
            }
          `}
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  );
}
