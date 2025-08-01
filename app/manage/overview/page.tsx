/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { useBalance } from "@/hooks/use-balance";
import { OverviewPage } from "@/components/features/management/overview";
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

export default function ManageOverviewPage() {
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalMessage, setWithdrawalMessage] = useState("");

  const {
    balance,
    isLoading,
    error,
    withdraw,
    isWithdrawing,
    formatBalance,
    isValidWithdrawAmount,
  } = useBalance();

  const handleWithdraw = () => {
    setShowWithdrawalModal(true);
    setWithdrawalMessage(""); // Clear any previous messages
    setWithdrawalAmount(""); // Clear amount field
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
        // Optional: Close modal after a short delay to show success message
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

  const formatBalanceAsNGN = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  // Use balance or fallback to 0 for display
  const displayBalance = error ? 0 : balance;

  return (
    <>
      <div className="space-y-6">
        {/* Overview Content - Pass balance data as props if needed */}
        <OverviewPage
          onWithdraw={handleWithdraw}
          balance={displayBalance}
          formattedBalance={formatBalanceAsNGN(displayBalance)}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Withdrawal Modal */}
      <Dialog open={showWithdrawalModal} onOpenChange={setShowWithdrawalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              {isLoading ? (
                <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
              ) : error ? (
                "Unable to load balance - showing ₦0.00"
              ) : (
                `You're about to withdraw from your NGN balance of ${formatBalanceAsNGN(
                  displayBalance
                )}`
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                Available Balance
              </div>
              <div className="text-3xl font-bold text-[#0A9355]">
                {isLoading ? (
                  <div className="h-9 bg-gray-200 rounded animate-pulse w-40 mx-auto"></div>
                ) : (
                  formatBalanceAsNGN(displayBalance)
                )}
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-2">
                  Error loading balance - showing ₦0.00
                </p>
              )}
            </div>

            {/* Withdrawal Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="withdrawalAmount">Withdrawal Amount (₦)</Label>
              <Input
                id="withdrawalAmount"
                type="number"
                step="0.01"
                placeholder="Enter amount to withdraw"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                disabled={isWithdrawing}
                className="text-lg"
              />
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

            {/* Action Buttons */}
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
                className="flex-1 bg-[#FF5B00] hover:bg-[#E04F00]"
                disabled={
                  isWithdrawing ||
                  !withdrawalAmount ||
                  !isValidWithdrawAmount(withdrawalAmount)
                }
              >
                {isWithdrawing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Continue to Withdrawal"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
