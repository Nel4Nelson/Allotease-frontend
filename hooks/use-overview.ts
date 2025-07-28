// hooks/useOverview.ts
import { useEffect, useState } from "react";
import {
  ManagementStats,
  StayReservationsResponse,
  EventReservationsResponse,
} from "@/types";
import { OverviewService } from "@/services/overview-service";

// 🔹 Hook to fetch Stay Statistics
export function useStayStats() {
  const [data, setData] = useState<ManagementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    OverviewService.getStayStats()
      .then((res) => {
        console.log("Stay Stats: from hook", res.data);
        // Make sure res.data is properly structured
        if (res.data && typeof res.data === "object") {
          setData(res.data);
        } else {
          setData(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stay stats:", err);
        setError(err);
        setData(null);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

// 🔹 Hook to fetch Event Statistics
export function useEventStats() {
  const [data, setData] = useState<ManagementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    OverviewService.getEventStats()
      .then((res) => {
        console.log("Event Stats: from hook", res.data);
        if (res.data && typeof res.data === "object") {
          setData(res.data);
        } else {
          setData(null);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Error fetching event stats:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setLoading(false);
      });      
  }, []);

  return { data, loading, error };
}

// 🔹 Hook to fetch recent Stay Reservations (paginated)
export function useRecentStaysReservations(page = 1, limit = 50) {
  const [data, setData] = useState<StayReservationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    OverviewService.getRecentStaysReservations(page, limit)
      .then((res) => {
        setData(res.data || null); // Handle undefined case
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [page, limit]);

  return { data, loading, error };
}

// 🔹 Hook to fetch recent Event Reservations (no pagination)
export function useRecentEventsReservations() {
  const [data, setData] = useState<EventReservationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    OverviewService.getRecentEventsReservations()
      .then((res) => {
        setData(res.data || null); // Handle undefined case
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
