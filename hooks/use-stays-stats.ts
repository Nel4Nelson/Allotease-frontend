import { useQuery } from "@tanstack/react-query";
import { 
  StaysStatsService, 
  StaysStatsResponse, 
  StaysStatsParams,
  ProcessedStatsData
} from "@/services/stays-stats-service";
import { useAuthStore } from "@/stores/auth-store";

// Query keys
export const staysStatsKeys = {
  all: ["staysStats"] as const,
  byTimeframe: (timeframe: string) => [...staysStatsKeys.all, timeframe] as const,
};

/**
 * Hook to fetch stays stats for a specific timeframe
 */
export function useStaysStats(timeframe: "day" | "month") {
  const { isAuthenticated } = useAuthStore();

  return useQuery<StaysStatsResponse>({
    queryKey: staysStatsKeys.byTimeframe(timeframe),
    queryFn: () => StaysStatsService.getStaysStats({ timeframe }),
    enabled: isAuthenticated, // Only fetch if user is authenticated
    staleTime: timeframe === "day" ? 2 * 60 * 1000 : 5 * 60 * 1000, // 2min for daily, 5min for monthly
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: timeframe === "day", // Refetch daily stats on focus
    refetchOnMount: true,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Optimized hook that fetches both daily and monthly stats (2 calls only)
 * - Daily: for check-ins today
 * - Monthly: for total reservations, available spaces, and revenue this month
 */
export function useProcessedStaysStats() {
  const { isAuthenticated } = useAuthStore();

  // Fetch daily stats (for check-ins today only)
  const dailyStatsQuery = useStaysStats("day");
  
  // Fetch monthly stats (for reservations, available spaces, and revenue)
  const monthlyStatsQuery = useStaysStats("month");

  // Determine overall loading state
  const isLoading = dailyStatsQuery.isLoading || monthlyStatsQuery.isLoading;
  
  // Determine if there are any errors
  const hasError = dailyStatsQuery.isError || monthlyStatsQuery.isError;
  
  // Get error details
  const error = dailyStatsQuery.error || monthlyStatsQuery.error;
  
  // Check if one query failed but the other succeeded
  const isPartialError = 
    (dailyStatsQuery.isError && !monthlyStatsQuery.isError) ||
    (!dailyStatsQuery.isError && monthlyStatsQuery.isError);

  // Process the data using our optimized approach
  const processedStats = StaysStatsService.processStatsData(
    dailyStatsQuery.data || null,
    monthlyStatsQuery.data || null
  );

  // Format stats as array for easy mapping in components
  const statsArray = [
    {
      title: "Total reservation",
      value: processedStats.totalReservation.value,
      percentage: processedStats.totalReservation.percentage,
      isFirstCard: true,
    },
    {
      title: "Check-ins today", 
      value: processedStats.checkinsToday.value,
      percentage: processedStats.checkinsToday.percentage,
      isFirstCard: false,
    },
    {
      title: "Available spaces",
      value: processedStats.availableSpaces.value,
      percentage: processedStats.availableSpaces.percentage,
      isFirstCard: false,
    },
    {
      title: "Revenue this month",
      value: processedStats.revenueThisMonth.value,
      percentage: processedStats.revenueThisMonth.percentage,
      isFirstCard: false,
    },
  ];

  return {
    // Processed data
    statsArray,
    processedStats,
    
    // Loading states
    isLoading,
    isDailyLoading: dailyStatsQuery.isLoading,
    isMonthlyLoading: monthlyStatsQuery.isLoading,
    
    // Error states
    hasError,
    isPartialError,
    error,
    dailyError: dailyStatsQuery.error,
    monthlyError: monthlyStatsQuery.error,
    
    // Success states
    isDailySuccess: dailyStatsQuery.isSuccess,
    isMonthlySuccess: monthlyStatsQuery.isSuccess,
    isBothSuccess: dailyStatsQuery.isSuccess && monthlyStatsQuery.isSuccess,
    
    // Refetch functions
    refetchDaily: dailyStatsQuery.refetch,
    refetchMonthly: monthlyStatsQuery.refetch,
    refetchAll: async () => {
      await Promise.all([
        dailyStatsQuery.refetch(),
        monthlyStatsQuery.refetch()
      ]);
    },
    
    // Individual query states for debugging
    dailyStatsQuery,
    monthlyStatsQuery,
  };
}

/**
 * Hook for manual refresh of stays stats
 */
export function useRefreshStaysStats() {
  const { refetchAll } = useProcessedStaysStats();
  
  return { refreshStaysStats: refetchAll };
}