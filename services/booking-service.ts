/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "./api-client";
import { useAuthStore } from "@/stores/auth-store";

// Booking interface from API response
export interface PendingStayBooking {
  _id: string;
  checkInDate: string;
  checkOutDate: string;
  bookingId: string;
  clientId: string;
  status: "awaiting_confirmation" | "confirmed" | "cancelled";
  numberOfRentedUnits: number;
  totalAmountPaid: number;
  stayId: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  stayType: string;
  stayImages: string[];
  stayTitle: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
}

// Stay Unit Booking interface from API response
export interface StayUnitBooking {
  _id: string;
  checkInDate: string;
  checkOutDate: string;
  bookingId: string;
  clientId: string;
  status: "active" | "expired";
  numberOfRentedUnits: number;
  totalAmountPaid: number;
  stayId: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  stayType?: string;
  stayImages: string[];
  stayTitle: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
}

// API response interface for getting pending stays
export interface GetPendingStaysResponse {
  status: string;
  message: string;
  data: {
    items: PendingStayBooking[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPages: number;
    totalCount: number;
    limit: number;
    page: number;
  };
}

// API response interface for getting stay units
export interface GetStayUnitsResponse {
  status: string;
  message: string;
  data: {
    items: StayUnitBooking[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPages: number;
    totalCount: number;
    limit: number;
    page: number;
  };
}

// Query parameters for getting pending stays
export interface GetPendingStaysParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

// Query parameters for getting stay units
export interface GetStayUnitsParams {
  status?: "all" | "active" | "expired";
  page?: number;
  limit?: number;
  [key: string]: any;
}

// Confirm stay response
interface ConfirmStayResponse {
  status: string;
  message: string;
  data?: any;
}

export class BookingService {
  private static readonly ENDPOINTS = {
    GET_PENDING_STAYS: "/book/pending-stays",
    CONFIRM_STAY: "/book/pending-stays", // Same endpoint but POST method
    GET_STAY_UNITS: "/book/stay-unit",
  } as const;

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const { isAuthenticated } = useAuthStore.getState();
    return isAuthenticated;
  }

  /**
   * Get pending stays (awaiting confirmation) with pagination
   */
  static async getPendingStays(
    params: GetPendingStaysParams = {}
  ): Promise<GetPendingStaysResponse> {
    // Check authentication before making the request
    if (!this.isAuthenticated()) {
      throw new Error("User must be authenticated to view pending stays");
    }

    try {
      const queryParams = new URLSearchParams();

      // Add default params
      queryParams.append("page", (params.page || 1).toString());
      queryParams.append("limit", (params.limit || 10).toString());

      // Add any additional params
      Object.keys(params).forEach((key) => {
        if (!["page", "limit"].includes(key) && params[key]) {
          queryParams.append(key, params[key].toString());
        }
      });

      const url = `${this.ENDPOINTS.GET_PENDING_STAYS}?${queryParams.toString()}`;

      const response = await apiClient.get<GetPendingStaysResponse>(url);

      return response;
    } catch (error: any) {
      // Handle 401 specifically
      if (error?.response?.status === 401) {
        console.log("User session expired, clearing auth");
        useAuthStore.getState().clearAuth();
        throw new Error("User must be authenticated to view pending stays");
      }

      console.error("Failed to fetch pending stays:", error);
      throw error;
    }
  }

  /**
   * Get stay unit bookings with status filter and pagination
   */
  static async getStayUnits(
    params: GetStayUnitsParams = {}
  ): Promise<GetStayUnitsResponse> {
    // Check authentication before making the request
    if (!this.isAuthenticated()) {
      throw new Error("User must be authenticated to view stay units");
    }

    try {
      const queryParams = new URLSearchParams();

      // Add default params
      queryParams.append("page", (params.page || 1).toString());
      queryParams.append("limit", (params.limit || 10).toString());

      // Add status param - pass it directly as API accepts: all, active, expired
      const apiStatus = params.status || "all";
      queryParams.append("status", apiStatus);

      // Add any additional params
      Object.keys(params).forEach((key) => {
        if (!["page", "limit", "status"].includes(key) && params[key]) {
          queryParams.append(key, params[key].toString());
        }
      });

      const url = `${this.ENDPOINTS.GET_STAY_UNITS}?${queryParams.toString()}`;

      const response = await apiClient.get<GetStayUnitsResponse>(url);

      return response;
    } catch (error: any) {
      // Handle 401 specifically
      if (error?.response?.status === 401) {
        console.log("User session expired, clearing auth");
        useAuthStore.getState().clearAuth();
        throw new Error("User must be authenticated to view stay units");
      }

      console.error("Failed to fetch stay units:", error);
      throw error;
    }
  }

  /**
   * Confirm a stay booking
   */
  static async confirmStay(
    bookingId: string,
    confirm: boolean = true
  ): Promise<ConfirmStayResponse> {
    // Check authentication before making the request
    if (!this.isAuthenticated()) {
      throw new Error("User must be authenticated to confirm stay");
    }

    try {
      const response = await apiClient.post<ConfirmStayResponse>(
        this.ENDPOINTS.CONFIRM_STAY,
        {
          bookingId,
          confirm,
        }
      );

      return response;
    } catch (error: any) {
      // Handle 401 specifically
      if (error?.response?.status === 401) {
        console.log("User session expired, clearing auth");
        useAuthStore.getState().clearAuth();
        throw new Error("User must be authenticated to confirm stay");
      }

      console.error("Failed to confirm stay:", error);
      throw error;
    }
  }

  /**
   * Format location for display
   */
  static formatLocation(
    location: PendingStayBooking["location"] | StayUnitBooking["location"]
  ): string {
    return `${location.city}, ${location.state}`;
  }

  /**
   * Format price for display (Nigerian Naira)
   */
  static formatPrice(price: number): string {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  /**
   * Format frequency for display
   */
  static formatFrequency(frequency: string): string {
    const frequencyMap: Record<string, string> = {
      daily: "Day",
      weekly: "Week",
      monthly: "Month",
      yearly: "Year",
    };
    return frequencyMap[frequency.toLowerCase()] || frequency;
  }

  /**
   * Get the first image from stay images
   */
  static getStayImage(images: string[]): string {
    return images.length > 0 ? images[0] : "/images/stay-banner.svg";
  }

  /**
   * Calculate days until check-in
   */
  static calculateDaysUntilCheckIn(checkInDate: string): number {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const diffTime = checkIn.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Calculate hours until check-in
   */
  static calculateHoursUntilCheckIn(checkInDate: string): number {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const diffTime = checkIn.getTime() - now.getTime();
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return diffHours;
  }

  /**
   * Get status text for display (future: can show time remaining)
   */
  static getStatusText(checkInDate: string): string {
    // For now, return empty string as per requirement
    // Future: Can implement countdown logic here
    return "";
  }

  /**
   * Map API booking to UI card format (for pending stays)
   */
  static mapToStayCard(booking: PendingStayBooking): {
    id: string;
    title: string;
    location: string;
    imageUrl: string;
    price: number;
    frequency: string;
    statusText: string;
    checkInDate: string;
    checkOutDate: string;
    stayId: string;
  } {
    return {
      id: booking._id,
      title: booking.stayTitle,
      location: this.formatLocation(booking.location),
      imageUrl: this.getStayImage(booking.stayImages),
      price: booking.totalAmountPaid,
      frequency: this.formatFrequency(booking.frequency),
      statusText: this.getStatusText(booking.checkInDate),
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      stayId: booking.stayId,
    };
  }

/**
 * Map stay unit booking to active stay card format
 */
static mapToActiveStayCard(booking: StayUnitBooking): {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  images: string[];
  price: number;
  frequency: string;
  status: "active" | "expired";
  checkInDate: string;
  checkOutDate: string;
  stayId: string;
} {
  return {
    id: booking._id,
    title: booking.stayTitle,
    location: this.formatLocation(booking.location),
    imageUrl: this.getStayImage(booking.stayImages),
    images: booking.stayImages,
    price: booking.totalAmountPaid,
    frequency: this.formatFrequency(booking.frequency),
    status: booking.status,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    stayId: booking.stayId,
  };
}
}