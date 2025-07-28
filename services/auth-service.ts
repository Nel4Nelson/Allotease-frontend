import { apiClient } from "./api-client";
import {
  SignupRequest,
  SigninRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  SignupResponse,
  SigninResponse,
  OtpResponse,
  ResendOtpResponse,
  PartialUpgradeRequest,
  PartialUpgradeResponse,
  LogoutResponse,
} from "@/types/auth";
import { useAuthStore } from "@/stores/auth-store";

// Auth API Service
export class AuthService {
  private static readonly ENDPOINTS = {
    // Signup endpoints
    SIGNUP: "/auth/signup",

    // Login endpoints
    USER_LOGIN: "/auth/login",

    // OTP endpoints
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",

    // Other endpoints
    PARTIAL_UPGRADE: "/users/partial-upgrade",
    LOGOUT: "/auth/logout",
  } as const;

  /**
   * User signup (Attendee)
   */
  static async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await apiClient.post<SignupResponse>(
        this.ENDPOINTS.SIGNUP,
        data
      );

      return response;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  }

  /**
   * Verify OTP after signup
   */
  static async verifyOtp(data: VerifyOtpRequest): Promise<OtpResponse> {
    try {
      const response = await apiClient.post<OtpResponse>(
        this.ENDPOINTS.VERIFY_OTP,
        data
      );

      // Store auth token and user data after successful OTP verification
      if (response.status === "success" && response.token && response.user) {
        const authStore = useAuthStore.getState();
        authStore.setUserAndToken(response.user, response.token, true);

        // Set the token in apiClient as well
        apiClient.setAuthToken(response.token, true);
      }

      return response;
    } catch (error) {
      console.error("OTP verification failed:", error);
      throw error;
    }
  }

  /**
   * Resend OTP
   */
  static async resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    try {
      const response = await apiClient.post<ResendOtpResponse>(
        this.ENDPOINTS.RESEND_OTP,
        data
      );

      return response;
    } catch (error) {
      console.error("Resend OTP failed:", error);
      throw error;
    }
  }

  /**
   * User login (Attendee)
   */
  static async userLogin(
    data: SigninRequest,
    rememberMe: boolean = true
  ): Promise<SigninResponse> {
    try {
      const response = await apiClient.post<SigninResponse>(
        this.ENDPOINTS.USER_LOGIN,
        data
      );

      // Store auth token and user data after successful login
      if (response.status === "success" && response.token && response.user) {
        const authStore = useAuthStore.getState();
        authStore.setUserAndToken(response.user, response.token, rememberMe);

        // Set the token in apiClient as well
        apiClient.setAuthToken(response.token, rememberMe);
      }

      return response;
    } catch (error) {
      console.error("User login failed:", error);
      throw error;
    }
  }

  /**
   * Partial upgrade to allocation admin
   */
  static async partialUpgrade(
    data: PartialUpgradeRequest
  ): Promise<PartialUpgradeResponse> {
    try {
      const response = await apiClient.post<PartialUpgradeResponse>(
        this.ENDPOINTS.PARTIAL_UPGRADE,
        data
      );

      // Store the new token and updated user data after successful upgrade
      if (response.status === "success" && response.token && response.data?.user) {
        const authStore = useAuthStore.getState();
        authStore.setUserAndToken(response.data.user, response.token, true);

        // Set the token in apiClient as well
        apiClient.setAuthToken(response.token, true);
      }

      return response;
    } catch (error) {
      console.error("Partial upgrade failed:", error);
      throw error;
    }
  }

  /**
   * Logout user - calls backend endpoint
   */
  static async logout(): Promise<void> {
    try {
      // Get current token before clearing
      const authStore = useAuthStore.getState();
      const token = authStore.token;

      // Call logout endpoint if user is authenticated
      if (token) {
        try {
          await apiClient.post<LogoutResponse>(this.ENDPOINTS.LOGOUT);
        } catch (error) {
          // Continue with logout even if API call fails
          console.warn("Logout API call failed, but continuing with local logout:", error);
        }
      }

      // Always clear local auth state
      authStore.clearAuth();
      
      // Clear token from apiClient
      apiClient.clearAuthToken();

      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, clear local state
      const authStore = useAuthStore.getState();
      authStore.clearAuth();
      apiClient.clearAuthToken();
      
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
  }

  /**
   * Logout user locally without API call (for token expiry, etc.)
   */
  static logoutLocal(): void {
    const authStore = useAuthStore.getState();
    authStore.logout();

    // Clear token from apiClient as well
    apiClient.clearAuthToken();
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const authStore = useAuthStore.getState();
    return authStore.isAuthenticated && authStore.checkTokenExpiry();
  }

  /**
   * Get current auth token
   */
  static getAuthToken(): string | null {
    const authStore = useAuthStore.getState();
    return authStore.token;
  }

  /**
   * Get current user
   */
  static getCurrentUser() {
    const authStore = useAuthStore.getState();
    return authStore.user;
  }

  /**
   * Check if current user is verified
   */
  static isUserVerified(): boolean {
    const authStore = useAuthStore.getState();
    return authStore.isUserVerified();
  }

  /**
   * Check if current user has business info (is allocator)
   */
  static hasBusinessInfo(): boolean {
    const authStore = useAuthStore.getState();
    return authStore.hasBusinessInfo();
  }

  /**
   * Get user's full name
   */
  static getUserFullName(): string {
    const authStore = useAuthStore.getState();
    return authStore.getFullName();
  }

  /**
   * Get user role
   */
  static getUserRole() {
    const authStore = useAuthStore.getState();
    return authStore.getUserRole();
  }

  /**
   * Store user email for OTP verification
   */
  static setVerificationEmail(email: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("verification_email", email);
    }
  }

  /**
   * Get stored verification email
   */
  static getVerificationEmail(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("verification_email");
  }

  /**
   * Clear verification email
   */
  static clearVerificationEmail(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("verification_email");
    }
  }

  /**
   * Initialize auth state from stored token (call this on app startup)
   */
  static initializeAuth(): void {
    const authStore = useAuthStore.getState();
    const token = authStore.token;

    if (token) {
      // Set token in apiClient
      apiClient.setAuthToken(token, true);

      // Check if token is still valid
      if (!authStore.checkTokenExpiry()) {
        console.warn("Stored token is expired, clearing auth");
        authStore.clearAuth();
      }
    }
  }
}