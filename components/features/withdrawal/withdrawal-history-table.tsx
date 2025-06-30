"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WithdrawalHistoryTableProps } from "@/types/withdrawal";
import { formatCurrency, formatDate } from "@/data/sample-withdrawal";

function StatusBadge({ status }: { status: string }) {
  // Ensure statusStyle is not undefined

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold `}
    >
      <span className="flex-shrink-0">hi</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function WithdrawalHistoryTable({
  withdrawals,
  isLoading,
  onViewDetails,
}: WithdrawalHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="px-4 md:px-8 py-4 md:py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-4" />
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-4">
              <div className="grid grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded" />
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4">
                  <div className="grid grid-cols-5 gap-4">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <div className="px-4 md:px-8 py-4 md:py-6">
        <h2 className="font-bold text-xl text-[#1F2024] mb-6">
          Withdrawal History
        </h2>

        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <div className="text-[#71727A]">
            <svg
              className="mx-auto h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium mb-2">No withdrawal history</h3>
            <p className="text-sm">
              Your withdrawal transactions will appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-4 md:py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-xl text-[#1F2024]">Withdrawal History</h2>
        <p className="text-sm text-[#71727A]">
          {withdrawals.length} transaction{withdrawals.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F2F4F780]">
            <TableRow>
              <TableHead className="border-[#8AAEA433] text-[#20232A] font-medium">
                Amount Requested
              </TableHead>
              <TableHead className="border-[#8AAEA433] text-[#20232A] font-medium">
                Withdrawal Fees
              </TableHead>
              <TableHead className="border-[#8AAEA433] text-[#20232A] font-medium">
                Date Requested
              </TableHead>
              <TableHead className="border-[#8AAEA433] text-[#20232A] font-medium">
                Payout Date
              </TableHead>
              <TableHead className="border-[#8AAEA433] text-[#20232A] font-medium">
                Status
              </TableHead>
              <TableHead className="border-[#8AAEA433] text-[#20232A] font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.map((withdrawal) => (
              <TableRow
                key={withdrawal.id}
                className="text-[#71727A] border-none hover:bg-gray-50 cursor-pointer"
                onClick={() => onViewDetails?.(withdrawal.id)}
              >
                <TableCell className="font-medium">
                  {formatCurrency(
                    withdrawal.amountRequested,
                    withdrawal.currency
                  )}
                </TableCell>
                <TableCell>
                  {formatCurrency(
                    withdrawal.withdrawalFees,
                    withdrawal.currency
                  )}
                </TableCell>
                <TableCell>{formatDate(withdrawal.dateRequested)}</TableCell>
                <TableCell>
                  {withdrawal.payoutDate
                    ? formatDate(withdrawal.payoutDate)
                    : "—"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={withdrawal.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails?.(withdrawal.id);
                      }}
                      className="text-[#FF5B00] hover:text-[#E04E00] text-xs font-medium"
                    >
                      View
                    </button>
                    {withdrawal.status === "paid" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Download receipt:", withdrawal.id);
                        }}
                        className="text-[#FF5B00] hover:text-[#E04E00] text-xs font-medium"
                      >
                        Receipt
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
