// components/bank-details.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilSimple } from "phosphor-react";
import { AddCardModal } from "../modal/addCard-modal";
import { BankDetailsFormData } from "@/validation/bank-details";

interface BankDetailItem {
  label: string;
  value: string;
}

interface BankDetailsProps {
  bankDetails?: BankDetailItem[];
  loading?: boolean;
  onBankDetailsUpdate?: (newDetails: BankDetailItem[]) => void;
}

const defaultBankDetails: BankDetailItem[] = [
  { label: "Account Holder Name", value: "Flend Worldwide Ltd." },
  { label: "Bank Name", value: "Global Bank Inc." },
  { label: "Account Number/IBAN", value: "1234567890" },
  { label: "Branch Code", value: "00123" },
  { label: "SWIFT/BIC Code", value: "GBINUS33" },
];

export function BankDetails({
  bankDetails = defaultBankDetails,
  loading = false,
  onBankDetailsUpdate,
}: BankDetailsProps) {
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [currentBankDetails, setCurrentBankDetails] = useState(bankDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditClick = () => {
    setShowAddCardModal(true);
  };

  const handleCloseModal = () => {
    setShowAddCardModal(false);
  };

  const handleSubmit = async (cardData: BankDetailsFormData): Promise<void> => {
    setIsSubmitting(true);

    try {
      // Simulate API call - replace with your actual API endpoint
      const response = await fetch("/api/bank-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update bank details");
      }

      const result = await response.json();
      console.log("Bank details updated successfully:", result);

      // Convert BankDetailsFormData to BankDetailItem array
      const newBankDetails: BankDetailItem[] = [
        { label: "Account Holder Name", value: cardData.accountHolderName },
        { label: "Bank Name", value: cardData.bankName },
        { label: "Account Number/IBAN", value: cardData.accountNumber },
        { label: "Branch Code", value: cardData.branchCode },
        { label: "SWIFT/BIC Code", value: cardData.swiftCode },
      ];

      // Update local state
      setCurrentBankDetails(newBankDetails);

      // Call parent callback if provided
      if (onBankDetailsUpdate) {
        onBankDetailsUpdate(newBankDetails);
      }

      // Close modal after successful submission
      setTimeout(() => {
        setShowAddCardModal(false);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to update bank details:", error);
      setIsSubmitting(false);
      throw error; // Re-throw to show error in the modal
    }
  };

  if (loading) {
    return (
      <div className="md:w-[70%] lg:px-10">
        <div className="flex gap-2 items-center mb-6">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-40"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="md:w-[70%] lg:px-10">
        {/* Header */}
        <div className="flex gap-2 items-center mb-1">
          <h2 className="font-bold text-2xl text-[#1F2024] font-space-grotesk flex items-center">
            Bank Details
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditClick}
            className="p-1 h-auto hover:bg-gray-100"
          >
            <PencilSimple size={18} className="text-[#71727A]" />
          </Button>
        </div>

        {/* Details List */}
        {currentBankDetails.length > 0 && (
          <div className="">
            {currentBankDetails.map((detail, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2"
              >
                <h4 className="text-[#1F2024] font-semibold text-sm">
                  {detail.label}
                </h4>
                <p className="text-[#71727A] text-sm font-medium">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {currentBankDetails.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🏦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bank details added
            </h3>
            <p className="text-gray-600 mb-4">
              Add your bank details to enable withdrawals
            </p>
            <Button
              onClick={handleEditClick}
              className="bg-[#FF5B00] hover:bg-[#E04F00] text-white"
            >
              Add Bank Details
            </Button>
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={showAddCardModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
