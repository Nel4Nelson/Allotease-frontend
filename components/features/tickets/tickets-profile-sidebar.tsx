/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProfileHeader } from "@/components/ui/profile-header";
import { FollowingSection } from "@/components/ui/following-section";
import { useProfileStore } from "@/stores/profile-store";
import { useAuthStore } from "@/stores/auth-store";
import { useIsOnline } from "@/hooks/use-network-status";
import { useFollowedUsersWithPagination, useFollowToggle } from "@/hooks/use-allocators";
import { AllocatorService, Allocator } from "@/services/allocator-service";
import { NetworkError, OfflineState } from "@/components/ui/network-error";
import { AuthModal } from "@/components/ui/modals/auth-modal";
import { toast } from "react-hot-toast";

interface FollowerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  isFollowing: boolean;
}

// Interface for cached unfollowed users
interface CachedUnfollowedUser {
  userId: string;
  unfollowedAt: number; // timestamp
  allocatorData: Allocator;
}

// Cache duration: 4 hours in milliseconds
const UNFOLLOW_CACHE_DURATION = 4 * 60 * 60 * 1000;

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
  const [showAuthModal, setShowAuthModal] = useState(false);

  // State for cached unfollowed users (stored in localStorage)
  const [cachedUnfollowedUsers, setCachedUnfollowedUsers] = useState<CachedUnfollowedUser[]>([]);

  // Refs for infinite scroll observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Use paginated followed users hook
  const { data, isLoading, isError, refetch } = useFollowedUsersWithPagination({
    page: currentPage,
    limit: 10,
  });

  const followToggleMutation = useFollowToggle();

  // Load cached unfollowed users from localStorage on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    try {
      const cached = localStorage.getItem("unfollowedUsersCache");
      if (cached) {
        const parsedCache: CachedUnfollowedUser[] = JSON.parse(cached);
        const now = Date.now();

        // Filter out expired cache entries (older than 4 hours)
        const validCache = parsedCache.filter(
          (item) => now - item.unfollowedAt < UNFOLLOW_CACHE_DURATION
        );

        setCachedUnfollowedUsers(validCache);

        // Update localStorage with cleaned cache
        if (validCache.length !== parsedCache.length) {
          localStorage.setItem("unfollowedUsersCache", JSON.stringify(validCache));
        }
      }
    } catch (error) {
      console.error("Failed to load unfollow cache:", error);
    }
  }, [isAuthenticated]);

  // Save cached unfollowed users to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated) return;

    try {
      localStorage.setItem("unfollowedUsersCache", JSON.stringify(cachedUnfollowedUsers));
    } catch (error) {
      console.error("Failed to save unfollow cache:", error);
    }
  }, [cachedUnfollowedUsers, isAuthenticated]);

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

  // Refetch when coming back online
  useEffect(() => {
    if (isOnline && isError) {
      refetch();
    }
  }, [isOnline, isError, refetch]);

  // Load more allocators for infinite scroll
  const loadMoreAllocators = useCallback(() => {
    if (loadingMoreRef.current || isLoadingMore || !hasMoreData || !isOnline) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
  }, [isLoadingMore, hasMoreData, isOnline]);

  // Set up intersection observer with stable dependencies
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreData && !isLoadingMore && !loadingMoreRef.current) {
          loadMoreAllocators();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    // Observe the trigger element
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreAllocators]);

  // Re-observe when element becomes available
  useEffect(() => {
    if (observerRef.current && loadMoreRef.current && hasMoreData) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [allAllocators.length, hasMoreData]);

  // Handle follow/unfollow with 4-hour cache for unfollowed users
  const handleToggleFollow = async (allocatorId: string) => {
    // Check authentication first
    if (!isAuthenticated) {
      setShowAuthModal(true);
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

    // Find the current allocator (check both API data and cached unfollowed)
    let currentAllocator = allAllocators.find((a) => a._id === allocatorId);
    
    if (!currentAllocator) {
      // Check cached unfollowed users
      const cachedUser = cachedUnfollowedUsers.find((c) => c.userId === allocatorId);
      if (cachedUser) {
        currentAllocator = cachedUser.allocatorData;
      }
    }

    if (!currentAllocator) return;

    const wasFollowing = currentAllocator.isFollowing || false;

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

    // Handle caching for unfollowed users
    if (wasFollowing) {
      // User is unfollowing - add to cache
      const newCachedUser: CachedUnfollowedUser = {
        userId: allocatorId,
        unfollowedAt: Date.now(),
        allocatorData: {
          ...currentAllocator,
          isFollowing: false,
          followersCount: currentAllocator.followersCount - 1,
        },
      };

      setCachedUnfollowedUsers((prev) => {
        // Remove any existing cache entry for this user
        const filtered = prev.filter((c) => c.userId !== allocatorId);
        return [...filtered, newCachedUser];
      });
    } else {
      // User is re-following - remove from cache
      setCachedUnfollowedUsers((prev) =>
        prev.filter((c) => c.userId !== allocatorId)
      );
    }

    try {
      await followToggleMutation.mutateAsync({
        userId: allocatorId,
        isFollowing: wasFollowing,
      });
    } catch (error: any) {
      // Revert the optimistic update on error
      setAllAllocators((prev) =>
        prev.map((allocator) =>
          allocator._id === allocatorId
            ? {
                ...allocator,
                isFollowing: currentAllocator!.isFollowing,
                followersCount: currentAllocator!.followersCount,
              }
            : allocator
        )
      );

      // Revert cache changes
      if (wasFollowing) {
        setCachedUnfollowedUsers((prev) =>
          prev.filter((c) => c.userId !== allocatorId)
        );
      }

      // If it's an auth error, show the modal
      if (
        error.message === "User must be authenticated" ||
        error?.response?.status === 401
      ) {
        setShowAuthModal(true);
      }
    }
  };

  // Handle card click - navigate to allocator details page
  const handleCardClick = (allocatorId: string) => {
    router.push(`/all-allocation-admins/${allocatorId}`);
  };

  // Merge API followed users with cached unfollowed users
  const getMergedAllocators = useCallback((): Allocator[] => {
    const now = Date.now();
    
    // Get valid cached unfollowed users (not expired)
    const validCachedUsers = cachedUnfollowedUsers
      .filter((cached) => now - cached.unfollowedAt < UNFOLLOW_CACHE_DURATION)
      .map((cached) => cached.allocatorData);

    // Merge: API followed users + cached unfollowed users
    const apiUserIds = new Set(allAllocators.map((a) => a._id));
    const cachedNotInApi = validCachedUsers.filter((cached) => !apiUserIds.has(cached._id));

    return [...allAllocators, ...cachedNotInApi];
  }, [allAllocators, cachedUnfollowedUsers]);

  // Convert allocators to FollowerProfile format
  const getFollowerProfiles = useCallback((): FollowerProfile[] => {
    const merged = getMergedAllocators();
    
    return merged.map((allocator) => ({
      id: allocator._id,
      name: AllocatorService.formatAllocatorName(allocator),
      avatarUrl: AllocatorService.getAllocatorAvatar(allocator),
      isFollowing: allocator.isFollowing || false,
    }));
  }, [getMergedAllocators]);

  // Reset states when starting fresh
  const handleReset = () => {
    setCurrentPage(1);
    setAllAllocators([]);
    setIsLoadingMore(false);
    setHasMoreData(true);
    loadingMoreRef.current = false;
  };

  // Handle unauthenticated state
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="space-y-6">
        {/* Profile Header Placeholder */}
        <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-2xl">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Sign in to Follow
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Sign in to see allocation admins you're following
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-2 bg-[var(--feature-accent-orange)] hover:bg-[#E54A00] text-white rounded-full font-semibold transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          redirectUrl={typeof window !== "undefined" ? window.location.pathname : "/"}
        />
      </div>
    );
  }

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
            message="Failed to load followed users"
            onRetry={() => {
              handleReset();
              refetch();
            }}
          />
        ) : /* Initial loading state */
        isLoading && allAllocators.length === 0 && cachedUnfollowedUsers.length === 0 ? (
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
        ) : /* Empty state - not following anyone */
        getMergedAllocators().length === 0 ? (
          <div className="flex flex-col items-center gap-4 p-8 bg-gray-50 rounded-2xl text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                No Followed Admins Yet
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Start following allocation admins to see them here
              </p>
              <button
                onClick={() => router.push("/all-allocation-admins")}
                className="px-6 py-2 bg-[var(--feature-accent-orange)] hover:bg-[#E54A00] text-white rounded-full font-semibold transition-colors"
              >
                Browse Admins
              </button>
            </div>
          </div>
        ) : (
          <>
            <FollowingSection
              followers={getFollowerProfiles()}
              onToggleFollow={handleToggleFollow}
              onCardClick={handleCardClick}
            />
            
            {/* Infinite scroll trigger element */}
            {hasMoreData && (
              <div 
                ref={loadMoreRef} 
                className="py-8 text-center min-h-[50px] flex items-center justify-center"
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
            {!hasMoreData && getMergedAllocators().length > 0 && (
              <div className="py-4 text-center">
                <span className="text-xs text-gray-400">
                  You've reached the end
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectUrl={typeof window !== "undefined" ? window.location.pathname : "/"}
      />
    </div>
  );
}