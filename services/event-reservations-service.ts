import { apiClient } from "./api-client";

// Event Reservations API Response Types
export interface EventReservationClient {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface EventReservation {
  _id: string;
  clientId: EventReservationClient;
  totalPrice: number;
  eventId: string;
  numberOfSeats: number;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface EventReservationsPagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface EventReservationsResponse {
  status: string;
  data: {
    events: EventReservation[];
    pagination: EventReservationsPagination;
  };
  message?: string;
}

export interface EventReservationsParams {
  page?: number;
  limit?: number;
}

// Transformed event reservation data for DataTable
export interface TransformedEventReservation {
  id: string;
  attendee: string;
  tickets: string[]; // Dummy data until backend provides seat numbers
  dates: string;
  avatar: string;
  // Full reservation data for modal
  fullReservation: EventReservation;
}

// Event Reservations API Service
export class EventReservationsService {
  private static readonly ENDPOINTS = {
    GET_EVENT_RESERVATIONS: "/dashboard/events/reservations",
  } as const;

  /**
   * Get event reservations with pagination
   */
  static async getEventReservations(params: EventReservationsParams = {}): Promise<EventReservationsResponse> {
    try {
      const { page = 1, limit = 10 } = params;
      
      const response = await apiClient.get<EventReservationsResponse>(
        this.ENDPOINTS.GET_EVENT_RESERVATIONS,
        { page, limit }
      );

      return response;
    } catch (error) {
      console.error("Get event reservations failed:", error);
      throw error;
    }
  }

  /**
   * Format date/time for display (from createdAt)
   */
  static formatDateTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      
      const formatOptions: Intl.DateTimeFormatOptions = { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      
      return date.toLocaleString('en-US', formatOptions);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  }

  /**
   * Get full name from client data
   */
  static getFullName(client: EventReservationClient): string {
    return `${client.firstname} ${client.lastname}`.trim();
  }

  /**
   * Generate dummy seat numbers until backend provides them
   */
  static generateDummySeatNumbers(numberOfSeats: number): string[] {
    // Generate dummy seat numbers like #17, #18, #19
    const startSeat = 17; // Starting seat number
    return Array.from({ length: numberOfSeats }, (_, i) => `#${startSeat + i}`);
  }

  /**
   * Transform API event reservation data to DataTable format
   */
  static transformEventReservations(reservations: EventReservation[]): TransformedEventReservation[] {
    return reservations.map(reservation => ({
      id: reservation._id,
      attendee: this.getFullName(reservation.clientId),
      tickets: this.generateDummySeatNumbers(reservation.numberOfSeats),
      dates: this.formatDateTime(reservation.createdAt),
      avatar: "/icons/encircle-star-green-avatar.svg", // Default avatar
      fullReservation: reservation, // Store full data for modal
    }));
  }
}