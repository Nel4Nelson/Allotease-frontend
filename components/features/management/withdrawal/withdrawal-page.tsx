"use client";

import { useState } from "react";
import { useBalance } from "@/hooks/use-balance";
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
  bankDetails?: BankDetailItem[];
  withdrawalHistory?: WithdrawalHistoryItem[];
  loading?: boolean;
}

export function WithdrawalPage({
  bankDetails,
  withdrawalHistory,
  loading = false,
}: WithdrawalPageProps) {
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalMessage, setWithdrawalMessage] = useState("");

  // Use balance hook
  const {
    balance,
    isLoading: balanceLoading,
    error: balanceError,
    withdraw,
    isWithdrawing,
    isValidWithdrawAmount,
  } = useBalance();

  // Use balance or fallback to 0 for display
  const displayBalance = balanceError ? 0 : balance;

  const formatBalanceAsNGN = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleWithdraw = () => {
    setShowWithdrawalModal(true);
    setWithdrawalMessage(""); // Clear any previous messages
    setWithdrawalAmount(""); // Clear amount field
  };

  const handleEditBankDetails = () => {
    setShowBankDetailsModal(true);
  };

  const handleWithdrawalSubmit = async () => {
    if (!withdrawalAmount || !isValidWithdrawAmount(withdrawalAmount)) {
      setWithdrawalMessage("Please enter a valid withdrawal amount");
      return;
    }

    try {
      const result = await withdraw(withdrawalAmount);

      if (result.success) {
        setWithdrawalMessage(result.message);
        // Close modal after showing success message
        setTimeout(() => {
          setShowWithdrawalModal(false);
          setWithdrawalMessage("");
          setWithdrawalAmount("");
        }, 2000);
      } else {
        setWithdrawalMessage(result.message);
      }
    } catch (err) {
      setWithdrawalMessage("Withdrawal failed. Please try again.");
      console.error(err);
    }
  };

  const handleBankDetailsSubmit = () => {
    // TODO: Implement bank details update logic
    console.log("Updating bank details...");
    setShowBankDetailsModal(false);
  };

  const calculateWithdrawalFee = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return 0;

    const feePercentage = 0.01; // 1%
    const minimumFee = 1000; // ₦1,000
    const calculatedFee = numAmount * feePercentage;

    return Math.max(calculatedFee, minimumFee);
  };

  const getNetAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return 0;

    const fee = calculateWithdrawalFee(amount);
    return numAmount - fee;
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
              balance={displayBalance}
              lastUpdated="October 10, 2024"
              onWithdraw={handleWithdraw}
              isLoading={balanceLoading}
              error={balanceError}
            />

            <BankDetails
              bankDetails={bankDetails}
              onEdit={handleEditBankDetails}
              loading={loading}
            />
          </div>
        </div>

        {/* Withdrawal History */}
        <WithdrawalHistory histories={withdrawalHistory} loading={loading} />
      </div>

      {/* Withdrawal Modal */}
      <Dialog open={showWithdrawalModal} onOpenChange={setShowWithdrawalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              {balanceLoading ? (
                <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
              ) : balanceError ? (
                "Unable to load balance - showing ₦0.00"
              ) : (
                `Enter the amount you want to withdraw from your NGN balance of ${formatBalanceAsNGN(
                  displayBalance
                )}`
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-sm text-gray-600 mb-1">
                Available Balance
              </div>
              <div className="text-2xl font-bold text-[#0A9355]">
                {balanceLoading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
                ) : (
                  formatBalanceAsNGN(displayBalance)
                )}
              </div>
              {balanceError && (
                <p className="text-sm text-red-600 mt-2">
                  Error loading balance - showing ₦0.00
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                disabled={isWithdrawing}
              />

              {/* Fee Information */}
              {withdrawalAmount && parseFloat(withdrawalAmount) > 0 && (
                <div className="space-y-1 text-xs text-gray-600">
                  <p>
                    Withdrawal fee: ₦
                    {calculateWithdrawalFee(withdrawalAmount).toLocaleString()}
                  </p>
                  <p>
                    Net amount to receive: ₦
                    {getNetAmount(withdrawalAmount).toLocaleString()}
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Withdrawal fee: 1% (minimum ₦1,000)
              </p>

              {/* Validation Messages */}
              {withdrawalAmount && !isValidWithdrawAmount(withdrawalAmount) && (
                <p className="text-sm text-red-600">
                  {parseFloat(withdrawalAmount) > displayBalance
                    ? "Amount exceeds available balance"
                    : "Please enter a valid amount"}
                </p>
              )}
            </div>

            {/* Status Messages */}
            {withdrawalMessage && (
              <div
                className={`p-3 rounded-md text-sm ${
                  withdrawalMessage.includes("successful") ||
                  withdrawalMessage.includes("Success")
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {withdrawalMessage}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowWithdrawalModal(false)}
                className="flex-1"
                disabled={isWithdrawing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleWithdrawalSubmit}
                disabled={
                  isWithdrawing ||
                  !withdrawalAmount ||
                  !isValidWithdrawAmount(withdrawalAmount)
                }
                className="flex-1 bg-[#FF5B00] hover:bg-[#E04F00]"
              >
                {isWithdrawing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Process Withdrawal"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bank Details Modal */}
      <Dialog
        open={showBankDetailsModal}
        onOpenChange={setShowBankDetailsModal}
      >
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
                <Input id="accountName" defaultValue="Flend Worldwide Ltd." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" defaultValue="Global Bank Inc." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" defaultValue="1234567890" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchCode">Branch Code</Label>
                <Input id="branchCode" defaultValue="00123" />
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
