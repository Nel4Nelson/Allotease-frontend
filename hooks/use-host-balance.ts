/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useCallback } from "react";
import { HostBalance } from "@/types/management";
import { sampleHostBalance } from "@/data/sample-management";

export function useHostBalance() {
  const [balance, setBalance] = useState<HostBalance>(sampleHostBalance);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleBalanceVisibility = useCallback(() => {
    setBalance((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  const requestWithdrawal = useCallback(
    async (amount: number) => {
      if (amount > balance.availableForWithdrawal) {
        setError("Insufficient balance for withdrawal");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setBalance((prev) => ({
          ...prev,
          availableForWithdrawal: prev.availableForWithdrawal - amount,
          pendingAmount: (prev.pendingAmount || 0) + amount,
        }));

        console.log(`Withdrawal request submitted: ${amount}`);
      } catch (err) {
        setError("Failed to process withdrawal request");
      } finally {
        setIsLoading(false);
      }
    },
    [balance.availableForWithdrawal]
  );

  const refreshBalance = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, would fetch from API
      console.log("Balance refreshed");
    } catch (err) {
      setError("Failed to refresh balance");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    balance,
    isLoading,
    error,
    toggleBalanceVisibility,
    requestWithdrawal,
    refreshBalance,
  };
}
