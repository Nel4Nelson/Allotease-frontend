import {
  ManagementStats,
  StayReservationsResponse,
  EventReservationsResponse,
} from "@/types";
import { apiClient, ApiResponse } from "./api-client";

export class OverviewService {
  private static readonly ENDPOINTS = {
    GET_STAYS_STATS: "/dashboard/stays/stats?timeframe=day",
    GET_EVENTS_STATS: "/dashboard/events/stats",
    GET_RECENT_STAYS_RESERVATIONS: "/dashboard/stays/reservations",
    GET_RECENT_EVENTS_RESERVATIONS: "/dashboard/events/reservations",
  } as const;

  private static async fetchStats(
    endpoint: string
  ): Promise<ApiResponse<ManagementStats>> {
    try {
      return await apiClient.get<ManagementStats>(endpoint);
    } catch (error) {
      console.error(
        `Fetching stats from ${endpoint} failed:`,
        error|| error
      );
      throw error;
    }
  }

  static getStayStats(): Promise<ApiResponse<ManagementStats>> {
    return this.fetchStats(this.ENDPOINTS.GET_STAYS_STATS);
  }

  static getEventStats(): Promise<ApiResponse<ManagementStats>> {
    return this.fetchStats(this.ENDPOINTS.GET_EVENTS_STATS);
  }

  static async getRecentStaysReservations(
    page = 1,
    limit = 50
  ): Promise<ApiResponse<StayReservationsResponse>> {
    const url = `${this.ENDPOINTS.GET_RECENT_STAYS_RESERVATIONS}?page=${page}&limit=${limit}`;
    try {
      return await apiClient.get<StayReservationsResponse>(url);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Fetching recent stay reservations failed:",
          error.message
        );
      } else {
        console.error("Unknown error while fetching stay reservations:", error);
      }
      throw error;
    }
  }

  static async getRecentEventsReservations(): Promise<
    ApiResponse<EventReservationsResponse>
  > {
    try {
      return await apiClient.get<EventReservationsResponse>(
        this.ENDPOINTS.GET_RECENT_EVENTS_RESERVATIONS
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Fetching recent event reservations failed:",
          error.message
        );
      } else {
        console.error(
          "Unknown error while fetching event reservations:",
          error
        );
      }
      throw error;
    }
  }
}
