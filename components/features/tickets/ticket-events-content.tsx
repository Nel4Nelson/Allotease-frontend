/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TicketEventCard } from "./ticket-event-card";
import {
  EventTicketService,
  EventTicketBooking,
  GetEventTicketsParams,
} from "@/services/event-ticket-service";
import { EventService } from "@/services/events-service";
import { useAuthStore } from "@/stores/auth-store";

interface TicketEventsContentProps {
  className?: string;
}

interface EventDetails {
  [eventId: string]: {
    title: string;
    coverImage?: string;
  };
}

export function TicketEventsContent({
  className = "",
}: TicketEventsContentProps) {
  const router = useRouter();
  const { isAuthenticated, checkTokenExpiry } = useAuthStore();

  // State management
  const [tickets, setTickets] = useState<EventTicketBooking[]>([]);
  const [eventDetails, setEventDetails] = useState<EventDetails>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch event tickets
  const fetchEventTickets = useCallback(
    async (page: number = 1, append: boolean = false) => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      if (!checkTokenExpiry()) {
        setLoading(false);
        return;
      }

      try {
        if (!append) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }
        setError(null);

        const params: GetEventTicketsParams = {
          status: "all",
          page,
          limit: 20,
        };

        const response = await EventTicketService.getEventTickets(params);

        if (response.status === "success") {
          const newTickets = response.data.items;

          if (append) {
            setTickets((prev) => [...prev, ...newTickets]);
          } else {
            setTickets(newTickets);
          }

          setCurrentPage(response.data.page);
          setHasNextPage(response.data.hasNextPage);

          // Fetch event details for tickets that don't have them yet
          await fetchMissingEventDetails(newTickets);
        } else {
          setError("Failed to load event tickets");
        }
      } catch (error) {
        console.error("Error fetching event tickets:", error);
        setError("Failed to load event tickets. Please try again.");
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [isAuthenticated, checkTokenExpiry]
  );

  // Fetch event details for tickets
  const fetchMissingEventDetails = async (newTickets: EventTicketBooking[]) => {
    const uniqueEventIds = Array.from(
      new Set(newTickets.map((ticket) => ticket.eventId))
    );

    const detailsToFetch = uniqueEventIds.filter(
      (eventId) => !eventDetails[eventId]
    );

    if (detailsToFetch.length === 0) return;

    try {
      const detailsPromises = detailsToFetch.map(async (eventId) => {
        try {
          const response = await EventService.getEventById(eventId);
          if (response.status === "success") {
            return {
              eventId,
              title: response.data.event.title,
              coverImage: response.data.event.coverImage,
            };
          }
        } catch (error) {
          console.error(`Failed to fetch details for event ${eventId}:`, error);
          return {
            eventId,
            title: "Event Details Unavailable",
            coverImage: undefined,
          };
        }
      });

      const results = await Promise.all(detailsPromises);
      const newDetails: EventDetails = {};

      results.forEach((result) => {
        if (result) {
          newDetails[result.eventId] = {
            title: result.title,
            coverImage: result.coverImage,
          };
        }
      });

      setEventDetails((prev) => ({ ...prev, ...newDetails }));
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  // Load more tickets
  const loadMoreTickets = () => {
    if (!isLoadingMore && hasNextPage) {
      fetchEventTickets(currentPage + 1, true);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEventTickets(1, false);
  }, [fetchEventTickets]);

  // Handle event card click
  const handleEventClick = (eventId: string) => {
    router.push(`/${eventId}`);
  };

  // Handle get another ticket
  const handleGetTicket = (eventId: string) => {
    router.push(`/${eventId}`);
  };

  // Group tickets by status
  const groupedTickets = EventTicketService.groupTicketsByStatus(tickets);
  const upcomingTickets = EventTicketService.sortTicketsByDate(
    groupedTickets.upcoming,
    "asc"
  );
  const pastTickets = EventTicketService.sortTicketsByDate(
    groupedTickets.past,
    "desc"
  );

  // Loading state
  if (loading && tickets.length === 0) {
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-96 animate-pulse" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-gray-100 rounded-lg animate-pulse"
              >
                <div className="w-24 h-16 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="text-center py-12">
          <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
          <button
            onClick={() => fetchEventTickets(1, false)}
            className="text-gray-500 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // No tickets state
  if (!loading && tickets.length === 0) {
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="text-center py-12">
          <div className="text-gray-600 text-lg font-semibold mb-2">
            No event tickets found
          </div>
          <div className="text-gray-500">
            You haven't booked any events yet. Start exploring events to book
            your first ticket!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Upcoming Events Section */}
      {upcomingTickets.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2
              style={{
                color: "var(--Title, #1F2024)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "140%",
                letterSpacing: "-0.48px",
                margin: 0,
              }}
            >
              Events
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
              Find tickets about the events you are excited to hear...
            </p>
          </div>

          <div className="space-y-4">
            {upcomingTickets.map((ticket) => {
              const details = eventDetails[ticket.eventId];
              return (
                <TicketEventCard
                  key={ticket._id}
                  title={details?.title || "Loading event details..."}
                  dateTime={EventTicketService.formatEventDateTime(
                    ticket.startTime
                  )}
                  imageUrl={
                    details?.coverImage ||
                    EventService.getEventCoverImage({
                      coverImage: details?.coverImage,
                    } as any)
                  }
                  badgeText={EventTicketService.getStatusBadgeText(
                    ticket.status,
                    ticket.startTime
                  )}
                  ticketCount={ticket.numberOfSeats}
                  totalPrice={ticket.totalPrice}
                  status={ticket.status}
                  onClick={() => handleEventClick(ticket.eventId)}
                  onGetTicket={() => handleGetTicket(ticket.eventId)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Past Events Section */}
      {pastTickets.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2
              style={{
                color: "var(--Title, #1F2024)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "140%",
                letterSpacing: "-0.48px",
                margin: 0,
              }}
            >
              Past events
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
              Find details about the events you are enrolled in here.
            </p>
          </div>

          <div className="space-y-4">
            {pastTickets.map((ticket) => {
              const details = eventDetails[ticket.eventId];
              return (
                <TicketEventCard
                  key={ticket._id}
                  title={details?.title || "Loading event details..."}
                  dateTime={EventTicketService.formatEventDateTime(
                    ticket.startTime
                  )}
                  imageUrl={
                    details?.coverImage ||
                    EventService.getEventCoverImage({
                      coverImage: details?.coverImage,
                    } as any)
                  }
                  badgeText={EventTicketService.getStatusBadgeText(
                    ticket.status,
                    ticket.startTime
                  )}
                  ticketCount={ticket.numberOfSeats}
                  totalPrice={ticket.totalPrice}
                  status={ticket.status}
                  onClick={() => handleEventClick(ticket.eventId)}
                  onGetTicket={() => handleGetTicket(ticket.eventId)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center py-4">
          <button
            onClick={loadMoreTickets}
            disabled={isLoadingMore}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
