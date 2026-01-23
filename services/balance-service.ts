import { apiClient } from "./api-client";

export interface BalanceResponse {
  status: string;
  data: {
    balance: number;
  };
}

export class BalanceService {
  private static readonly ENDPOINTS = {
    GET_BALANCE: "/dashboard/balance",
  } as const;

  /**
   * Get current balance for allocation admin
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
   * Format balance to Nigerian Naira with commas
   * Example: 3915000 → "N3,915,000"
   */
  static formatBalance(amount: number): string {
    try {
      const formatted = new Intl.NumberFormat('en-NG', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
      
      return `N${formatted}`;
    } catch (error) {
      console.error("Balance formatting error:", error);
      return `N${amount}`;
    }
  }

  /**
   * Format balance amount without currency symbol (for specific use cases)
   * Example: 3915000 → "3,915,000"
   */
  static formatBalanceAmount(amount: number): string {
    try {
      return new Intl.NumberFormat('en-NG', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      console.error("Amount formatting error:", error);
      return `${amount}`;
    }
  }

  /**
   * Parse formatted balance string back to number
   * Example: "N3,915,000" → 3915000
   */
  static parseBalance(formattedBalance: string): number {
    try {
      const cleanString = formattedBalance.replace(/[N,\s]/g, '');
      return parseInt(cleanString, 10) || 0;
    } catch (error) {
      console.error("Balance parsing error:", error);
      return 0;
    }
  }
}