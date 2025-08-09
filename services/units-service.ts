import { apiClient } from "./api-client";
import type { UnitData } from "@/stores/stay-form-store";

// Unit creation payload interface
export interface CreateUnitPayload {
  quantity: number;
  price: number;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  title: string;
  description: string;
  facilities?: string[];
}

// Unit creation response interface
export interface CreateUnitResponse {
  status: string;
  message: string;
  data: {
    unit: {
      _id: string;
      title: string;
      description: string;
      price: number;
      frequency: string;
      quantity: number;
      totalBooked: number;
      facilities: string[];
      ownerId: string;
      stayId: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

// Batch unit creation response
export interface BatchCreateUnitsResponse {
  status: string;
  message: string;
  data: {
    units: CreateUnitResponse['data']['unit'][];
    successful: number;
    failed: number;
    errors?: Array<{
      unit: CreateUnitPayload;
      error: string;
    }>;
  };
}

export class UnitsService {
  /**
   * Create a single unit for a stay
   */
  static async createUnit(
    stayId: string, 
    unitData: CreateUnitPayload
  ): Promise<CreateUnitResponse> {
    try {
      const response = await apiClient.post<CreateUnitResponse>(
        `/stays/${stayId}/units`,
        unitData
      );
      
      return response;
    } catch (error) {
      console.error(`Failed to create unit for stay ${stayId}:`, error);
      throw error;
    }
  }

  /**
   * Create multiple units for a stay (sequential)
   */
  static async createUnits(
    stayId: string, 
    units: UnitData[]
  ): Promise<BatchCreateUnitsResponse> {
    const results: CreateUnitResponse['data']['unit'][] = [];
    const errors: Array<{ unit: CreateUnitPayload; error: string }> = [];
    
    try {
      for (const unit of units) {
        try {
          const unitPayload: CreateUnitPayload = {
            quantity: unit.quantity,
            price: unit.price,
            frequency: unit.frequency,
            title: unit.title,
            description: unit.description,
            ...(unit.facilities.length > 0 && { facilities: unit.facilities })
          };

          const response = await this.createUnit(stayId, unitPayload);
          results.push(response.data.unit);
          
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
          errors.push({
            unit: {
              quantity: unit.quantity,
              price: unit.price,
              frequency: unit.frequency,
              title: unit.title,
              description: unit.description,
              ...(unit.facilities.length > 0 && { facilities: unit.facilities })
            },
            error: errorMessage
          });
        }
      }

      return {
        status: errors.length === 0 ? 'success' : 'partial',
        message: errors.length === 0 
          ? 'All units created successfully' 
          : `${results.length} units created, ${errors.length} failed`,
        data: {
          units: results,
          successful: results.length,
          failed: errors.length,
          ...(errors.length > 0 && { errors })
        }
      };

    } catch (error) {
      console.error(`Failed to create units for stay ${stayId}:`, error);
      throw error;
    }
  }

  /**
   * Create units with progress callback
   */
  static async createUnitsWithProgress(
    stayId: string,
    units: UnitData[],
    onProgress: (current: number, total: number, unitTitle: string) => void
  ): Promise<BatchCreateUnitsResponse> {
    const results: CreateUnitResponse['data']['unit'][] = [];
    const errors: Array<{ unit: CreateUnitPayload; error: string }> = [];
    
    try {
      for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        
        // Report progress
        onProgress(i + 1, units.length, unit.title);
        
        try {
          const unitPayload: CreateUnitPayload = {
            quantity: unit.quantity,
            price: unit.price,
            frequency: unit.frequency,
            title: unit.title,
            description: unit.description,
            ...(unit.facilities.length > 0 && { facilities: unit.facilities })
          };

          const response = await this.createUnit(stayId, unitPayload);
          results.push(response.data.unit);
          
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
          errors.push({
            unit: {
              quantity: unit.quantity,
              price: unit.price,
              frequency: unit.frequency,
              title: unit.title,
              description: unit.description,
              ...(unit.facilities.length > 0 && { facilities: unit.facilities })
            },
            error: errorMessage
          });
        }
      }

      return {
        status: errors.length === 0 ? 'success' : 'partial',
        message: errors.length === 0 
          ? 'All units created successfully' 
          : `${results.length} units created, ${errors.length} failed`,
        data: {
          units: results,
          successful: results.length,
          failed: errors.length,
          ...(errors.length > 0 && { errors })
        }
      };

    } catch (error) {
      console.error(`Failed to create units for stay ${stayId}:`, error);
      throw error;
    }
  }

  /**
   * Validate unit data before creation
   */
  static validateUnitData(unit: UnitData): string[] {
    const errors: string[] = [];

    if (!unit.title || unit.title.trim().length === 0) {
      errors.push("Unit title is required");
    }

    if (!unit.description || unit.description.trim().length === 0) {
      errors.push("Unit description is required");
    }

    if (!unit.price || unit.price <= 0) {
      errors.push("Unit price must be greater than 0");
    }

    if (!unit.frequency || !['daily', 'weekly', 'monthly', 'yearly'].includes(unit.frequency)) {
      errors.push("Valid frequency is required (daily, weekly, monthly, yearly)");
    }

    if (!unit.quantity || unit.quantity <= 0) {
      errors.push("Unit quantity must be at least 1");
    }

    return errors;
  }

  /**
   * Validate all units before creation
   */
  static validateAllUnits(units: UnitData[]): Array<{ unitIndex: number; unitTitle: string; errors: string[] }> {
    const validationResults: Array<{ unitIndex: number; unitTitle: string; errors: string[] }> = [];

    units.forEach((unit, index) => {
      const errors = this.validateUnitData(unit);
      if (errors.length > 0) {
        validationResults.push({
          unitIndex: index,
          unitTitle: unit.title,
          errors
        });
      }
    });

    return validationResults;
  }

  /**
   * Format unit for display
   */
  static formatUnitPrice(unit: UnitData): string {
    const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    });
    
    return `${formatter.format(unit.price)} per ${unit.frequency}`;
  }

  /**
   * Get unit summary for confirmation
   */
  static getUnitsSummary(units: UnitData[]): {
    totalUnits: number;
    totalQuantity: number;
    priceRange: { min: number; max: number };
    frequencies: string[];
  } {
    if (units.length === 0) {
      return {
        totalUnits: 0,
        totalQuantity: 0,
        priceRange: { min: 0, max: 0 },
        frequencies: []
      };
    }

    const totalQuantity = units.reduce((sum, unit) => sum + unit.quantity, 0);
    const prices = units.map(unit => unit.price);
    const frequencies = [...new Set(units.map(unit => unit.frequency))];

    return {
      totalUnits: units.length,
      totalQuantity,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      frequencies
    };
  }
}