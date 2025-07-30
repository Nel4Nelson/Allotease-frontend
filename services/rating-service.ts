/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "./api-client";

// Review interfaces
export interface ReviewUser {
  _id: string;
  firstname: string;
  lastname: string;
  avatar: string;
}

export interface Review {
  _id: string;
  userId: ReviewUser;
  allocatorId: string;
  bookingId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ReviewAllocator {
  _id: string;
  name: string;
  averageRating: number;
  totalReviews: number;
}

export interface ReviewPagination {
  totalReviews: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetReviewsResponse {
  status: string;
  data: {
    allocator: ReviewAllocator;
    reviews: Review[];
    pagination: ReviewPagination;
  };
}

// Query parameters for getting reviews
export interface GetReviewsParams {
  page?: number;
  limit?: number;
  [key: string]: any; // Allow additional query params
}

export class RatingService {
  private static readonly ENDPOINTS = {
    GET_REVIEWS: "/reviews/allocator/", // Will append allocatorId
  } as const;

  /**
   * Get reviews for an allocator (stay owner)
   */
  static async getReviewsByAllocator(
    allocatorId: string,
    params: GetReviewsParams = {}
  ): Promise<GetReviewsResponse> {
    try {
      const queryParams = new URLSearchParams();

      // Add default params
      queryParams.append("page", (params.page || 1).toString());
      queryParams.append("limit", (params.limit || 10).toString());

      // Add any additional params
      Object.keys(params).forEach((key) => {
        if (!["page", "limit"].includes(key) && params[key]) {
          queryParams.append(key, params[key].toString());
        }
      });

      const url = `${
        this.ENDPOINTS.GET_REVIEWS
      }${allocatorId}?${queryParams.toString()}`;
      const response = await apiClient.get<GetReviewsResponse>(url);

      return response;
    } catch (error) {
      console.error(
        `Failed to fetch reviews for allocator ${allocatorId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get only allocator rating summary (first page with limit 1 for efficiency)
   */
  static async getAllocatorRating(
    allocatorId: string
  ): Promise<ReviewAllocator | null> {
    try {
      const response = await this.getReviewsByAllocator(allocatorId, {
        page: 1,
        limit: 1,
      });

      if (response.status === "success") {
        return response.data.allocator;
      }

      return null;
    } catch (error) {
      console.error(
        `Failed to fetch allocator rating for ${allocatorId}:`,
        error
      );
      return null; // Return null instead of throwing for rating data
    }
  }

  /**
   * Format total reviews count for display
   */
  static formatReviewsCount(count: number): string {
    if (count === 0) return "No reviews";
    if (count === 1) return "1 review";

    // Format large numbers with commas
    const formatter = new Intl.NumberFormat("en-US");
    return `${formatter.format(count)} reviews`;
  }

  /**
   * Check if allocator has reviews
   */
  static hasReviews(allocator: ReviewAllocator | null): boolean {
    return allocator !== null && allocator.totalReviews > 0;
  }

  /**
   * Get rating display data for UI
   */
  static getRatingDisplayData(allocator: ReviewAllocator | null): {
    hasRating: boolean;
    rating: number;
    reviewsText: string;
  } {
    if (!allocator || allocator.totalReviews === 0) {
      return {
        hasRating: false,
        rating: 0,
        reviewsText: "No reviews yet",
      };
    }

    return {
      hasRating: true,
      rating: allocator.averageRating,
      reviewsText: this.formatReviewsCount(allocator.totalReviews),
    };
  }

  /**
   * Validate rating value
   */
  static isValidRating(rating: number): boolean {
    return rating >= 0 && rating <= 5;
  }

  /**
   * Get rating category based on score
   */
  static getRatingCategory(
    rating: number
  ): "excellent" | "very-good" | "good" | "fair" | "poor" {
    if (rating >= 4.5) return "excellent";
    if (rating >= 4.0) return "very-good";
    if (rating >= 3.0) return "good";
    if (rating >= 2.0) return "fair";
    return "poor";
  }

  /**
   * Sort reviews by different criteria
   */
  static sortReviews(
    reviews: Review[],
    sortBy: "newest" | "oldest" | "highest" | "lowest" = "newest"
  ): Review[] {
    const sorted = [...reviews];

    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }

  /**
   * Format review date for display
   */
  static formatReviewDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  /**
   * Get user display name from review user
   */
  static getUserDisplayName(user: ReviewUser): string {
    return `${user.firstname} ${user.lastname}`.trim();
  }

  /**
   * Truncate review comment for preview
   */
  static truncateComment(comment: string, maxLength: number = 150): string {
    if (comment.length <= maxLength) return comment;

    const truncated = comment.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");

    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + "...";
    }

    return truncated + "...";
  }
}
