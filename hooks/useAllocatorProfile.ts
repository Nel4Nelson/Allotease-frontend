//Todo: Tell Johnpaul to give 
import { useQuery } from "@tanstack/react-query";
import { AllocatorService, Allocator } from "@/services/allocator-service";

// Response type for single allocator profile
interface AllocatorProfileResponse {
  status: string;
  message: string;
  data: Allocator;
}

/**
 * Hook to fetch a single allocator's profile
 */
export function useAllocatorProfile(allocatorId: string) {
  return useQuery<AllocatorProfileResponse>({
    queryKey: ["allocator", "profile", allocatorId],
    queryFn: async () => {
      // Fetch allocators and find by ID
      const response = await AllocatorService.getAllocators({
        page: 1,
        limit: 100, // Fetch more to increase chance of finding the allocator
      });

      // Find the allocator by ID from the response
      const allocator = response.data.items.find((a) => a._id === allocatorId);

      if (!allocator) {
        throw new Error("Allocator not found");
      }

      return {
        status: "success",
        message: "Allocator profile fetched successfully",
        data: allocator,
      };
    },
    enabled: !!allocatorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}