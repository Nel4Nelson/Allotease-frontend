/* eslint-disable @typescript-eslint/no-explicit-any */
// /services/event-service.ts
import { apiClient, ApiResponse } from "./api-client";
import { CreateEventRequest, CreateEventResponse } from "@/types/events";

export class EventService {
  private static readonly ENDPOINTS = {
    CREATE_EVENT: "/events/",
    GET_EVENTS: "/events/",
    GET_EVENT_BY_ID: "/events/",
  } as const;

  /**
   * Create a new event
   */
  static async createEvent(
    data: CreateEventRequest
  ): Promise<ApiResponse<CreateEventResponse>> {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all text fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("eventType", data.eventType);
      formData.append("startTime", data.startTime);
      formData.append("price", data.price.toString());
      formData.append("capacity", data.capacity.toString());
      formData.append("agenda", JSON.stringify(data.agenda));
      formData.append("tags", JSON.stringify(data.tags));

      // Add location if venue type
      if (data.location && data.eventType === "venue") {
        formData.append("location", JSON.stringify(data.location));
      }

      // Add image file if present
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await apiClient.post<CreateEventResponse>(
        this.ENDPOINTS.CREATE_EVENT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Create event failed:", error);
      throw error;
    }
  }

  /**
   * Get all events (for listing)
   */
  static async getEvents(): Promise<ApiResponse<any[]>> {
    try {
      return await apiClient.get(this.ENDPOINTS.GET_EVENTS);
    } catch (error) {
      console.error("Get events failed:", error);
      throw error;
    }
  }

  /**
   * Get event by ID
   */
  static async getEventById(id: string): Promise<ApiResponse<any>> {
    try {
      return await apiClient.get(`${this.ENDPOINTS.GET_EVENT_BY_ID}${id}`);
    } catch (error) {
      console.error("Get event by ID failed:", error);
      throw error;
    }
  }
}
