/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useCallback } from "react";
import { WithdrawalAccount } from "@/types/withdrawal";
import { sampleWithdrawalAccount } from "@/data/sample-withdrawal";

export function useWithdrawalAccount() {
  const [account, setAccount] = useState<WithdrawalAccount>(
    sampleWithdrawalAccount
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleBalanceVisibility = useCallback(() => {
    setAccount((prev) => ({
      ...prev,
      balance: {
        ...prev.balance,
        isVisible: !prev.balance.isVisible,
      },
    }));
  }, []);

  const refreshAccount = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAccount((prev) => ({
        ...prev,
        balance: {
          ...prev.balance,
          lastUpdated: new Date().toISOString(),
        },
      }));

      console.log("Account data refreshed");
    } catch (err) {
      setError("Failed to refresh account data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestWithdrawal = useCallback(
    async (amount: number) => {
      if (amount > account.availableForWithdrawal) {
        setError("Insufficient balance for withdrawal");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Update account state
        setAccount((prev) => ({
          ...prev,
          availableForWithdrawal: prev.availableForWithdrawal - amount,
          pendingWithdrawals: prev.pendingWithdrawals + amount,
        }));

        console.log(`Withdrawal request submitted: ${amount}`);
      } catch (err) {
        setError("Failed to process withdrawal request");
      } finally {
        setIsLoading(false);
      }
    },
    [account.availableForWithdrawal]
  );

  return {
    account,
    isLoading,
    error,
    toggleBalanceVisibility,
    refreshAccount,
    requestWithdrawal,
  };
}
