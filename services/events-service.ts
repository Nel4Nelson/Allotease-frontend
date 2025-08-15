/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "./api-client";
import type { EventsFormData } from "@/components/features/create/events-form";

// Event interface from API response
export interface Event {
  _id: string;
  title: string;
  description: string;
  eventType: "remote" | "physical";
  price: number;
  capacity: number;
  startTime: string;
  endTime?: string;
  coverImage?: string;
  location?: {
    country: string;
    city?: string;
    state?: string;
    address?: string;
  };
  // Add geoLocation property if your API returns it
  geoLocation?: {
    type: string;
    coordinates: number[];
  };
  tags?: string[];
  agenda?: Array<{
    _id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  }>;
  ownerId?: string;
  organizationName: string;
  organizationBio: string;
  organizationCategory: string;
  averageRating: number;
  totalReviews: number;
  totalComments: number;
  totalFollowers: number;
  createdAt?: string;
  updatedAt?: string;
}

// API response interface for getting single event
interface GetEventResponse {
  status: string;
  message?: string;
  data: {
    event: Event;
    availableCapacity: number;
  };
}

// API response interface for getting events
interface GetEventsResponse {
  status: string;
  message: string;
  data: {
    items: Event[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// API response interface for creating event
interface CreateEventResponse {
  status: string;
  message: string;
  data: {
    event: Event;
  };
}

// Query parameters for getting events
export interface GetEventsParams {
  page?: number;
  limit?: number;
  query?: string;
  allocatorId?: string;
  [key: string]: any; // Allow additional query params
}

export class EventService {
  private static readonly ENDPOINTS = {
    CREATE_EVENT: "/events/",
    GET_EVENTS: "/events/",
    GET_EVENT_BY_ID: "/events/", // Will append ID
  } as const;

  /**
   * Get single event by ID
   */
  static async getEventById(id: string): Promise<GetEventResponse> {
    try {
      const url = `${this.ENDPOINTS.GET_EVENT_BY_ID}${id}`;
      const response = await apiClient.get<GetEventResponse>(url);

      return response;
    } catch (error) {
      console.error("Failed to fetch event:", error);
      throw error;
    }
  }

  /**
   * Get all events with pagination and filters
   */
  static async getAllEvents(
    params: GetEventsParams = {}
  ): Promise<GetEventsResponse> {
    try {
      const queryParams = new URLSearchParams();

      // Add default params
      queryParams.append("page", (params.page || 1).toString());
      queryParams.append("limit", (params.limit || 6).toString());

      // Add optional params
      if (params.query) queryParams.append("query", params.query);
      if (params.allocatorId)
        queryParams.append("allocatorId", params.allocatorId);

      // Add any additional params
      Object.keys(params).forEach((key) => {
        if (
          !["page", "limit", "query", "allocatorId"].includes(key) &&
          params[key]
        ) {
          queryParams.append(key, params[key].toString());
        }
      });

      const url = `${this.ENDPOINTS.GET_EVENTS}?${queryParams.toString()}`;
      const response = await apiClient.get<GetEventsResponse>(url);

      return response;
    } catch (error) {
      console.error("Failed to fetch events:", error);
      throw error;
    }
  }

  /**
   * Format event date and time for display
   */
  static formatEventDateTime(startTime: string): string {
    try {
      const date = new Date(startTime);
      
      // Get day with ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
      const day = date.getDate();
      const dayWithSuffix = this.getDayWithOrdinalSuffix(day);
      
      // Get month name
      const month = date.toLocaleDateString("en-US", { month: "long" });
      
      // Get day name
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      
      // Get time
      const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      // Get timezone offset
      const timeZone = date
        .toLocaleTimeString("en-US", { timeZoneName: "short" })
        .split(" ")[2];

      return `${dayWithSuffix} ${month}, ${dayName} • ${time} ${timeZone}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date TBD";
    }
  }

  /**
   * Helper method to add ordinal suffix to day
   */
  private static getDayWithOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  }

  /**
   * Format event price for display
   */
  static formatEventPrice(price: number): string {
    return price === 0 ? "Free" : `₦${price.toLocaleString()}`;
  }

  /**
   * Format follower count for display
   */
  static formatFollowerCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M Followers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K Followers`;
    } else {
      return `${count} Followers`;
    }
  }

  /**
   * Get event cover image with fallback
   */
  static getEventCoverImage(event: Event): string {
    return event.coverImage || "/images/event-banner.svg";
  }

  /**
   * Create a new event
   */
  static async createEvent(
    formData: EventsFormData
  ): Promise<CreateEventResponse> {
    try {
      // Check if backend expects multipart/form-data or JSON
      // Let's try JSON first with manual FormData for image
      const hasImage = formData.image && formData.image.length > 0;

      if (hasImage) {
        // Use FormData for image upload
        return this.createEventWithFormData(formData);
      } else {
        // Use JSON for no image (shouldn't happen but fallback)
        return this.createEventWithJSON(formData);
      }
    } catch (error) {
      console.error("Event creation failed:", error);
      throw error;
    }
  }

  /**
   * Create event using FormData (for image uploads)
   */
  private static async createEventWithFormData(
    formData: EventsFormData
  ): Promise<CreateEventResponse> {
    const form = new FormData();

    // Add basic fields
    form.append("title", formData.eventTitle);
    form.append("description", formData.eventDescription);

    // Map eventType: "venue" -> "physical", "remote" -> "remote"
    const eventType = formData.eventType === "venue" ? "physical" : "remote";
    form.append("eventType", eventType);

    // Format dates to ISO strings
    if (formData.eventDate && formData.startTime && formData.endTime) {
      const startDateTime = this.combineDateTime(
        formData.eventDate,
        formData.startTime
      );
      const endDateTime = this.combineDateTime(
        formData.eventDate,
        formData.endTime
      );

      form.append("startTime", startDateTime.toISOString());
      form.append("endTime", endDateTime.toISOString());
    }

    form.append("price", formData.price.toString());
    form.append("capacity", formData.capacity.toString());

    // Add agenda items - send each item individually instead of JSON string
    if (formData.agenda && formData.agenda.length > 0) {
      formData.agenda.forEach((item, index) => {
        const startDateTime = this.combineDateTime(
          formData.eventDate!,
          item.startTime
        );
        const endDateTime = this.combineDateTime(
          formData.eventDate!,
          item.endTime
        );

        form.append(`agenda[${index}][title]`, item.title);
        form.append(`agenda[${index}][description]`, item.description);
        form.append(`agenda[${index}][startTime]`, startDateTime.toISOString());
        form.append(`agenda[${index}][endTime]`, endDateTime.toISOString());
      });
    }

    // Add tags - try multiple approaches
    if (formData.categories && formData.categories.length > 0) {
      formData.categories.forEach((tag, index) => {
        form.append(`tags[${index}]`, tag);
      });
    }

    // Add location for physical events - send as individual fields
    if (formData.eventType === "venue" && formData.location) {
      form.append("location[address]", formData.location.address);
      form.append("location[city]", formData.location.city);
      form.append("location[state]", formData.location.state);
      form.append("location[country]", formData.location.country);
    }

    // Add image file
    if (formData.image && formData.image.length > 0) {
      form.append("image", formData.image[0]);
    }

    // Use uploadFile method for multipart/form-data
    const response = await apiClient.uploadFile<CreateEventResponse>(
      this.ENDPOINTS.CREATE_EVENT,
      form
    );

    return response;
  }

  /**
   * Create event using JSON (fallback)
   */
  private static async createEventWithJSON(
    formData: EventsFormData
  ): Promise<CreateEventResponse> {
    const eventType = formData.eventType === "venue" ? "physical" : "remote";

    const payload: any = {
      title: formData.eventTitle,
      description: formData.eventDescription,
      eventType,
      price: formData.price,
      capacity: formData.capacity,
      tags: formData.categories || [], // Direct array assignment
    };

    // Add dates
    if (formData.eventDate && formData.startTime && formData.endTime) {
      const startDateTime = this.combineDateTime(
        formData.eventDate,
        formData.startTime
      );
      const endDateTime = this.combineDateTime(
        formData.eventDate,
        formData.endTime
      );

      payload.startTime = startDateTime.toISOString();
      payload.endTime = endDateTime.toISOString();
    }

    // Add agenda
    if (formData.agenda && formData.agenda.length > 0) {
      payload.agenda = formData.agenda.map((item) => ({
        title: item.title,
        description: item.description,
        startTime: this.combineDateTime(
          formData.eventDate!,
          item.startTime
        ).toISOString(),
        endTime: this.combineDateTime(
          formData.eventDate!,
          item.endTime
        ).toISOString(),
      }));
    }

    // Add location
    if (formData.eventType === "venue" && formData.location) {
      payload.location = {
        address: formData.location.address,
        city: formData.location.city,
        state: formData.location.state,
        country: formData.location.country,
      };
    }

    const response = await apiClient.post<CreateEventResponse>(
      this.ENDPOINTS.CREATE_EVENT,
      payload
    );

    return response;
  }

  /**
   * Helper to combine date and time strings into a Date object
   */
  private static combineDateTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  }

  /**
   * Validate form data before submission
   */
  static validateEventData(formData: EventsFormData): string[] {
    const errors: string[] = [];

    if (!formData.eventTitle) errors.push("Event title is required");
    if (!formData.eventDescription)
      errors.push("Event description is required");
    if (!formData.image || formData.image.length === 0)
      errors.push("Cover image is required");
    if (!formData.eventDate) errors.push("Event date is required");
    if (!formData.startTime) errors.push("Start time is required");
    if (!formData.endTime) errors.push("End time is required");
    if (!formData.categories || formData.categories.length === 0)
      errors.push("At least one category is required");
    if (!formData.capacity || formData.capacity <= 0)
      errors.push("Event capacity is required");
    if (!formData.agenda || formData.agenda.length === 0)
      errors.push("At least one agenda item is required");

    // Validate agenda items
    if (formData.agenda) {
      formData.agenda.forEach((item, index) => {
        if (!item.title)
          errors.push(`Agenda item ${index + 1}: Title is required`);
        if (!item.description)
          errors.push(`Agenda item ${index + 1}: Description is required`);
        if (!item.startTime)
          errors.push(`Agenda item ${index + 1}: Start time is required`);
        if (!item.endTime)
          errors.push(`Agenda item ${index + 1}: End time is required`);
      });
    }

    // Validate location for venue events
    if (formData.eventType === "venue") {
      if (!formData.location) {
        errors.push("Location is required for venue events");
      } else {
        if (!formData.location.address)
          errors.push("Event address is required");
        if (!formData.location.city) errors.push("Event city is required");
        if (!formData.location.state) errors.push("Event state is required");
        if (!formData.location.country)
          errors.push("Event country is required");
      }
    }

    // Validate price for paid events
    if (!formData.isFree && (!formData.price || formData.price <= 0)) {
      errors.push("Price is required for paid events");
    }

    return errors;
  }
}