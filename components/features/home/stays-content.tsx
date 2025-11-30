/* eslint-disable @typescript-eslint/no-explicit-any */
// Todo: Add accessibility attributes for screen readers
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StayCard } from "@/components/ui/stays-card";
import { Button } from "@/components/ui/button";
import { StaysService } from "@/services/stays-service";
import { StaysGridSkeleton } from "@/components/ui/loading-skeletons/stay-card-skeleton";
import {
  NetworkError,
  EmptyState,
  OfflineState,
} from "@/components/ui/network-error";
import { useIsOnline } from "@/hooks/use-network-status";
import {
  useStays,
  useLoadMoreStays,
  useInvalidateStays,
  staysKeys,
} from "@/hooks/use-stays";
import { useQueryClient } from "@tanstack/react-query";
import { StayFilters } from "@/components/ui/filters";
import { useSearchStore } from "@/stores/search-store";
import { buildSearchParams } from "@/lib/search-helper";

interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface StaysContentProps {
  className?: string;
}

export function StaysContent({ className = "" }: StaysContentProps) {
  const router = useRouter();
  const isOnline = useIsOnline();
  const queryClient = useQueryClient();
  const { removeQueries } = useInvalidateStays();
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string>("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSortOrder, setSelectedSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Get search state from store
  const { searchQuery, setActiveContext, clearSearch } = useSearchStore();

  // Register as active context and cleanup on unmount
  useEffect(() => {
    setActiveContext("stays");
    return () => {
      setActiveContext(null);
      clearSearch();
    };
  }, [setActiveContext, clearSearch]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    if (searchQuery !== undefined) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  // Build query params with search - always use page 1 as the cache key base
  const baseQueryParams = {
    page: 1,
    limit: 6,
    sortOrder: selectedSortOrder,
    ...(selectedType && selectedType !== "all" && { accommodationType: selectedType }),
    ...(selectedLocation && {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    }),
  };

  const queryParams = buildSearchParams(baseQueryParams, searchQuery, "stays");

  const { data, isLoading, isError, isFetched, refetch } = useStays(queryParams);

  // Use load more mutation for pagination
  const loadMoreMutation = useLoadMoreStays();

  // Handle filter changes
  const handleFilterChange = () => {
    // Reset pagination when filters change
    setCurrentPage(1);

    // Remove old cached data for smooth transition
    removeQueries();
  };

  // Refetch when coming back online
  useEffect(() => {
    if (isOnline && isError) {
      refetch();
    }
  }, [isOnline, isError, refetch]);

  // Handle accommodation type change
  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    handleFilterChange();
  };

  // Handle sort order change
  const handleSortOrderChange = (newSortOrder: "asc" | "desc") => {
    setSelectedSortOrder(newSortOrder);
    handleFilterChange();
  };

  // Handle location change
  const handleLocationChange = (coordinates: LocationCoordinates, placeName: string) => {
    setSelectedLocation(coordinates);
    setSelectedLocationName(placeName);
    handleFilterChange();
  };

  // Show more stays using load more mutation
  const handleShowMore = async () => {
    if (data?.data?.hasNextPage && !loadMoreMutation.isPending && isOnline) {
      const nextPage = currentPage + 1;
      const nextPageParams = buildSearchParams(
        {
          ...baseQueryParams,
          page: nextPage,
        },
        searchQuery,
        "stays"
      );

      try {
        await loadMoreMutation.mutateAsync(nextPageParams);
        setCurrentPage(nextPage);
      } catch (error) {
        console.error("Failed to load more stays:", error);
      }
    }
  };

  // Collapse back to previous page
  const handleCollapse = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      const itemsPerPage = baseQueryParams.limit || 6;

      // Get current first page data
      const firstPageData = queryClient.getQueryData<any>(
        staysKeys.list(queryParams)
      );

      if (firstPageData) {
        // Calculate how many items to keep
        const itemsToKeep = newPage * itemsPerPage;
        const newItems = firstPageData.data.items.slice(0, itemsToKeep);

        // Update the cache with reduced items
        const updatedData = {
          ...firstPageData,
          data: {
            ...firstPageData.data,
            items: newItems,
            hasNextPage: newPage < firstPageData.data.totalPages,
          },
        };

        queryClient.setQueryData(staysKeys.list(queryParams), updatedData);
        setCurrentPage(newPage);
      }
    }
  };

  // Handle stay card click
  const handleStayClick = (stayId: string) => {
    router.push(`/${stayId}?type=stays`);
  };

  // Retry handler
  const handleRetry = () => {
    refetch();
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setSelectedType("all");
    setSelectedSortOrder("desc");
    setSelectedLocation(null);
    setSelectedLocationName("");
    handleFilterChange();
  };

  // Get all stays from data
  const allStays = data?.data?.items || [];

  // Loading state - only show skeleton on initial load OR when filters change AND not yet fetched
  const isLoadingData = isLoading || (!isFetched && allStays.length === 0);

  // Show different buttons based on state
  const showMoreButton =
    data?.data?.hasNextPage &&
    !isLoading &&
    !isError &&
    !loadMoreMutation.isPending;

  const showCollapseButton =
    currentPage > 1 && !isLoading && !isError && !loadMoreMutation.isPending;

  // Current info for display
  const itemsPerPage = baseQueryParams.limit || 6;
  const totalPages = data?.data?.totalPages || 1;

  // Render loading skeleton for initial load OR filter changes (but only if not yet fetched)
  if (isLoadingData && isOnline) {
    return (
      <div className={`space-y-6 ${className}`}>
        <StayFilters
          selectedLocation={selectedLocation}
          selectedType={selectedType}
          selectedSortOrder={selectedSortOrder}
          onLocationChange={handleLocationChange}
          onTypeChange={handleTypeChange}
          onSortOrderChange={handleSortOrderChange}
        />

        {/* Loading skeleton - shown during filter changes */}
        <StaysGridSkeleton count={6} />
      </div>
    );
  }

  // Handle offline state
  if (!isOnline && allStays.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <StayFilters
          selectedLocation={selectedLocation}
          selectedType={selectedType}
          selectedSortOrder={selectedSortOrder}
          onLocationChange={handleLocationChange}
          onTypeChange={handleTypeChange}
          onSortOrderChange={handleSortOrderChange}
        />

        <OfflineState />
      </div>
    );
  }

  // Handle error state
  if (isError && !isLoading && allStays.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <StayFilters
          selectedLocation={selectedLocation}
          selectedType={selectedType}
          selectedSortOrder={selectedSortOrder}
          onLocationChange={handleLocationChange}
          onTypeChange={handleTypeChange}
          onSortOrderChange={handleSortOrderChange}
        />

        <NetworkError message="Unable to load accommodations" onRetry={handleRetry} />
      </div>
    );
  }

  // Handle empty state - this will properly trigger when data is fetched but empty
  if (!isLoading && !isError && isFetched && allStays.length === 0) {
    const emptyMessage = searchQuery
      ? `No accommodations found for "${searchQuery}"`
      : selectedType !== "all" || selectedLocation
      ? "No accommodations match your selected filters. Try adjusting your search criteria."
      : "No accommodations available.";

    return (
      <div className={`space-y-6 ${className}`}>
        <StayFilters
          selectedLocation={selectedLocation}
          selectedType={selectedType}
          selectedSortOrder={selectedSortOrder}
          onLocationChange={handleLocationChange}
          onTypeChange={handleTypeChange}
          onSortOrderChange={handleSortOrderChange}
        />

        <EmptyState
          title="No accommodations found"
          message={emptyMessage}
          actionLabel={selectedType !== "all" || selectedLocation ? "Clear Filters" : undefined}
          onAction={selectedType !== "all" || selectedLocation ? handleClearFilters : undefined}
        />
      </div>
    );
  }

  // Normal render with data
  return (
    <div className={`space-y-6 ${className}`}>
      <StayFilters
        selectedLocation={selectedLocation}
        selectedType={selectedType}
        selectedSortOrder={selectedSortOrder}
        onLocationChange={handleLocationChange}
        onTypeChange={handleTypeChange}
        onSortOrderChange={handleSortOrderChange}
      />

      {/* Active filters indicator */}
      {(searchQuery || selectedLocationName || selectedType !== "all") && (
        <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
          {searchQuery && (
            <span>
              Search: <strong>&quot;{searchQuery}&quot;</strong>
            </span>
          )}
          {selectedLocationName && (
            <span>
              {searchQuery && "•"} Location: <strong>{selectedLocationName}</strong>
            </span>
          )}
          {selectedType !== "all" && (
            <span>
              {(searchQuery || selectedLocationName) && "•"} Type:{" "}
              <strong>{StaysService.formatAccommodationType(selectedType)}</strong>
            </span>
          )}
          {data?.data?.totalCount !== undefined && (
            <span className="text-gray-500">
              ({data.data.totalCount} {data.data.totalCount === 1 ? "result" : "results"})
            </span>
          )}
        </div>
      )}

      {/* Stays Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {allStays.map((stay) => (
          <StayCard
            key={stay._id}
            title={stay.title}
            location={StaysService.formatStayLocation(stay.location)}
            rating={stay.averageRating}
            reviewCount={StaysService.formatReviewCount(stay.totalReviews)}
            description={stay.description}
            imageUrl={StaysService.getStayBannerImage(stay)}
            onClick={() => handleStayClick(stay._id)}
          />
        ))}
      </div>

      {/* Loading more indicator */}
      {loadMoreMutation.isPending && (
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
            <span>Loading more accommodations...</span>
          </div>
        </div>
      )}

      {/* Status info - showing current page/total info */}
      {allStays.length > itemsPerPage && (
        <div className="flex justify-center text-sm text-gray-500">
          <span>
            Showing {allStays.length} of {data?.data?.totalCount || 0} accommodations ({currentPage}{" "}
            of {totalPages} pages loaded)
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
            disabled={!isOnline || loadMoreMutation.isPending}
            loading={loadMoreMutation.isPending}
          >
            Show More
          </Button>
        )}

        {showCollapseButton && (
          <Button
            variant="allotease-blur"
            size="allotease-md"
            onClick={handleCollapse}
            disabled={isLoading || loadMoreMutation.isPending}
          >
            Collapse
          </Button>
        )}
      </div>
    </div>
  );
}