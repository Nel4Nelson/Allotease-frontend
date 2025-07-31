/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProfileHeader } from "@/components/ui/profile-header";
import { FollowingSection } from "@/components/ui/following-section";
import { useProfileStore } from "@/stores/profile-store";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/services/api-client";

interface Allocator {
  _id: string;
  firstname: string;
  lastname: string;
  avatar?: string;
  followersCount?: number;
  followingCount?: number;
}

interface AllocatorsResponse {
  status: string;
  message?: string;
  data: {
    items: Allocator[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPages: number;
    totalCount: number;
    limit: number;
    page: number;
  };
}

interface FollowStatusResponse {
  status: string;
  message?: string;
  data: Array<{
    _id: string;
    email: string;
    firstname: string;
    lastname: string;
    followersCount: number;
    avatar?: string;
  }>;
}

interface FollowerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  isFollowing: boolean;
}

export function TicketsProfileSidebar() {
  const router = useRouter();
  const {
    profile,
    isLoading: profileLoading,
    error: profileError,
    fetchProfile,
    getFullName,
    getFollowingCount,
    getAvatarUrl,
  } = useProfileStore();

  const {
    isAuthenticated,
    isLoading: authLoading,
    checkTokenExpiry,
  } = useAuthStore();

  const [allocators, setAllocators] = useState<Allocator[]>([]);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [isLoadingAllocators, setIsLoadingAllocators] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingFollowStatus, setIsLoadingFollowStatus] = useState(true);
  const [allocatorsError, setAllocatorsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  // Ref for infinite scroll observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch allocators with pagination
  const fetchAllocators = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        setIsLoadingAllocators(true);
      } else {
        setIsLoadingMore(true);
      }
      setAllocatorsError(null);

      const response = await apiClient.get<AllocatorsResponse>(
        `/users/allocators/?page=${page}&limit=10`
      );

      if (response.status === "success") {
        const { items, hasNextPage: nextPage, totalPages: total } = response.data;
        
        if (append) {
          setAllocators(prev => [...prev, ...items]);
        } else {
          setAllocators(items);
        }
        
        setHasNextPage(nextPage);
        setTotalPages(total);
        setCurrentPage(page);
      } else {
        setAllocatorsError("Failed to load allocators");
      }
    } catch (error) {
      console.error("Error fetching allocators:", error);
      setAllocatorsError("Failed to load allocators");
    } finally {
      setIsLoadingAllocators(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Load more allocators for infinite scroll
  const loadMoreAllocators = useCallback(() => {
    if (!isLoadingMore && hasNextPage && currentPage < totalPages) {
      fetchAllocators(currentPage + 1, true);
    }
  }, [isLoadingMore, hasNextPage, currentPage, totalPages, fetchAllocators]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isLoadingMore) {
          loadMoreAllocators();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isLoadingMore, loadMoreAllocators]);

  // Check follow status for authenticated users
  const checkFollowStatus = useCallback(async () => {
    // Only call if user is authenticated
    if (!isAuthenticated) {
      setFollowedUsers(new Set()); // Clear followed users for unauthenticated
      setIsLoadingFollowStatus(false);
      return;
    }

    if (!checkTokenExpiry()) {
      setFollowedUsers(new Set());
      setIsLoadingFollowStatus(false);
      return;
    }

    try {
      setIsLoadingFollowStatus(true);

      const response = await apiClient.get<FollowStatusResponse>("/users/follow/");

      if (response.status === "success" && Array.isArray(response.data)) {
        // Extract _id from each followed user and create a Set for O(1) lookup
        const followedIds = new Set(response.data.map(user => user._id));
        setFollowedUsers(followedIds);
        
        console.log("Following status loaded:", {
          followedCount: response.data.length,
          followedUsers: response.data.map(u => `${u.firstname} ${u.lastname}`)
        });
      } else {
        console.error("Unexpected follow status response:", response);
        setFollowedUsers(new Set());
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
      setFollowedUsers(new Set());
    } finally {
      setIsLoadingFollowStatus(false);
    }
  }, [isAuthenticated, checkTokenExpiry]);

  // Handle follow/unfollow functionality
  const handleToggleFollow = async (userId: string) => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    if (!checkTokenExpiry()) {
      router.push("/signin");
      return;
    }

    const isCurrentlyFollowing = followedUsers.has(userId);

    try {
      if (isCurrentlyFollowing) {
        // Unfollow user
        await apiClient.delete(`/users/follow/${userId}`);
        
        // Update local state
        setFollowedUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });

        // Update allocator's follower count
        setAllocators(prev => prev.map(allocator => 
          allocator._id === userId 
            ? { 
                ...allocator, 
                followersCount: Math.max(0, (allocator.followersCount || 0) - 1)
              }
            : allocator
        ));
      } else {
        // Follow user
        await apiClient.post(`/users/follow/${userId}`);
        
        // Update local state
        setFollowedUsers(prev => new Set([...prev, userId]));

        // Update allocator's follower count
        setAllocators(prev => prev.map(allocator => 
          allocator._id === userId 
            ? { 
                ...allocator, 
                followersCount: (allocator.followersCount || 0) + 1
              }
            : allocator
        ));
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      // Optionally show error toast here
    }
  };

  // Convert allocators to FollowerProfile format
  const getFollowerProfiles = (): FollowerProfile[] => {
    return allocators.map(allocator => ({
      id: allocator._id,
      name: `${allocator.firstname} ${allocator.lastname}`.trim(),
      avatarUrl: allocator.avatar || "/icons/encircle-star-green-avatar.svg",
      isFollowing: followedUsers.has(allocator._id)
    }));
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!authLoading) {
      fetchAllocators(1, false); // Start with page 1
      
      // Only check follow status if authenticated
      if (isAuthenticated) {
        checkFollowStatus();
      } else {
        // Clear follow status for unauthenticated users
        setFollowedUsers(new Set());
        setIsLoadingFollowStatus(false);
      }
    }
  }, [isAuthenticated, authLoading, fetchAllocators, checkFollowStatus]);

  // Loading State
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
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
        {/* Initial loading state */}
        {isLoadingAllocators && allocators.length === 0 ? (
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
        ) : allocatorsError ? (
          <div className="text-red-500 text-center p-4">
            <p>Failed to load organizers</p>
            <button
              onClick={() => fetchAllocators(1, false)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <FollowingSection
              followers={getFollowerProfiles()}
              onToggleFollow={handleToggleFollow}
            />
            
            {/* Infinite scroll trigger element */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="py-4 text-center">
                {isLoadingMore ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    <span className="text-sm text-gray-500">Loading more...</span>
                  </div>
                ) : (
                  <div className="h-4" /> // Invisible trigger area
                )}
              </div>
            )}

            {/* End of list indicator */}
            {!hasNextPage && allocators.length > 0 && (
              <div className="py-2 text-center">
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