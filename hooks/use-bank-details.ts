/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useCallback } from "react";
import { BankDetails } from "@/types/withdrawal";

export function useBankDetails(initialBankDetails: BankDetails[]) {
  const [bankDetails, setBankDetails] =
    useState<BankDetails[]>(initialBankDetails);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addBankDetails = useCallback(
    async (newBankDetails: Omit<BankDetails, "id" | "addedDate">) => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const bankDetail: BankDetails = {
          ...newBankDetails,
          id: `bank-${Date.now()}`,
          addedDate: new Date().toISOString(),
        };

        setBankDetails((prev) => [...prev, bankDetail]);
        console.log("Bank details added successfully");
      } catch (err) {
        setError("Failed to add bank details");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateBankDetails = useCallback(
    async (id: string, updates: Partial<BankDetails>) => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setBankDetails((prev) =>
          prev.map((bank) => (bank.id === id ? { ...bank, ...updates } : bank))
        );

        console.log("Bank details updated successfully");
      } catch (err) {
        setError("Failed to update bank details");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteBankDetails = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setBankDetails((prev) => prev.filter((bank) => bank.id !== id));
      console.log("Bank details deleted successfully");
    } catch (err) {
      setError("Failed to delete bank details");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setDefaultBank = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setBankDetails((prev) =>
        prev.map((bank) => ({
          ...bank,
          isDefault: bank.id === id,
        }))
      );

      console.log("Default bank updated successfully");
    } catch (err) {
      setError("Failed to update default bank");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    bankDetails,
    isLoading,
    error,
    addBankDetails,
    updateBankDetails,
    deleteBankDetails,
    setDefaultBank,
  };
}
