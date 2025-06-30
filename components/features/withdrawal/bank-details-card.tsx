"use client";
import React from "react";
import { BankDetailsCardProps } from "@/types";

function BankDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <h4 className="text-[#1F2024] font-semibold text-sm">{label}</h4>
      <p className="text-[#71727A] text-sm">{value}</p>
    </div>
  );
}

export function BankDetailsCard({
  bankDetails,
  onEdit,
  onAddNew,
  isLoading,
}: BankDetailsCardProps) {
  const defaultBank =
    bankDetails.find((bank) => bank.isDefault) || bankDetails[0];

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 bg-gray-300 rounded w-32" />
          <div className="h-4 w-4 bg-gray-300 rounded" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-300 rounded w-32" />
              <div className="h-4 bg-gray-300 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!defaultBank) {
    return (
      <div className="text-center py-8">
        <div className="text-[#71727A] mb-4">
          <svg
            className="mx-auto h-12 w-12 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <h3 className="font-medium text-[#1F2024] mb-1">
            No bank details found
          </h3>
          <p className="text-sm">Add your bank details to enable withdrawals</p>
        </div>

        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-[#FF5B00] text-white rounded-lg hover:bg-[#E04E00] transition-colors"
        >
          Add Bank Details
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-bold text-xl text-[#1F2024]">Bank Details</h2>
        <button
          onClick={onEdit}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Edit bank details"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z" />
          </svg>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="space-y-0">
          <BankDetailRow
            label="Account Holder Name"
            value={defaultBank.accountHolderName}
          />
          <BankDetailRow label="Bank Name" value={defaultBank.bankName} />
          <BankDetailRow
            label="Account Number/IBAN"
            value={defaultBank.accountNumber}
          />
          {defaultBank.branchCode && (
            <BankDetailRow label="Branch Code" value={defaultBank.branchCode} />
          )}
          {defaultBank.swiftBicCode && (
            <BankDetailRow
              label="SWIFT/BIC Code"
              value={defaultBank.swiftBicCode}
            />
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            {defaultBank.isVerified ? (
              <div className="flex items-center gap-1 text-green-600">
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z" />
                </svg>
                <span className="text-xs font-medium">Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-orange-600">
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM120,136V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" />
                </svg>
                <span className="text-xs font-medium">
                  Pending verification
                </span>
              </div>
            )}
          </div>

          {bankDetails.length > 1 && (
            <button
              onClick={onEdit}
              className="text-[#FF5B00] hover:text-[#E04E00] text-xs font-medium"
            >
              Manage ({bankDetails.length} accounts)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
