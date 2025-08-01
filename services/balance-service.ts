import { apiClient } from "./api-client";

// Balance types
export interface BalanceData {
  balance: number;
}

export interface BalanceResponse {
  status: "success";
  data: BalanceData;
}

export interface WithdrawRequest {
  amount: string;
}

export interface WithdrawSuccessResponse {
  status: "success";
  data?: {
    transactionId?: string;
    newBalance?: number;
    withdrawnAmount?: number;
  };
}

export interface WithdrawErrorResponse {
  status: "fail";
  message: string;
  isOperational: boolean;
}

export type WithdrawResponse = WithdrawSuccessResponse | WithdrawErrorResponse;

// Balance API Service
export class BalanceService {
  private static readonly ENDPOINTS = {
    BALANCE: "/dashboard/balance",
    WITHDRAW: "/dashboard/withdraw",
  } as const;

  /**
   * Get user balance
   */
  static async getBalance(): Promise<BalanceResponse> {
    try {
      const response = await apiClient.get<BalanceResponse>(
        this.ENDPOINTS.BALANCE
      );
      return response;
    } catch (error) {
      console.error("Get balance failed:", error);
      throw error;
    }
  }

  /**
   * Withdraw funds
   */
  static async withdraw(amount: string): Promise<WithdrawResponse> {
    try {
      const response = await apiClient.post<WithdrawResponse>(
        this.ENDPOINTS.WITHDRAW,
        { amount }
      );
      return response;
    } catch (error) {
      console.error("Withdraw failed:", error);
      throw error;
    }
  }

  /**
   * Format balance as currency
   */
  static formatBalance(balance: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(balance);
  }

  /**
   * Check if withdrawal amount is valid
   */
  static isValidWithdrawAmount(amount: string, balance: number): boolean {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= balance;
  }
}
