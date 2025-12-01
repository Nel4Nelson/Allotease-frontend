/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AllocationAdminGridSkeleton } from "@/components/ui/loading-skeletons/allocation-admin-skeleton";
import { Button } from "@/components/ui/button";
import { AllocatorService, Allocator } from "@/services/allocator-service";
import {
  NetworkError,
  EmptyState,
  OfflineState,
} from "@/components/ui/network-error";
import { useIsOnline } from "@/hooks/use-network-status";
import {
  useAllocators,
  allocatorKeys,
  useFollowToggle,
} from "@/hooks/use-allocators";
import { useAuthStore } from "@/stores/auth-store";
import { useSearchStore } from "@/stores/search-store";
import { buildSearchParams } from "@/lib/search-helper";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AllocationAdminCard } from "@/components/ui/allocation-admin-card";

export function AllAllocationAdminsContent() {
  const router = useRouter();
  const isOnline = useIsOnline();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedAllocators, setAccumulatedAllocators] = useState<Allocator[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Get search state from store
  const { searchQuery, setActiveContext, clearSearch } = useSearchStore();

  // Register as active context and cleanup on unmount
  useEffect(() => {
    setActiveContext("allocators");
    return () => {
      setActiveContext(null);
      clearSearch();
    };
  }, [setActiveContext, clearSearch]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    if (searchQuery !== undefined) {
      setCurrentPage(1);
      setAccumulatedAllocators([]);
    }
  }, [searchQuery]);

  // Build query params with search
  const baseQueryParams = {
    page: 1,
    limit: 12,
  };

  const queryParams = buildSearchParams(baseQueryParams, searchQuery, "allocators");

  const { data, isLoading, isError, isFetched, refetch } =
    useAllocators(queryParams);

  // Follow toggle mutation
  const followToggleMutation = useFollowToggle();

  // Update accumulated allocators ONLY on initial load
  useEffect(() => {
    if (data?.data?.items && accumulatedAllocators.length === 0) {
      setAccumulatedAllocators(data.data.items);
    }
  }, [data?.data?.items]);

  // Refetch when coming back online
  useEffect(() => {
    if (isOnline && isError) {
      refetch();
    }
  }, [isOnline, isError, refetch]);

  // Handle follow/unfollow
  const handleFollowClick = async (allocatorId: string) => {
    // Check authentication first
    if (!isAuthenticated) {
      toast.error("Please sign in to follow allocation admins");
      router.push("/signin");
      return;
    }

    // Don't allow follow actions when offline
    if (!isOnline) {
      toast.error("You're offline. Please check your connection.");
      return;
    }

    // Find the current allocator
    const currentAllocator = accumulatedAllocators.find((a) => a._id === allocatorId);
    if (!currentAllocator) return;

    // Update local state optimistically BEFORE the mutation
    setAccumulatedAllocators((prev) =>
      prev.map((allocator) =>
        allocator._id === allocatorId
          ? {
              ...allocator,
              isFollowing: !allocator.isFollowing,
              followersCount: allocator.isFollowing
                ? allocator.followersCount - 1
                : allocator.followersCount + 1,
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
      setAccumulatedAllocators((prev) =>
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

      // If it's an auth error, redirect to sign in
      if (
        error.message === "User must be authenticated" ||
        error?.response?.status === 401
      ) {
        toast.error("Please sign in to follow allocation admins");
        router.push("/signin");
      }
    }
  };

  // Show more allocators
  const handleShowMore = async () => {
    if (data?.data?.hasNextPage && isOnline && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setIsLoadingMore(true);
      
      try {
        const nextPageParams = buildSearchParams(
          {
            ...baseQueryParams,
            page: nextPage,
          },
          searchQuery,
          "allocators"
        );

        const response = await AllocatorService.getAllocators(nextPageParams);

        if (response.status === "success") {
          // Append new items to accumulated list
          const newAccumulatedAllocators = [...accumulatedAllocators, ...response.data.items];
          setAccumulatedAllocators(newAccumulatedAllocators);
          setCurrentPage(nextPage);
          
          // Update cache
          const updatedData = {
            ...data,
            data: {
              ...data.data,
              items: newAccumulatedAllocators,
              hasNextPage: response.data.hasNextPage,
            },
          };
          
          queryClient.setQueryData(allocatorKeys.list(queryParams), updatedData);
        }
      } catch (error) {
        console.error("Failed to load more allocators:", error);
        toast.error("Failed to load more. Please try again.");
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  // Collapse back to previous page
  const handleCollapse = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      const itemsPerPage = baseQueryParams.limit || 12;
      const itemsToKeep = newPage * itemsPerPage;
      const newAllocators = accumulatedAllocators.slice(0, itemsToKeep);

      setAccumulatedAllocators(newAllocators);
      setCurrentPage(newPage);

      // Update cache
      if (data) {
        const updatedData = {
          ...data,
          data: {
            ...data.data,
            items: newAllocators,
            hasNextPage: newPage < (data?.data?.totalPages || 1),
          },
        };

        queryClient.setQueryData(allocatorKeys.list(queryParams), updatedData);
      }
    }
  };

  // Retry handler
  const handleRetry = () => {
    refetch();
  };

  // Use accumulated allocators
  const allAllocators = accumulatedAllocators;

  // Loading state
  const isLoadingData = isLoading || (!isFetched && allAllocators.length === 0);

  // Show different buttons based on state
  const showMoreButton =
    data?.data?.hasNextPage &&
    !isLoading &&
    !isError &&
    !isLoadingMore;

  const showCollapseButton =
    currentPage > 1 && !isLoading && !isError && !isLoadingMore;

  // Current info for display
  const itemsPerPage = baseQueryParams.limit || 12;
  const totalPages = data?.data?.totalPages || 1;

  // Render loading skeleton for initial load
  if (isLoadingData && isOnline) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1
            style={{
              color: "#1F2024",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "110%",
              letterSpacing: "-0.36px",
            }}
          >
            All Allocation Admins
          </h1>
          <p
            style={{
              color: "#71727A",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Discover and follow allocation admins
          </p>
        </div>
        <AllocationAdminGridSkeleton count={12} />
      </div>
    );
  }

  // Handle offline state
  if (!isOnline && allAllocators.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1
            style={{
              color: "#1F2024",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "110%",
              letterSpacing: "-0.36px",
            }}
          >
            All Allocation Admins
          </h1>
        </div>
        <OfflineState />
      </div>
    );
  }

  // Handle error state
  if (isError && !isLoading && allAllocators.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1
            style={{
              color: "#1F2024",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "110%",
              letterSpacing: "-0.36px",
            }}
          >
            All Allocation Admins
          </h1>
        </div>
        <NetworkError
          message="Unable to load allocation admins"
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // Handle empty state
  if (!isLoading && !isError && isFetched && allAllocators.length === 0) {
    const emptyMessage = searchQuery
      ? `No allocation admins found for "${searchQuery}"`
      : "No allocation admins are currently available.";

    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1
            style={{
              color: "#1F2024",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "110%",
              letterSpacing: "-0.36px",
            }}
          >
            All Allocation Admins
          </h1>
        </div>
        <EmptyState
          title="No allocation admins found"
          message={emptyMessage}
        />
      </div>
    );
  }

  // Normal render with data
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1
          style={{
            color: "#1F2024",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: "110%",
            letterSpacing: "-0.36px",
          }}
        >
          All Allocation Admins
        </h1>
        <p
          style={{
            color: "#71727A",
            fontFamily: "var(--font-source-sans), sans-serif",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Discover and follow allocation admins to stay updated with their events and spaces
        </p>
      </div>

      {/* Search results indicator */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Search results for <strong>&quot;{searchQuery}&quot;</strong>
          </span>
          {data?.data?.totalCount !== undefined && (
            <span className="text-gray-500">
              ({data.data.totalCount} {data.data.totalCount === 1 ? "result" : "results"})
            </span>
          )}
        </div>
      )}

      {/* Allocation Admin Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {allAllocators.map((allocator) => (
          <AllocationAdminCard
            key={allocator._id}
            id={allocator._id}
            name={AllocatorService.formatAllocatorName(allocator)}
            followerCount={AllocatorService.formatFollowerCount(
              allocator.followersCount
            )}
            avatarUrl={allocator.avatar || "/icons/encircle-star-orange-avatar.svg"}
            isFollowing={allocator.isFollowing}
            onFollowClick={handleFollowClick}
          />
        ))}
      </div>

      {/* Loading more indicator - ✅ ADDED THIS */}
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading more allocation admins...</span>
          </div>
        </div>
      )}

      {/* Status info - showing current page/total info */}
      {allAllocators.length > itemsPerPage && (
        <div className="flex justify-center text-sm text-gray-500">
          <span>
            Showing {allAllocators.length} of {data?.data?.totalCount || 0}{" "}
            allocation admins ({currentPage} of {totalPages} pages loaded)
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        {showMoreButton && (
          <Button
            variant="signup-primary"
            size="allotease-md"
            onClick={handleShowMore}
            disabled={!isOnline || isLoadingMore}
            loading={isLoadingMore}
          >
            Show More
          </Button>
        )}

        {showCollapseButton && (
          <Button
            variant="allotease-blur"
            size="allotease-md"
            onClick={handleCollapse}
            disabled={isLoading || isLoadingMore}
          >
            Collapse
          </Button>
        )}
      </div>
    </div>
  );
}