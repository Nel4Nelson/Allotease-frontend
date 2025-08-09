import type { FacilityDetail } from "@/stores/stay-form-store";
import { apiClient } from "./api-client";

// API response interface for searching facilities
interface FacilitiesSearchResponse {
  status: string;
  message: string;
  data: {
    items: FacilityDetail[];
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// API response interface for creating facility
interface CreateFacilityResponse {
  status: string;
  message: string;
  data: {
    _id: string;
    name: string;
    icon?: string; // Optional
    allocatorId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

// Create facility request payload
interface CreateFacilityPayload {
  name: string;
  icon?: File | string; //
}

// Query parameters for searching facilities
export interface SearchFacilitiesParams {
  query?: string;
  page?: number;
  limit?: number;
}

export class FacilitiesService {
  private static readonly ENDPOINTS = {
    SEARCH_FACILITIES: "/facilities/",
    CREATE_FACILITY: "/facilities/",
    GET_FACILITY_BY_ID: "/facilities/", // Will append ID
    UPDATE_FACILITY: "/facilities/", // Will append ID
    DELETE_FACILITY: "/facilities/", // Will append ID
  } as const;

  /**
   * Search facilities with query string
   */
  static async searchFacilities(params: SearchFacilitiesParams = {}): Promise<FacilityDetail[]> {
    try {
      const queryParams = new URLSearchParams();

      // Add query parameter if provided
      if (params.query && params.query.trim()) {
        queryParams.append("query", params.query.trim());
      }

      // Add pagination parameters
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      // Build URL with query parameters
      const url = queryParams.toString() 
        ? `${this.ENDPOINTS.SEARCH_FACILITIES}?${queryParams.toString()}`
        : this.ENDPOINTS.SEARCH_FACILITIES;

      const response = await apiClient.get<FacilitiesSearchResponse>(url);

      if (response.status === "success" && response.data?.items) {
        return response.data.items;
      }

      return [];
    } catch (error) {
      console.error("Facilities search failed:", error);
      return []; // Return empty array on error instead of throwing
    }
  }

  /**
   * Get facility by ID
   */
  static async getFacilityById(id: string): Promise<FacilityDetail | null> {
    try {
      const response = await apiClient.get<{ status: string; data: FacilityDetail }>(
        `${this.ENDPOINTS.GET_FACILITY_BY_ID}${id}`
      );

      if (response.status === "success" && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error(`Failed to fetch facility with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Get facility details for multiple IDs (for preview and cache)
   */
  static async getFacilitiesDetails(facilityIds: string[]): Promise<FacilityDetail[]> {
    try {
      if (!facilityIds || facilityIds.length === 0) {
        return [];
      }

      // Fetch facilities in parallel
      const facilityPromises = facilityIds.map(async (id) => {
        try {
          return await this.getFacilityById(id);
        } catch {
          return null; // Return null for failed fetches
        }
      });

      const results = await Promise.allSettled(facilityPromises);
      
      return results
        .filter((result): result is PromiseFulfilledResult<FacilityDetail> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);

    } catch (error) {
      console.error("Failed to fetch facility details:", error);
      return [];
    }
  }

  /**
   * Create a new facility
   */
  static async createFacility(payload: CreateFacilityPayload): Promise<FacilityDetail> {
    try {
      // Validate payload
      if (!payload.name || !payload.name.trim()) {
        throw new Error("Facility name is required");
      }

      // Prepare form data for file upload
      const formData = new FormData();
      formData.append("name", payload.name.trim());

      // Handle icon - can be File or string URL
      if (payload.icon) {
        if (payload.icon instanceof File) {
          formData.append("icon", payload.icon);
        } else {
          formData.append("icon", payload.icon);
        }
      }

      const response = await apiClient.uploadFile<CreateFacilityResponse>(
        this.ENDPOINTS.CREATE_FACILITY,
        formData
      );

      if (response.status === "success" && response.data) {
        // Convert API response to FacilityDetail format
        const facilityDetail: FacilityDetail = {
          _id: response.data._id,
          name: response.data.name,
          icon: response.data.icon || "", // Default to empty string if no icon
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };
        
        return facilityDetail;
      }

      throw new Error(response.message || "Failed to create facility");
    } catch (error) {
      console.error("Facility creation failed:", error);
      throw error;
    }
  }

  /**
   * Update an existing facility
   */
  static async updateFacility(
    id: string, 
    payload: Partial<CreateFacilityPayload>
  ): Promise<FacilityDetail> {
    try {
      if (!id) {
        throw new Error("Facility ID is required");
      }

      const response = await apiClient.put<CreateFacilityResponse>(
        `${this.ENDPOINTS.UPDATE_FACILITY}${id}`,
        payload
      );

      if (response.status === "success" && response.data) {
        // Convert API response to FacilityDetail format
        const facilityDetail: FacilityDetail = {
          _id: response.data._id,
          name: response.data.name,
          icon: response.data.icon || "", // Default to empty string if no icon
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };
        
        return facilityDetail;
      }

      throw new Error(response.message || "Failed to update facility");
    } catch (error) {
      console.error("Facility update failed:", error);
      throw error;
    }
  }

  /**
   * Delete a facility
   */
  static async deleteFacility(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error("Facility ID is required");
      }

      await apiClient.delete(`${this.ENDPOINTS.DELETE_FACILITY}${id}`);
    } catch (error) {
      console.error("Facility deletion failed:", error);
      throw error;
    }
  }

  /**
   * Validate facility data before submission
   */
  static validateFacilityData(payload: CreateFacilityPayload): string[] {
    const errors: string[] = [];

    if (!payload.name || !payload.name.trim()) {
      errors.push("Facility name is required");
    }

    if (payload.name && payload.name.trim().length > 100) {
      errors.push("Facility name must not exceed 100 characters");
    }

    // Icon is optional, but if provided as string, validate URL
    if (payload.icon && typeof payload.icon === 'string' && !this.isValidIconUrl(payload.icon)) {
      errors.push("Invalid icon URL format");
    }

    return errors;
  }

  /**
   * Format facility name for display
   */
  static formatFacilityName(name: string): string {
    return name.trim().replace(/\s+/g, " ");
  }

  /**
   * Check if facility icon URL is valid
   */
  static isValidIconUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Search facilities with debounced query (for autocomplete)
   */
  static async searchFacilitiesDebounced(
    query: string,
    abortController?: AbortController
  ): Promise<FacilityDetail[]> {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }

      // Add abort signal if provided
      const response = await fetch(
        `/api/facilities/?query=${encodeURIComponent(query.trim())}`,
        {
          signal: abortController?.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FacilitiesSearchResponse = await response.json();

      if (data.status === "success" && data.data?.items) {
        return data.data.items;
      }

      return [];
    } catch (error) {
      // Don't log error if request was aborted
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Debounced facilities search failed:", error);
      }
      return [];
    }
  }

  /**
   * Get default facility icons (for modal selection)
   */
  static getDefaultFacilityIcons(): Array<{ value: string; label: string }> {
    return [
      {
        value: "/icons/wifi.svg",
        label: "WiFi"
      },
      {
        value: "/icons/swim.svg", 
        label: "Swimming Pool"
      },
      {
        value: "/icons/prohibit.svg",
        label: "No Smoking"
      },
      {
        value: "/icons/gym.svg",
        label: "Gym"
      },
      {
        value: "/icons/parking.svg",
        label: "Parking"
      },
      {
        value: "/icons/restaurant.svg",
        label: "Restaurant"
      },
      {
        value: "/icons/spa.svg",
        label: "Spa"
      },
      {
        value: "/icons/laundry.svg",
        label: "Laundry"
      },
      {
        value: "/icons/elevator.svg",
        label: "Elevator"
      },
      {
        value: "/icons/conference.svg",
        label: "Conference Room"
      },
      {
        value: "/icons/bar.svg",
        label: "Bar"
      },
      {
        value: "/icons/garden.svg",
        label: "Garden"
      }
    ];
  }
}