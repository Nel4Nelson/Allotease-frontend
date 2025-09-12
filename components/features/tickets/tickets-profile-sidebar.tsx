/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProfileHeader } from "@/components/ui/profile-header";
import { FollowingSection } from "@/components/ui/following-section";
import { useProfileStore } from "@/stores/profile-store";
import { useAuthStore } from "@/stores/auth-store";
import { useIsOnline } from "@/hooks/use-network-status";
import { useAllocators, useFollowToggle } from "@/hooks/use-allocators";
import { AllocatorService, Allocator } from "@/services/allocator-service";
import { NetworkError, OfflineState } from "@/components/ui/network-error";
import { toast } from "react-hot-toast";

interface FollowerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  isFollowing: boolean;
}

export function TicketsProfileSidebar() {
  const router = useRouter();
  const isOnline = useIsOnline();
  
  // Profile store with authentication guard
  const {
    profile,
    isLoading: profileLoading,
    error: profileError,
    fetchProfile,
    getFullName,
    getFollowingCount,
    getAvatarUrl,
    getUserId,
  } = useProfileStore();

  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  // State for pagination and accumulated data
  const [currentPage, setCurrentPage] = useState(1);
  const [allAllocators, setAllAllocators] = useState<Allocator[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const loadingMoreRef = useRef(false);

  // Refs for infinite scroll observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Use established TanStack Query hooks
  const { data, isLoading, isError, refetch } = useAllocators({
    page: currentPage,
    limit: 10,
  });

  const followToggleMutation = useFollowToggle();

  // Fetch profile with authentication guard
  useEffect(() => {
    if (isAuthenticated && !profile && !getUserId()) {
      fetchProfile();
    }
  }, [isAuthenticated, profile, getUserId, fetchProfile]);

  // Handle initial load and subsequent loads
  useEffect(() => {
    if (data?.data?.items) {
      if (currentPage === 1) {
        // First page - replace all data
        setAllAllocators(data.data.items);
      } else {
        // Subsequent pages - append new data
        setAllAllocators((prev) => {
          const existingIds = new Set(prev.map((a) => a._id));
          const newItems = data.data.items.filter(
            (item) => !existingIds.has(item._id)
          );
          return [...prev, ...newItems];
        });
      }

      // Update hasMoreData based on API response
      setHasMoreData(data.data.hasNextPage);

      // Reset loading state for pagination
      if (currentPage > 1) {
        setIsLoadingMore(false);
        loadingMoreRef.current = false;
      }
    }
  }, [data, currentPage]);

  // Debug log to check if data is being received
  useEffect(() => {
    console.log('Debug - Current page:', currentPage);
    console.log('Debug - Data received:', data?.data?.items?.length || 0);
    console.log('Debug - Has next page:', data?.data?.hasNextPage);
    console.log('Debug - Total allocators:', allAllocators.length);
  }, [data, currentPage, allAllocators.length]);

  // Refetch when coming back online
  useEffect(() => {
    if (isOnline && isError) {
      refetch();
    }
  }, [isOnline, isError, refetch]);

  // Load more allocators for infinite scroll - FIXED: Stable function with useCallback
  const loadMoreAllocators = useCallback(() => {
    console.log('Debug - loadMoreAllocators called');
    console.log('Debug - loadingMoreRef.current:', loadingMoreRef.current);
    console.log('Debug - isLoadingMore:', isLoadingMore);
    console.log('Debug - hasMoreData:', hasMoreData);
    console.log('Debug - isOnline:', isOnline);
    
    if (loadingMoreRef.current || isLoadingMore || !hasMoreData || !isOnline) {
      console.log('Debug - Early return from loadMoreAllocators');
      return;
    }

    console.log('Debug - Incrementing page from:', currentPage, 'to:', currentPage + 1);
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
  }, [isLoadingMore, hasMoreData, isOnline]); // REMOVED currentPage dependency

  // FIXED: Set up intersection observer with stable dependencies
  useEffect(() => {
    console.log('Debug - Setting up intersection observer');
    
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        console.log('Debug - Intersection observer triggered');
        const [entry] = entries;
        console.log('Debug - Entry isIntersecting:', entry.isIntersecting);
        console.log('Debug - Current hasMoreData:', hasMoreData);
        console.log('Debug - Current isLoadingMore:', isLoadingMore);
        
        if (entry.isIntersecting && hasMoreData && !isLoadingMore && !loadingMoreRef.current) {
          console.log('Debug - Calling loadMoreAllocators from observer');
          loadMoreAllocators();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px', // Increased rootMargin for earlier triggering
      }
    );

    // Observe the trigger element
    if (loadMoreRef.current) {
      console.log('Debug - Observing loadMoreRef element');
      observerRef.current.observe(loadMoreRef.current);
    } else {
      console.log('Debug - loadMoreRef.current is null');
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreAllocators]); // FIXED: Only depend on loadMoreAllocators

  // FIXED: Re-observe when element becomes available
  useEffect(() => {
    if (observerRef.current && loadMoreRef.current && hasMoreData) {
      console.log('Debug - Re-observing loadMoreRef element');
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [allAllocators.length, hasMoreData]); // Re-observe when data changes

  // Handle follow/unfollow with established patterns
  const handleToggleFollow = async (allocatorId: string) => {
    // Check authentication first
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    // Don't allow follow actions when offline
    if (!isOnline) {
      toast.error("You're offline. Please check your connection.");
      return;
    }

    // Prevent self-follow
    const currentUserId = getUserId();
    if (currentUserId === allocatorId) {
      toast.error("You can't follow yourself");
      return;
    }

    // Find the current allocator
    const currentAllocator = allAllocators.find((a) => a._id === allocatorId);
    if (!currentAllocator) return;

    // Update local state optimistically BEFORE the mutation
    setAllAllocators((prev) =>
      prev.map((allocator) =>
        allocator._id === allocatorId
          ? {
              ...allocator,
              isFollowing: !allocator.isFollowing,
              followersCount: allocator.isFollowing
                ? (allocator.followersCount || 0) - 1
                : (allocator.followersCount || 0) + 1,
            }
          : allocator
      )
    );

    try {
      await followToggleMutation.mutateAsync({
        userId: allocatorId,
        isFollowing: currentAllocator.isFollowing || false,
      });
    } catch (error: any) {
      // Revert the optimistic update on error
      setAllAllocators((prev) =>
        prev.map((allocator) =>
          allocator._id === allocatorId
            ? {
                ...allocator,
                isFollowing: currentAllocator.isFollowing,
                followersCount: currentAllocator.followersCount,
              }
            : allocator
        )
      );

      // If it's an auth error, redirect to signin
      if (
        error.message === "User must be authenticated" ||
        error?.response?.status === 401
      ) {
        router.push("/signin");
      }
    }
  };

  // Convert allocators to FollowerProfile format
  const getFollowerProfiles = useCallback((): FollowerProfile[] => {
    return allAllocators.map((allocator) => ({
      id: allocator._id,
      name: AllocatorService.formatAllocatorName(allocator),
      avatarUrl: AllocatorService.getAllocatorAvatar(allocator),
      isFollowing: allocator.isFollowing || false,
    }));
  }, [allAllocators]);

  // Reset states when starting fresh
  const handleReset = () => {
    setCurrentPage(1);
    setAllAllocators([]);
    setIsLoadingMore(false);
    setHasMoreData(true);
    loadingMoreRef.current = false;
  };

  // Loading State for profile
  if (profileLoading && !profile) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse" />
        <div className="w-32 h-6 bg-gray-300 rounded animate-pulse" />
        <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
      </div>
    );
  }

  // Error State for profile
  if (profileError && !profile) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-red-500 text-center">
          <p>Failed to load profile</p>
          <button
            onClick={() => fetchProfile()}
            className="mt-2 px-4 py-2 bg-[var(--feature-accent-orange)] text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Profile not loaded
  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        name={getFullName()}
        avatarUrl={getAvatarUrl()}
        followingCount={getFollowingCount()}
      />

      {/* Following Section with Infinite Scroll */}
      <div>
        {/* Handle offline state */}
        {!isOnline && allAllocators.length === 0 ? (
          <OfflineState />
        ) : /* Handle error state */
        isError && !isLoading && allAllocators.length === 0 ? (
          <NetworkError
            message="Failed to load organizers"
            onRetry={() => {
              handleReset();
              refetch();
            }}
          />
        ) : /* Initial loading state */
        isLoading && allAllocators.length === 0 ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
                </div>
                <div className="h-6 bg-gray-300 rounded w-16 animate-pulse" />
              </div>
            ))}
          </div>
        ) : /* Normal render with data */
        allAllocators.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No organizers found</p>
          </div>
        ) : (
          <>
            <FollowingSection
              followers={getFollowerProfiles()}
              onToggleFollow={handleToggleFollow}
            />
            
            {/* FIXED: Infinite scroll trigger element with better visibility */}
            {hasMoreData && (
              <div 
                ref={loadMoreRef} 
                className="py-8 text-center min-h-[50px] flex items-center justify-center"
                style={{ 
                  // DEBUGGING: Temporary visible styling - remove after testing
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  border: '1px dashed red'
                }}
              >
                {isLoadingMore ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-[var(--feature-accent-orange)] rounded-full animate-spin" />
                    <span className="text-sm text-gray-500">Loading more...</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Scroll for more</span>
                )}
              </div>
            )}

            {/* End of list indicator */}
            {!hasMoreData && allAllocators.length > 0 && (
              <div className="py-4 text-center">
                <span className="text-xs text-gray-400">
                  You've reached the end
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}