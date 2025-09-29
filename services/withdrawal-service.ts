import { apiClient } from "./api-client";

// Withdrawal API Request Types
export interface WithdrawRequest {
  amount: number;
}

// Withdrawal API Response Types
export interface WithdrawResponse {
  status: string;
  message?: string;
  data?: {
    transactionId?: string;
    withdrawalId?: string;
    amount?: number;
    fee?: number;
    netAmount?: number;
  };
}

// Withdrawal API Service
export class WithdrawalService {
  private static readonly ENDPOINTS = {
    WITHDRAW: "/dashboard/withdraw",
  } as const;

  /**
   * Process withdrawal request
   */
  static async withdraw(data: WithdrawRequest): Promise<WithdrawResponse> {
    try {
      const response = await apiClient.post<WithdrawResponse>(
        this.ENDPOINTS.WITHDRAW,
        data
      );

      return response;
    } catch (error) {
      console.error("Withdrawal failed:", error);
      throw error;
    }
  }

  /**
   * Format withdrawal amount for display
   */
  static formatWithdrawAmount(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Validate withdrawal amount
   */
  static validateWithdrawAmount(
    amount: number,
    availableBalance: number
  ): { isValid: boolean; error?: string } {
    if (amount <= 0) {
      return { isValid: false, error: "Amount must be greater than 0" };
    }

    if (amount > availableBalance) {
      return { isValid: false, error: "Insufficient balance" };
    }

    // Add minimum withdrawal amount check if needed
    const minimumWithdraw = 100; // NGN 100 minimum
    if (amount < minimumWithdraw) {
      return { 
        isValid: false, 
        error: `Minimum withdrawal amount is ${this.formatWithdrawAmount(minimumWithdraw)}` 
      };
    }

    return { isValid: true };
  }
}