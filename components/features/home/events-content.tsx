/* eslint-disable @typescript-eslint/no-explicit-any */
// Todo: Add accessibility attributes for screen readers
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventCard } from "@/components/ui/event-card";
import { Button } from "@/components/ui/button";
import { EventService } from "@/services/events-service";
import { StaysGridSkeleton } from "@/components/ui/loading-skeletons/stay-card-skeleton";
import { NetworkError, EmptyState, OfflineState } from "@/components/ui/network-error";
import { useIsOnline } from "@/hooks/use-network-status";
import { useEvents, useLoadMoreEvents, useInvalidateEvents, eventsKeys } from "@/hooks/use-events";
import { useQueryClient } from "@tanstack/react-query";
import { EventFilters } from "@/components/ui/filters";
import { useSearchStore } from "@/stores/search-store";
import { buildSearchParams } from "@/lib/search-helper";

interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface EventsContentProps {
  className?: string;
}

export function EventsContent({ className = "" }: EventsContentProps) {
  const router = useRouter();
  const isOnline = useIsOnline();
  const queryClient = useQueryClient();
  const { removeQueries } = useInvalidateEvents();
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState("all");
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [selectedSortOrder, setSelectedSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Get search state from store
  const { searchQuery, setActiveContext, clearSearch } = useSearchStore();

  // Register as active context and cleanup on unmount
  useEffect(() => {
    setActiveContext("events");
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
    ...(selectedTags && selectedTags !== "all" && { tags: selectedTags }),
    ...(selectedEventType && selectedEventType !== "all" && { eventType: selectedEventType as "physical" | "remote" }),
    ...(selectedLocation && {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    }),
  };

  const queryParams = buildSearchParams(baseQueryParams, searchQuery, "events");

  const { data, isLoading, isError, isFetched, refetch } = useEvents(queryParams);

  // Use load more mutation for pagination
  const loadMoreMutation = useLoadMoreEvents();

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

  // Handle tags change
  const handleTagsChange = (newTags: string) => {
    setSelectedTags(newTags);
    handleFilterChange();
  };

  // Handle event type change
  const handleEventTypeChange = (newEventType: string) => {
    setSelectedEventType(newEventType);
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

  // Show more events using load more mutation
  const handleShowMore = async () => {
    if (data?.data?.hasNextPage && !loadMoreMutation.isPending && isOnline) {
      const nextPage = currentPage + 1;
      const nextPageParams = buildSearchParams(
        {
          ...baseQueryParams,
          page: nextPage,
        },
        searchQuery,
        "events"
      );

      try {
        await loadMoreMutation.mutateAsync(nextPageParams);
        setCurrentPage(nextPage);
      } catch (error) {
        console.error("Failed to load more events:", error);
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
        eventsKeys.list(queryParams)
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

        queryClient.setQueryData(eventsKeys.list(queryParams), updatedData);
        setCurrentPage(newPage);
      }
    }
  };

  // Handle event card click
  const handleEventClick = (eventId: string) => {
    router.push(`/${eventId}?type=events`);
  };

  // Retry handler
  const handleRetry = () => {
    refetch();
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setSelectedTags("all");
    setSelectedEventType("all");
    setSelectedSortOrder("desc");
    setSelectedLocation(null);
    setSelectedLocationName("");
    handleFilterChange();
  };

  // Get all events from data
  const allEvents = data?.data?.items || [];

  // Loading state - only show skeleton on initial load OR when filters change AND not yet fetched
  const isLoadingData = isLoading || (!isFetched && allEvents.length === 0);

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
        <EventFilters
          selectedLocation={selectedLocation}
          selectedTags={selectedTags}
          selectedEventType={selectedEventType}
          selectedSortOrder={selectedSortOrder}
          onLocationChange={handleLocationChange}
          onTagsChange={handleTagsChange}
          onEventTypeChange={handleEventTypeChange}
          onSortOrderChange={handleSortOrderChange}
        />

        {/* Loading skeleton - shown during filter changes */}
        <StaysGridSkeleton count={6} />
      </div>
    );
  }

  // Handle offline state
  if (!isOnline && allEvents.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <EventFilters
          selectedLocation={selectedLocation}
          selectedTags={selectedTags}
          selectedEventType={selectedEventType}
          selectedSortOrder={selectedSortOrder}
          onLocationChange={handleLocationChange}
          onTagsChange={handleTagsChange}
          onEventTypeChange={handleEventTypeChange}
          onSortOrderChange={handleSortOrderChange}
        />

        <OfflineState />
      </div>
    );
  }

  // Handle error state
  if (isError && !isLoading && allEvents.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <EventFilters
          selectedLocation={selectedLocation}
          selectedTags={selectedTags}
          selectedEventType={selectedEventType}
          selectedSortOrder={selectedSortOrder}
          onLocationChange={handleLocationChange}
          onTagsChange={handleTagsChange}
          onEventTypeChange={handleEventTypeChange}
          onSortOrderChange={handleSortOrderChange}
        />

        <NetworkError
          message="Unable to load events"
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // Handle empty state - this will properly trigger when data is fetched but empty
  if (!isLoading && !isError && isFetched && allEvents.length === 0) {
    const emptyMessage = searchQuery
      ? `No events found for "${searchQuery}"`
      : selectedTags !== "all" || selectedEventType !== "all" || selectedLocation
      ? "No events match your selected filters. Try adjusting your search criteria."
      : "No events available.";

    return (
      <div className={`space-y-6 ${className}`}>
        <EventFilters
          selectedLocation={selectedLocation}
          selectedTags={selectedTags}
          selectedEventType={selectedEventType}
          selectedSortOrder={selectedSortOrder}
          onLocationChange={handleLocationChange}
          onTagsChange={handleTagsChange}
          onEventTypeChange={handleEventTypeChange}
          onSortOrderChange={handleSortOrderChange}
        />

        <EmptyState
          title="No events found"
          message={emptyMessage}
          actionLabel={selectedTags !== "all" || selectedEventType !== "all" || selectedLocation ? "Clear Filters" : undefined}
          onAction={selectedTags !== "all" || selectedEventType !== "all" || selectedLocation ? handleClearFilters : undefined}
        />
      </div>
    );
  }

  // Normal render with data
  return (
    <div className={`space-y-6 ${className}`}>
      <EventFilters
        selectedLocation={selectedLocation}
        selectedTags={selectedTags}
        selectedEventType={selectedEventType}
        selectedSortOrder={selectedSortOrder}
        onLocationChange={handleLocationChange}
        onTagsChange={handleTagsChange}
        onEventTypeChange={handleEventTypeChange}
        onSortOrderChange={handleSortOrderChange}
      />

      {/* Active filters indicator */}
      {(searchQuery || selectedLocationName || selectedTags !== "all" || selectedEventType !== "all") && (
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
          {selectedTags !== "all" && (
            <span>
              {(searchQuery || selectedLocationName) && "•"} Tags:{" "}
              <strong>{selectedTags}</strong>
            </span>
          )}
          {selectedEventType !== "all" && (
            <span>
              {(searchQuery || selectedLocationName || selectedTags !== "all") && "•"} Type:{" "}
              <strong>{selectedEventType === "physical" ? "Physical" : "Remote"}</strong>
            </span>
          )}
          {data?.data?.totalCount !== undefined && (
            <span className="text-gray-500">
              ({data.data.totalCount} {data.data.totalCount === 1 ? "result" : "results"})
            </span>
          )}
        </div>
      )}

      {/* Events Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {allEvents.map((event) => (
          <EventCard
            key={event._id}
            title={event.title}
            dateTime={EventService.formatEventDateTime(event.startTime)}
            imageUrl={EventService.getEventCoverImage(event)}
            badgeText={EventService.formatEventPrice(event.price)}
            organizerName={event.organizationName}
            followerCount={EventService.formatFollowerCount(event.totalFollowers)}
            onClick={() => handleEventClick(event._id)}
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
            <span>Loading more events...</span>
          </div>
        </div>
      )}

      {/* Status info - showing current page/total info */}
      {allEvents.length > itemsPerPage && (
        <div className="flex justify-center text-sm text-gray-500">
          <span>
            Showing {allEvents.length} of {data?.data?.totalCount || 0} events ({currentPage}{" "}
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