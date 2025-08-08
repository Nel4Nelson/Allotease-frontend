/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AllocatorService,
  Allocator,
  GetAllocatorsParams,
  GetAllocatorsResponse,
} from "@/services/allocator-service";
import { useAuthStore } from "@/stores/auth-store";
import toast from "react-hot-toast";

// Query keys
export const allocatorKeys = {
  all: ["allocators"] as const,
  lists: () => [...allocatorKeys.all, "list"] as const,
  list: (params: GetAllocatorsParams) =>
    [...allocatorKeys.lists(), params] as const,
  followed: () => [...allocatorKeys.all, "followed"] as const,
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
 * Hook to fetch followed users
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
 * Hook to follow/unfollow users with optimistic updates
 */
export function useFollowToggle() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

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

      // Optimistically update allocators
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

      // Optimistically update followed users list
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

      return { previousAllocators, previousFollowed };
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

      // Show error message
      if (err.message === "User must be authenticated") {
        // This will be handled by the component to show auth modal
        return;
      }

      toast.error("Failed to update follow status. Please try again.");
    },
    onSuccess: (data, { isFollowing }) => {
      const action = isFollowing ? "unfollowed" : "followed";
      toast.success(`Successfully ${action}!`);
    },
    onSettled: () => {
      // Refetch after mutation regardless of error or success
      queryClient.invalidateQueries({ queryKey: allocatorKeys.followed() });
      // Optionally invalidate allocators to ensure consistency
      // queryClient.invalidateQueries({ queryKey: allocatorKeys.lists() });
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
