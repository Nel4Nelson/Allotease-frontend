"use client";

import { useState } from "react";
import { WithdrawalBalance } from "./withdrawal-balance";
import { BankDetails } from "./bank-details";
import { WithdrawalHistory } from "./withdrawal-history";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BankDetailItem {
  label: string;
  value: string;
}

interface WithdrawalHistoryItem {
  id: string;
  amountRequested: string;
  withdrawalFees: string;
  dateRequested: string;
  payoutDate?: string;
  status: "Paid" | "Declined" | "Pending";
}

interface WithdrawalPageProps {
  balance?: number;
  bankDetails?: BankDetailItem[];
  withdrawalHistory?: WithdrawalHistoryItem[];
  loading?: boolean;
}

export function WithdrawalPage({
  balance = 2150500,
  bankDetails,
  withdrawalHistory,
  loading = false
}: WithdrawalPageProps) {
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  const handleWithdraw = () => {
    setShowWithdrawalModal(true);
  };

  const handleEditBankDetails = () => {
    setShowBankDetailsModal(true);
  };

  const handleWithdrawalSubmit = () => {
    // TODO: Implement withdrawal logic
    console.log("Processing withdrawal of:", withdrawalAmount);
    setShowWithdrawalModal(false);
    setWithdrawalAmount("");
    
    // Show success message or update history
  };

  const handleBankDetailsSubmit = () => {
    // TODO: Implement bank details update logic
    console.log("Updating bank details...");
    setShowBankDetailsModal(false);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="px-4 md:px-8">
          <p className="text-sm text-[#71727A] font-source mb-2">
            Admin / Withdrawal
          </p>
          <h1 className="font-bold text-2xl text-[#1F2024]">Your Account</h1>
        </div>

        {/* Balance and Bank Details */}
        <div className="px-4 md:px-8">
          <div className="md:flex w-full justify-between items-start gap-8">
            <WithdrawalBalance
              balance={balance}
              lastUpdated="October 10, 2024"
              onWithdraw={handleWithdraw}
            />

            <BankDetails
              bankDetails={bankDetails}
              onEdit={handleEditBankDetails}
              loading={loading}
            />
          </div>
        </div>

        {/* Withdrawal History */}
        <WithdrawalHistory
          histories={withdrawalHistory}
          loading={loading}
        />
      </div>

      {/* Withdrawal Modal */}
      <Dialog open={showWithdrawalModal} onOpenChange={setShowWithdrawalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Enter the amount you want to withdraw from your NGN balance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-sm text-gray-600 mb-1">Available Balance</div>
              <div className="text-2xl font-bold text-[#0A9355]">
                ₦{balance.toLocaleString()}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <Input
                id="amount"
                type="text"
                placeholder="Enter amount"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Withdrawal fee: 1% (minimum ₦1,000)
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowWithdrawalModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleWithdrawalSubmit}
                disabled={!withdrawalAmount}
                className="flex-1 bg-[#FF5B00] hover:bg-[#E04F00]"
              >
                Process Withdrawal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bank Details Modal */}
      <Dialog open={showBankDetailsModal} onOpenChange={setShowBankDetailsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bank Details</DialogTitle>
            <DialogDescription>
              Update your bank information for withdrawals
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Holder Name</Label>
                <Input
                  id="accountName"
                  defaultValue="Flend Worldwide Ltd."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  defaultValue="Global Bank Inc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  defaultValue="1234567890"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="branchCode">Branch Code</Label>
                <Input
                  id="branchCode"
                  defaultValue="00123"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBankDetailsModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBankDetailsSubmit}
                className="flex-1 bg-[#FF5B00] hover:bg-[#E04F00]"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}