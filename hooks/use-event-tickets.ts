/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EventTicketService,
  GetEventTicketsParams,
  EventTicketWithDetails,
} from "@/services/event-ticket-service";
import { useAuthStore } from "@/stores/auth-store";
import toast from "react-hot-toast";

// Query keys
export const eventTicketKeys = {
  all: ["event-tickets"] as const,
  lists: () => [...eventTicketKeys.all, "list"] as const,
  list: (params: GetEventTicketsParams) =>
    [...eventTicketKeys.lists(), params] as const,
};

/**
 * Hook to fetch event tickets with full details
 */
export function useEventTickets(params: GetEventTicketsParams = {}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery<EventTicketWithDetails[]>({
    queryKey: eventTicketKeys.list(params),
    queryFn: () => EventTicketService.getEventTicketsWithDetails(params),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

/**
 * Hook for loading more event tickets (accumulative pagination)
 */
export function useLoadMoreEventTickets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: GetEventTicketsParams) => {
      const response = await EventTicketService.getEventTicketsWithDetails(
        params
      );
      return { response, params };
    },
    onSuccess: ({ response, params }) => {
      // Get the base params (without page) for the first page
      const baseParams = { ...params };
      delete baseParams.page;
      const firstPageParams = { ...baseParams, page: 1 };

      // Get current first page data
      const firstPageData = queryClient.getQueryData<EventTicketWithDetails[]>(
        eventTicketKeys.list(firstPageParams)
      );

      if (firstPageData && params.page && params.page > 1) {
        // Create combined data for the first page cache
        const combinedData = [...firstPageData, ...response];

        // Update the first page cache with accumulated data
        queryClient.setQueryData(
          eventTicketKeys.list(firstPageParams),
          combinedData
        );
      } else {
        // Set the current page cache
        queryClient.setQueryData(eventTicketKeys.list(params), response);
      }
    },
    onError: (error: any) => {
      console.error("Failed to load more event tickets:", error);

      if (error?.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (error?.response?.status >= 400) {
        toast.error("Failed to load event tickets. Please try again.");
      } else {
        toast.error("Network error. Please check your connection.");
      }
    },
  });
}

/**
 * Hook to invalidate event tickets cache
 */
export function useInvalidateEventTickets() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: eventTicketKeys.all });
    },
    removeAll: () => {
      queryClient.removeQueries({ queryKey: eventTicketKeys.all });
    },
    removeQueries: (predicate?: any) => {
      queryClient.removeQueries({
        queryKey: eventTicketKeys.lists(),
        predicate,
      });
    },
  };
}