import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BalanceService, BalanceResponse } from "@/services/balance-service";
import { useAuthStore } from "@/stores/auth-store";

// Query keys
export const balanceKeys = {
  all: ["balance"] as const,
  current: () => [...balanceKeys.all, "current"] as const,
};

/**
 * Hook to fetch allocation admin's current balance with smart caching
 */
export function useBalance() {
  const { isAuthenticated } = useAuthStore();

  return useQuery<BalanceResponse>({
    queryKey: balanceKeys.current(),
    queryFn: () => BalanceService.getBalance(),
    enabled: isAuthenticated, // Only fetch if user is authenticated
    staleTime: 30 * 1000, // 30 seconds - balance becomes stale quickly
    gcTime: 2 * 60 * 1000, // 2 minutes - don't keep in memory too long
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: true, // Always refetch on component mount
    retry: 2, // Retry failed requests twice
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to manually refresh balance (for after transactions, withdrawals, etc.)
 */
export function useRefreshBalance() {
  const queryClient = useQueryClient();

  const refreshBalance = async () => {
    await queryClient.invalidateQueries({
      queryKey: balanceKeys.current(),
    });
    
    // Optionally refetch immediately
    await queryClient.refetchQueries({
      queryKey: balanceKeys.current(),
    });
  };

  return { refreshBalance };
}

/**
 * Hook to get formatted balance values with loading and error states
 */
export function useFormattedBalance() {
  const balanceQuery = useBalance();
  
  // Extract balance from response (allocation admin uses 'balance' field)
  const balance = balanceQuery.data?.data?.balance ?? 0;
  
  return {
    // Raw balance value
    balance,
    
    // Formatted balance strings
    formattedBalance: BalanceService.formatBalance(balance),
    formattedAmount: BalanceService.formatBalanceAmount(balance),
    
    // Query states
    isLoading: balanceQuery.isLoading,
    isError: balanceQuery.isError,
    error: balanceQuery.error,
    isRefetching: balanceQuery.isRefetching,
    
    // Manual refresh function
    refetch: balanceQuery.refetch,
  };
}