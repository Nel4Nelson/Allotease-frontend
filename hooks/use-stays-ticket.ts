/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  StaysTicketService,
  GetPendingStaysParams,
  GetStaysParams,
  ConfirmBookingPayload,
  PendingStayBooking,
} from "@/services/stays-ticket-service";

// Query Keys
export const STAYS_QUERY_KEYS = {
  all: ["stays"] as const,
  pending: (params?: GetPendingStaysParams) =>
    ["stays", "pending", params] as const,
  active: (params?: GetStaysParams) => ["stays", "active", params] as const,
  past: (params?: GetStaysParams) => ["stays", "past", params] as const,
  completed: (params?: GetStaysParams) => ["stays", "completed", params] as const,
} as const;

/**
 * Hook for fetching pending stays
 */
export function usePendingStays(params: GetPendingStaysParams = {}) {
  return useQuery({
    queryKey: STAYS_QUERY_KEYS.pending(params),
    queryFn: () => StaysTicketService.getPendingStays(params),
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching active stays
 */
export function useActiveStays(params: GetStaysParams = {}) {
  const activeParams = { ...params, status: "active" as const };

  return useQuery({
    queryKey: STAYS_QUERY_KEYS.active(activeParams),
    queryFn: () => StaysTicketService.getStayBookings(activeParams),
    staleTime: 30000,
    gcTime: 300000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching past/expired stays - Use "expired" for API call but handle "completed" in response
 */
export function usePastStays(params: GetStaysParams = {}) {
  const pastParams = { ...params, status: "expired" as const }; // Use "expired" for API parameter

  return useQuery({
    queryKey: STAYS_QUERY_KEYS.past(pastParams),
    queryFn: () => StaysTicketService.getStayBookings(pastParams),
    staleTime: 60000, // Past stays change less frequently
    gcTime: 600000, // Keep in cache for 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for confirming or requesting refund for pending stays
 */
export function useConfirmBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ConfirmBookingPayload) =>
      StaysTicketService.confirmBooking(payload),

    onMutate: async (payload) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: STAYS_QUERY_KEYS.pending() });

      // Snapshot the previous value for rollback
      const previousPendingStays = queryClient.getQueryData(
        STAYS_QUERY_KEYS.pending()
      );

      // Optimistically update pending stays (remove the confirmed/refunded stay)
      queryClient.setQueriesData(
        { queryKey: STAYS_QUERY_KEYS.pending() },
        (old: any) => {
          if (!old?.data?.items) return old;

          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.filter(
                (stay: PendingStayBooking) =>
                  stay.bookingId !== payload.bookingId
              ),
              totalCount: Math.max(0, old.data.totalCount - 1),
            },
          };
        }
      );

      return { previousPendingStays };
    },

    onSuccess: (data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: STAYS_QUERY_KEYS.pending() });

      if (variables.confirm) {
        // If confirmed, also invalidate active stays to show the new booking
        queryClient.invalidateQueries({ queryKey: STAYS_QUERY_KEYS.active() });
        toast.success("Stay confirmed successfully!");
      } else {
        toast.success("Refund request submitted successfully!");
      }
    },

    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousPendingStays) {
        queryClient.setQueryData(
          STAYS_QUERY_KEYS.pending(),
          context.previousPendingStays
        );
      }

      console.error("Failed to process booking:", error);

      const errorMessage = variables.confirm
        ? "Failed to confirm stay. Please try again."
        : "Failed to request refund. Please try again.";

      toast.error(errorMessage);
    },

    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({ queryKey: STAYS_QUERY_KEYS.pending() });
    },
  });
}

/**
 * Hook for invalidating all stays queries (useful for global refresh)
 */
export function useInvalidateStaysQueries() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: STAYS_QUERY_KEYS.all });
    },
    invalidatePending: () => {
      queryClient.invalidateQueries({ queryKey: STAYS_QUERY_KEYS.pending() });
    },
    invalidateActive: () => {
      queryClient.invalidateQueries({ queryKey: STAYS_QUERY_KEYS.active() });
    },
    invalidatePast: () => {
      queryClient.invalidateQueries({ queryKey: STAYS_QUERY_KEYS.past() });
    },
  };
}

/**
 * Hook for prefetching stays data (useful for preloading)
 */
export function usePrefetchStays() {
  const queryClient = useQueryClient();

  return {
    prefetchPending: (params: GetPendingStaysParams = {}) => {
      queryClient.prefetchQuery({
        queryKey: STAYS_QUERY_KEYS.pending(params),
        queryFn: () => StaysTicketService.getPendingStays(params),
        staleTime: 30000,
      });
    },

    prefetchActive: (params: GetStaysParams = {}) => {
      const activeParams = { ...params, status: "active" as const };
      queryClient.prefetchQuery({
        queryKey: STAYS_QUERY_KEYS.active(activeParams),
        queryFn: () => StaysTicketService.getStayBookings(activeParams),
        staleTime: 30000,
      });
    },

    prefetchPast: (params: GetStaysParams = {}) => {
      const pastParams = { ...params, status: "expired" as const };
      queryClient.prefetchQuery({
        queryKey: STAYS_QUERY_KEYS.past(pastParams),
        queryFn: () => StaysTicketService.getStayBookings(pastParams),
        staleTime: 60000,
      });
    },
  };
}

/**
 * Hook that provides transformed pending stays data ready for UI
 */
export function useTransformedPendingStays(params: GetPendingStaysParams = {}) {
  const query = usePendingStays(params);

  const transformedData =
    query.data?.data.items.map((stay) =>
      StaysTicketService.transformPendingStay(stay)
    ) || [];

  return {
    ...query,
    data: query.data
      ? {
          ...query.data,
          transformedItems: transformedData,
        }
      : undefined,
    transformedStays: transformedData,
  };
}

/**
 * Hook for getting stays statistics
 */
export function useStaysStats() {
  const pendingQuery = usePendingStays();
  const activeQuery = useActiveStays();
  const pastQuery = usePastStays();

  const stats = {
    pending: pendingQuery.data?.data.totalCount || 0,
    active: activeQuery.data?.data.totalCount || 0,
    past: pastQuery.data?.data.totalCount || 0,
    total:
      (pendingQuery.data?.data.totalCount || 0) +
      (activeQuery.data?.data.totalCount || 0) +
      (pastQuery.data?.data.totalCount || 0),
    isLoading:
      pendingQuery.isLoading || activeQuery.isLoading || pastQuery.isLoading,
    hasError: pendingQuery.error || activeQuery.error || pastQuery.error,
  };

  return stats;
}