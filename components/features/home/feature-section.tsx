/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AllocatorService, Allocator } from "@/services/allocator-service";
import { LoadingSkeleton } from "@/components/ui/follow-card-skeleton";
import { AllocationAdminCarousel } from "@/components/ui/allocation-admin-carousel";

interface FeaturedSectionProps {
  className?: string;
}

export function FeaturedSection({ className = "" }: FeaturedSectionProps) {
  const [allocators, setAllocators] = useState<Allocator[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Load allocators function with persistent follow state
  const loadAllocators = async (page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      // The getAllocators method now automatically includes follow status
      const response = await AllocatorService.getAllocators({
        page,
        limit: 12,
      });

      if (response.status === "success") {
        const newAllocators = response.data.items;

        if (append) {
          // Append new allocators to existing ones
          setAllocators((prev) => [...prev, ...newAllocators]);
        } else {
          // Replace allocators (for initial load)
          setAllocators(newAllocators);
        }

        setCurrentPage(response.data.page);
        setHasNextPage(response.data.hasNextPage);
      }
    } catch (error) {
      console.error("Failed to load allocators:", error);
      toast.error("Failed to load featured allocators. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Refresh follow status without reloading all data
  const refreshFollowStatus = async () => {
    try {
      const updatedAllocators =
        await AllocatorService.updateAllocatorsFollowStatus(allocators);
      setAllocators(updatedAllocators);
    } catch (error) {
      console.error("Failed to refresh follow status:", error);
    }
  };

  // Initial load
  useEffect(() => {
    loadAllocators(1, false);
  }, []);

  // Optional: Refresh follow status when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && allocators.length > 0) {
        // Refresh follow status when tab becomes active
        refreshFollowStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [allocators]);

  // Handle follow/unfollow with optimistic updates and error recovery
  const handleFollowClick = async (allocatorId: string) => {
    // Find the current allocator
    const currentAllocator = allocators.find((a) => a._id === allocatorId);
    if (!currentAllocator) return;

    // Optimistic update
    setAllocators((prev) =>
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
      await AllocatorService.followUser(allocatorId);
      // Success - optimistic update was correct
      console.log(
        `Successfully ${
          currentAllocator.isFollowing ? "unfollowed" : "followed"
        } ${currentAllocator.firstname}`
      );
    } catch (error) {
      console.error("Failed to follow/unfollow:", error);

      // Revert optimistic update on error
      setAllocators((prev) =>
        prev.map((allocator) =>
          allocator._id === allocatorId
            ? {
                ...allocator,
                isFollowing: !allocator.isFollowing,
                followersCount: allocator.isFollowing
                  ? allocator.followersCount + 1
                  : allocator.followersCount - 1,
              }
            : allocator
        )
      );

      toast.error("Failed to update follow status. Please try again.");
    }
  };

  // Load more when carousel reaches end
  const handleLoadMore = () => {
    if (hasNextPage && !loadingMore) {
      loadAllocators(currentPage + 1, true);
    }
  };

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          {/* Title */}
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

          {/* Subtitle */}
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
            Extra description text
          </p>
        </div>

        {/* Content */}
        {loading ? (
          // Loading skeleton
          <div className="flex gap-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
          </div>
        ) : (
          // Carousel with real data
          <AllocationAdminCarousel
            profiles={allocators.map((allocator) =>
              AllocatorService.mapToProfile(allocator)
            )}
            onFollowClick={handleFollowClick}
            onLoadMore={handleLoadMore}
            hasMore={hasNextPage}
            isLoadingMore={loadingMore}
          />
        )}
      </div>
    </section>
  );
}
