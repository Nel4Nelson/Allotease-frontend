/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "./api-client";

// Bank info interface
export interface BankInfo {
  verified: boolean;
  // Future bank-related fields can be added here
  [key: string]: any;
}

// Extended Profile types - maintaining backward compatibility
export interface ProfileData {
  // Core user fields
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  avatar: string;
  isVerified: boolean;

  // Social counts
  followingCount: number;
  followersCount: number;

  // Bank information
  bankInfo: BankInfo;

  // Allow for future fields to be added without breaking existing code
  [key: string]: any;
}

export interface ProfileResponse {
  message: string;
  data: {
    user: ProfileData;
    // Allow for future response fields
    [key: string]: any;
  };
  // Allow for future top-level response fields
  [key: string]: any;
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

  /**
   * Check if bank info is verified
   */
  static isBankVerified(profile: ProfileData): boolean {
    return profile.bankInfo?.verified || false;
  }

  /**
   * Get user role
   */
  static getUserRole(profile: ProfileData): string {
    return profile.role || "";
  }

  /**
   * Check if user is verified
   */
  static isUserVerified(profile: ProfileData): boolean {
    return profile.isVerified || false;
  }
}
