/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useCallback } from "react";
import { HostProfile } from "@/types/management";
import { sampleHostProfile } from "@/data/sample-management";

export function useHostProfile() {
  const [profile, setProfile] = useState<HostProfile>(sampleHostProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (updates: Partial<HostProfile>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfile((prev) => ({ ...prev, ...updates }));
      console.log("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, would fetch from API
      console.log("Profile refreshed");
    } catch (err) {
      setError("Failed to refresh profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile,
  };
}
