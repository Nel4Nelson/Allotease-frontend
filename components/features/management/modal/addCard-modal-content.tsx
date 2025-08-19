"use client";
import {
  BankDetailsFormData,
  bankDetailsSchema,
} from "@/validation/bank-details";
import React, { useState } from "react";
import { ZodError } from "zod";

interface AddCardModalContentProps {
  onSubmit: (cardData: BankDetailsFormData) => Promise<void>;
  isSubmitting: boolean;
  submitError?: string;
}

export function AddCardModalContent({
  onSubmit,
  isSubmitting,
  submitError,
}: AddCardModalContentProps) {
  const [formData, setFormData] = useState<BankDetailsFormData>({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    branchCode: "",
    swiftCode: "",
  });
  const [inputErrors, setInputErrors] = useState<
    Partial<Record<keyof BankDetailsFormData, string>>
  >({});
  const [fieldTouched, setFieldTouched] = useState<
    Partial<Record<keyof BankDetailsFormData, boolean>>
  >({});

  // Handle input change with real-time validation
  const handleInputChange =
    (field: keyof BankDetailsFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (inputErrors[field]) {
        setInputErrors((prev) => ({ ...prev, [field]: "" }));
      }

      // Real-time validation for touched fields
      if (fieldTouched[field] && value.trim()) {
        const result = bankDetailsSchema.shape[field].safeParse(value.trim());
        if (!result.success) {
          setInputErrors((prev) => ({
            ...prev,
            [field]: result.error.errors[0]?.message || "Invalid value",
          }));
        } else {
          setInputErrors((prev) => ({ ...prev, [field]: "" }));
        }
      }
    };

  // Handle input blur for validation
  const handleInputBlur = (field: keyof BankDetailsFormData) => () => {
    setFieldTouched((prev) => ({ ...prev, [field]: true }));

    const value = formData[field].trim();
    if (!value) {
      setInputErrors((prev) => ({
        ...prev,
        [field]: `${getFieldLabel(field)} is required`,
      }));
      return;
    }

    // Validate individual field
    const result = bankDetailsSchema.shape[field].safeParse(value);
    if (!result.success) {
      setInputErrors((prev) => ({
        ...prev,
        [field]: result.error.errors[0]?.message || "Invalid value",
      }));
    } else {
      setInputErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Get field label for error messages
  const getFieldLabel = (field: keyof BankDetailsFormData): string => {
    const labels: Record<keyof BankDetailsFormData, string> = {
      accountHolderName: "Account Holder Name",
      bankName: "Bank Name",
      accountNumber: "Account Number/IBAN",
      branchCode: "Branch Code",
      swiftCode: "SWIFT Code",
    };
    return labels[field];
  };

  // Validate entire form
  const validateForm = (): {
    isValid: boolean;
    errors: Partial<Record<keyof BankDetailsFormData, string>>;
  } => {
    try {
      // Trim all values before validation
      const trimmedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value.trim()])
      ) as BankDetailsFormData;

      bankDetailsSchema.parse(trimmedData);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Partial<Record<keyof BankDetailsFormData, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof BankDetailsFormData;
          if (!errors[field]) {
            errors[field] = err.message;
          }
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: {} };
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors } = validateForm();

    if (!isValid) {
      setInputErrors(errors);
      // Mark all fields as touched to show errors
      setFieldTouched(
        Object.fromEntries(
          Object.keys(formData).map((key) => [key, true])
        ) as Record<keyof BankDetailsFormData, boolean>
      );
      return;
    }

    try {
      // Trim all values before submitting
      const trimmedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value.trim()])
      ) as BankDetailsFormData;

      await onSubmit(trimmedData);

      // Reset form on success
      setFormData({
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        branchCode: "",
        swiftCode: "",
      });
      setInputErrors({});
      setFieldTouched({});
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSubmitting) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  const { isValid } = validateForm();
  const hasAllValues = Object.values(formData).every((value) => value.trim());
  const isButtonDisabled = isSubmitting || !hasAllValues || !isValid;

  const inputFields: Array<{
    key: keyof BankDetailsFormData;
    placeholder: string;
  }> = [
    { key: "accountHolderName", placeholder: "Account Holder Name" },
    { key: "bankName", placeholder: "Bank Name" },
    { key: "accountNumber", placeholder: "Account Number/IBAN" },
    { key: "branchCode", placeholder: "Branch Code" },
    { key: "swiftCode", placeholder: "SWIFT Code" },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
      {/* Form Inputs */}
      {inputFields.map(({ key, placeholder }, index) => (
        <div
          key={key}
          className={`relative w-full max-w-[320px] ${
            index === inputFields.length - 1 ? "mb-2" : "mb-4"
          }`}
        >
          <input
            type="text"
            value={formData[key]}
            onChange={handleInputChange(key)}
            onBlur={handleInputBlur(key)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            className={`appearance-none w-full h-11 px-3 rounded-lg border outline-none focus:ring-2 focus:border-transparent transition-all text-base font-normal ${
              inputErrors[key]
                ? "border-red-500 bg-red-50 focus:ring-red-200"
                : "border-[#8AAEA433] bg-[#F2F4F780] focus:ring-[#FF5B00]"
            }`}
          />
          {!formData[key] && !inputErrors[key] && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-base font-normal text-[#71727A]">
              {placeholder}
              <span className="text-[#FF5B00]">*</span>
            </div>
          )}
          {/* Field-specific error message */}
          {inputErrors[key] && (
            <div className="mt-1">
              <p className="text-red-500 text-sm font-medium">
                {inputErrors[key]}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Submit Error Message */}
      {submitError && (
        <div className="mb-2 w-full max-w-[320px]">
          <p className="text-red-500 text-sm font-medium">{submitError}</p>
        </div>
      )}

      {/* Success Message */}
      {hasAllValues && isValid && Object.keys(inputErrors).length === 0 && (
        <div className="mb-4 w-full max-w-[320px]">
          <p className="text-green-600 text-sm font-medium">
            ✓ All fields completed successfully
          </p>
        </div>
      )}

      {/* Update Bank Details Button */}
      <button
        type="submit"
        disabled={isButtonDisabled}
        className={`transition-all duration-200 transform w-[180px] h-[35px] px-3 py-1.5 rounded-[51px] font-semibold text-base sm:text-lg text-white mt-2 ${
          isButtonDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#FF5B00] hover:bg-[#E04F00] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm sm:text-base">Updating...</span>
          </div>
        ) : (
          "Update Bank Details"
        )}
      </button>
    </form>
  );
}
