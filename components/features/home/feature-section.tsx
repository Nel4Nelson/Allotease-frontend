/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { AllocatorService, Allocator } from "@/services/allocator-service";
import { LoadingSkeleton } from "@/components/ui/follow-card-skeleton";
import { AllocationAdminCarousel } from "@/components/ui/allocation-admin-carousel";
import { AuthModal } from "@/components/ui/modals/auth-modal";
import { FeaturedSectionHeader } from "@/components/ui/featured-section-header";
import { useAuthStore } from "@/stores/auth-store";
import { useAllocators, useFollowToggle } from "@/hooks/use-allocators";
import { useQueryClient } from "@tanstack/react-query";
import { allocatorKeys } from "@/hooks/use-allocators";
import { useIsOnline } from "@/hooks/use-network-status";
import {
  NetworkError,
  EmptyState,
  OfflineState,
} from "@/components/ui/network-error";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface FeaturedSectionProps {
  className?: string;
}

export function FeaturedSection({ className = "" }: FeaturedSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [allAllocators, setAllAllocators] = useState<Allocator[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const loadingMoreRef = useRef(false);

  // Get auth state from store
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const isOnline = useIsOnline();
  const router = useRouter();

  // Use TanStack Query for fetching allocators
  const { data, isLoading, isError, refetch } = useAllocators({
    page: currentPage,
    limit: 12,
  });

  // Use the follow toggle mutation
  const followToggleMutation = useFollowToggle();

  // Handle initial load and subsequent loads
  useEffect(() => {
    if (data?.data?.items) {
      if (currentPage === 1) {
        setAllAllocators(data.data.items);
      } else {
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

      // Reset loading state
      if (currentPage > 1) {
        setIsLoadingMore(false);
        loadingMoreRef.current = false;
      }
    }
  }, [data, currentPage]);

  // Invalidate queries when auth state changes
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: allocatorKeys.all });
  }, [isAuthenticated, queryClient]);

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
      setShowAuthModal(true);
      return;
    }

    // Don't allow follow actions when offline
    if (!isOnline) {
      toast.error("You're offline. Please check your connection.");
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

      // If it's an auth error, show the modal
      if (
        error.message === "User must be authenticated" ||
        error?.response?.status === 401
      ) {
        setShowAuthModal(true);
      }
    }
  };

  // Load more when carousel reaches end
  const handleLoadMore = async () => {
    // Prevent duplicate requests
    if (loadingMoreRef.current || isLoadingMore || !hasMoreData || !isOnline) {
      return;
    }

    // Set loading states
    loadingMoreRef.current = true;
    setIsLoadingMore(true);

    // Increment page which will trigger the useEffect to fetch new data
    setCurrentPage((prev) => {
      const nextPage = prev + 1;
      return nextPage;
    });
  };

  // Reset states when starting fresh
  const handleReset = () => {
    setCurrentPage(1);
    setAllAllocators([]);
    setIsLoadingMore(false);
    setHasMoreData(true);
    loadingMoreRef.current = false;
  };

  // Handle view all button click
  const handleViewAll = () => {
    router.push("/all-allocation-admins");
  };

  // Render loading skeleton for initial load
  if (isLoading && currentPage === 1) {
    return (
      <section className={`${className}`}>
        <FeaturedSectionHeader />
        
        {/* Loading skeleton */}
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-hidden">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
          </div>
        </div>
      </section>
    );
  }

  // Handle offline state
  if (!isOnline && allAllocators.length === 0) {
    return (
      <section className={`py-12 ${className}`}>
        <FeaturedSectionHeader />
        
        <div className="container mx-auto px-4">
          <OfflineState />
        </div>
      </section>
    );
  }

  // Handle error state
  if (isError && !isLoading && allAllocators.length === 0) {
    return (
      <section className={`py-12 ${className}`}>
        <FeaturedSectionHeader />
        
        <div className="container mx-auto px-4">
          <NetworkError
            message="Unable to load featured allocators"
            onRetry={() => {
              handleReset();
              refetch();
            }}
          />
        </div>
      </section>
    );
  }

  // Handle empty state
  if (!isLoading && !isError && allAllocators.length === 0) {
    return (
      <section className={`py-12 ${className}`}>
        <FeaturedSectionHeader />
        
        <div className="container mx-auto px-4">
          <EmptyState
            title="No allocation admins available"
            message="Check back later for featured hotels and landlords"
            icon={
              <svg
                className="w-20 h-20 text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
          />
        </div>
      </section>
    );
  }

  // Normal render with data
  return (
    <section className={`${className}`}>
      <FeaturedSectionHeader />
      
      <div className="container mx-auto px-4 space-y-6">
        {/* Carousel with real data */}
        <AllocationAdminCarousel
          profiles={allAllocators.map((allocator) =>
            AllocatorService.mapToProfile(allocator)
          )}
          onFollowClick={handleFollowClick}
          onLoadMore={handleLoadMore}
          hasMore={hasMoreData}
          isLoadingMore={isLoadingMore}
        />

        {/* View All Button */}
        <div className="flex justify-center pt-4">
          <Button
            variant="signup-primary"
            size="allotease-md"
            onClick={handleViewAll}
          >
            View all
          </Button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectUrl={
          typeof window !== "undefined" ? window.location.pathname : "/"
        }
      />
    </section>
  );
}