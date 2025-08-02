import { useState, useEffect, useCallback } from "react";
import { BalanceService } from "../services/balance-service";

// Hook return type
interface UseBalanceReturn {
  balance: number;
  isLoading: boolean;
  error: string | null;
  isWithdrawing: boolean;
  withdraw: (amount: string) => Promise<{ success: boolean; message: string }>;
  refreshBalance: () => Promise<void>;
  formatBalance: (currency?: string) => string;
  isValidWithdrawAmount: (amount: string) => boolean;
}

// Balance Hook
export const useBalance = (): UseBalanceReturn => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

  // Fetch balance
  const fetchBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await BalanceService.getBalance();
      setBalance(response.data.balance);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch balance");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Withdraw funds
  const withdraw = useCallback(
    async (amount: string) => {
      try {
        setIsWithdrawing(true);
        setError(null);

        const response = await BalanceService.withdraw(amount);

        if (response.status === "success") {
          // Refresh balance after successful withdrawal
          await fetchBalance();
          return { success: true, message: "Withdrawal successful" };
        } else {
          const errorMessage = response.message || "Withdrawal failed";
          setError(errorMessage);
          return { success: false, message: errorMessage };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Withdrawal failed";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setIsWithdrawing(false);
      }
    },
    [fetchBalance]
  );

  // Refresh balance (alias for fetchBalance for better naming)
  const refreshBalance = useCallback(() => {
    return fetchBalance();
  }, [fetchBalance]);

  // Load balance on mount
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    isLoading,
    error,
    isWithdrawing,
    withdraw,
    refreshBalance,
    formatBalance: (currency?: string) =>
      BalanceService.formatBalance(balance, currency),
    isValidWithdrawAmount: (amount: string) =>
      BalanceService.isValidWithdrawAmount(amount, balance),
  };
};
