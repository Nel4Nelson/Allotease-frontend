/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EventService,
  Event,
  GetEventsParams,
} from "@/services/events-service";
import toast from "react-hot-toast";

// Define the response type to match your API
interface GetEventsResponse {
  status: string;
  message: string;
  data: {
    items: Event[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Query keys for events
export const eventsKeys = {
  all: ["events"] as const,
  lists: () => [...eventsKeys.all, "list"] as const,
  list: (params: GetEventsParams) => [...eventsKeys.lists(), params] as const,
};

/**
 * Hook to fetch events with caching and pagination
 */
export function useEvents(params: GetEventsParams = {}) {
  return useQuery<GetEventsResponse>({
    queryKey: eventsKeys.list(params),
    queryFn: () => EventService.getAllEvents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

/**
 * Hook for loading more events (accumulative pagination)
 */
export function useLoadMoreEvents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: GetEventsParams) => {
      const response = await EventService.getAllEvents(params);
      return { response, params };
    },
    onSuccess: ({ response, params }) => {
      // Get the base params (without page) for the first page
      const baseParams = { ...params };
      delete baseParams.page;
      const firstPageParams = { ...baseParams, page: 1 };
      
      // Get current first page data
      const firstPageData = queryClient.getQueryData<GetEventsResponse>(
        eventsKeys.list(firstPageParams)
      );
      
      if (firstPageData && params.page && params.page > 1) {
        // Create combined data for the first page cache
        const combinedData: GetEventsResponse = {
          ...response,
          data: {
            ...response.data,
            items: [...firstPageData.data.items, ...response.data.items],
            page: 1, // Keep as page 1 for UI consistency
          }
        };
        
        // Update the first page cache with accumulated data
        queryClient.setQueryData(eventsKeys.list(firstPageParams), combinedData);
      } else {
        // Set the current page cache
        queryClient.setQueryData(eventsKeys.list(params), response);
      }
    },
    onError: (error: any) => {
      console.error("Failed to load more events:", error);
      
      if (error?.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (error?.response?.status >= 400) {
        toast.error("Failed to load events. Please try again.");
      } else {
        toast.error("Network error. Please check your connection.");
      }
    },
  });
}

/**
 * Hook to invalidate events cache when filters change
 */
export function useInvalidateEvents() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
    invalidateLists: () => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
    },
    invalidateList: (params: GetEventsParams) => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.list(params) });
    },
    removeAll: () => {
      queryClient.removeQueries({ queryKey: eventsKeys.all });
    },
    removeQueries: (predicate?: any) => {
      queryClient.removeQueries({ 
        queryKey: eventsKeys.lists(),
        predicate 
      });
    }
  };
}

/**
 * Hook to get cached events data
 */
export function useCachedEvents(params: GetEventsParams) {
  const queryClient = useQueryClient();
  
  return queryClient.getQueryData<GetEventsResponse>(eventsKeys.list(params));
}

/**
 * Hook for events mutations (future use - create, update, delete)
 */
export function useEventsMutation() {
  const queryClient = useQueryClient();

  return {
    // Future: Add create event mutation
    create: useMutation({
      mutationFn: EventService.createEvent,
      onSuccess: () => {
        // Invalidate all events lists to refetch fresh data
        queryClient.invalidateQueries({ queryKey: eventsKeys.lists() });
        toast.success("Event created successfully!");
      },
      onError: (error: any) => {
        console.error("Failed to create event:", error);
        toast.error("Failed to create event. Please try again.");
      },
    }),
  };
}