import { apiClient } from "./api-client";

// Reservations API Response Types
export interface ReservationClient {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface ReservationUnit {
  unitId: string;
  numberOfUnits: number;
  unitPrice: number;
  subtotal: number;
  _id: string;
}

export interface Reservation {
  _id: string;
  clientId: ReservationClient;
  status: 'pending' | 'awaiting_confirmation' | 'active' | 'completed' | 'cancelled' | 'timed_out';
  type: string;
  units: ReservationUnit[];
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
  data: {
    reservations: Reservation[];
    pagination: ReservationsPagination;
  };
  message?: string;
}

export interface ReservationsParams {
  page?: number;
  limit?: number;
}

// Transformed reservation data for DataTable
export interface TransformedReservation {
  id: string;
  guest: string;
  room: string; // Will be "--" until backend adds room data
  dates: string;
  status: string;
  avatar: string;
}

// Reservations API Service
export class ReservationsService {
  private static readonly ENDPOINTS = {
    GET_RESERVATIONS: "/dashboard/stays/reservations",
  } as const;

  /**
   * Get stays reservations with pagination
   */
  static async getReservations(params: ReservationsParams = {}): Promise<ReservationsResponse> {
    try {
      const { page = 1, limit = 10 } = params;
      
      const response = await apiClient.get<ReservationsResponse>(
        this.ENDPOINTS.GET_RESERVATIONS,
        { page, limit }
      );

      return response;
    } catch (error) {
      console.error("Get reservations failed:", error);
      throw error;
    }
  }

  /**
   * Format date range for display
   */
  static formatDateRange(checkInDate: string, checkOutDate: string): string {
    try {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      
      const formatOptions: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric' 
      };
      
      const checkInFormatted = checkIn.toLocaleDateString('en-US', formatOptions);
      const checkOutFormatted = checkOut.toLocaleDateString('en-US', formatOptions);
      
      return `${checkInFormatted} - ${checkOutFormatted}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid dates";
    }
  }

  /**
   * Get full name from client data
   */
  static getFullName(client: ReservationClient): string {
    return `${client.firstname} ${client.lastname}`.trim();
  }

  /**
   * Transform API reservation data to DataTable format
   */
  static transformReservations(reservations: Reservation[]): TransformedReservation[] {
    return reservations.map(reservation => ({
      id: reservation._id,
      guest: this.getFullName(reservation.clientId),
      room: "-- -- --", // Placeholder until backend adds room data
      dates: this.formatDateRange(reservation.checkInDate, reservation.checkOutDate),
      status: reservation.status,
      avatar: "/icons/encircle-star-green-avatar.svg", // Default avatar
    }));
  }

  /**
   * Map backend status to display status for UI consistency
   */
  static mapStatusForDisplay(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'pending',
      'awaiting_confirmation': 'awaiting_confirmation', 
      'active': 'confirmed', // Map active to confirmed for UI
      'completed': 'completed',
      'cancelled': 'cancelled',
      'timed_out': 'timed_out',
    };

    return statusMap[status] || status;
  }

  /**
   * Transform reservations with mapped status
   */
  static transformReservationsWithMappedStatus(reservations: Reservation[]): TransformedReservation[] {
    return reservations.map(reservation => ({
      id: reservation._id,
      guest: this.getFullName(reservation.clientId),
      room: "-- -- --", // Placeholder until backend adds room data
      dates: this.formatDateRange(reservation.checkInDate, reservation.checkOutDate),
      status: this.mapStatusForDisplay(reservation.status),
      avatar: "/icons/encircle-star-green-avatar.svg", // Default avatar
    }));
  }
}