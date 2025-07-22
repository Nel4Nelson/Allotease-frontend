// /services/stays-service.ts
import { apiClient, ApiResponse } from "./api-client";

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface GeoLocation {
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Stay {
  _id: string;
  accomodationType: string;
  description: string;
  facilities: string[];
  images: string[];
  title: string;
  ownerId: string;
  location: Location;
  geoLocation?: GeoLocation;
  createdAt: string;
  updatedAt: string;
}

export interface StayUnit {
  _id: string;
  stayId: string;
  quantity: number;
  price: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  title: string;
  facilities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StaysResponse {
  items: Stay[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface StayUnitsResponse {
  items: StayUnit[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface StaysQuery {
  accomodationType?: string;
  limit?: number;
  page?: number;
  city?: string;
  state?: string;
  country?: string;
}

export interface CreateStayRequest {
  title: string;
  description: string;
  geoLocation: GeoLocation;
  location: Location;
  accomodationType: string;
  images: string[];
  facilities: string[];
}

export interface CreateStayUnitRequest {
  quantity: number;
  price: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  title: string;
  facilities?: string[];
}

export interface CreateStayWithUnitsRequest {
  stay: CreateStayRequest;
  units: CreateStayUnitRequest[];
}

export class StaysService {
  private static readonly ENDPOINTS = {
    GET_STAYS: "/stays",
    GET_STAY_BY_ID: "/stays",
    CREATE_STAY: "/stays",
    GET_STAY_UNITS: "/stays",
    CREATE_STAY_UNIT: "/stays"
  } as const;

  /**
   * Get all stays with optional filters
   */
  static async getStays(
    params: StaysQuery = {}
  ): Promise<ApiResponse<StaysResponse>> {
    try {
      const queryParams = new URLSearchParams();

      if (params.accomodationType)
        queryParams.append("accomodationType", params.accomodationType);
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.city) queryParams.append("city", params.city);
      if (params.state) queryParams.append("state", params.state);
      if (params.country) queryParams.append("country", params.country);

      const url = `${this.ENDPOINTS.GET_STAYS}?${queryParams.toString()}`;

      const response = await apiClient.get<StaysResponse>(url);
      return response;
    } catch (error) {
      console.error("Failed to fetch stays:", error);
      throw error;
    }
  }

  /**
   * Get stays by accommodation type
   */
  static async getStaysByType(
    type: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<StaysResponse>> {
    return this.getStays({
      accomodationType: type,
      page,
      limit,
    });
  }

  /**
   * Get stay by ID
   */
  static async getStayById(id: string): Promise<ApiResponse<Stay>> {
    try {
      const response = await apiClient.get<Stay>(
        `${this.ENDPOINTS.GET_STAY_BY_ID}/${id}`
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch stay:", error);
      throw error;
    }
  }

  /**
   * Create a new stay
   */
  static async createStay(
    stayData: CreateStayRequest
  ): Promise<ApiResponse<Stay>> {
    try {
      const response = await apiClient.post<Stay>(
        this.ENDPOINTS.CREATE_STAY,
        stayData
      );
      return response;
    } catch (error) {
      console.error("Failed to create stay:", error);
      throw error;
    }
  }

  /**
   * Get units for a specific stay
   */
  static async getStayUnits(
    stayId: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<StayUnitsResponse>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      const url = `${this.ENDPOINTS.GET_STAY_UNITS}/${stayId}/units?${queryParams.toString()}`;

      const response = await apiClient.get<StayUnitsResponse>(url);
      return response;
    } catch (error) {
      console.error("Failed to fetch stay units:", error);
      throw error;
    }
  }

  /**
   * Create a unit for a specific stay
   */
  static async createStayUnit(
    stayId: string,
    unitData: CreateStayUnitRequest
  ): Promise<ApiResponse<StayUnit>> {
    try {
      const response = await apiClient.post<StayUnit>(
        `${this.ENDPOINTS.CREATE_STAY_UNIT}/${stayId}/units`,
        unitData
      );
      return response;
    } catch (error) {
      console.error("Failed to create stay unit:", error);
      throw error;
    }
  }

  /**
   * Create stay with units (atomic operation)
   * This method handles the complex flow of creating a stay and its units
   */
  static async createStayWithUnits(
    data: CreateStayWithUnitsRequest
  ): Promise<ApiResponse<{ stay: Stay; units: StayUnit[] }>> {
    try {
      // Step 1: Create the stay
      const stayResponse = await this.createStay(data.stay);
      
      if (!stayResponse.success || !stayResponse.data) {
        throw new Error("Failed to create stay");
      }

      const createdStay = stayResponse.data;

      // Step 2: Create all units
      const unitPromises = data.units.map(unitData => 
        this.createStayUnit(createdStay._id, unitData)
      );

      const unitResponses = await Promise.all(unitPromises);
      
      // Check if all units were created successfully
      const failedUnits = unitResponses.filter(response => !response.success);
      if (failedUnits.length > 0) {
        // In a real implementation, you might want to implement rollback logic here
        console.error("Some units failed to create:", failedUnits);
        throw new Error(`Failed to create ${failedUnits.length} unit(s)`);
      }

      const createdUnits = unitResponses
        .filter(response => response.success && response.data)
        .map(response => response.data!);

      return {
        success: true,
        message: "Stay and units created successfully",
        data: {
          stay: createdStay,
          units: createdUnits
        }
      };
    } catch (error) {
      console.error("Failed to create stay with units:", error);
      throw error;
    }
  }

  /**
   * Update a stay
   */
  static async updateStay(
    stayId: string,
    stayData: Partial<CreateStayRequest>
  ): Promise<ApiResponse<Stay>> {
    try {
      const response = await apiClient.put<Stay>(
        `${this.ENDPOINTS.GET_STAY_BY_ID}/${stayId}`,
        stayData
      );
      return response;
    } catch (error) {
      console.error("Failed to update stay:", error);
      throw error;
    }
  }

  /**
   * Delete a stay
   */
  static async deleteStay(stayId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<void>(
        `${this.ENDPOINTS.GET_STAY_BY_ID}/${stayId}`
      );
      return response;
    } catch (error) {
      console.error("Failed to delete stay:", error);
      throw error;
    }
  }

  /**
   * Update a stay unit
   */
  static async updateStayUnit(
    stayId: string,
    unitId: string,
    unitData: Partial<CreateStayUnitRequest>
  ): Promise<ApiResponse<StayUnit>> {
    try {
      const response = await apiClient.put<StayUnit>(
        `${this.ENDPOINTS.CREATE_STAY_UNIT}/${stayId}/units/${unitId}`,
        unitData
      );
      return response;
    } catch (error) {
      console.error("Failed to update stay unit:", error);
      throw error;
    }
  }

  /**
   * Delete a stay unit
   */
  static async deleteStayUnit(
    stayId: string,
    unitId: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<void>(
        `${this.ENDPOINTS.CREATE_STAY_UNIT}/${stayId}/units/${unitId}`
      );
      return response;
    } catch (error) {
      console.error("Failed to delete stay unit:", error);
      throw error;
    }
  }
}