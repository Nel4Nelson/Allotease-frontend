/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useCallback } from "react";
import { WithdrawalHistory } from "@/types/withdrawal";
import { sampleWithdrawalHistory } from "@/data/sample-withdrawal";

export function useWithdrawalHistory() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalHistory[]>(
    sampleWithdrawalHistory
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "declined">(
    "all"
  );

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    if (filter === "all") return true;
    return withdrawal.status === filter;
  });

  const refreshHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, would fetch from API
      console.log("Withdrawal history refreshed");
    } catch (err) {
      setError("Failed to refresh withdrawal history");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const viewWithdrawalDetails = useCallback((withdrawalId: string) => {
    console.log("Viewing withdrawal details:", withdrawalId);
    // In real app: router.push(`/manage/withdrawals/${withdrawalId}`)
  }, []);

  const cancelWithdrawal = useCallback(async (withdrawalId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setWithdrawals((prev) =>
        prev.map((withdrawal) =>
          withdrawal.id === withdrawalId
            ? { ...withdrawal, status: "cancelled" as const }
            : withdrawal
        )
      );

      console.log("Withdrawal cancelled:", withdrawalId);
    } catch (err) {
      setError("Failed to cancel withdrawal");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(refreshHistory, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshHistory]);

  return {
    withdrawals: filteredWithdrawals,
    allWithdrawals: withdrawals,
    isLoading,
    error,
    filter,
    setFilter,
    refreshHistory,
    viewWithdrawalDetails,
    cancelWithdrawal,
  };
}
