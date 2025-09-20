"use client";
import React from "react";
import { BalanceCard } from "./balance-card";
import { WithdrawSection } from "./withdraw-section";
import { OverviewTabs } from "./overview-tabs";

export function OverviewContent() {
  const handleWithdrawalHistoryClick = () => {
    // TODO: Implement withdrawal history modal or navigation
    console.log("Withdrawal history clicked");
  };

  const handleWithdrawClick = () => {
    // TODO: Implement withdrawal modal
    console.log("Withdraw clicked");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Balance Card Container with Withdraw Section */}
      <div className="relative">
        {/* Balance Card */}
        <BalanceCard
          balance="N2,150,500"
          onWithdrawalHistoryClick={handleWithdrawalHistoryClick}
        />

        {/* Withdraw Section - Positioned absolutely relative to balance card */}
        <WithdrawSection onWithdraw={handleWithdrawClick} />
      </div>

      {/* Overview Tabs */}
      <OverviewTabs />
    </div>
  );
}
