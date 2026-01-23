"use client";
import React, { useState } from "react";
import { BalanceCard } from "./balance-card";
import { WithdrawSection } from "./withdraw-section";
import { OverviewTabs } from "./overview-tabs";
import { WithdrawalModal } from "@/components/ui/modals/withdrawal-modal";

export function OverviewContent() {
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  const handleWithdrawalHistoryClick = () => {
    // TODO: Implement withdrawal history modal or navigation
    console.log("Withdrawal history clicked");
  };

  const handleWithdrawClick = () => {
    setIsWithdrawalModalOpen(true);
  };

  const handleCloseWithdrawalModal = () => {
    setIsWithdrawalModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Balance Card Container with Withdraw Section */}
      <div className="relative">
        {/* Balance Card */}
        <BalanceCard 
          onWithdrawalHistoryClick={handleWithdrawalHistoryClick}
        />

        {/* Withdraw Section - Positioned absolutely relative to balance card */}
        <WithdrawSection onWithdraw={handleWithdrawClick} />
      </div>

      {/* Overview Tabs */}
      <OverviewTabs />

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={handleCloseWithdrawalModal}
      />
    </div>
  );
}