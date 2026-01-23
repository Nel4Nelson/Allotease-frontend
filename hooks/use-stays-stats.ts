import { useQuery } from "@tanstack/react-query";
import { 
  StaysStatsService, 
  StaysStatsResponse, 
  TimeFrame,
} from "@/services/stays-stats-service";
import { useAuthStore } from "@/stores/auth-store";
import { getStatTitles } from "@/lib/stat-titles";

// Query keys
export const staysStatsKeys = {
  all: ["staysStats"] as const,
  byTimeframe: (timeframe: TimeFrame) => [...staysStatsKeys.all, timeframe, "self"] as const,
};

/**
 * Hook to fetch stays stats for allocation admin (scope=self)
 */
export function useStaysStats(timeframe: TimeFrame) {
  const { isAuthenticated } = useAuthStore();

  return useQuery<StaysStatsResponse>({
    queryKey: staysStatsKeys.byTimeframe(timeframe),
    queryFn: () => StaysStatsService.getStaysStats({ timeframe, scope: "self" }),
    enabled: isAuthenticated,
    staleTime: timeframe === "day" ? 2 * 60 * 1000 : 5 * 60 * 1000, // 2min for daily, 5min for others
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: timeframe === "day", // Refetch daily stats on focus
    refetchOnMount: true,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook that processes stats for a single timeframe with dynamic titles
 */
export function useProcessedStaysStats(timeframe: TimeFrame = "day") {
  const { isAuthenticated } = useAuthStore();

  // Fetch stats for the selected timeframe
  const statsQuery = useStaysStats(timeframe);

  // Get dynamic titles based on timeframe
  const titles = getStatTitles(timeframe);

  // Process the data using single timeframe
  const processedStats = StaysStatsService.processStatsData(
    statsQuery.data || null
  );

  // Format stats as array for easy mapping in components
  const statsArray = [
    {
      title: titles.totalReservation,
      value: processedStats.totalReservation.value,
      percentage: processedStats.totalReservation.percentage,
      isFirstCard: true,
    },
    {
      title: titles.checkins,
      value: processedStats.checkinsToday.value,
      percentage: processedStats.checkinsToday.percentage,
      isFirstCard: false,
    },
    {
      title: titles.availableSpaces,
      value: processedStats.availableSpaces.value,
      percentage: processedStats.availableSpaces.percentage,
      isFirstCard: false,
    },
    {
      title: titles.revenue,
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
    isLoading: statsQuery.isLoading,
    
    // Error states
    hasError: statsQuery.isError,
    error: statsQuery.error,
    
    // Success state
    isSuccess: statsQuery.isSuccess,
    
    // Refetch function
    refetch: statsQuery.refetch,
    
    // Query state for debugging
    statsQuery,
  };
}

/**
 * Hook for manual refresh of stays stats
 */
export function useRefreshStaysStats(timeframe: TimeFrame = "day") {
  const { refetch } = useProcessedStaysStats(timeframe);
  
  return { refreshStaysStats: refetch };
}