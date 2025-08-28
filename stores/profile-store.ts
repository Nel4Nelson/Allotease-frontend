/* eslint-disable @typescript-eslint/no-explicit-any */
//Todo: cache this with tanstack
import { create } from 'zustand';
import { ProfileData, ProfileService } from '@/services/profile-service';

interface ProfileState {
  // State
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // Actions
  setProfile: (profile: ProfileData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
  updateProfile: (updates: Partial<ProfileData>) => void;
  
  // Helper methods (backward compatible)
  getFullName: () => string;
  getFollowersCount: () => number;
  getFollowingCount: () => number;
  getAvatarUrl: () => string;
  shouldRefetch: () => boolean;
  
  // New helper methods for extended data
  isBankVerified: () => boolean;
  getUserRole: () => string;
  isUserVerified: () => boolean;
  getUserId: () => string;
  getEmail: () => string;
  
  // Generic getter for any profile field (for future extensibility)
  getProfileField: (fieldPath: string) => any;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export const useProfileStore = create<ProfileState>((set, get) => ({
  // Initial state
  profile: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  // Set profile data - now captures ALL response data
  setProfile: (profile: ProfileData) => {
    set({ 
      profile, 
      error: null, 
      lastFetched: Date.now(),
      isLoading: false 
    });
  },

  // Set loading state
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Set error state
  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },

  // Fetch profile from API - captures complete response data
  fetchProfile: async () => {
    const { isLoading, shouldRefetch } = get();
    
    // Don't fetch if already loading or data is fresh
    if (isLoading || !shouldRefetch()) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await ProfileService.getProfile();
      
      if (response.data?.user) {
        // Store the complete user object, including any additional fields
        get().setProfile(response.data.user);
      } else {
        get().setError("Invalid profile response");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      get().setError(error instanceof Error ? error.message : "Failed to fetch profile");
    }
  },

  // Clear profile data
  clearProfile: () => {
    set({ 
      profile: null, 
      isLoading: false, 
      error: null, 
      lastFetched: null 
    });
  },

  // Update profile data partially
  updateProfile: (updates: Partial<ProfileData>) => {
    const currentProfile = get().profile;
    if (currentProfile) {
      set({ 
        profile: { ...currentProfile, ...updates },
        lastFetched: Date.now()
      });
    }
  },

  getFullName: (): string => {
    const { profile } = get();
    return profile ? ProfileService.getFullName(profile) : '';
  },

  getFollowersCount: (): number => {
    const { profile } = get();
    return profile ? ProfileService.getFollowersCount(profile) : 0;
  },

  getFollowingCount: (): number => {
    const { profile } = get();
    return profile ? ProfileService.getFollowingCount(profile) : 0;
  },

  getAvatarUrl: (): string => {
    const { profile } = get();
    return profile ? ProfileService.getAvatarUrl(profile) : "/icons/encircle-star-green-avatar.svg";
  },

  // New helper methods for extended data
  isBankVerified: (): boolean => {
    const { profile } = get();
    return profile ? ProfileService.isBankVerified(profile) : false;
  },

  getUserRole: (): string => {
    const { profile } = get();
    return profile ? ProfileService.getUserRole(profile) : '';
  },

  isUserVerified: (): boolean => {
    const { profile } = get();
    return profile ? ProfileService.isUserVerified(profile) : false;
  },

  getUserId: (): string => {
    const { profile } = get();
    return profile?._id || '';
  },

  getEmail: (): string => {
    const { profile } = get();
    return profile?.email || '';
  },

  // Generic getter for any profile field using dot notation
  // Examples: getProfileField('bankInfo.verified'), getProfileField('firstname')
  getProfileField: (fieldPath: string): any => {
    const { profile } = get();
    if (!profile) return null;

    return fieldPath.split('.').reduce((obj, key) => {
      return obj && obj[key] !== undefined ? obj[key] : null;
    }, profile);
  },

  // Check if we should refetch data (if no data or data is stale)
  shouldRefetch: (): boolean => {
    const { profile, lastFetched } = get();
    
    // Always fetch if no profile data
    if (!profile) return true;
    
    // Fetch if no lastFetched timestamp
    if (!lastFetched) return true;
    
    // Fetch if data is older than cache duration
    return Date.now() - lastFetched > CACHE_DURATION;
  },
}));