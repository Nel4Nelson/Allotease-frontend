import { apiClient } from "./api-client";

// Profile types
export interface ProfileData {
  bankInfo: {
    verified: boolean;
  };
  _id: string;
  email: string;
  firstname: string;
  followingCount: number;
  followersCount: number;
  lastname: string;
  role: string;
  avatar: string;
  isVerified: boolean;
}

export interface ProfileResponse {
  message: string;
  data: {
    user: ProfileData;
  };
}

// Profile API Service
export class ProfileService {
  private static readonly ENDPOINTS = {
    PROFILE: "/users/profile",
  } as const;

  /**
   * Get user profile
   */
  static async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await apiClient.get<ProfileResponse>(
        this.ENDPOINTS.PROFILE
      );

      return response;
    } catch (error) {
      console.error("Get profile failed:", error);
      throw error;
    }
  }

  /**
   * Get user's full name from profile data
   */
  static getFullName(profile: ProfileData): string {
    return `${profile.firstname} ${profile.lastname}`.trim();
  }

  /**
   * Get followers count from profile data
   */
  static getFollowersCount(profile: ProfileData): number {
    return profile.followersCount || 0;
  }

  /**
   * Get following count from profile data
   */
  static getFollowingCount(profile: ProfileData): number {
    return profile.followingCount || 0;
  }

  /**
   * Get avatar URL with fallback
   */
  static getAvatarUrl(profile: ProfileData): string {
    return profile.avatar || "/icons/encircle-star-green-avatar.svg";
  }
}