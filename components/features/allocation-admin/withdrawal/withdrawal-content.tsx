"use client";
import React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AccountSection } from "./account-section";
import { DataTable, ColumnConfig } from "@/components/ui/data-table";

export function WithdrawalContent() {
  // Sample bank details data
  const sampleBankDetails = {
    accountHolderName: "Fiend Worldwide Ltd.",
    bankName: "Global Bank Inc.",
    accountNumber: "1234567890",
    branchCode: "00123",
    swiftCode: "GBINUS33",
  };

  // Withdrawals table configuration
  const withdrawalColumns: ColumnConfig[] = [
    {
      key: "amountRequested",
      label: "Amount Requested",
      type: "text",
    },
    {
      key: "withdrawalFees",
      label: "Withdrawal Fees",
      type: "text",
    },
    {
      key: "dateRequested",
      label: "Date Requested",
      type: "text",
    },
    {
      key: "payoutDate",
      label: "Payout Date",
      type: "text",
    },
    {
      key: "status",
      label: "Status",
      type: "status",
    },
  ];

  const withdrawalData = [
    {
      amountRequested: "N300,000",
      withdrawalFees: "N3,000",
      dateRequested: "October 10, 2024",
      payoutDate: "–",
      status: "Declined",
    },
    {
      amountRequested: "N300,000",
      withdrawalFees: "N3,000",
      dateRequested: "October 10, 2024",
      payoutDate: "October 10, 2024",
      status: "Paid",
    },
  ];

  const handleWithdraw = () => {
    // TODO: Implement withdrawal modal
    console.log("Withdraw button clicked");
  };

  const handleEditBankDetails = () => {
    // TODO: Implement edit bank details functionality
    console.log("Edit bank details clicked");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4" />

      {/* Account Section */}
      <AccountSection
        balance="N2,150,500"
        lastUpdated="Last Updated October 10, 2024"
        bankDetails={sampleBankDetails}
        onWithdraw={handleWithdraw}
        onEditBankDetails={handleEditBankDetails}
      />

      {/* Withdrawals Table */}
      <DataTable
        title="Withdrawals"
        columns={withdrawalColumns}
        data={withdrawalData}
        variant="withdrawal"
      />
    </div>
  );
}
