"use client";
import { useState } from "react";
import { useBalance } from "@/hooks/use-balance";
import { OverviewPage } from "@/components/features/management/overview";
import { WithdrawalModal } from "@/components/features/management/modal/withdrawal-modal";

// Define types for the hook return value (adjust based on your actual hook)
interface UseBalanceReturn {
  balance: number;
  isLoading: boolean;
  error: string | null;
  withdraw: (amount: string) => Promise<{ success: boolean }>;
  isWithdrawing: boolean;
  isValidWithdrawAmount: (amount: string) => boolean;
}

export default function ManageOverviewPage(): React.ReactElement {
  const [showWithdrawalModal, setShowWithdrawalModal] =
    useState<boolean>(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");

  const {
    balance,
    isLoading,
    error,
    withdraw,
    isWithdrawing,
    isValidWithdrawAmount,
  } = useBalance() as UseBalanceReturn;

  const handleWithdraw = (): void => {
    setShowWithdrawalModal(true);
    setWithdrawalAmount(""); // Clear amount field
  };

  const handleWithdrawalSubmit = async (): Promise<void> => {
    if (!withdrawalAmount || !isValidWithdrawAmount(withdrawalAmount)) {
      return;
    }

    try {
      const result = await withdraw(withdrawalAmount);

      if (result.success) {
        // Close modal after successful withdrawal
        setTimeout(() => {
          setShowWithdrawalModal(false);
          setWithdrawalAmount("");
        }, 1000);
      }
    } catch (err) {
      console.error("Withdrawal failed:", err);
    }
  };

  const handleCloseModal = (): void => {
    setShowWithdrawalModal(false);
  };

  const formatBalanceAsNGN = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  // Use balance or fallback to 0 for display
  const displayBalance: number = error ? 0 : balance;

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
      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={handleCloseModal}
        withdrawalAmount={withdrawalAmount}
        setWithdrawalAmount={setWithdrawalAmount}
        onSubmit={handleWithdrawalSubmit}
        isWithdrawing={isWithdrawing}
        isValidWithdrawAmount={isValidWithdrawAmount}
      />
    </>
  );
}
