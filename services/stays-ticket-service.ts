/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "./api-client";

// Location interface
export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
}

// Stay booking interface for pending stays
export interface PendingStayBooking {
  _id: string;
  checkInDate: string;
  checkOutDate: string;
  bookingId: string;
  clientId: string;
  status: "awaiting_confirmation";
  numberOfRentedUnits: number;
  frequency: string;
  stayImages: string[];
  stayTitle: string;
  location: Location;
}

// Stay booking interface for active/expired stays
export interface StayBooking {
  _id: string;
  checkInDate: string;
  checkOutDate: string;
  bookingId: string;
  clientId: string;
  status: "active" | "expired" | "completed";
  numberOfRentedUnits: number;
  frequency: string;
  stayType?: string;
  stayImages: string[];
  stayTitle: string;
  location: Location;
}

// API response interface for getting pending stays
interface GetPendingStaysResponse {
  status: string;
  message: string;
  data: {
    items: PendingStayBooking[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    page: number;
    totalCount: number;
    totalPages: number;
  };
}

// API response interface for getting stay bookings
interface GetStayBookingsResponse {
  status: string;
  message: string;
  data: {
    items: StayBooking[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    page: number;
    totalCount: number;
    totalPages: number;
  };
}

// Query parameters for getting stays
export interface GetStaysParams {
  status?: "active" | "expired";
  page?: number;
  limit?: number;
}

// Query parameters for getting pending stays
export interface GetPendingStaysParams {
  page?: number;
  limit?: number;
}

// Confirm booking payload
export interface ConfirmBookingPayload {
  bookingId: string;
  confirm: boolean;
}

// Confirm booking response
export interface ConfirmBookingResponse {
  status: string;
  message: string;
  data?: any;
}

export class StaysTicketService {
  private static readonly ENDPOINTS = {
    GET_PENDING_STAYS: "/book/pending-stays",
    CONFIRM_BOOKING: "/book/pending-stays",
    GET_STAY_BOOKINGS: "/book/stay-unit",
  } as const;

  /**
   * Get user's pending stays with pagination
   */
  static async getPendingStays(
    params: GetPendingStaysParams = {}
  ): Promise<GetPendingStaysResponse> {
    try {
      const queryParams = new URLSearchParams();

      // Add pagination params
      queryParams.append("page", (params.page || 1).toString());
      queryParams.append("limit", (params.limit || 10).toString());

      const url = `${
        this.ENDPOINTS.GET_PENDING_STAYS
      }?${queryParams.toString()}`;
      const response = await apiClient.get<GetPendingStaysResponse>(url);

      return response;
    } catch (error) {
      console.error("Failed to fetch pending stays:", error);
      throw error;
    }
  }

  /**
   * Get user's stay bookings with pagination and filters
   */
  static async getStayBookings(
    params: GetStaysParams = {}
  ): Promise<GetStayBookingsResponse> {
    try {
      const queryParams = new URLSearchParams();

      // Add required status param
      if (params.status) {
        queryParams.append("status", params.status);
      }

      // Add pagination params
      queryParams.append("page", (params.page || 1).toString());
      queryParams.append("limit", (params.limit || 10).toString());

      const url = `${
        this.ENDPOINTS.GET_STAY_BOOKINGS
      }?${queryParams.toString()}`;
      const response = await apiClient.get<GetStayBookingsResponse>(url);

      return response;
    } catch (error) {
      console.error("Failed to fetch stay bookings:", error);
      throw error;
    }
  }

  /**
   * Confirm or request refund for a booking
   */
  static async confirmBooking(
    payload: ConfirmBookingPayload
  ): Promise<ConfirmBookingResponse> {
    try {
      const response = await apiClient.post<ConfirmBookingResponse>(
        this.ENDPOINTS.CONFIRM_BOOKING,
        payload
      );

      return response;
    } catch (error) {
      console.error("Failed to confirm booking:", error);
      throw error;
    }
  }

  /**
   * Format location for display
   */
  static formatLocation(location: Location): string {
    return `${location.address}, ${location.city}, ${location.state}, ${location.country}`;
  }

  /**
   * Format check-in and check-out dates for display
   */
  static formatStayDates(checkInDate: string, checkOutDate: string): string {
    try {
      const checkIn = new Date(checkInDate).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const checkOut = new Date(checkOutDate).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return `${checkIn} - ${checkOut}`;
    } catch (error) {
      console.error("Error formatting dates:", error);
      return "Dates TBD";
    }
  }

  /**
   * Calculate expiry date for pending stays (2 days before check-in)
   */
  static calculateExpiryDate(checkInDate: string): string {
    try {
      const checkIn = new Date(checkInDate);
      const expiryDate = new Date(checkIn.getTime() - 2 * 24 * 60 * 60 * 1000);
      return expiryDate.toISOString();
    } catch (error) {
      console.error("Error calculating expiry date:", error);
      return new Date().toISOString();
    }
  }

  /**
   * Get status badge info - Updated to handle "completed" status
   */
  static getStatusBadgeInfo(
    status: StayBooking["status"] | PendingStayBooking["status"]
  ): { color: string; text: string } {
    switch (status) {
      case "active":
        return {
          color: "bg-green-500",
          text: "Active",
        };
      case "expired":
      case "completed":
        return {
          color: "bg-gray-500",
          text: "Expired",
        };
      case "awaiting_confirmation":
        return {
          color: "bg-yellow-500",
          text: "Pending",
        };
      default:
        console.warn("Unknown status received:", status);
        return {
          color: "bg-gray-400",
          text: "Unknown",
        };
    }
  }

  /**
   * Check if stay is past
   */
  static isStayPast(checkOutDate: string): boolean {
    const now = new Date();
    const stayEnd = new Date(checkOutDate);
    return stayEnd < now;
  }

  /**
   * Transform pending stay for UI
   */
  static transformPendingStay(stay: PendingStayBooking) {
    return {
      _id: stay._id,
      title: stay.stayTitle,
      location: this.formatLocation(stay.location),
      price: 0, // No price in API, will show "N----"
      frequency: stay.frequency,
      imageUrl: stay.stayImages[0] || "/images/stays/default.jpg",
      expiresAt: this.calculateExpiryDate(stay.checkInDate),
      bookingId: stay.bookingId,
      checkInDate: stay.checkInDate,
      checkOutDate: stay.checkOutDate,
      numberOfRentedUnits: stay.numberOfRentedUnits,
    };
  }

  /**
   * Get stay summary statistics
   */
  static getStayStats(stays: StayBooking[]) {
    const stats = {
      total: stays.length,
      active: 0,
      expired: 0,
      completed: 0,
      upcoming: 0,
      past: 0,
    };

    const now = new Date();

    stays.forEach((stay) => {
      // Count by status
      if (stay.status === "active") {
        stats.active++;
      } else if (stay.status === "expired") {
        stats.expired++;
      } else if (stay.status === "completed") {
        stats.completed++;
      }

      // Count by time
      const checkIn = new Date(stay.checkInDate);
      if (checkIn > now) {
        stats.upcoming++;
      } else {
        stats.past++;
      }
    });

    return stats;
  }

  /**
   * Group stays by status and time
   */
  static groupStaysByStatus(stays: StayBooking[]) {
    const now = new Date();

    return {
      upcoming: stays.filter(
        (stay) => stay.status === "active" && new Date(stay.checkInDate) > now
      ),
      current: stays.filter(
        (stay) =>
          stay.status === "active" &&
          new Date(stay.checkInDate) <= now &&
          new Date(stay.checkOutDate) > now
      ),
      past: stays.filter(
        (stay) =>
          stay.status === "completed" ||
          stay.status === "expired" ||
          this.isStayPast(stay.checkOutDate)
      ),
    };
  }

  /**
   * Sort stays by date
   */
  static sortStaysByDate(
    stays: StayBooking[],
    order: "asc" | "desc" = "desc"
  ): StayBooking[] {
    return [...stays].sort((a, b) => {
      const dateA = new Date(a.checkInDate).getTime();
      const dateB = new Date(b.checkInDate).getTime();
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
  }

  /**
   * Sort pending stays by expiry date
   */
  static sortPendingStaysByExpiry(
    stays: PendingStayBooking[],
    order: "asc" | "desc" = "asc"
  ): PendingStayBooking[] {
    return [...stays].sort((a, b) => {
      const expiryA = new Date(
        this.calculateExpiryDate(a.checkInDate)
      ).getTime();
      const expiryB = new Date(
        this.calculateExpiryDate(b.checkInDate)
      ).getTime();
      return order === "asc" ? expiryA - expiryB : expiryB - expiryA;
    });
  }
}
