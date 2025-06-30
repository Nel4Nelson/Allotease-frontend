/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ManagementStats,
  ReservationItem,
  HostListing,
} from "@/types";
import {
  sampleManagementStats,
  sampleRecentReservations,
  sampleHostListings,
  getFilteredListings,
} from "@/data";

export function useManagementData() {
  const [stats, setStats] = useState<ManagementStats>(sampleManagementStats);
  const [reservations, setReservations] = useState<ReservationItem[]>(
    sampleRecentReservations
  );
  const [allListings] = useState<HostListing[]>(sampleHostListings);
  const [listingFilter, setListingFilter] = useState<
    "all" | "event" | "stay" | "car-park"
  >("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredListings = getFilteredListings(allListings, listingFilter);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real app, would fetch from API
      console.log("Management data refreshed");
    } catch (err) {
      setError("Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateReservationStatus = useCallback(
    async (reservationId: string, status: ReservationItem["status"]) => {
      setIsLoading(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setReservations((prev) =>
          prev.map((reservation) =>
            reservation.id === reservationId
              ? { ...reservation, status }
              : reservation
          )
        );

        console.log(`Reservation ${reservationId} status updated to ${status}`);
      } catch (err) {
        setError("Failed to update reservation status");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const filterListings = useCallback((filter: typeof listingFilter) => {
    setListingFilter(filter);
  }, []);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(refreshData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    stats,
    reservations,
    listings: filteredListings,
    allListings,
    listingFilter,
    isLoading,
    error,
    refreshData,
    updateReservationStatus,
    filterListings,
  };
}
