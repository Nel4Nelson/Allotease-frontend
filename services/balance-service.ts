import { apiClient } from "./api-client";

// Balance API Response Types
export interface BalanceResponse {
  status: string;
  data: {
    balance: number;
  };
  message?: string;
}

export interface BalanceData {
  balance: number;
}

// Balance API Service
export class BalanceService {
  private static readonly ENDPOINTS = {
    GET_BALANCE: "/dashboard/balance",
  } as const;

  /**
   * Get user's current balance
   */
  static async getBalance(): Promise<BalanceResponse> {
    try {
      const response = await apiClient.get<BalanceResponse>(
        this.ENDPOINTS.GET_BALANCE
      );

      return response;
    } catch (error) {
      console.error("Get balance failed:", error);
      throw error;
    }
  }

  /**
   * Format balance amount with NGN currency
   */
  static formatBalance(balance: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(balance);
  }

  /**
   * Format balance amount without currency symbol (for display flexibility)
   */
  static formatBalanceAmount(balance: number): string {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(balance);
  }
}