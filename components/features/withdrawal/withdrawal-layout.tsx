"use client";

import React from "react";
import {
  WithdrawalPageHeader,
  WithdrawalBalanceCard,
  BankDetailsCard,
  WithdrawalHistoryTable,
} from "./";
import { useWithdrawalAccount } from "@/hooks/use-withdrawal-account";
import { useBankDetails } from "@/hooks/use-bank-details";
import { useWithdrawalHistory } from "@/hooks/use-withdrawal-history";

export function WithdrawalLayout() {
  const {
    account,
    toggleBalanceVisibility,
    isLoading: accountLoading,
  } = useWithdrawalAccount();

  const {
    bankDetails,
    isLoading: bankLoading,
  } = useBankDetails(account.bankDetails);

  const {
    withdrawals,
    isLoading: historyLoading,
    viewWithdrawalDetails,
  } = useWithdrawalHistory();

  const handleWithdraw = async () => {
    // In real app, would open withdrawal modal with amount input
    console.log("Opening withdrawal modal");
  };

  const handleEditBankDetails = () => {
    // In real app, would open bank details modal
    console.log("Opening bank details modal");
  };

  const handleAddBankDetails = () => {
    // In real app, would open add bank details modal
    console.log("Opening add bank details modal");
  };

  return (
    <div className="px-4 md:px-8 py-4 md:py-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <WithdrawalPageHeader
        title="Your Account"
        breadcrumb={["Admin", "Withdrawal History"]}
        lastUpdated={account.balance.lastUpdated}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column - Balance */}
        <div className="lg:col-span-1">
          <WithdrawalBalanceCard
            balance={account.balance}
            availableAmount={account.availableForWithdrawal}
            onToggleVisibility={toggleBalanceVisibility}
            onWithdraw={handleWithdraw}
            isLoading={accountLoading}
          />
        </div>

        {/* Right Column - Bank Details */}
        <div className="lg:col-span-2">
          <BankDetailsCard
            bankDetails={bankDetails}
            onEdit={handleEditBankDetails}
            onAddNew={handleAddBankDetails}
            isLoading={bankLoading}
          />
        </div>
      </div>

      {/* Withdrawal History Table */}
      <WithdrawalHistoryTable
        withdrawals={withdrawals}
        isLoading={historyLoading}
        onViewDetails={viewWithdrawalDetails}
      />
    </div>
  );
}
