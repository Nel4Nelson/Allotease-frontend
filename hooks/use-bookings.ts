/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookingService,
  GetPendingStaysParams,
  GetPendingStaysResponse,
  GetStayUnitsParams,
  GetStayUnitsResponse,
} from "@/services/booking-service";
import { useAuthStore } from "@/stores/auth-store";
import toast from "react-hot-toast";

// Query keys
export const bookingKeys = {
  all: ["bookings"] as const,
  pendingStays: () => [...bookingKeys.all, "pending-stays"] as const,
  pendingStaysList: (params: GetPendingStaysParams) =>
    [...bookingKeys.pendingStays(), params] as const,
  stayUnits: () => [...bookingKeys.all, "stay-units"] as const,
  stayUnitsList: (params: GetStayUnitsParams) =>
    [...bookingKeys.stayUnits(), params] as const,
};

/**
 * Hook to fetch pending stays (awaiting confirmation) with caching
 */
export function usePendingStays(params: GetPendingStaysParams = {}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery<GetPendingStaysResponse>({
    queryKey: bookingKeys.pendingStaysList(params),
    queryFn: () => BookingService.getPendingStays(params),
    enabled: isAuthenticated, // Only fetch if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2,
  });
}

/**
 * Hook to fetch stay units (active/expired bookings) with caching
 */
export function useStayUnits(params: GetStayUnitsParams = {}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery<GetStayUnitsResponse>({
    queryKey: bookingKeys.stayUnitsList(params),
    queryFn: () => BookingService.getStayUnits(params),
    enabled: isAuthenticated, // Only fetch if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2,
  });
}

/**
 * Hook for loading more stay units (accumulative pagination)
 */
export function useLoadMoreStayUnits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: GetStayUnitsParams) => {
      const response = await BookingService.getStayUnits(params);
      return { response, params };
    },
    onSuccess: ({ response, params }) => {
      // Get the base params (without page) for the first page
      const baseParams = { ...params };
      delete baseParams.page;
      const firstPageParams = { ...baseParams, page: 1 };

      // Get current first page data
      const firstPageData = queryClient.getQueryData<GetStayUnitsResponse>(
        bookingKeys.stayUnitsList(firstPageParams)
      );

      if (firstPageData && params.page && params.page > 1) {
        // Create combined data for the first page cache
        const combinedData: GetStayUnitsResponse = {
          ...response,
          data: {
            ...response.data,
            items: [...firstPageData.data.items, ...response.data.items],
            page: 1, // Keep as page 1 for UI consistency
          },
        };

        // Update the first page cache with accumulated data
        queryClient.setQueryData(
          bookingKeys.stayUnitsList(firstPageParams),
          combinedData
        );
      } else {
        // Set the current page cache
        queryClient.setQueryData(bookingKeys.stayUnitsList(params), response);
      }
    },
    onError: (error: any) => {
      console.error("Failed to load more stay units:", error);

      if (error?.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (error?.response?.status >= 400) {
        toast.error("Failed to load stay units. Please try again.");
      } else {
        toast.error("Network error. Please check your connection.");
      }
    },
  });
}

/**
 * Extract error message from API response
 */
function extractErrorMessage(error: any): string {
  // Check if it's a specific error from backend
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Check if it's a validation error with details
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  // Check for status-based errors
  if (error?.response?.status === 400 && error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.status === 401) {
    return "Please log in to confirm stays";
  }

  if (error?.response?.status === 429) {
    return "Too many requests. Please try again later";
  }

  if (error?.response?.status >= 500) {
    return "Server error. Please try again later";
  }

  // Fallback to generic message or error message
  return error?.message || "Failed to confirm stay. Please try again.";
}

/**
 * Hook to confirm a stay with optimistic updates
 */
export function useConfirmStay() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      bookingId,
      confirm = true,
    }: {
      bookingId: string;
      confirm?: boolean;
    }) => {
      if (!isAuthenticated) {
        throw new Error("User must be authenticated");
      }

      return BookingService.confirmStay(bookingId, confirm);
    },
    onMutate: async ({ bookingId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookingKeys.pendingStays() });

      // Snapshot the previous values
      const previousPendingStays = queryClient.getQueriesData({
        queryKey: bookingKeys.pendingStays(),
      });

      // Optimistically remove the stay from pending list
      queryClient.setQueriesData(
        { queryKey: bookingKeys.pendingStays() },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.filter(
                (stay: any) =>
                  stay._id !== bookingId && stay.bookingId !== bookingId
              ),
              totalCount: old.data.totalCount - 1,
            },
          };
        }
      );

      return { previousPendingStays };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPendingStays) {
        context.previousPendingStays.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Extract and show specific error message
      const errorMessage = extractErrorMessage(err);

      // Handle authentication errors differently
      if (
        err.message === "User must be authenticated" ||
        errorMessage.includes("log in")
      ) {
        // This will be handled by the component
        return;
      }

      // Show the extracted error message via toast (will be handled by component)
      console.error("Confirm stay error:", errorMessage);
    },
    onSuccess: () => {
      // Success message will be handled by component
      console.log("Stay confirmed successfully");
    },
    onSettled: () => {
      // Refetch after mutation regardless of error or success
      queryClient.invalidateQueries({ queryKey: bookingKeys.pendingStays() });
    },
  });
}

/**
 * Hook to invalidate stay units cache when filters change
 */
export function useInvalidateStayUnits() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.stayUnits() });
    },
    removeAll: () => {
      queryClient.removeQueries({ queryKey: bookingKeys.stayUnits() });
    },
    removeQueries: (predicate?: any) => {
      queryClient.removeQueries({
        queryKey: bookingKeys.stayUnits(),
        predicate,
      });
    },
  };
}