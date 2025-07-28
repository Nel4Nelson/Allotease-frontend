/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useCallback } from "react";
import { UserProfile, FollowedOrganizer } from "@/types/tickets";
import {
  sampleUserProfile,
  sampleFollowedOrganizers,
} from "@/data/sample-tickets";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(sampleUserProfile);
  const [followedOrganizers, setFollowedOrganizers] = useState<
    FollowedOrganizer[]
  >(sampleFollowedOrganizers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFollowOrganizer = useCallback(
    async (organizerId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        setFollowedOrganizers((prev) =>
          prev.map((org) =>
            org.id === organizerId
              ? { ...org, isFollowing: !org.isFollowing }
              : org
          )
        );

        // Update profile following count
        setProfile((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            followingCount: followedOrganizers.filter((org) => org.isFollowing)
              .length,
          },
        }));

        console.log(`Toggled follow for organizer: ${organizerId}`);
      } catch (err) {
        setError("Failed to update follow status");
      } finally {
        setIsLoading(false);
      }
    },
    [followedOrganizers]
  );

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfile((prev) => ({ ...prev, ...updates }));
      console.log("Profile updated");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    profile,
    followedOrganizers,
    isLoading,
    error,
    toggleFollowOrganizer,
    updateProfile,
  };
}
