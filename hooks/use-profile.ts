import { useQuery } from "@tanstack/react-query";
import { ProfileService, ProfileResponse, ProfileData } from "@/services/profile-service";

// Query keys for profile
export const profileKeys = {
  all: ["profile"] as const,
  detail: () => [...profileKeys.all, "detail"] as const,
};

/**
 * Hook to fetch user profile
 */
export function useProfile() {
  return useQuery<ProfileResponse>({
    queryKey: profileKeys.detail(),
    queryFn: () => ProfileService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

/**
 * Hook to get profile data with helper methods
 */
export function useProfileData() {
  const { data, isLoading, isError, refetch } = useProfile();

  const profileData = data?.data?.user;

  return {
    profile: profileData,
    isLoading,
    isError,
    refetch,
    // Helper methods
    fullName: profileData ? ProfileService.getFullName(profileData) : "",
    followersCount: profileData ? ProfileService.getFollowersCount(profileData) : 0,
    followingCount: profileData ? ProfileService.getFollowingCount(profileData) : 0,
    avatarUrl: profileData ? ProfileService.getAvatarUrl(profileData) : "/icons/encircle-star-green-avatar.svg",
    isBankVerified: profileData ? ProfileService.isBankVerified(profileData) : false,
    userRole: profileData ? ProfileService.getUserRole(profileData) : "",
    isVerified: profileData ? ProfileService.isUserVerified(profileData) : false,
  };
}