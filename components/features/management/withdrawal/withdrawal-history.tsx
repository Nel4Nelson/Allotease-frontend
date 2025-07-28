"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface WithdrawalHistoryItem {
  id: string;
  amountRequested: string;
  withdrawalFees: string;
  dateRequested: string;
  payoutDate?: string;
  status: "Paid" | "Declined" | "Pending";
}

interface WithdrawalHistoryProps {
  histories?: WithdrawalHistoryItem[];
  loading?: boolean;
}

const defaultHistories: WithdrawalHistoryItem[] = [
  {
    id: "1",
    amountRequested: "₦300,000",
    withdrawalFees: "₦3,000",
    dateRequested: "October 10, 2024",
    payoutDate: "",
    status: "Declined",
  },
  {
    id: "2",
    amountRequested: "₦300,000", 
    withdrawalFees: "₦3,000",
    dateRequested: "October 10, 2024",
    payoutDate: "October 10, 2024",
    status: "Paid",
  },
  {
    id: "3",
    amountRequested: "₦150,000",
    withdrawalFees: "₦1,500", 
    dateRequested: "October 15, 2024",
    payoutDate: "",
    status: "Pending",
  },
];

const getStatusConfig = (status: WithdrawalHistoryItem['status']) => {
  switch (status) {
    case "Paid":
      return {
        bg: "bg-[#ECFDF3]",
        text: "text-[#0A9355]",
        icon: <CheckCircle size={16} />,
      };
    case "Declined":
      return {
        bg: "bg-[#FFE2E7]",
        text: "text-[#EB4244]",
        icon: <XCircle size={16} />,
      };
    case "Pending":
      return {
        bg: "bg-[#FEEDD6]",
        text: "text-[#F07C29]",
        icon: <Clock size={16} />,
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        icon: null,
      };
  }
};

export function WithdrawalHistory({ 
  histories = defaultHistories, 
  loading = false 
}: WithdrawalHistoryProps) {
  if (loading) {
    return (
      <div className="px-4 md:px-8 py-4 md:py-6">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-[#F2F4F780] p-4">
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="p-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-4 bg-gray-100 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-4 md:py-6">
      <h2 className="text-xl font-bold text-[#1F2024] mb-6">
        Withdrawal History
      </h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table>
          <TableHeader className="bg-[#F2F4F780]">
            <TableRow>
              <TableHead className="text-[#20232A] font-medium">
                Amount Requested
              </TableHead>
              <TableHead className="text-[#20232A] font-medium">
                Withdrawal Fees
              </TableHead>
              <TableHead className="text-[#20232A] font-medium">
                Date Requested
              </TableHead>
              <TableHead className="text-[#20232A] font-medium">
                Payout Date
              </TableHead>
              <TableHead className="text-[#20232A] font-medium">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {histories.map((history) => {
              const statusConfig = getStatusConfig(history.status);
              
              return (
                <TableRow key={history.id} className="text-[#71727A] border-b-0">
                  <TableCell className="font-medium">
                    {history.amountRequested}
                  </TableCell>
                  <TableCell>{history.withdrawalFees}</TableCell>
                  <TableCell>{history.dateRequested}</TableCell>
                  <TableCell>
                    {history.payoutDate || (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      {statusConfig.icon}
                      {history.status}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {histories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No withdrawal history
            </h3>
            <p className="text-gray-600">
              Your withdrawal transactions will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}