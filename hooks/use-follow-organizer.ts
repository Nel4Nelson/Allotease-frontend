/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useCallback } from "react";
import { EventOrganizer } from "@/types/event-details";

export function useFollowOrganizer(organizer: EventOrganizer) {
  const [isFollowing, setIsFollowing] = useState(organizer.isFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFollow = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsFollowing((prev) => !prev);
      console.log(
        `${isFollowing ? "Unfollowed" : "Followed"} ${organizer.name}`
      );
    } catch (err) {
      setError("Failed to update follow status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isFollowing, organizer.name]);

  return {
    isFollowing,
    isLoading,
    error,
    toggleFollow,
  };
}
