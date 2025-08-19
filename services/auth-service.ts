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
import {
  setAuthCookie,
  clearAuthCookie,
  getAuthCookie,
} from "@/lib/auth-cookies";

// Auth API Service - Enhanced for mobile
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
   * Detect if current device is mobile
   */
  private static isMobileDevice(): boolean {
    if (typeof window === "undefined") return false;
    const userAgent = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  }

  /**
   * Enhanced mobile cookie verification
   */
  private static verifyMobileCookie(token: string): void {
    if (!this.isMobileDevice()) return;

    setTimeout(() => {
      const cookieCheck = getAuthCookie();
      if (!cookieCheck || cookieCheck !== token) {
        console.warn(
          "[Auth Service] Mobile cookie verification failed, retrying..."
        );
        setAuthCookie(token, true);
      }
    }, 100);
  }

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
   * Verify OTP after signup - Enhanced for mobile
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
        const isMobile = this.isMobileDevice();

        console.log(
          `[Auth Service] OTP success on ${isMobile ? "mobile" : "desktop"}`
        );

        authStore.setUserAndToken(response.user, response.token, true);

        // Set the token in apiClient as well
        apiClient.setAuthToken(response.token, true);

        // Set cookie for server-side middleware access
        setAuthCookie(response.token, true);

        // Mobile verification
        this.verifyMobileCookie(response.token);
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
   * User login (Attendee) - Enhanced for mobile
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
        const isMobile = this.isMobileDevice();

        console.log(
          `[Auth Service] Login success on ${isMobile ? "mobile" : "desktop"}`
        );

        authStore.setUserAndToken(response.user, response.token, rememberMe);

        // Set the token in apiClient as well
        apiClient.setAuthToken(response.token, rememberMe);

        // Set cookie for server-side middleware access
        setAuthCookie(response.token, rememberMe);

        // Mobile verification
        this.verifyMobileCookie(response.token);
      }

      return response;
    } catch (error) {
      console.error("User login failed:", error);
      throw error;
    }
  }

  /**
   * Partial upgrade to allocator - Enhanced for mobile
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
      if (
        response.status === "success" &&
        response.token &&
        response.data?.user
      ) {
        const authStore = useAuthStore.getState();
        const isMobile = this.isMobileDevice();

        console.log(
          `[Auth Service] Upgrade success on ${isMobile ? "mobile" : "desktop"}`
        );

        authStore.setUserAndToken(response.data.user, response.token, true);

        // Set the token in apiClient as well
        apiClient.setAuthToken(response.token, true);

        // Set cookie for server-side middleware access
        setAuthCookie(response.token, true);

        // Mobile verification
        this.verifyMobileCookie(response.token);
      }

      return response;
    } catch (error) {
      console.error("Partial upgrade failed:", error);
      throw error;
    }
  }

  /**
   * Logout user - calls backend endpoint - Enhanced for mobile
   */
  static async logout(): Promise<void> {
    try {
      // Get current token before clearing
      const authStore = useAuthStore.getState();
      const token = authStore.token;
      const isMobile = this.isMobileDevice();

      console.log(
        `[Auth Service] Logout on ${isMobile ? "mobile" : "desktop"}`
      );

      // Call logout endpoint if user is authenticated
      if (token) {
        try {
          await apiClient.post<LogoutResponse>(this.ENDPOINTS.LOGOUT);
        } catch (error) {
          // Continue with logout even if API call fails
          console.warn(
            "Logout API call failed, but continuing with local logout:",
            error
          );
        }
      }

      // Always clear local auth state
      authStore.clearAuth();

      // Clear token from apiClient
      apiClient.clearAuthToken();

      // Clear auth cookie
      clearAuthCookie();

      // Enhanced mobile redirect handling
      if (typeof window !== "undefined") {
        if (isMobile) {
          // On mobile, add a small delay to ensure cleanup is complete
          setTimeout(() => {
            window.location.href = "/signin";
          }, 100);
        } else {
          window.location.href = "/signin";
        }
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, clear local state
      const authStore = useAuthStore.getState();
      authStore.clearAuth();
      apiClient.clearAuthToken();
      clearAuthCookie();

      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    }
  }

  /**
   * Logout user locally without API call (for token expiry, etc.) - Enhanced for mobile
   */
  static logoutLocal(): void {
    const authStore = useAuthStore.getState();
    const isMobile = this.isMobileDevice();

    console.log(
      `[Auth Service] Local logout on ${isMobile ? "mobile" : "desktop"}`
    );

    authStore.logout();

    // Clear token from apiClient as well
    apiClient.clearAuthToken();

    // Clear auth cookie
    clearAuthCookie();
  }

  /**
   * Check if user is authenticated - Enhanced for mobile
   */
  static isAuthenticated(): boolean {
    const authStore = useAuthStore.getState();
    const isAuth = authStore.isAuthenticated && authStore.checkTokenExpiry();

    // Additional mobile check - verify cookie exists
    if (this.isMobileDevice() && isAuth) {
      const cookieToken = getAuthCookie();
      if (!cookieToken) {
        console.warn(
          "[Auth Service] Mobile: Auth state exists but no cookie found"
        );
        // Try to restore from current token
        if (authStore.token) {
          setAuthCookie(authStore.token, true);
        }
      }
    }

    return isAuth;
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
   * Store user email for OTP verification - Enhanced for mobile
   */
  static setVerificationEmail(email: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("verification_email", email);

      // Additional mobile storage
      if (this.isMobileDevice()) {
        // Also store in localStorage as backup for mobile
        localStorage.setItem("verification_email_backup", email);
      }
    }
  }

  /**
   * Get stored verification email - Enhanced for mobile
   */
  static getVerificationEmail(): string | null {
    if (typeof window === "undefined") return null;

    const email = sessionStorage.getItem("verification_email");

    // Mobile fallback
    if (!email && this.isMobileDevice()) {
      return localStorage.getItem("verification_email_backup");
    }

    return email;
  }

  /**
   * Clear verification email - Enhanced for mobile
   */
  static clearVerificationEmail(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("verification_email");
      // Also clear mobile backup
      localStorage.removeItem("verification_email_backup");
    }
  }

  /**
   * Initialize auth state from stored token - Enhanced for mobile
   */
  static initializeAuth(): void {
    const authStore = useAuthStore.getState();
    const token = authStore.token;
    const isMobile = this.isMobileDevice();

    console.log(
      `[Auth Service] Initializing auth on ${isMobile ? "mobile" : "desktop"}`
    );

    if (token) {
      // Set token in apiClient
      apiClient.setAuthToken(token, true);

      // Set cookie for server-side detection
      setAuthCookie(token, true);

      // Check if token is still valid
      if (!authStore.checkTokenExpiry()) {
        console.warn("Stored token is completed, clearing auth");
        authStore.clearAuth();
        clearAuthCookie();
      }
    } else if (isMobile) {
      // On mobile, try to initialize from cookie if store is empty
      setTimeout(() => {
        this.synchronizeMobileAuth();
      }, 100);
    }
  }

  /**
   * Mobile-specific method to force cookie synchronization
   */
  static synchronizeMobileAuth(): void {
    if (!this.isMobileDevice()) return;

    console.log("[Auth Service] Synchronizing mobile auth state");

    const authStore = useAuthStore.getState();
    const storeToken = authStore.token;
    const cookieToken = getAuthCookie();

    if (storeToken && !cookieToken) {
      // Store has token but cookie doesn't - set cookie
      setAuthCookie(storeToken, true);
      console.log("[Auth Service] Mobile: Set missing cookie from store");
    } else if (!storeToken && cookieToken) {
      // Cookie has token but store doesn't - update store
      authStore.setToken(cookieToken, true);
      console.log("[Auth Service] Mobile: Updated store from cookie");
    }
  }
}
