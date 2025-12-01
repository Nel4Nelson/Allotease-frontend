/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { StaysService, Stay } from "@/services/stays-service";
import { StayCard } from "@/components/ui/stays-card";
import { StaysGridSkeleton } from "@/components/ui/loading-skeletons/stay-card-skeleton";
import { Button } from "@/components/ui/button";
import {
  NetworkError,
  EmptyState,
  OfflineState,
} from "@/components/ui/network-error";
import { useIsOnline } from "@/hooks/use-network-status";
import { useStays, staysKeys } from "@/hooks/use-stays";
import { UnverifiedStayModal } from "@/components/ui/modals/unverified-stay-modal";

interface AllocationAdminStaysContentProps {
  allocatorId: string;
}

export function AllocationAdminStaysContent({ allocatorId }: AllocationAdminStaysContentProps) {
  const router = useRouter();
  const isOnline = useIsOnline();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedStays, setAccumulatedStays] = useState<Stay[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [showUnverifiedModal, setShowUnverifiedModal] = useState(false);
  const [selectedStay, setSelectedStay] = useState<{ id: string; title: string; isVerified: boolean } | null>(null);

  // Build query params with allocator filter
  const baseQueryParams = {
    page: 1,
    limit: 12,
    allocator: allocatorId, // Filter by this allocator
  };

  const { data, isLoading, isError, isFetched, refetch } =
    useStays(baseQueryParams);

  // Update accumulated stays ONLY on initial load
  useEffect(() => {
    if (data?.data?.items && accumulatedStays.length === 0) {
      setAccumulatedStays(data.data.items);
    }
  }, [data?.data?.items]);

  // Refetch when coming back online
  useEffect(() => {
    if (isOnline && isError) {
      refetch();
    }
  }, [isOnline, isError, refetch]);

  // Show more stays
  const handleShowMore = async () => {
    if (data?.data?.hasNextPage && isOnline && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setIsLoadingMore(true);
      
      try {
        const response = await StaysService.getAllStays({
          ...baseQueryParams,
          page: nextPage,
        });

        if (response.status === "success") {
          // Append new items to accumulated list
          const newAccumulatedStays = [...accumulatedStays, ...response.data.items];
          setAccumulatedStays(newAccumulatedStays);
          setCurrentPage(nextPage);
          
          // Update cache
          const updatedData = {
            ...data,
            data: {
              ...data.data,
              items: newAccumulatedStays,
              hasNextPage: response.data.hasNextPage,
            },
          };
          
          queryClient.setQueryData(staysKeys.list(baseQueryParams), updatedData);
        }
      } catch (error) {
        console.error("Failed to load more stays:", error);
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
      const newStays = accumulatedStays.slice(0, itemsToKeep);

      setAccumulatedStays(newStays);
      setCurrentPage(newPage);

      // Update cache
      if (data) {
        const updatedData = {
          ...data,
          data: {
            ...data.data,
            items: newStays,
            hasNextPage: newPage < (data?.data?.totalPages || 1),
          },
        };

        queryClient.setQueryData(staysKeys.list(baseQueryParams), updatedData);
      }
    }
  };

  // HandleStayClick with verification logic
  const handleStayClick = (stayId: string, stayTitle: string, isVerified: boolean) => {
    if (!isVerified) {
      // Show warning modal for unverified stays
      setSelectedStay({ id: stayId, title: stayTitle, isVerified });
      setShowUnverifiedModal(true);
    } else {
      // Navigate directly for verified stays
      router.push(`/${stayId}?type=stays`);
    }
  };

  // Proceed handler
  const handleProceedToStay = () => {
    if (selectedStay) {
      router.push(`/${selectedStay.id}?type=stays`);
      setShowUnverifiedModal(false);
      setSelectedStay(null);
    }
  };

  // Retry handler
  const handleRetry = () => {
    refetch();
  };

  // Use accumulated stays
  const allStays = accumulatedStays;

  // Loading state
  const isLoadingData = isLoading || (!isFetched && allStays.length === 0);

  // Show different buttons based on state
  const showMoreButton = data?.data?.hasNextPage && !isLoading && !isError && !isLoadingMore;
  const showCollapseButton = currentPage > 1 && !isLoading && !isError && !isLoadingMore;

  // Current info for display
  const itemsPerPage = baseQueryParams.limit || 12;
  const totalPages = data?.data?.totalPages || 1;

  // Render loading skeleton for initial load
  if (isLoadingData && isOnline) {
    return (
      <div className="p-6 space-y-6">
        <StaysGridSkeleton count={6} />
      </div>
    );
  }

  // Handle offline state
  if (!isOnline && allStays.length === 0) {
    return (
      <div className="p-6">
        <OfflineState />
      </div>
    );
  }

  // Handle error state
  if (isError && !isLoading && allStays.length === 0) {
    return (
      <div className="p-6">
        <NetworkError
          message="Unable to load spaces"
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // Handle empty state
  if (!isLoading && !isError && isFetched && allStays.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="No spaces found"
          message="This allocation admin hasn't listed any spaces yet."
        />
      </div>
    );
  }

  // Normal render with data
  return (
    <div className="p-6 space-y-6">
      {/* Stays Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allStays.map((stay) => (
          <StayCard
            key={stay._id}
            title={stay.title}
            location={StaysService.formatStayLocation(stay.location)}
            rating={stay.averageRating}
            reviewCount={StaysService.formatReviewCount(stay.totalReviews)}
            description={stay.description}
            imageUrl={StaysService.getStayBannerImage(stay)}
            isVerified={stay.isVerified}
            onClick={() => handleStayClick(stay._id, stay.title, stay.isVerified)}
          />
        ))}
      </div>

      {/* Loading more indicator */}
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
            <span>Loading more spaces...</span>
          </div>
        </div>
      )}

      {/* Status info */}
      {allStays.length > itemsPerPage && (
        <div className="flex justify-center text-sm text-gray-500">
          <span>
            Showing {allStays.length} of {data?.data?.totalCount || 0} spaces
            ({currentPage} of {totalPages} pages loaded)
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

      {/* Unverified Stay Modal */}
      <UnverifiedStayModal
        isOpen={showUnverifiedModal}
        onClose={() => {
          setShowUnverifiedModal(false);
          setSelectedStay(null);
        }}
        onProceed={handleProceedToStay}
        stayTitle={selectedStay?.title || ""}
      />
    </div>
  );
}