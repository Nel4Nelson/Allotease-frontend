/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "./api-client";
import { useAuthStore } from "@/stores/auth-store";

// Allocator interface from API response
export interface Allocator {
  _id: string;
  firstname: string;
  lastname: string;
  role: string;
  avatar: string;
  followingCount: number;
  followersCount: number;
  isFollowing?: boolean;
}

// Followed user interface from the follow endpoint
interface FollowedUser {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  followersCount: number;
  avatar: string;
}

// API response interface for getting allocators
export interface GetAllocatorsResponse {
  status: string;
  message: string;
  data: {
    items: Allocator[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPages: number;
    totalCount: number;
    limit: number;
    page: number;
  };
}

// Follow/Unfollow response
interface FollowResponse {
  status: string;
  message: string;
  data?: any;
}

// Response for getting followed users
interface GetFollowedUsersResponse {
  status: string;
  message: string;
  data: FollowedUser[];
}

// Query parameters for getting allocators
export interface GetAllocatorsParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

export class AllocatorService {
  private static readonly ENDPOINTS = {
    GET_ALLOCATORS: "/users/allocators/",
    FOLLOW_USER: "/users/follow/",
    GET_FOLLOWED_USERS: "/users/follow/", // Same endpoint but GET method
  } as const;

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const { isAuthenticated } = useAuthStore.getState();
    return isAuthenticated;
  }

  /**
   * Get all users that the current user is following
   * Only call this if user is authenticated
   */
  static async getFollowedUsers(): Promise<string[]> {
    // Check authentication before making the request
    if (!this.isAuthenticated()) {
      console.log("User not authenticated, skipping followed users fetch");
      return [];
    }

    try {
      const response = await apiClient.get<GetFollowedUsersResponse>(
        this.ENDPOINTS.GET_FOLLOWED_USERS
      );

      if (response.status === "success") {
        // Return array of followed user IDs
        return response.data.map((user) => user._id);
      }

      return [];
    } catch (error: any) {
      // Handle 401 specifically without logging as error
      if (error?.response?.status === 401) {
        console.log("User session completed, clearing auth");
        useAuthStore.getState().clearAuth();
        return [];
      }

      console.error("Failed to fetch followed users:", error);
      return [];
    }
  }

  /**
   * Get all allocators with pagination and follow status (if authenticated)
   */
  static async getAllocators(
    params: GetAllocatorsParams = {}
  ): Promise<GetAllocatorsResponse> {
    try {
      const queryParams = new URLSearchParams();

      // Add default params
      queryParams.append("page", (params.page || 1).toString());
      queryParams.append("limit", (params.limit || 12).toString());

      // Add any additional params
      Object.keys(params).forEach((key) => {
        if (!["page", "limit"].includes(key) && params[key]) {
          queryParams.append(key, params[key].toString());
        }
      });

      const url = `${this.ENDPOINTS.GET_ALLOCATORS}?${queryParams.toString()}`;

      // If user is authenticated, fetch both allocators and followed users
      if (this.isAuthenticated()) {
        const [allocatorsResponse, followedUserIds] = await Promise.all([
          apiClient.get<GetAllocatorsResponse>(url),
          this.getFollowedUsers(),
        ]);

        // Mark allocators as followed if they're in the followed list
        if (allocatorsResponse.status === "success") {
          allocatorsResponse.data.items = allocatorsResponse.data.items.map(
            (allocator) => ({
              ...allocator,
              isFollowing: followedUserIds.includes(allocator._id),
            })
          );
        }

        return allocatorsResponse;
      } else {
        // User not authenticated, just fetch allocators without follow status
        const allocatorsResponse = await apiClient.get<GetAllocatorsResponse>(
          url
        );

        if (allocatorsResponse.status === "success") {
          // Ensure all allocators have isFollowing: false for unauthenticated users
          allocatorsResponse.data.items = allocatorsResponse.data.items.map(
            (allocator) => ({
              ...allocator,
              isFollowing: false,
            })
          );
        }

        return allocatorsResponse;
      }
    } catch (error) {
      console.error("Failed to fetch allocators:", error);
      throw error;
    }
  }

  /**
   * Get allocators with updated follow status (for refresh without full reload)
   * Only for authenticated users
   */
  static async updateAllocatorsFollowStatus(
    allocators: Allocator[]
  ): Promise<Allocator[]> {
    if (!this.isAuthenticated()) {
      // Return allocators with isFollowing: false for unauthenticated users
      return allocators.map((allocator) => ({
        ...allocator,
        isFollowing: false,
      }));
    }

    try {
      const followedUserIds = await this.getFollowedUsers();

      return allocators.map((allocator) => ({
        ...allocator,
        isFollowing: followedUserIds.includes(allocator._id),
      }));
    } catch (error) {
      console.error("Failed to update follow status:", error);
      return allocators; // Return original allocators if update fails
    }
  }

  /**
   * Follow a user
   */
  static async followUser(userToFollow: string): Promise<FollowResponse> {
    if (!this.isAuthenticated()) {
      throw new Error("User must be authenticated to follow");
    }

    try {
      const response = await apiClient.post<FollowResponse>(
        `${this.ENDPOINTS.FOLLOW_USER}${userToFollow}`,
        {} // Empty body for POST request
      );

      return response;
    } catch (error) {
      console.error("Failed to follow user:", error);
      throw error;
    }
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(userToUnfollow: string): Promise<FollowResponse> {
    if (!this.isAuthenticated()) {
      throw new Error("User must be authenticated to unfollow");
    }

    try {
      const response = await apiClient.delete<FollowResponse>(
        `${this.ENDPOINTS.FOLLOW_USER}${userToUnfollow}`
      );

      return response;
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      throw error;
    }
  }

  /**
   * Toggle follow status for a user
   */
  static async toggleFollowUser(
    userId: string,
    currentlyFollowing: boolean
  ): Promise<FollowResponse> {
    if (currentlyFollowing) {
      return this.unfollowUser(userId);
    } else {
      return this.followUser(userId);
    }
  }

  /**
   * Format allocator name for display
   */
  static formatAllocatorName(allocator: Allocator): string {
    return `${allocator.firstname} ${allocator.lastname}`;
  }

  /**
   * Format follower count for display
   */
  static formatFollowerCount(count: number): string {
    if (count === 0) {
      return "No followers";
    } else if (count === 1) {
      return "1 Follower";
    } else if (count < 1000) {
      return `${count} Followers`;
    } else if (count < 1000000) {
      const k = (count / 1000).toFixed(1);
      return `${k}K Followers`;
    } else {
      const m = (count / 1000000).toFixed(1);
      return `${m}M Followers`;
    }
  }

  /**
   * Get allocator avatar with fallback
   */
  static getAllocatorAvatar(allocator: Allocator): string {
    return "/icons/encircle-star-orange-avatar.svg";
  }

  /**
   * Map API allocator to UI profile format
   */
  static mapToProfile(allocator: Allocator): {
    id: string;
    name: string;
    followerCount: string;
    avatarUrl: string;
    isFollowing?: boolean;
  } {
    return {
      id: allocator._id,
      name: AllocatorService.formatAllocatorName(allocator),
      followerCount: AllocatorService.formatFollowerCount(
        allocator.followersCount
      ),
      avatarUrl: AllocatorService.getAllocatorAvatar(allocator),
      isFollowing: allocator.isFollowing || false,
    };
  }
}
