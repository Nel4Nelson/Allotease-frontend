import { useQuery } from "@tanstack/react-query";
import { 
  EventReservationsService, 
  EventReservationsResponse, 
  EventReservationsParams,
  TransformedEventReservation
} from "@/services/event-reservations-service";
import { useAuthStore } from "@/stores/auth-store";

// Query keys
export const eventReservationsKeys = {
  all: ["eventReservations"] as const,
  lists: () => [...eventReservationsKeys.all, "list"] as const,
  list: (params: EventReservationsParams) => [...eventReservationsKeys.lists(), params] as const,
};

/**
 * Hook to fetch event reservations with pagination
 */
export function useEventReservations(params: EventReservationsParams = {}) {
  const { isAuthenticated } = useAuthStore();
  const { page = 1, limit = 10 } = params;

  return useQuery<EventReservationsResponse>({
    queryKey: eventReservationsKeys.list(params),
    queryFn: () => EventReservationsService.getEventReservations(params),
    enabled: isAuthenticated, // Only fetch if user is authenticated
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to get transformed event reservations data ready for DataTable
 */
export function useTransformedEventReservations(params: EventReservationsParams = {}) {
  const eventReservationsQuery = useEventReservations(params);

  // Transform the data for DataTable consumption
  const transformedData: TransformedEventReservation[] = 
    eventReservationsQuery.data?.data?.events 
      ? EventReservationsService.transformEventReservations(eventReservationsQuery.data.data.events)
      : [];

  // Extract pagination info
  const pagination = eventReservationsQuery.data?.data?.pagination || null;

  return {
    // Transformed data ready for DataTable
    data: transformedData,
    pagination,
    
    // Query states
    isLoading: eventReservationsQuery.isLoading,
    isError: eventReservationsQuery.isError,
    error: eventReservationsQuery.error,
    isSuccess: eventReservationsQuery.isSuccess,
    
    // Refetch function
    refetch: eventReservationsQuery.refetch,
    
    // Original query for advanced usage
    eventReservationsQuery,
  };
}

/**
 * Hook for manual refresh of event reservations
 */
export function useRefreshEventReservations() {
  const { refetch } = useTransformedEventReservations();
  
  return { refreshEventReservations: refetch };
}