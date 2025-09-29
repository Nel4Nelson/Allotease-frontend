import { useQuery } from "@tanstack/react-query";
import { 
  ReservationsService, 
  ReservationsResponse, 
  ReservationsParams,
  TransformedReservation
} from "@/services/reservations-service";
import { useAuthStore } from "@/stores/auth-store";

// Query keys
export const reservationsKeys = {
  all: ["reservations"] as const,
  lists: () => [...reservationsKeys.all, "list"] as const,
  list: (params: ReservationsParams) => [...reservationsKeys.lists(), params] as const,
};

/**
 * Hook to fetch stays reservations with pagination
 */
export function useReservations(params: ReservationsParams = {}) {
  const { isAuthenticated } = useAuthStore();
  const { page = 1, limit = 10 } = params;

  return useQuery<ReservationsResponse>({
    queryKey: reservationsKeys.list(params),
    queryFn: () => ReservationsService.getReservations(params),
    enabled: isAuthenticated, // Only fetch if user is authenticated
    staleTime: 3 * 60 * 1000, // 3 minutes - reservations change moderately frequently
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus for table data
    refetchOnMount: true,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to get transformed reservations data ready for DataTable
 */
export function useTransformedReservations(params: ReservationsParams = {}) {
  const reservationsQuery = useReservations(params);

  // Transform the data for DataTable consumption
  const transformedData: TransformedReservation[] = 
    reservationsQuery.data?.data?.reservations 
      ? ReservationsService.transformReservationsWithMappedStatus(reservationsQuery.data.data.reservations)
      : [];

  // Extract pagination info
  const pagination = reservationsQuery.data?.data?.pagination || null;

  return {
    // Transformed data ready for DataTable
    data: transformedData,
    pagination,
    
    // Query states
    isLoading: reservationsQuery.isLoading,
    isError: reservationsQuery.isError,
    error: reservationsQuery.error,
    isSuccess: reservationsQuery.isSuccess,
    
    // Refetch function
    refetch: reservationsQuery.refetch,
    
    // Original query for advanced usage
    reservationsQuery,
  };
}

/**
 * Hook for manual refresh of reservations
 */
export function useRefreshReservations() {
  const { refetch } = useTransformedReservations();
  
  return { refreshReservations: refetch };
}