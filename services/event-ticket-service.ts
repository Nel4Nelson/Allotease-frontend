/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "./api-client";
import { EventService } from "./events-service";
import type { Event } from "./events-service";
import { useAuthStore } from "@/stores/auth-store";

// Booking interface from API response
export interface EventBooking {
  bookingId: string;
  numberOfSeats: number;
  totalPrice: number;
  startTime: string;
  endTime: string;
  status: "active" | "expired";
}

// Event ticket group interface
export interface EventTicketGroup {
  _id: {
    eventId: string;
    userId: string;
  };
  totalSeats: number;
  bookings: EventBooking[];
}

// Event ticket with full event details
export interface EventTicketWithDetails extends EventTicketGroup {
  eventDetails?: Event;
}

// API response interface
export interface GetEventTicketsResponse {
  status: string;
  message: string;
  data: {
    items: EventTicketGroup[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPages: number;
    totalCount: number;
    limit: number;
    page: number;
  };
}

// Query parameters
export interface GetEventTicketsParams {
  status?: "all" | "active" | "expired";
  page?: number;
  limit?: number;
  [key: string]: any;
}

export class EventTicketService {
  private static readonly ENDPOINTS = {
    GET_EVENT_TICKETS: "/book/event",
  } as const;

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const { isAuthenticated } = useAuthStore.getState();
    return isAuthenticated;
  }

  /**
   * Get event tickets with pagination and status filter
   */
  static async getEventTickets(
    params: GetEventTicketsParams = {}
  ): Promise<GetEventTicketsResponse> {
    // Check authentication
    if (!this.isAuthenticated()) {
      throw new Error("User must be authenticated to view event tickets");
    }

    try {
      const queryParams = new URLSearchParams();

      // Add default params
      queryParams.append("page", (params.page || 1).toString());
      queryParams.append("limit", (params.limit || 10).toString());

      // Add status param
      const apiStatus = params.status || "all";
      queryParams.append("status", apiStatus);

      // Add any additional params
      Object.keys(params).forEach((key) => {
        if (!["page", "limit", "status"].includes(key) && params[key]) {
          queryParams.append(key, params[key].toString());
        }
      });

      const url = `${this.ENDPOINTS.GET_EVENT_TICKETS}?${queryParams.toString()}`;

      const response = await apiClient.get<GetEventTicketsResponse>(url);

      return response;
    } catch (error: any) {
      // Handle 401 specifically
      if (error?.response?.status === 401) {
        console.log("User session expired, clearing auth");
        useAuthStore.getState().clearAuth();
        throw new Error("User must be authenticated to view event tickets");
      }

      console.error("Failed to fetch event tickets:", error);
      throw error;
    }
  }

  /**
   * Fetch event tickets with full event details
   */
  static async getEventTicketsWithDetails(
    params: GetEventTicketsParams = {}
  ): Promise<EventTicketWithDetails[]> {
    try {
      const response = await this.getEventTickets(params);

      // Fetch event details for each ticket group
      const ticketsWithDetails = await Promise.all(
        response.data.items.map(async (ticketGroup) => {
          try {
            const eventResponse = await EventService.getEventById(
              ticketGroup._id.eventId
            );

            return {
              ...ticketGroup,
              eventDetails: eventResponse.data.event,
            };
          } catch (error) {
            console.error(
              `Failed to fetch event details for ${ticketGroup._id.eventId}:`,
              error
            );
            return {
              ...ticketGroup,
              eventDetails: undefined,
            };
          }
        })
      );

      return ticketsWithDetails;
    } catch (error) {
      console.error("Failed to fetch event tickets with details:", error);
      throw error;
    }
  }

  /**
   * Calculate time until event starts (for active events)
   */
  static calculateTimeUntilStart(startTime: string): string {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const diffTime = start - now;

    if (diffTime <= 0) {
      return "Event has started";
    }

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffDays > 0) {
      return `Event starts in ${diffDays} ${diffDays === 1 ? "day" : "days"} ${diffHours} ${diffHours === 1 ? "hour" : "hours"}`;
    } else if (diffHours > 0) {
      const diffMinutes = Math.floor(
        (diffTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      return `Event starts in ${diffHours} ${diffHours === 1 ? "hour" : "hours"} ${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"}`;
    } else {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `Event starts in ${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"}`;
    }
  }

  /**
   * Calculate time since event ended (for expired events)
   */
  static calculateTimeSinceEnd(endTime: string): string {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diffTime = now - end;

    if (diffTime <= 0) {
      return "Event ongoing";
    }

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Event ended today";
    } else if (diffDays === 1) {
      return "Event ended yesterday";
    } else {
      return `Event ended ${diffDays} days ago`;
    }
  }

  /**
   * Calculate total price for all bookings
   */
  static calculateTotalPrice(bookings: EventBooking[]): number {
    return bookings.reduce((total, booking) => total + booking.totalPrice, 0);
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number): string {
    return price === 0
      ? "Free"
      : `₦${new Intl.NumberFormat("en-NG").format(price)}`;
  }

  /**
   * Map event ticket to card format
   */
  static mapToEventTicketCard(
    ticketWithDetails: EventTicketWithDetails
  ): {
    eventId: string;
    userId: string;
    title: string;
    imageUrl: string;
    startTime: string;
    endTime: string;
    totalSeats: number;
    totalBookings: number;
    totalPrice: number;
    bookings: EventBooking[];
    status: "active" | "expired";
    countdownText: string;
  } | null {
    // Return null if event details not found
    if (!ticketWithDetails.eventDetails) {
      return null;
    }

    const event = ticketWithDetails.eventDetails;
    const firstBooking = ticketWithDetails.bookings[0];
    const totalPrice = this.calculateTotalPrice(ticketWithDetails.bookings);

    // Determine overall status (if any booking is active, event is active)
    const status = ticketWithDetails.bookings.some((b) => b.status === "active")
      ? "active"
      : "expired";

    // Calculate countdown based on status
    const countdownText =
      status === "active"
        ? this.calculateTimeUntilStart(firstBooking.startTime)
        : this.calculateTimeSinceEnd(firstBooking.endTime);

    return {
      eventId: ticketWithDetails._id.eventId,
      userId: ticketWithDetails._id.userId,
      title: event.title,
      imageUrl: EventService.getEventCoverImage(event),
      startTime: firstBooking.startTime,
      endTime: firstBooking.endTime,
      totalSeats: ticketWithDetails.totalSeats,
      totalBookings: ticketWithDetails.bookings.length,
      totalPrice: totalPrice,
      bookings: ticketWithDetails.bookings,
      status: status,
      countdownText: countdownText,
    };
  }
}