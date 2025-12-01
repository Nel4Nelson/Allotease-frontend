/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { EventService, Event } from "@/services/events-service";
import { EventCard } from "@/components/ui/event-card";
import { StaysGridSkeleton } from "@/components/ui/loading-skeletons/stay-card-skeleton";
import { Button } from "@/components/ui/button";
import {
  NetworkError,
  EmptyState,
  OfflineState,
} from "@/components/ui/network-error";
import { useIsOnline } from "@/hooks/use-network-status";
import { useEvents, eventsKeys } from "@/hooks/use-events";
import { UnverifiedEventModal } from "@/components/ui/modals/unverified-event-modal";

interface AllocationAdminEventsContentProps {
  allocatorId: string;
}

export function AllocationAdminEventsContent({ allocatorId }: AllocationAdminEventsContentProps) {
  const router = useRouter();
  const isOnline = useIsOnline();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedEvents, setAccumulatedEvents] = useState<Event[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [showUnverifiedModal, setShowUnverifiedModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; title: string; isVerified: boolean } | null>(null);

  // Build query params with allocatorId filter
  const baseQueryParams = {
    page: 1,
    limit: 12,
    allocatorId: allocatorId, // Filter by this allocator
  };

  const { data, isLoading, isError, isFetched, refetch } =
    useEvents(baseQueryParams);

  // Update accumulated events ONLY on initial load
  useEffect(() => {
    if (data?.data?.items && accumulatedEvents.length === 0) {
      setAccumulatedEvents(data.data.items);
    }
  }, [data?.data?.items]);

  // Refetch when coming back online
  useEffect(() => {
    if (isOnline && isError) {
      refetch();
    }
  }, [isOnline, isError, refetch]);

  // Show more events
  const handleShowMore = async () => {
    if (data?.data?.hasNextPage && isOnline && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setIsLoadingMore(true);

      try {
        const response = await EventService.getAllEvents({
          ...baseQueryParams,
          page: nextPage,
        });

        if (response.status === "success") {
          // Append new items to accumulated list
          const newAccumulatedEvents = [...accumulatedEvents, ...response.data.items];
          setAccumulatedEvents(newAccumulatedEvents);
          setCurrentPage(nextPage);

          // Update cache
          const updatedData = {
            ...data,
            data: {
              ...data.data,
              items: newAccumulatedEvents,
              hasNextPage: response.data.hasNextPage,
            },
          };

          queryClient.setQueryData(eventsKeys.list(baseQueryParams), updatedData);
        }
      } catch (error) {
        console.error("Failed to load more events:", error);
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
      const newEvents = accumulatedEvents.slice(0, itemsToKeep);

      setAccumulatedEvents(newEvents);
      setCurrentPage(newPage);

      // Update cache
      if (data) {
        const updatedData = {
          ...data,
          data: {
            ...data.data,
            items: newEvents,
            hasNextPage: newPage < (data?.data?.totalPages || 1),
          },
        };

        queryClient.setQueryData(eventsKeys.list(baseQueryParams), updatedData);
      }
    }
  };

  // Update handleEventClick with verification logic
  const handleEventClick = (eventId: string, eventTitle: string, isVerified: boolean) => {
    if (!isVerified) {
      // Show warning modal for unverified events
      setSelectedEvent({ id: eventId, title: eventTitle, isVerified });
      setShowUnverifiedModal(true);
    } else {
      // Navigate directly for verified events
      router.push(`/${eventId}?type=events`);
    }
  };

  // Add proceed handler
  const handleProceedToEvent = () => {
    if (selectedEvent) {
      router.push(`/${selectedEvent.id}?type=events`);
      setShowUnverifiedModal(false);
      setSelectedEvent(null);
    }
  };

  // Retry handler
  const handleRetry = () => {
    refetch();
  };

  // Get all events from accumulated state
  const allEvents = accumulatedEvents;

  // Loading state
  const isLoadingData = isLoading || (!isFetched && allEvents.length === 0);

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
        <StaysGridSkeleton count={6} />
      </div>
    );
  }

  // Handle offline state
  if (!isOnline && allEvents.length === 0) {
    return (
      <div className="p-6">
        <OfflineState />
      </div>
    );
  }

  // Handle error state
  if (isError && !isLoading && allEvents.length === 0) {
    return (
      <div className="p-6">
        <NetworkError
          message="Unable to load events"
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // Handle empty state
  if (!isLoading && !isError && isFetched && allEvents.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="No events found"
          message="This allocation admin hasn't created any events yet or doesn't have any future events"
        />
      </div>
    );
  }

  // Normal render with data
  return (
    <div className="p-6 space-y-6">
      {/* Events Grid */}
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
            isVerified={event.isVerified}
            onClick={() => handleEventClick(event._id, event.title, event.isVerified)}
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
            <span>Loading more events...</span>
          </div>
        </div>
      )}

      {/* Status info */}
      {allEvents.length > itemsPerPage && (
        <div className="flex justify-center text-sm text-gray-500">
          <span>
            Showing {allEvents.length} of {data?.data?.totalCount || 0} events
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

      {/* Unverified Event Modal */}
      <UnverifiedEventModal
        isOpen={showUnverifiedModal}
        onClose={() => {
          setShowUnverifiedModal(false);
          setSelectedEvent(null);
        }}
        onProceed={handleProceedToEvent}
        eventTitle={selectedEvent?.title || ""}
      />
    </div>
  );
}