import { apiClient } from "./api-client";

// Reservations API Response Types
export interface Reservation {
  _id: string;
  clientId: {
    _id: string;
    email: string;
    firstname: string;
    lastname: string;
    avatar?: string;
  };
  status: 'pending' | 'awaiting_confirmation' | 'active' | 'completed' | 'cancelled' | 'timed_out';
  type: string;
  unitId: {
    _id: string;
    description: string;
    title: string;
  };
  checkInDate: string;
  checkOutDate: string;
}

export interface ReservationsPagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReservationsResponse {
  status: string;
  message?: string;
  data: {
    reservations: Reservation[];
    pagination: ReservationsPagination;
  };
}

export interface ReservationsParams {
  page?: number;
  limit?: number;
  query?: string;
}

export interface TransformedReservation {
  id: string;
  guest: string;
  room: string;
  dates: string;
  status: string;
  avatar: string;
  rawData?: Reservation;
}


// Reservations API Service
export class ReservationsService {
  private static readonly ENDPOINTS = {
    GET_RESERVATIONS: "/dashboard/stays/reservations",
  } as const;

  /**
   * Get reservations with pagination and optional search
   */
  static async getReservations(params: ReservationsParams = {}): Promise<ReservationsResponse> {
    try {
      const { page = 1, limit = 10, query } = params;

      const queryParams: Record<string, any> = { page, limit };

      if (query) {
        queryParams.query = query;
      }

      const response = await apiClient.get<ReservationsResponse>(
        this.ENDPOINTS.GET_RESERVATIONS,
        queryParams
      );

      return response;
    } catch (error) {
      console.error("Get reservations failed:", error);
      throw error;
    }
  }

  /**
   * Format date range with years included
   * Example: "Dec 6, 2025 - Dec 6, 2026"
   */
  static formatDateRange(checkInDate: string, checkOutDate: string): string {
    try {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      const formatOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'  // Always include year
      };

      const checkInFormatted = checkIn.toLocaleDateString('en-US', formatOptions);
      const checkOutFormatted = checkOut.toLocaleDateString('en-US', formatOptions);

      // Format: "Dec 6, 2025 - Dec 6, 2026"
      return `${checkInFormatted} - ${checkOutFormatted}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid dates";
    }
  }

  /**
   * Get full name from client data
   */
  static getFullName(reservation: Reservation): string {
    if (!reservation.clientId) return 'Guest';

    const firstName = reservation.clientId.firstname || '';
    const lastName = reservation.clientId.lastname || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'Guest';
  }

  /**
   * Get unit/room title from reservation
   */
  static getRoomTitle(reservation: Reservation): string {
    // Extract title from unitId object
    if (reservation.unitId && typeof reservation.unitId === 'object') {
      return reservation.unitId.title || "-- -- --";
    }
    return "-- -- --";
  }

  /**
   * Get avatar URL from client data
   */
  static getAvatarUrl(reservation: Reservation): string {
    return reservation.clientId?.avatar || "/icons/encircle-star-green-avatar.svg";
  }

  /**
   * Map status to display-friendly format
   */
  static mapStatusForDisplay(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'Pending',
      'awaiting_confirmation': 'Awaiting Confirmation',
      'active': 'Confirmed',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'timed_out': 'Timed Out',
    };

    return statusMap[status] || status;
  }

  /**
   * Transform reservations for display (with raw status values)
   */
  static transformReservations(reservations: Reservation[]): TransformedReservation[] {
    return reservations.map(reservation => ({
      id: reservation._id,
      guest: this.getFullName(reservation),
      room: this.getRoomTitle(reservation),
      dates: this.formatDateRange(reservation.checkInDate, reservation.checkOutDate),
      status: reservation.status,
      avatar: this.getAvatarUrl(reservation),
      rawData: reservation,
    }));
  }

  /**
   * Transform reservations with mapped status for display
   */
  static transformReservationsWithMappedStatus(reservations: Reservation[]): TransformedReservation[] {
    return reservations.map(reservation => ({
      id: reservation._id,
      guest: this.getFullName(reservation),
      room: this.getRoomTitle(reservation),
      dates: this.formatDateRange(reservation.checkInDate, reservation.checkOutDate),
      status: this.mapStatusForDisplay(reservation.status),
      avatar: this.getAvatarUrl(reservation),
      rawData: reservation,
    }));
  }
}