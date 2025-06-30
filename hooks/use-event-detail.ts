/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { EventDetail } from "@/types/event-details";
import { sampleEventDetail } from "@/data/sample-event-detail";

export function useEventDetail(eventId: string) {
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // In a real app, this would fetch from API based on eventId
        if (eventId === sampleEventDetail.id || eventId === "default") {
          setEventDetail(sampleEventDetail);
        } else {
          setEventDetail(sampleEventDetail); // Fallback for now
        }
      } catch (err) {
        setError("Failed to load event details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetail();
    }
  }, [eventId]);

  return {
    eventDetail,
    isLoading,
    error,
    refetch: () => {
      if (eventId) {
        // Re-trigger the effect
        setIsLoading(true);
      }
    },
  };
}
