/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { AllocatorService, Allocator } from "@/services/allocator-service";
import { LoadingSkeleton } from "@/components/ui/follow-card-skeleton";
import { AllocationAdminCarousel } from "@/components/ui/allocation-admin-carousel";
import { AuthModal } from "@/components/ui/modals/auth-modal";
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

interface FeaturedSectionProps {
  className?: string;
}

export function FeaturedSection({ className = "" }: FeaturedSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [allAllocators, setAllAllocators] = useState<Allocator[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Get auth state from store
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const isOnline = useIsOnline();

  // Use TanStack Query for fetching allocators
  const { data, isLoading, isError, refetch } = useAllocators({
    page: currentPage,
    limit: 12,
  });

  // Use the follow toggle mutation
  const followToggleMutation = useFollowToggle();

  // Update local state when data changes
  useEffect(() => {
    if (data?.data?.items) {
      if (currentPage === 1) {
        setAllAllocators(data.data.items);
      } else {
        // Append new items for pagination
        setAllAllocators((prev) => {
          const existingIds = new Set(prev.map((a) => a._id));
          const newItems = data.data.items.filter(
            (item) => !existingIds.has(item._id)
          );
          return [...prev, ...newItems];
        });
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
  const handleLoadMore = () => {
    if (data?.data?.hasNextPage && !isLoading && isOnline) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Render loading skeleton for initial load
  if (isLoading && currentPage === 1) {
    return (
      <section className={`${className}`}>
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h2
              style={{
                color: "var(--System-Teal, #1F3A3A)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "28px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "110%",
                letterSpacing: "-0.56px",
                margin: 0,
                marginBottom: "8px",
              }}
            >
              Featured Hotels & Landlords
            </h2>
            <p
              style={{
                color: "var(--Body, #71727A)",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "142.745%",
                letterSpacing: "-0.32px",
                margin: 0,
              }}
            >
              Follow your favorite allocation admins to stay updated
            </p>
          </div>

          {/* Loading skeleton */}
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
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h2
              style={{
                color: "var(--System-Teal, #1F3A3A)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "28px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "110%",
                letterSpacing: "-0.56px",
                margin: 0,
                marginBottom: "8px",
              }}
            >
              Featured Hotels & Landlords
            </h2>
            <p
              style={{
                color: "var(--Body, #71727A)",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "142.745%",
                letterSpacing: "-0.32px",
                margin: 0,
              }}
            >
              Follow your favorite allocation admins to stay updated
            </p>
          </div>

          <OfflineState />
        </div>
      </section>
    );
  }

  // Handle error state
  if (isError && !isLoading && allAllocators.length === 0) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h2
              style={{
                color: "var(--System-Teal, #1F3A3A)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "28px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "110%",
                letterSpacing: "-0.56px",
                margin: 0,
                marginBottom: "8px",
              }}
            >
              Featured Hotels & Landlords
            </h2>
            <p
              style={{
                color: "var(--Body, #71727A)",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "142.745%",
                letterSpacing: "-0.32px",
                margin: 0,
              }}
            >
              Follow your favorite allocation admins to stay updated
            </p>
          </div>

          <NetworkError
            message="Unable to load featured allocators"
            onRetry={() => refetch()}
          />
        </div>
      </section>
    );
  }

  // Handle empty state
  if (!isLoading && !isError && allAllocators.length === 0) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h2
              style={{
                color: "var(--System-Teal, #1F3A3A)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "28px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "110%",
                letterSpacing: "-0.56px",
                margin: 0,
                marginBottom: "8px",
              }}
            >
              Featured Hotels & Landlords
            </h2>
            <p
              style={{
                color: "var(--Body, #71727A)",
                fontFamily: "var(--font-source-sans), sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "142.745%",
                letterSpacing: "-0.32px",
                margin: 0,
              }}
            >
              Follow your favorite allocation admins to stay updated
            </p>
          </div>

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
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2
            style={{
              color: "var(--System-Teal, #1F3A3A)",
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "28px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "110%",
              letterSpacing: "-0.56px",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            Featured Hotels & Landlords
          </h2>

          <p
            style={{
              color: "var(--Body, #71727A)",
              fontFamily: "var(--font-source-sans), sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "142.745%",
              letterSpacing: "-0.32px",
              margin: 0,
            }}
          >
            Follow your favorite allocation admins to stay updated
          </p>
        </div>

        {/* Carousel with real data */}
        <AllocationAdminCarousel
          profiles={allAllocators.map((allocator) =>
            AllocatorService.mapToProfile(allocator)
          )}
          onFollowClick={handleFollowClick}
          onLoadMore={handleLoadMore}
          hasMore={data?.data?.hasNextPage || false}
          isLoadingMore={isLoading && currentPage > 1}
        />
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