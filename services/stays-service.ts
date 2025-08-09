/* eslint-disable @typescript-eslint/no-explicit-any */
import { StaysFormData } from "@/types/stays-form-schema";
import { apiClient } from "./api-client";
import type { FacilityDetail } from "@/stores/stay-form-store";

// Stay interface from API response
export interface Stay {
  _id: string;
  title: string;
  description: string;
  accomodationType: string; // Note: API uses "accomodationType" (typo in backend)
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  geoLocation: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  facilities: string[];
  images: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Stay Unit interface
export interface StayUnit {
  _id: string;
  title: string;
  description: string;
  price: number;
  frequency: string;
  quantity: number;
  totalBooked: number;
  facilities: string[];
  ownerId: string;
}

// Stay Facility interface (resolved from facilities IDs)
export interface StayFacility {
  _id: string;
  name: string;
  icon: string;
}

// Single stay response interface
export interface GetStayByIdResponse {
  status: string;
  data: {
    stay: Stay;
    stayFacilities: StayFacility[];
    stayUnits: StayUnit[];
  };
}

// API response interface for getting stays
interface GetStaysResponse {
  status: string;
  message: string;
  data: {
    items: Stay[];
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Query parameters for getting stays
export interface GetStaysParams {
  page?: number;
  limit?: number;
  accommodationType?: string;
  allocator?: string;
  [key: string]: any; // Allow additional query params
}

// Facility search response
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

// Create stay response - Updated to match actual API response
interface CreateStayResponse {
  status: string;
  message: string;
  data: {
    _id: string;
    title: string;
    description: string;
    accommodationType: string;
    location: {
      address: string;
      city: string;
      state: string;
      country: string;
    };
    geoLocation: {
      coordinates: [number, number]; // [longitude, latitude]
      type: string;
    };
    facilities: string[];
    images: string[];
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

// Progress callback type
type ProgressCallback = (step: string, progress: number) => void;

export class StaysService {
  private static readonly ENDPOINTS = {
    SEARCH_FACILITIES: "/facilities/",
    CREATE_STAY: "/stays/",
    GET_STAYS: "/stays/",
    GET_STAY_BY_ID: "/stays/", // Will append ID
    DELETE_STAY: "/stays/", // Will append ID
  } as const;

  /**
   * Get stay by ID with full details
   */
  static async getStayById(id: string): Promise<GetStayByIdResponse> {
    try {
      const response = await apiClient.get<GetStayByIdResponse>(
        `${this.ENDPOINTS.GET_STAY_BY_ID}${id}`
      );
      
      return response;
    } catch (error) {
      console.error(`Failed to fetch stay with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all stays with pagination and filters
   */
  static async getAllStays(params: GetStaysParams = {}): Promise<GetStaysResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add default params
      queryParams.append("page", (params.page || 1).toString());
      queryParams.append("limit", (params.limit || 6).toString());
      
      // Add optional params
      if (params.accommodationType) queryParams.append("accommodationType", params.accommodationType);
      if (params.allocator) queryParams.append("allocator", params.allocator);
      
      // Add any additional params
      Object.keys(params).forEach(key => {
        if (!["page", "limit", "accommodationType", "allocator"].includes(key) && params[key]) {
          queryParams.append(key, params[key].toString());
        }
      });

      const url = `${this.ENDPOINTS.GET_STAYS}?${queryParams.toString()}`;
      const response = await apiClient.get<GetStaysResponse>(url);
      
      return response;
    } catch (error) {
      console.error("Failed to fetch stays:", error);
      throw error;
    }
  }

  /**
   * Format stay location for display
   */
  static formatStayLocation(location: Stay['location']): string {
    return `${location.city}, ${location.state}, ${location.country}`;
  }

  /**
   * Get stay banner image with fallback
   */
  static getStayBannerImage(stay: Stay): string {
    if (stay.images && stay.images.length > 0) {
      return stay.images[0];
    }
    return "/images/stay-banner.svg";
  }

  /**
   * Get mock rating for stay (until backend supports reviews)
   */
  static getMockRating(): number {
    // Generate consistent mock ratings between 4.0 and 5.0
    const ratings = [4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
    return ratings[Math.floor(Math.random() * ratings.length)];
  }

  /**
   * Get mock review count for stay (until backend supports reviews)
   */
  static getMockReviewCount(): string {
    const counts = [
      "1,469 reviews",
      "2,134 reviews", 
      "987 reviews",
      "3,245 reviews",
      "1,876 reviews",
      "564 reviews",
      "2,987 reviews"
    ];
    return counts[Math.floor(Math.random() * counts.length)];
  }

  /**
   * Format accommodation type for display
   */
  static formatAccommodationType(type: string): string {
    // Convert from backend format to display format
    const typeMap: Record<string, string> = {
      "hotel & lodging": "Hotels & Lodging",
      "appartments": "Apartments",
      "guesthouses": "Guest Houses", 
      "hostels": "Hostels",
      "resorts": "Resorts"
    };
    
    return typeMap[type.toLowerCase()] || type;
  }

  /**
   * Format unit price for display
   */
  static formatUnitPrice(unit: StayUnit): string {
    const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    });
    
    return `${formatter.format(unit.price)} per ${unit.frequency}`;
  }

  /**
   * Get availability status for unit
   */
  static getUnitAvailability(unit: StayUnit): { available: number; status: 'available' | 'limited' | 'unavailable' } {
    const available = unit.quantity - unit.totalBooked;
    
    if (available <= 0) {
      return { available: 0, status: 'unavailable' };
    } else if (available <= 5) {
      return { available, status: 'limited' };
    } else {
      return { available, status: 'available' };
    }
  }

  /**
   * Search facilities with query
   */
  static async searchFacilities(query: string): Promise<FacilityDetail[]> {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }

      const response = await apiClient.get<FacilitiesSearchResponse>(
        `${this.ENDPOINTS.SEARCH_FACILITIES}?query=${encodeURIComponent(query.trim())}`
      );

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
   * Get facility details for multiple IDs (for preview)
   */
  static async getFacilitiesDetails(facilityIds: string[]): Promise<FacilityDetail[]> {
    try {
      if (!facilityIds || facilityIds.length === 0) {
        return [];
      }

      // For now, we'll need to search for each facility individually
      // If backend provides a bulk endpoint, update this method
      const facilityPromises = facilityIds.map(async (id) => {
        try {
          // This might need to be adjusted based on actual backend endpoint
          const response = await apiClient.get<{ data: FacilityDetail }>(
            `${this.ENDPOINTS.SEARCH_FACILITIES}${id}`
          );
          return response.data;
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
   * Generate coordinates from location data
   */
  private static generateCoordinatesFromLocation(location: StaysFormData['location']): [number, number] {
    // Use coordinates if available
    if (location.coordinates) {
      return location.coordinates;
    }

    // Fallback coordinates for major Nigerian cities
    const cityCoordinates: Record<string, [number, number]> = {
      // Lagos
      "lagos": [3.3792, 6.5244],
      "ikeja": [3.3566, 6.6018],
      "lekki": [3.4716, 6.4698],
      
      // Abuja
      "abuja": [7.5399, 9.0579],
      "garki": [7.4951, 9.0579],
      
      // Port Harcourt
      "port harcourt": [7.0134, 4.8156],
      
      // Kano
      "kano": [8.5264, 11.9925],
      
      // Ibadan
      "ibadan": [3.9470, 7.3986],
      
      // Kaduna
      "kaduna": [7.4421, 10.5264],
      
      // Benin City
      "benin": [5.6037, 6.3350],
      "benin city": [5.6037, 6.3350],
      
      // Enugu
      "enugu": [7.5105, 6.2649],
      
      // Jos
      "jos": [8.8932, 9.8965],
      
      // Warri
      "warri": [5.7500, 5.5166],
      
      // Calabar
      "calabar": [8.3275, 4.9517],
    };

    // Try to match city
    const cityKey = location.city?.toLowerCase() || "";
    if (cityCoordinates[cityKey]) {
      return cityCoordinates[cityKey];
    }

    // Try to match by state (approximate center coordinates)
    const stateCoordinates: Record<string, [number, number]> = {
      "lagos": [3.3792, 6.5244],
      "abuja": [7.5399, 9.0579],
      "rivers": [7.0134, 4.8156],
      "kano": [8.5264, 11.9925],
      "oyo": [3.9470, 7.3986],
      "kaduna": [7.4421, 10.5264],
      "edo": [5.6037, 6.3350],
      "enugu": [7.5105, 6.2649],
      "plateau": [8.8932, 9.8965],
      "delta": [5.7500, 5.5166],
      "cross river": [8.3275, 4.9517],
      "anambra": [6.9175, 6.2649],
      "imo": [7.0255, 5.4966],
      "abia": [7.5248, 5.4527],
      "akwa ibom": [7.8249, 4.9059],
      "bayelsa": [6.0699, 4.7719],
      "benue": [8.7340, 7.7099],
      "borno": [13.0827, 11.8846],
      "taraba": [9.7799, 7.8637],
    };

    const stateKey = location.state?.toLowerCase() || "";
    if (stateCoordinates[stateKey]) {
      return stateCoordinates[stateKey];
    }

    // Default to Nigeria center coordinates
    return [7.4951, 9.0579];
  }

  /**
   * Create a new stay
   */
  static async createStay(formData: StaysFormData): Promise<CreateStayResponse> {
    try {
      // Prepare form data for multipart/form-data
      const form = new FormData();

      // Add basic fields
      form.append("title", formData.accommodationTitle);
      form.append("description", formData.accommodationDescription);
      form.append("accommodationType", formData.accommodationType);

      // Add location
      if (formData.location) {
        form.append("location[address]", formData.location.address);
        form.append("location[city]", formData.location.city);
        form.append("location[state]", formData.location.state);
        form.append("location[country]", formData.location.country);
      }

      // Add geoLocation coordinates (CRITICAL FIX)
      const coordinates = formData.geoLocation?.coordinates || 
                         this.generateCoordinatesFromLocation(formData.location);
      
      form.append("geoLocation[coordinates][0]", coordinates[0].toString());
      form.append("geoLocation[coordinates][1]", coordinates[1].toString());

      // Add facilities
      if (formData.facilities && formData.facilities.length > 0) {
        formData.facilities.forEach((facilityId, index) => {
          form.append(`facilities[${index}]`, facilityId);
        });
      }

      // Add images
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          form.append(`images`, image);
        });
      }

      // Log form data for debugging
      console.log("Creating stay with coordinates:", coordinates);

      // Use uploadFile method for multipart/form-data
      const response = await apiClient.uploadFile<CreateStayResponse>(
        this.ENDPOINTS.CREATE_STAY,
        form
      );

      return response;
    } catch (error) {
      console.error("Stay creation failed:", error);
      throw error;
    }
  }

  /**
   * Delete a stay (for cleanup)
   */
  static async deleteStay(stayId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.ENDPOINTS.DELETE_STAY}${stayId}`);
    } catch (error) {
      console.error("Failed to delete stay:", error);
      // Don't throw - cleanup should be best effort
    }
  }

  /**
   * Create stay with progress feedback (for future units integration)
   */
  static async createStayComplete(
    formData: StaysFormData,
    onProgress: ProgressCallback
  ): Promise<CreateStayResponse> {
    try {
      // Step 1: Create the stay
      onProgress("Creating accommodation...", 33);
      const stayResponse = await this.createStay(formData);

      // Step 2: Future - Add units (placeholder for now)
      onProgress("Setting up accommodation...", 66);
      
      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Complete
      onProgress("Finalizing...", 100);

      return stayResponse;

    } catch (error) {
      console.error("Complete stay creation failed:", error);
      throw error;
    }
  }

  /**
   * Create stay with full error handling and cleanup
   */
  static async createStayWithCleanup(
    formData: StaysFormData,
    onProgress: ProgressCallback
  ): Promise<CreateStayResponse> {
    let stayId: string | null = null;

    try {
      // Create the stay
      onProgress("Creating accommodation...", 50);
      const stayResponse = await this.createStay(formData);
      stayId = stayResponse.data.stay._id;

      // Future: Add units here
      onProgress("Finalizing accommodation...", 100);
      
      return stayResponse;

    } catch (error) {
      // Cleanup on failure
      if (stayId) {
        console.log("Cleaning up failed stay creation...");
        await this.deleteStay(stayId);
      }
      
      throw error;
    }
  }

  /**
   * Validate stay data before submission
   */
  static validateStayData(formData: StaysFormData): string[] {
    const errors: string[] = [];

    // Basic validation
    if (!formData.accommodationTitle) errors.push("Accommodation title is required");
    if (!formData.accommodationDescription) errors.push("Accommodation description is required");
    if (!formData.images || formData.images.length === 0) errors.push("At least one image is required");
    if (!formData.accommodationType) errors.push("Accommodation type is required");

    // Location validation
    if (!formData.location) {
      errors.push("Location is required");
    } else {
      if (!formData.location.address) errors.push("Address is required");
      if (!formData.location.city) errors.push("City is required");
      if (!formData.location.state) errors.push("State is required");
      if (!formData.location.country) errors.push("Country is required");
    }

    // Facilities validation
    if (!formData.facilities || formData.facilities.length === 0) {
      errors.push("At least one facility is required");
    }

    // Coordinates validation (will be auto-generated if missing)
    if (!formData.geoLocation?.coordinates && !formData.location) {
      errors.push("Location coordinates are required");
    }

    return errors;
  }
}