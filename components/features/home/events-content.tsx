/* eslint-disable @typescript-eslint/no-explicit-any */
// Todo: Clean code - the duplicated variants make that implementation cleaner
// Todo: Extract filter components to reduce duplication between desktop/mobile variants
// Todo: Consider memoizing expensive operations like EventService formatters
// Todo: Add proper TypeScript interfaces for queryClient.getQueryData instead of using 'any'
// Todo: Implement virtualization for large lists to improve performance
// Todo: Add accessibility attributes for screen readers
// Todo: Extracting business logic into custom hooks for better testability
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ContentHeader } from "@/components/ui/content-header";
import { SectionTitle } from "@/components/ui/section-title";
import { VariantSelect } from "@/components/ui/variant-select";
import { EventCard } from "@/components/ui/event-card";
import { Button } from "@/components/ui/button";
import { EventService } from "@/services/events-service";
import { StaysGridSkeleton } from "@/components/ui/loading-skeletons/stay-card-skeleton";
import { NetworkError, EmptyState, OfflineState } from "@/components/ui/network-error";
import { useIsOnline } from "@/hooks/use-network-status";
import { useEvents, useLoadMoreEvents, useInvalidateEvents, eventsKeys } from "@/hooks/use-events";
import { useQueryClient } from "@tanstack/react-query";

interface EventsContentProps {
  className?: string;
}

export function EventsContent({ className = "" }: EventsContentProps) {
  const router = useRouter();
  const isOnline = useIsOnline();
  const queryClient = useQueryClient();
  const { removeQueries } = useInvalidateEvents();
  const [selectedLocation, setSelectedLocation] = useState("awka-anambra");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Build query params
  const queryParams = {
    page: 1, // Always use page 1 for the main query
    limit: 6,
    ...(selectedCategory &&
      selectedCategory !== "all" && { query: selectedCategory }),
  };

  // Use TanStack Query for fetching events
  const { data, isLoading, isError, refetch } = useEvents(queryParams);

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

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    handleFilterChange();
  };

  // Handle location change
  const handleLocationChange = (newLocation: string) => {
    setSelectedLocation(newLocation);
    handleFilterChange();
  };

  // Show more events using load more mutation
  const handleShowMore = async () => {
    if (data?.data?.hasNextPage && !loadMoreMutation.isPending && isOnline) {
      const nextPage = currentPage + 1;
      const nextPageParams = {
        ...queryParams,
        page: nextPage,
      };

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
      const itemsPerPage = queryParams.limit || 6;

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
    setSelectedCategory("all");
    setSelectedLocation("awka-anambra");
    handleFilterChange();
  };

  // Get all events from data
  const allEvents = data?.data?.items || [];

  // Loading state - show skeleton on initial load OR when filters change
  const isLoadingData = isLoading || (allEvents.length === 0 && !isError);

  // Show different buttons based on state
  const showMoreButton =
    data?.data?.hasNextPage &&
    !isLoading &&
    !isError &&
    !loadMoreMutation.isPending;

  const showCollapseButton =
    currentPage > 1 && !isLoading && !isError && !loadMoreMutation.isPending;

  // Current info for display
  const itemsPerPage = queryParams.limit || 6;
  const totalPages = data?.data?.totalPages || 1;

  // Render loading skeleton for initial load OR filter changes
  if (isLoadingData && isOnline) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div>
          {/* Desktop: Category in header, Location below */}
          <div className="hidden md:block">
            <ContentHeader
              title={
                <SectionTitle>Exciting events happening near you</SectionTitle>
              }
              action={
                <VariantSelect
                  variant="glass"
                  placeholder="Category"
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "workshop", label: "Workshop" },
                    { value: "conference", label: "Conference" },
                    { value: "seminar", label: "Seminar" },
                    { value: "networking", label: "Networking" },
                    { value: "Bitcoin", label: "Bitcoin" },
                    { value: "Pool", label: "Pool Party" },
                    { value: "Ethereum", label: "Ethereum" },
                  ]}
                />
              }
            />

            <VariantSelect
              variant="ghost"
              icon="/icons/location.svg"
              iconAlt="Location"
              value={selectedLocation}
              onValueChange={handleLocationChange}
              options={[
                { value: "awka-anambra", label: "Awka, Anambra" },
                { value: "lagos-lagos", label: "Lagos, Lagos" },
                { value: "abuja-fct", label: "Abuja, FCT" },
                {
                  value: "port-harcourt-rivers",
                  label: "Port Harcourt, Rivers",
                },
                { value: "kano-kano", label: "Kano, Kano" },
                { value: "ibadan-oyo", label: "Ibadan, Oyo" },
              ]}
            />
          </div>

          {/* Mobile: Title and both selects in same row */}
          <div className="block md:hidden">
            <div className="mb-4">
              <SectionTitle>Exciting events near you</SectionTitle>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <VariantSelect
                  variant="ghost"
                  icon="/icons/location.svg"
                  iconAlt="Location"
                  value={selectedLocation}
                  onValueChange={handleLocationChange}
                  options={[
                    { value: "awka-anambra", label: "Awka, Anambra" },
                    { value: "lagos-lagos", label: "Lagos, Lagos" },
                    { value: "abuja-fct", label: "Abuja, FCT" },
                    {
                      value: "port-harcourt-rivers",
                      label: "Port Harcourt, Rivers",
                    },
                    { value: "kano-kano", label: "Kano, Kano" },
                    { value: "ibadan-oyo", label: "Ibadan, Oyo" },
                  ]}
                />
              </div>

              <div className="flex-1">
                <VariantSelect
                  variant="glass"
                  placeholder="Category"
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "workshop", label: "Workshop" },
                    { value: "conference", label: "Conference" },
                    { value: "seminar", label: "Seminar" },
                    { value: "networking", label: "Networking" },
                    { value: "Bitcoin", label: "Bitcoin" },
                    { value: "Pool", label: "Pool Party" },
                    { value: "Ethereum", label: "Ethereum" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading skeleton - shown during filter changes */}
        <StaysGridSkeleton count={6} />
      </div>
    );
  }

  // Handle offline state
  if (!isOnline && allEvents.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div>
          {/* Filters remain interactive even offline */}
          <div className="hidden md:block">
            <ContentHeader
              title={
                <SectionTitle>Exciting events happening near you</SectionTitle>
              }
              action={
                <VariantSelect
                  variant="glass"
                  placeholder="Category"
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "workshop", label: "Workshop" },
                    { value: "conference", label: "Conference" },
                    { value: "seminar", label: "Seminar" },
                    { value: "networking", label: "Networking" },
                    { value: "Bitcoin", label: "Bitcoin" },
                    { value: "Pool", label: "Pool Party" },
                    { value: "Ethereum", label: "Ethereum" },
                  ]}
                />
              }
            />

            <VariantSelect
              variant="ghost"
              icon="/icons/location.svg"
              iconAlt="Location"
              value={selectedLocation}
              onValueChange={handleLocationChange}
              options={[
                { value: "awka-anambra", label: "Awka, Anambra" },
                { value: "lagos-lagos", label: "Lagos, Lagos" },
                { value: "abuja-fct", label: "Abuja, FCT" },
                {
                  value: "port-harcourt-rivers",
                  label: "Port Harcourt, Rivers",
                },
                { value: "kano-kano", label: "Kano, Kano" },
                { value: "ibadan-oyo", label: "Ibadan, Oyo" },
              ]}
            />
          </div>

          <div className="block md:hidden">
            <div className="mb-4">
              <SectionTitle>Exciting events near you</SectionTitle>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <VariantSelect
                  variant="ghost"
                  icon="/icons/location.svg"
                  iconAlt="Location"
                  value={selectedLocation}
                  onValueChange={handleLocationChange}
                  options={[
                    { value: "awka-anambra", label: "Awka, Anambra" },
                    { value: "lagos-lagos", label: "Lagos, Lagos" },
                    { value: "abuja-fct", label: "Abuja, FCT" },
                    {
                      value: "port-harcourt-rivers",
                      label: "Port Harcourt, Rivers",
                    },
                    { value: "kano-kano", label: "Kano, Kano" },
                    { value: "ibadan-oyo", label: "Ibadan, Oyo" },
                  ]}
                />
              </div>

              <div className="flex-1">
                <VariantSelect
                  variant="glass"
                  placeholder="Category"
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "workshop", label: "Workshop" },
                    { value: "conference", label: "Conference" },
                    { value: "seminar", label: "Seminar" },
                    { value: "networking", label: "Networking" },
                    { value: "Bitcoin", label: "Bitcoin" },
                    { value: "Pool", label: "Pool Party" },
                    { value: "Ethereum", label: "Ethereum" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        <OfflineState />
      </div>
    );
  }

  // Handle error state
  if (isError && !isLoading && allEvents.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div>
          <div className="hidden md:block">
            <ContentHeader
              title={
                <SectionTitle>Exciting events happening near you</SectionTitle>
              }
              action={
                <VariantSelect
                  variant="glass"
                  placeholder="Category"
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "workshop", label: "Workshop" },
                    { value: "conference", label: "Conference" },
                    { value: "seminar", label: "Seminar" },
                    { value: "networking", label: "Networking" },
                    { value: "Bitcoin", label: "Bitcoin" },
                    { value: "Pool", label: "Pool Party" },
                    { value: "Ethereum", label: "Ethereum" },
                  ]}
                />
              }
            />

            <VariantSelect
              variant="ghost"
              icon="/icons/location.svg"
              iconAlt="Location"
              value={selectedLocation}
              onValueChange={handleLocationChange}
              options={[
                { value: "awka-anambra", label: "Awka, Anambra" },
                { value: "lagos-lagos", label: "Lagos, Lagos" },
                { value: "abuja-fct", label: "Abuja, FCT" },
                {
                  value: "port-harcourt-rivers",
                  label: "Port Harcourt, Rivers",
                },
                { value: "kano-kano", label: "Kano, Kano" },
                { value: "ibadan-oyo", label: "Ibadan, Oyo" },
              ]}
            />
          </div>

          <div className="block md:hidden">
            <div className="mb-4">
              <SectionTitle>Exciting events near you</SectionTitle>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <VariantSelect
                  variant="ghost"
                  icon="/icons/location.svg"
                  iconAlt="Location"
                  value={selectedLocation}
                  onValueChange={handleLocationChange}
                  options={[
                    { value: "awka-anambra", label: "Awka, Anambra" },
                    { value: "lagos-lagos", label: "Lagos, Lagos" },
                    { value: "abuja-fct", label: "Abuja, FCT" },
                    {
                      value: "port-harcourt-rivers",
                      label: "Port Harcourt, Rivers",
                    },
                    { value: "kano-kano", label: "Kano, Kano" },
                    { value: "ibadan-oyo", label: "Ibadan, Oyo" },
                  ]}
                />
              </div>

              <div className="flex-1">
                <VariantSelect
                  variant="glass"
                  placeholder="Category"
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "workshop", label: "Workshop" },
                    { value: "conference", label: "Conference" },
                    { value: "seminar", label: "Seminar" },
                    { value: "networking", label: "Networking" },
                    { value: "Bitcoin", label: "Bitcoin" },
                    { value: "Pool", label: "Pool Party" },
                    { value: "Ethereum", label: "Ethereum" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        <NetworkError
          message="Unable to load events"
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // Handle empty state
  if (!isLoading && !isError && allEvents.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div>
          <div className="hidden md:block">
            <ContentHeader
              title={
                <SectionTitle>Exciting events happening near you</SectionTitle>
              }
              action={
                <VariantSelect
                  variant="glass"
                  placeholder="Category"
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "workshop", label: "Workshop" },
                    { value: "conference", label: "Conference" },
                    { value: "seminar", label: "Seminar" },
                    { value: "networking", label: "Networking" },
                    { value: "Bitcoin", label: "Bitcoin" },
                    { value: "Pool", label: "Pool Party" },
                    { value: "Ethereum", label: "Ethereum" },
                  ]}
                />
              }
            />

            <VariantSelect
              variant="ghost"
              icon="/icons/location.svg"
              iconAlt="Location"
              value={selectedLocation}
              onValueChange={handleLocationChange}
              options={[
                { value: "awka-anambra", label: "Awka, Anambra" },
                { value: "lagos-lagos", label: "Lagos, Lagos" },
                { value: "abuja-fct", label: "Abuja, FCT" },
                {
                  value: "port-harcourt-rivers",
                  label: "Port Harcourt, Rivers",
                },
                { value: "kano-kano", label: "Kano, Kano" },
                { value: "ibadan-oyo", label: "Ibadan, Oyo" },
              ]}
            />
          </div>

          <div className="block md:hidden">
            <div className="mb-4">
              <SectionTitle>Exciting events near you</SectionTitle>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <VariantSelect
                  variant="ghost"
                  icon="/icons/location.svg"
                  iconAlt="Location"
                  value={selectedLocation}
                  onValueChange={handleLocationChange}
                  options={[
                    { value: "awka-anambra", label: "Awka, Anambra" },
                    { value: "lagos-lagos", label: "Lagos, Lagos" },
                    { value: "abuja-fct", label: "Abuja, FCT" },
                    {
                      value: "port-harcourt-rivers",
                      label: "Port Harcourt, Rivers",
                    },
                    { value: "kano-kano", label: "Kano, Kano" },
                    { value: "ibadan-oyo", label: "Ibadan, Oyo" },
                  ]}
                />
              </div>

              <div className="flex-1">
                <VariantSelect
                  variant="glass"
                  placeholder="Category"
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "workshop", label: "Workshop" },
                    { value: "conference", label: "Conference" },
                    { value: "seminar", label: "Seminar" },
                    { value: "networking", label: "Networking" },
                    { value: "Bitcoin", label: "Bitcoin" },
                    { value: "Pool", label: "Pool Party" },
                    { value: "Ethereum", label: "Ethereum" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        <EmptyState
          title="No events found"
          message={
            selectedCategory !== "all"
              ? "No events match your selected filters. Try adjusting your search criteria."
              : "No events available in this location."
          }
          actionLabel={selectedCategory !== "all" ? "Clear Filters" : undefined}
          onAction={selectedCategory !== "all" ? handleClearFilters : undefined}
        />
      </div>
    );
  }

  // Normal render with data
  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        {/* Desktop: Category in header, Location below */}
        <div className="hidden md:block">
          <ContentHeader
            title={
              <SectionTitle>Exciting events happening near you</SectionTitle>
            }
            action={
              <VariantSelect
                variant="glass"
                placeholder="Category"
                value={selectedCategory}
                onValueChange={handleCategoryChange}
                options={[
                  { value: "all", label: "All Categories" },
                  { value: "workshop", label: "Workshop" },
                  { value: "conference", label: "Conference" },
                  { value: "seminar", label: "Seminar" },
                  { value: "networking", label: "Networking" },
                  { value: "Bitcoin", label: "Bitcoin" },
                  { value: "Pool", label: "Pool Party" },
                  { value: "Ethereum", label: "Ethereum" },
                ]}
              />
            }
          />

          <VariantSelect
            variant="ghost"
            icon="/icons/location.svg"
            iconAlt="Location"
            value={selectedLocation}
            onValueChange={handleLocationChange}
            options={[
              { value: "awka-anambra", label: "Awka, Anambra" },
              { value: "lagos-lagos", label: "Lagos, Lagos" },
              { value: "abuja-fct", label: "Abuja, FCT" },
              { value: "port-harcourt-rivers", label: "Port Harcourt, Rivers" },
              { value: "kano-kano", label: "Kano, Kano" },
              { value: "ibadan-oyo", label: "Ibadan, Oyo" },
            ]}
          />
        </div>

        {/* Mobile: Title and both selects in same row */}
        <div className="block md:hidden">
          <div className="mb-4">
            <SectionTitle>Exciting events near you</SectionTitle>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <VariantSelect
                variant="ghost"
                icon="/icons/location.svg"
                iconAlt="Location"
                value={selectedLocation}
                onValueChange={handleLocationChange}
                options={[
                  { value: "awka-anambra", label: "Awka, Anambra" },
                  { value: "lagos-lagos", label: "Lagos, Lagos" },
                  { value: "abuja-fct", label: "Abuja, FCT" },
                  {
                    value: "port-harcourt-rivers",
                    label: "Port Harcourt, Rivers",
                  },
                  { value: "kano-kano", label: "Kano, Kano" },
                  { value: "ibadan-oyo", label: "Ibadan, Oyo" },
                ]}
              />
            </div>

            <div className="flex-1">
              <VariantSelect
                variant="glass"
                placeholder="Category"
                value={selectedCategory}
                onValueChange={handleCategoryChange}
                options={[
                  { value: "all", label: "All Categories" },
                  { value: "workshop", label: "Workshop" },
                  { value: "conference", label: "Conference" },
                  { value: "seminar", label: "Seminar" },
                  { value: "networking", label: "Networking" },
                  { value: "Bitcoin", label: "Bitcoin" },
                  { value: "Pool", label: "Pool Party" },
                  { value: "Ethereum", label: "Ethereum" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

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
            Showing {allEvents.length} of {data?.data?.totalCount || 0}{" "}
            events ({currentPage} of {totalPages} pages loaded)
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