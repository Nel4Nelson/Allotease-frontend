"use client";

import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BankDetailItem {
  label: string;
  value: string;
}

interface BankDetailsProps {
  bankDetails?: BankDetailItem[];
  onEdit?: () => void;
  loading?: boolean;
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
  onEdit,
  loading = false 
}: BankDetailsProps) {
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
    <div className="md:w-[70%] lg:px-10">
      {/* Header */}
      <div className="flex gap-2 items-center mb-6">
        <h2 className="font-bold text-2xl text-[#1F2024]">Bank Details</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="p-1 h-auto hover:bg-gray-100"
        >
          <Edit2 size={16} className="text-[#71727A]" />
        </Button>
      </div>

      {/* Details List */}
      <div className="space-y-4">
        {bankDetails.map((detail, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <h4 className="text-[#1F2024] font-semibold text-sm">
              {detail.label}
            </h4>
            <p className="text-[#71727A] text-sm font-medium">
              {detail.value}
            </p>
          </div>
        ))}
      </div>

      {bankDetails.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No bank details added
          </h3>
          <p className="text-gray-600 mb-4">
            Add your bank details to enable withdrawals
          </p>
          <Button
            onClick={onEdit}
            className="bg-[#FF5B00] hover:bg-[#E04F00] text-white"
          >
            Add Bank Details
          </Button>
        </div>
      )}
    </div>
  );
}