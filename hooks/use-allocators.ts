/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AllocatorService,
  Allocator,
  GetAllocatorsParams,
  GetAllocatorsResponse,
} from "@/services/allocator-service";
import { useAuthStore } from "@/stores/auth-store";
import { useProfileStore } from "@/stores/profile-store";
import toast from "react-hot-toast";

// Query keys
export const allocatorKeys = {
  all: ["allocators"] as const,
  lists: () => [...allocatorKeys.all, "list"] as const,
  list: (params: GetAllocatorsParams) =>
    [...allocatorKeys.lists(), params] as const,
  followed: () => [...allocatorKeys.all, "followed"] as const,
  followedPaginated: () => [...allocatorKeys.all, "followed-paginated"] as const,
  followedPaginatedList: (params: GetAllocatorsParams) =>
    [...allocatorKeys.followedPaginated(), params] as const,
};

/**
 * Hook to fetch allocators with caching
 */
export function useAllocators(params: GetAllocatorsParams = {}) {
  return useQuery<GetAllocatorsResponse>({
    queryKey: allocatorKeys.list(params),
    queryFn: () => AllocatorService.getAllocators(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

/**
 * Hook to fetch followed users (simple ID list)
 */
export function useFollowedUsers() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: allocatorKeys.followed(),
    queryFn: () => AllocatorService.getFollowedUsers(),
    enabled: isAuthenticated, // Only fetch if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
}

/**
 * Hook to fetch followed users with pagination (for TicketsProfileSidebar)
 */
export function useFollowedUsersWithPagination(params: GetAllocatorsParams = {}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery<GetAllocatorsResponse>({
    queryKey: allocatorKeys.followedPaginatedList(params),
    queryFn: () => AllocatorService.getFollowedUsersWithPagination(params),
    enabled: isAuthenticated, // Only fetch if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2,
  });
}

/**
 * Extract error message from API response
 */
function extractErrorMessage(error: any): string {
  // Check if it's the specific self-follow error from backend
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
    return "Please log in to follow users";
  }
  
  if (error?.response?.status === 429) {
    return "Too many requests. Please try again later";
  }
  
  if (error?.response?.status >= 500) {
    return "Server error. Please try again later";
  }
  
  // Fallback to generic message or error message
  return error?.message || "Failed to update follow status. Please try again.";
}

/**
 * Hook to follow/unfollow users with optimistic updates and improved error handling
 * Now also updates the followed users paginated cache
 */
export function useFollowToggle() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { getUserId } = useProfileStore();

  return useMutation({
    mutationFn: async ({
      userId,
      isFollowing,
    }: {
      userId: string;
      isFollowing: boolean;
    }) => {
      if (!isAuthenticated) {
        throw new Error("User must be authenticated");
      }
      
      // Prevent self-follow on the frontend as an extra safety check
      const currentUserId = getUserId();
      if (currentUserId === userId) {
        throw new Error("You cannot follow yourself");
      }
      
      return AllocatorService.toggleFollowUser(userId, isFollowing);
    },
    onMutate: async ({ userId, isFollowing }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: allocatorKeys.all });

      // Snapshot the previous values
      const previousAllocators = queryClient.getQueriesData({
        queryKey: allocatorKeys.lists(),
      });
      const previousFollowed = queryClient.getQueryData(
        allocatorKeys.followed()
      );
      const previousFollowedPaginated = queryClient.getQueriesData({
        queryKey: allocatorKeys.followedPaginated(),
      });

      // Optimistically update allocators (all pages)
      queryClient.setQueriesData(
        { queryKey: allocatorKeys.lists() },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((allocator: Allocator) =>
                allocator._id === userId
                  ? {
                      ...allocator,
                      isFollowing: !isFollowing,
                      followersCount: isFollowing
                        ? allocator.followersCount - 1
                        : allocator.followersCount + 1,
                    }
                  : allocator
              ),
            },
          };
        }
      );

      // Optimistically update followed users list (simple ID array)
      queryClient.setQueryData(
        allocatorKeys.followed(),
        (old: string[] = []) => {
          if (isFollowing) {
            // Remove from followed list
            return old.filter((id) => id !== userId);
          } else {
            // Add to followed list
            return [...old, userId];
          }
        }
      );

      // Optimistically update followed users paginated list
      queryClient.setQueriesData(
        { queryKey: allocatorKeys.followedPaginated() },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((allocator: Allocator) =>
                allocator._id === userId
                  ? {
                      ...allocator,
                      isFollowing: !isFollowing,
                      followersCount: isFollowing
                        ? allocator.followersCount - 1
                        : allocator.followersCount + 1,
                    }
                  : allocator
              ),
            },
          };
        }
      );

      return { previousAllocators, previousFollowed, previousFollowedPaginated };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousAllocators) {
        context.previousAllocators.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousFollowed) {
        queryClient.setQueryData(
          allocatorKeys.followed(),
          context.previousFollowed
        );
      }
      if (context?.previousFollowedPaginated) {
        context.previousFollowedPaginated.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Extract and show specific error message
      const errorMessage = extractErrorMessage(err);
      
      // Handle authentication errors differently
      if (err.message === "User must be authenticated" || errorMessage.includes("log in")) {
        // This will be handled by the component to show auth modal
        return;
      }

      // Show the extracted error message
      toast.error(errorMessage);
    },
    onSuccess: (data, { isFollowing }) => {
      const action = isFollowing ? "unfollowed" : "followed";
      toast.success(`Successfully ${action}!`);
    },
    onSettled: () => {
      // Refetch after mutation regardless of error or success
      queryClient.invalidateQueries({ queryKey: allocatorKeys.followed() });
      queryClient.invalidateQueries({ queryKey: allocatorKeys.followedPaginated() });
    },
  });
}

/**
 * Hook to refresh follow status for current allocators
 */
export function useRefreshFollowStatus() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async (allocators: Allocator[]) => {
      if (!isAuthenticated) {
        return allocators.map((a) => ({ ...a, isFollowing: false }));
      }
      return AllocatorService.updateAllocatorsFollowStatus(allocators);
    },
    onSuccess: (updatedAllocators) => {
      // Update cache with refreshed data
      queryClient.setQueriesData(
        { queryKey: allocatorKeys.lists() },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            data: {
              ...old.data,
              items: updatedAllocators,
            },
          };
        }
      );
    },
  });
}