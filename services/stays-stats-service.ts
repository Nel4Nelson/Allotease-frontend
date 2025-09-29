import { apiClient } from "./api-client";

// Stays Stats API Response Types
export interface StaysStatsResponse {
  status: string;
  data: {
    totalReservations: {
      count: number;
      percentChange: number;
    };
    checkIns: {
      count: number;
      percentChange: number;
    };
    availableSpaces: {
      count: number;
      percentChange: number;
    };
    revenue: {
      amount: number;
      percentChange: number;
      currency: string;
    };
  };
  message?: string;
}

export type TimeFrame = "day" | "week" | "month";

export interface StaysStatsParams {
  timeframe: TimeFrame;
}

export interface ProcessedStatsData {
  totalReservation: {
    value: string;
    percentage: string;
  };
  checkinsToday: {
    value: string;
    percentage: string;
  };
  availableSpaces: {
    value: string;
    percentage: string;
  };
  revenueThisMonth: {
    value: string;
    percentage: string;
  };
}

// Stays Stats API Service
export class StaysStatsService {
  private static readonly ENDPOINTS = {
    GET_STATS: "/dashboard/stays/stats",
  } as const;

  /**
   * Get stays stats for a specific timeframe
   */
  static async getStaysStats(params: StaysStatsParams): Promise<StaysStatsResponse> {
    try {
      const response = await apiClient.get<StaysStatsResponse>(
        this.ENDPOINTS.GET_STATS,
        params
      );

      return response;
    } catch (error) {
      console.error(`Get stays stats failed for timeframe ${params.timeframe}:`, error);
      throw error;
    }
  }

  /**
   * Format percentage change
   */
  static formatPercentageChange(percentChange: number): string {
    const sign = percentChange >= 0 ? "+" : "";
    return `${sign}${Math.round(percentChange)}%`;
  }

  /**
   * Format currency amount
   */
  static formatCurrency(amount: number, currency: string = "NGN"): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Format count number
   */
  static formatCount(count: number): string {
    return new Intl.NumberFormat('en-NG').format(count);
  }

  /**
   * Process stats data for display using optimal 2-call approach
   * - Daily stats: for "Check-ins today" 
   * - Monthly stats: for "Total reservations", "Available spaces", and "Revenue this month"
   */
  static processStatsData(
    dailyStats: StaysStatsResponse | null,
    monthlyStats: StaysStatsResponse | null
  ): ProcessedStatsData {
    return {
      // From monthly stats
      totalReservation: {
        value: monthlyStats?.data?.totalReservations?.count !== undefined
          ? this.formatCount(monthlyStats.data.totalReservations.count)
          : "--",
        percentage: monthlyStats?.data?.totalReservations?.percentChange !== undefined
          ? this.formatPercentageChange(monthlyStats.data.totalReservations.percentChange)
          : "--",
      },
      // From daily stats  
      checkinsToday: {
        value: (dailyStats?.data?.checkIns && typeof dailyStats.data.checkIns.count === 'number')
          ? this.formatCount(dailyStats.data.checkIns.count)
          : "--",
        percentage: (dailyStats?.data?.checkIns && typeof dailyStats.data.checkIns.percentChange === 'number')
          ? this.formatPercentageChange(dailyStats.data.checkIns.percentChange)
          : "--",
      },
      // From monthly stats
      availableSpaces: {
        value: monthlyStats?.data?.availableSpaces?.count !== undefined
          ? this.formatCount(monthlyStats.data.availableSpaces.count)
          : "--",
        percentage: monthlyStats?.data?.availableSpaces?.percentChange !== undefined
          ? this.formatPercentageChange(monthlyStats.data.availableSpaces.percentChange)
          : "--",
      },
      // From monthly stats
      revenueThisMonth: {
        value: monthlyStats?.data?.revenue?.amount !== undefined
          ? this.formatCurrency(monthlyStats.data.revenue.amount, monthlyStats.data.revenue.currency)
          : "--",
        percentage: monthlyStats?.data?.revenue?.percentChange !== undefined
          ? this.formatPercentageChange(monthlyStats.data.revenue.percentChange)
          : "--",
      },
    };
  }
}