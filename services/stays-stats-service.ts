import { apiClient } from "./api-client";

export type TimeFrame = "day" | "week" | "month";
export type Scope = "self" | "all";

export interface StaysStatsResponse {
  status: string;
  message?: string;
  data: {
    totalReservations: {  // <- Changed to plural
      count: number;
      percentChange: number;  // <- Changed to percentChange
    };
    checkIns: {
      count: number;
      percentChange: number;  // <- Changed to percentChange
    };
    availableSpaces: {
      count: number;
      percentChange: number;  // <- Changed to percentChange
    };
    revenue: {
      amount: number;
      percentChange: number;  // <- Changed to percentChange
      currency: string;
    };
  };
}

export interface StaysStatsParams {
  timeframe?: TimeFrame;
  scope?: Scope;
}

export interface ProcessedStatValue {
  value: string;
  percentage: string;
}

export interface ProcessedStatsData {
  totalReservation: ProcessedStatValue;
  checkinsToday: ProcessedStatValue;
  availableSpaces: ProcessedStatValue;
  revenueThisMonth: ProcessedStatValue;
}

export class StaysStatsService {
  private static readonly ENDPOINTS = {
    GET_STAYS_STATS: "/dashboard/stays/stats",
  } as const;

  /**
   * Get stays statistics for allocation admin
   */
  static async getStaysStats(params: StaysStatsParams = {}): Promise<StaysStatsResponse> {
    try {
      const { timeframe = "day", scope = "self" } = params;

      const response = await apiClient.get<StaysStatsResponse>(
        this.ENDPOINTS.GET_STAYS_STATS,
        { timeframe, scope }
      );

      return response;
    } catch (error) {
      console.error("Get stays stats failed:", error);
      throw error;
    }
  }

  /**
   * Format a number as a count string
   * Example: 1234 → "1,234"
   */
  static formatCount(count: number): string {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(count);
    } catch (error) {
      console.error("Count formatting error:", error);
      return `${count}`;
    }
  }

  /**
   * Format revenue amount in Naira
   * Example: 3915000 → "N3,915,000"
   */
  static formatRevenue(amount: number): string {
    try {
      const formatted = new Intl.NumberFormat('en-NG', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);

      return `N${formatted}`;
    } catch (error) {
      console.error("Revenue formatting error:", error);
      return `N${amount}`;
    }
  }

  /**
   * Format percentage change
   * Example: 12.5 → "+12.5%", -5.3 → "-5.3%"
   */
  static formatPercentage(percentage: number): string {
    try {
      if (percentage === 0) return "0%";

      const sign = percentage > 0 ? "+" : "";
      const formatted = percentage.toFixed(1);

      return `${sign}${formatted}%`;
    } catch (error) {
      console.error("Percentage formatting error:", error);
      return "--";
    }
  }

  /**
   * Process stats data from API response
   */
  static processStatsData(
    statsResponse: StaysStatsResponse | null
  ): ProcessedStatsData {
    // Default fallback values
    const defaultValue: ProcessedStatValue = {
      value: "--",
      percentage: "--",
    };

    if (!statsResponse?.data) {
      return {
        totalReservation: defaultValue,
        checkinsToday: defaultValue,
        availableSpaces: defaultValue,
        revenueThisMonth: defaultValue,
      };
    }

    const { data } = statsResponse;

    return {
      totalReservation: {
        value: this.formatCount(data.totalReservations.count),  // <- plural
        percentage: this.formatPercentage(data.totalReservations.percentChange),  // <- percentChange
      },
      checkinsToday: {
        value: this.formatCount(data.checkIns.count),
        percentage: this.formatPercentage(data.checkIns.percentChange),  // <- percentChange
      },
      availableSpaces: {
        value: this.formatCount(data.availableSpaces.count),
        percentage: this.formatPercentage(data.availableSpaces.percentChange),  // <- percentChange
      },
      revenueThisMonth: {
        value: this.formatRevenue(data.revenue.amount),
        percentage: this.formatPercentage(data.revenue.percentChange),  // <- percentChange
      },
    };
  }
}