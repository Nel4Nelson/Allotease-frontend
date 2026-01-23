/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { TicketsSectionHeader } from "./tickets-section-header";
import { ActiveEventTicketCard } from "./active-event-ticket-card";
import { ShowMoreSection } from "./show-more-section";
import { useIsOnline } from "@/hooks/use-network-status";
import { NetworkError, OfflineState } from "@/components/ui/network-error";
import { useQueryClient } from "@tanstack/react-query";
import {
  useEventTickets,
  useLoadMoreEventTickets,
  eventTicketKeys,
} from "@/hooks/use-event-tickets";
import {
  EventTicketService,
  EventTicketWithDetails,
} from "@/services/event-ticket-service";
import { ActiveEventTicketCardSkeletonGrid } from "@/components/ui/loading-skeletons/active-event-ticket-card-skeleton";

export function TicketEventsContent() {
  const router = useRouter();
  const isOnline = useIsOnline();
  const queryClient = useQueryClient();

  // State for active events
  const [activePage, setActivePage] = useState(1);
  const [allActiveEvents, setAllActiveEvents] = useState<
    EventTicketWithDetails[]
  >([]);
  const [isLoadingMoreActive, setIsLoadingMoreActive] = useState(false);
  const [hasMoreActive, setHasMoreActive] = useState(true);
  const loadingMoreActiveRef = useRef(false);

  // State for expired events
  const [expiredPage, setExpiredPage] = useState(1);
  const [allExpiredEvents, setAllExpiredEvents] = useState<
    EventTicketWithDetails[]
  >([]);
  const [isLoadingMoreExpired, setIsLoadingMoreExpired] = useState(false);
  const [hasMoreExpired, setHasMoreExpired] = useState(true);
  const loadingMoreExpiredRef = useRef(false);

  // Fetch active events
  const {
    data: activeData,
    isLoading: isLoadingActive,
    isError: isErrorActive,
    refetch: refetchActive,
  } = useEventTickets({
    status: "active",
    page: activePage,
    limit: 3,
  });

  // Fetch expired events
  const {
    data: expiredData,
    isLoading: isLoadingExpired,
    isError: isErrorExpired,
    refetch: refetchExpired,
  } = useEventTickets({
    status: "expired",
    page: expiredPage,
    limit: 3,
  });

  // Load more mutations
  const loadMoreActiveMutation = useLoadMoreEventTickets();
  const loadMoreExpiredMutation = useLoadMoreEventTickets();

  // Handle initial load for active events
  useEffect(() => {
    if (activeData) {
      if (activePage === 1) {
        setAllActiveEvents(activeData);
      } else {
        setAllActiveEvents((prev) => {
          const existingIds = new Set(prev.map((e) => e._id.eventId));
          const newItems = activeData.filter(
            (item) => !existingIds.has(item._id.eventId)
          );
          return [...prev, ...newItems];
        });
      }

      // Note: Since we're getting array directly, we need to track pagination differently
      // For now, assume hasNextPage based on returned items
      setHasMoreActive(activeData.length >= 3);

      if (activePage > 1) {
        setIsLoadingMoreActive(false);
        loadingMoreActiveRef.current = false;
      }
    }
  }, [activeData, activePage]);

  // Handle initial load for expired events
  useEffect(() => {
    if (expiredData) {
      if (expiredPage === 1) {
        setAllExpiredEvents(expiredData);
      } else {
        setAllExpiredEvents((prev) => {
          const existingIds = new Set(prev.map((e) => e._id.eventId));
          const newItems = expiredData.filter(
            (item) => !existingIds.has(item._id.eventId)
          );
          return [...prev, ...newItems];
        });
      }

      setHasMoreExpired(expiredData.length >= 3);

      if (expiredPage > 1) {
        setIsLoadingMoreExpired(false);
        loadingMoreExpiredRef.current = false;
      }
    }
  }, [expiredData, expiredPage]);

  // Refetch when coming back online
  useEffect(() => {
    if (isOnline && isErrorActive) {
      refetchActive();
    }
    if (isOnline && isErrorExpired) {
      refetchExpired();
    }
  }, [isOnline, isErrorActive, isErrorExpired, refetchActive, refetchExpired]);

  // Handlers for active events
  const handleShowMoreActive = async () => {
    if (
      loadingMoreActiveRef.current ||
      isLoadingMoreActive ||
      !hasMoreActive ||
      !isOnline
    ) {
      return;
    }

    const nextPage = activePage + 1;

    try {
      loadingMoreActiveRef.current = true;
      setIsLoadingMoreActive(true);

      await loadMoreActiveMutation.mutateAsync({
        status: "active",
        page: nextPage,
        limit: 3,
      });

      setActivePage(nextPage);
    } catch (error) {
      console.error("Failed to load more active events:", error);
      loadingMoreActiveRef.current = false;
      setIsLoadingMoreActive(false);
    }
  };

  const handleCollapseActive = () => {
    if (activePage > 1) {
      const newPage = activePage - 1;
      const itemsPerPage = 3;

      const firstPageData = queryClient.getQueryData<EventTicketWithDetails[]>(
        eventTicketKeys.list({
          status: "active",
          page: 1,
          limit: 3,
        })
      );

      if (firstPageData) {
        const itemsToKeep = newPage * itemsPerPage;
        const newItems = firstPageData.slice(0, itemsToKeep);

        queryClient.setQueryData(
          eventTicketKeys.list({
            status: "active",
            page: 1,
            limit: 3,
          }),
          newItems
        );

        setActivePage(newPage);
      }
    }
  };

  // Handlers for expired events
  const handleShowMoreExpired = async () => {
    if (
      loadingMoreExpiredRef.current ||
      isLoadingMoreExpired ||
      !hasMoreExpired ||
      !isOnline
    ) {
      return;
    }

    const nextPage = expiredPage + 1;

    try {
      loadingMoreExpiredRef.current = true;
      setIsLoadingMoreExpired(true);

      await loadMoreExpiredMutation.mutateAsync({
        status: "expired",
        page: nextPage,
        limit: 3,
      });

      setExpiredPage(nextPage);
    } catch (error) {
      console.error("Failed to load more expired events:", error);
      loadingMoreExpiredRef.current = false;
      setIsLoadingMoreExpired(false);
    }
  };

  const handleCollapseExpired = () => {
    if (expiredPage > 1) {
      const newPage = expiredPage - 1;
      const itemsPerPage = 3;

      const firstPageData = queryClient.getQueryData<EventTicketWithDetails[]>(
        eventTicketKeys.list({
          status: "expired",
          page: 1,
          limit: 3,
        })
      );

      if (firstPageData) {
        const itemsToKeep = newPage * itemsPerPage;
        const newItems = firstPageData.slice(0, itemsToKeep);

        queryClient.setQueryData(
          eventTicketKeys.list({
            status: "expired",
            page: 1,
            limit: 3,
          }),
          newItems
        );

        setExpiredPage(newPage);
      }
    }
  };

  const handleViewEvent = (eventId: string) => {
    router.push(`/${eventId}?type=events`);
  };

  const handleResetActive = () => {
    setActivePage(1);
    setAllActiveEvents([]);
    setIsLoadingMoreActive(false);
    setHasMoreActive(true);
    loadingMoreActiveRef.current = false;
  };

  const handleResetExpired = () => {
    setExpiredPage(1);
    setAllExpiredEvents([]);
    setIsLoadingMoreExpired(false);
    setHasMoreExpired(true);
    loadingMoreExpiredRef.current = false;
  };

  // Map events to card format
  const mappedActiveEvents = allActiveEvents
    .map((event) => EventTicketService.mapToEventTicketCard(event))
    .filter((event) => event !== null);

  const mappedExpiredEvents = allExpiredEvents
    .map((event) => EventTicketService.mapToEventTicketCard(event))
    .filter((event) => event !== null);

  return (
    <div className="space-y-12">
      {/* Active Events Section */}
      <div className="space-y-6">
        <TicketsSectionHeader
          title="Your active events"
          subtitle="Find details about the events you are enrolled in here."
        />

        {!isOnline && allActiveEvents.length === 0 ? (
          <OfflineState />
        ) : isErrorActive &&
          !isLoadingActive &&
          allActiveEvents.length === 0 ? (
          <NetworkError
            message="Failed to load active events"
            onRetry={() => {
              handleResetActive();
              refetchActive();
            }}
          />
        ) : isLoadingActive && allActiveEvents.length === 0 ? (
          <ActiveEventTicketCardSkeletonGrid count={3} />
        ) : !isLoadingActive &&
          !isErrorActive &&
          allActiveEvents.length === 0 ? (
          <div className="flex flex-col items-center gap-4 p-8 bg-gray-50 rounded-2xl text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                No Active Events
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You don't have any active event bookings
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2 bg-[var(--feature-accent-orange)] hover:bg-[#E54A00] text-white rounded-full font-semibold transition-colors"
              >
                Browse Events
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {mappedActiveEvents.map((event, index) => (
                <ActiveEventTicketCard
                  key={`${event!.eventId}-${index}`}
                  eventId={event!.eventId}
                  title={event!.title}
                  imageUrl={event!.imageUrl}
                  startTime={event!.startTime}
                  endTime={event!.endTime}
                  totalSeats={event!.totalSeats}
                  totalBookings={event!.totalBookings}
                  totalPrice={event!.totalPrice}
                  bookings={event!.bookings}
                  status={event!.status}
                  onViewEvent={() => handleViewEvent(event!.eventId)}
                />
              ))}
            </div>

            <ShowMoreSection
              showMoreButton={hasMoreActive}
              showCollapseButton={activePage > 1}
              onShowMore={handleShowMoreActive}
              onCollapse={handleCollapseActive}
              isLoading={isLoadingMoreActive}
              loadingText="Loading more events..."
              showMoreText="Show more"
              statusInfo={{
                currentCount: mappedActiveEvents.length,
                totalCount: mappedActiveEvents.length,
                currentPage: activePage,
                totalPages: activePage,
              }}
            />
          </>
        )}
      </div>

      {/* Expired Events Section */}
      <div className="space-y-6">
        <TicketsSectionHeader
          title="Your past events"
          subtitle="Find details about the events you attended."
        />

        {!isOnline && allExpiredEvents.length === 0 ? (
          <OfflineState />
        ) : isErrorExpired &&
          !isLoadingExpired &&
          allExpiredEvents.length === 0 ? (
          <NetworkError
            message="Failed to load past events"
            onRetry={() => {
              handleResetExpired();
              refetchExpired();
            }}
          />
        ) : isLoadingExpired && allExpiredEvents.length === 0 ? (
          <ActiveEventTicketCardSkeletonGrid count={3} />
        ) : !isLoadingExpired &&
          !isErrorExpired &&
          allExpiredEvents.length === 0 ? (
          <div className="flex flex-col items-center gap-4 p-8 bg-gray-50 rounded-2xl text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                No Past Events
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You haven't attended any events yet
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2 bg-[var(--feature-accent-orange)] hover:bg-[#E54A00] text-white rounded-full font-semibold transition-colors"
              >
                Browse Events
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {mappedExpiredEvents.map((event, index) => (
                <ActiveEventTicketCard
                  key={`${event!.eventId}-${index}`}
                  eventId={event!.eventId}
                  title={event!.title}
                  imageUrl={event!.imageUrl}
                  startTime={event!.startTime}
                  endTime={event!.endTime}
                  totalSeats={event!.totalSeats}
                  totalBookings={event!.totalBookings}
                  totalPrice={event!.totalPrice}
                  bookings={event!.bookings}
                  status={event!.status}
                  onViewEvent={() => handleViewEvent(event!.eventId)}
                />
              ))}
            </div>

            <ShowMoreSection
              showMoreButton={hasMoreExpired}
              showCollapseButton={expiredPage > 1}
              onShowMore={handleShowMoreExpired}
              onCollapse={handleCollapseExpired}
              isLoading={isLoadingMoreExpired}
              loadingText="Loading more past events..."
              showMoreText="Show more"
              statusInfo={{
                currentCount: mappedExpiredEvents.length,
                totalCount: mappedExpiredEvents.length,
                currentPage: expiredPage,
                totalPages: expiredPage,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}