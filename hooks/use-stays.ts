/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  StaysService,
  Stay,
  GetStaysParams,
} from "@/services/stays-service";
import toast from "react-hot-toast";

interface GetStaysResponse {
  status: string;
  message: string;
  data: {
    items: Stay[];
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Query keys for stays
export const staysKeys = {
  all: ["stays"] as const,
  lists: () => [...staysKeys.all, "list"] as const,
  list: (params: GetStaysParams) => [...staysKeys.lists(), params] as const,
};

/**
 * Hook to fetch stays with caching and pagination
 */
export function useStays(params: GetStaysParams = {}) {
  return useQuery<GetStaysResponse>({
    queryKey: staysKeys.list(params),
    queryFn: () => StaysService.getAllStays(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

/**
 * Hook for loading more stays (accumulative pagination)
 */
export function useLoadMoreStays() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: GetStaysParams) => {
      const response = await StaysService.getAllStays(params);
      return { response, params };
    },
    onSuccess: ({ response, params }) => {
      // Get the base params (without page) for the first page
      const baseParams = { ...params };
      delete baseParams.page;
      const firstPageParams = { ...baseParams, page: 1 };
      
      // Get current first page data
      const firstPageData = queryClient.getQueryData<GetStaysResponse>(
        staysKeys.list(firstPageParams)
      );
      
      if (firstPageData && params.page && params.page > 1) {
        // Create combined data for the first page cache
        const combinedData: GetStaysResponse = {
          ...response,
          data: {
            ...response.data,
            items: [...firstPageData.data.items, ...response.data.items],
            page: 1, // Keep as page 1 for UI consistency
          }
        };
        
        // Update the first page cache with accumulated data
        queryClient.setQueryData(staysKeys.list(firstPageParams), combinedData);
      } else {
        // Set the current page cache
        queryClient.setQueryData(staysKeys.list(params), response);
      }
    },
    onError: (error: any) => {
      console.error("Failed to load more stays:", error);
      
      if (error?.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (error?.response?.status >= 400) {
        toast.error("Failed to load accommodations. Please try again.");
      } else {
        toast.error("Network error. Please check your connection.");
      }
    },
  });
}

/**
 * Hook to invalidate stays cache when filters change
 */
export function useInvalidateStays() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: staysKeys.all });
    },
    invalidateLists: () => {
      queryClient.invalidateQueries({ queryKey: staysKeys.lists() });
    },
    invalidateList: (params: GetStaysParams) => {
      queryClient.invalidateQueries({ queryKey: staysKeys.list(params) });
    },
    removeAll: () => {
      queryClient.removeQueries({ queryKey: staysKeys.all });
    },
    removeQueries: (predicate?: any) => {
      queryClient.removeQueries({ 
        queryKey: staysKeys.lists(),
        predicate 
      });
    }
  };
}

/**
 * Hook to get cached stays data
 */
export function useCachedStays(params: GetStaysParams) {
  const queryClient = useQueryClient();
  
  return queryClient.getQueryData<GetStaysResponse>(staysKeys.list(params));
}