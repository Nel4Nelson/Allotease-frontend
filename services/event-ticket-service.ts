/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiClient } from "./api-client";

// Event ticket booking interface
export interface EventTicketBooking {
  _id: string;
  ownerId: string;
  clientId: string;
  status: "active" | "cancelled" | "completed";
  totalPrice: number;
  type: "event";
  eventId: string;
  numberOfSeats: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// API response interface for getting event tickets
interface GetEventTicketsResponse {
  status: string;
  message: string;
  data: {
    items: EventTicketBooking[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    page: number;
    totalCount: number;
    totalPages: number;
  };
}

// Query parameters for getting event tickets
export interface GetEventTicketsParams {
  status?: "all" | "active" | "cancelled" | "completed";
  page?: number;
  limit?: number;
  eventId?: string;
}

export class EventTicketService {
  private static readonly ENDPOINTS = {
    GET_EVENT_TICKETS: "/book/event",
  } as const;

  /**
   * Get user's event tickets with pagination and filters
   */
  static async getEventTickets(
    params: GetEventTicketsParams = {}
  ): Promise<GetEventTicketsResponse> {
    try {
      const queryParams = new URLSearchParams();

      // Add default params
      queryParams.append("status", params.status || "all");
      queryParams.append("page", (params.page || 1).toString());
      queryParams.append("limit", (params.limit || 100).toString());

      // Add optional params
      if (params.eventId) {
        queryParams.append("eventId", params.eventId);
      }

      const url = `${
        this.ENDPOINTS.GET_EVENT_TICKETS
      }?${queryParams.toString()}`;
      const response = await apiClient.get<GetEventTicketsResponse>(url);

      return response;
    } catch (error) {
      console.error("Failed to fetch event tickets:", error);
      throw error;
    }
  }

  /**
   * Format event date and time for display
   */
  static formatEventDateTime(startTime: string, endTime?: string): string {
    try {
      const startDate = new Date(startTime);
      const dayName = startDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const time = startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      // Get timezone offset
      const timeZone = startDate
        .toLocaleTimeString("en-US", { timeZoneName: "short" })
        .split(" ")[2];

      return `${dayName} • ${time} ${timeZone}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date TBD";
    }
  }

  /**
   * Format ticket price for display
   */
  static formatTicketPrice(price: number): string {
    return price === 0 ? "Free" : `₦${price.toLocaleString()}`;
  }

  /**
   * Get status badge text
   */
  static getStatusBadgeText(
    status: EventTicketBooking["status"],
    startTime: string
  ): string {
    const now = new Date();
    const eventStart = new Date(startTime);

    switch (status) {
      case "active":
        return eventStart > now ? "Upcoming" : "Active";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  }

  /**
   * Check if event is past
   */
  static isEventPast(endTime: string): boolean {
    const now = new Date();
    const eventEnd = new Date(endTime);
    return eventEnd < now;
  }

  /**
   * Get ticket summary statistics
   */
  static getTicketStats(tickets: EventTicketBooking[]) {
    const stats = {
      total: tickets.length,
      active: 0,
      completed: 0,
      cancelled: 0,
      upcoming: 0,
      past: 0,
      totalSpent: 0,
    };

    const now = new Date();

    tickets.forEach((ticket) => {
      // Count by status
      stats[ticket.status]++;

      // Count by time
      const eventStart = new Date(ticket.startTime);
      if (eventStart > now) {
        stats.upcoming++;
      } else {
        stats.past++;
      }

      // Calculate total spent
      if (ticket.status !== "cancelled") {
        stats.totalSpent += ticket.totalPrice;
      }
    });

    return stats;
  }

  /**
   * Group tickets by status
   */
  static groupTicketsByStatus(tickets: EventTicketBooking[]) {
    const now = new Date();

    return {
      upcoming: tickets.filter(
        (ticket) =>
          ticket.status === "active" && new Date(ticket.startTime) > now
      ),
      active: tickets.filter(
        (ticket) =>
          ticket.status === "active" && new Date(ticket.startTime) <= now
      ),
      past: tickets.filter((ticket) => this.isEventPast(ticket.endTime)),
      cancelled: tickets.filter((ticket) => ticket.status === "cancelled"),
    };
  }

  /**
   * Sort tickets by date (newest first)
   */
  static sortTicketsByDate(
    tickets: EventTicketBooking[],
    order: "asc" | "desc" = "desc"
  ): EventTicketBooking[] {
    return [...tickets].sort((a, b) => {
      const dateA = new Date(a.startTime).getTime();
      const dateB = new Date(b.startTime).getTime();
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
  }
}
