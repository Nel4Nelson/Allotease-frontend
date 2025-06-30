/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient, ApiResponse } from './api-client';
import {
  SignupRequest,
  AdminSignupRequest,
  SigninRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  SignupResponse,
  SigninResponse,
  OtpResponse,
  ResendOtpResponse
} from '@/types/auth';

// Auth API Service
export class AuthService {
  private static readonly ENDPOINTS = {
    // Signup endpoints
    SIGNUP: '/auth/user/signup',
    ADMIN_SIGNUP: '/auth/organization/signup',
    
    // Login endpoints
    USER_LOGIN: '/auth/user/login',
    ORGANIZATION_LOGIN: '/auth/organization/login',
    
    // OTP endpoints
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    
    // Other endpoints
    LOGOUT: '/auth/user/logout',
    REFRESH: '/auth/user/refresh',
    PROFILE: '/auth/user/profile',
  } as const;

  /**
   * User signup (Attendee)
   */
  static async signup(data: SignupRequest): Promise<ApiResponse<SignupResponse>> {
    try {
      const response = await apiClient.post<SignupResponse>(
        this.ENDPOINTS.SIGNUP,
        data
      );

      return response;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }

  /**
   * Admin/Organization signup
   */
  static async adminSignup(data: AdminSignupRequest): Promise<ApiResponse<SignupResponse>> {
    try {
      const response = await apiClient.post<SignupResponse>(
        this.ENDPOINTS.ADMIN_SIGNUP,
        data
      );

      return response;
    } catch (error) {
      console.error('Admin signup failed:', error);
      throw error;
    }
  }

  /**
   * Verify OTP after signup
   */
  static async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<OtpResponse>> {
    try {
      const response = await apiClient.post<OtpResponse>(
        this.ENDPOINTS.VERIFY_OTP,
        data
      );

      // Store auth token after successful OTP verification
      if (response.status === 'success' && response.token) {
        apiClient.setAuthToken(response.token, true);
      }

      return response;
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  }

  /**
   * Resend OTP
   */
  static async resendOtp(data: ResendOtpRequest): Promise<ApiResponse<ResendOtpResponse>> {
    try {
      const response = await apiClient.post<ResendOtpResponse>(
        this.ENDPOINTS.RESEND_OTP,
        data
      );

      return response;
    } catch (error) {
      console.error('Resend OTP failed:', error);
      throw error;
    }
  }

  /**
   * User login (Attendee)
   */
  static async userLogin(data: SigninRequest): Promise<ApiResponse<SigninResponse>> {
    try {
      const response = await apiClient.post<SigninResponse>(
        this.ENDPOINTS.USER_LOGIN,
        data
      );

      // Store auth token for successful login
      if (response.status === 'success' && response.token) {
        apiClient.setAuthToken(response.token, true);
      }

      return response;
    } catch (error) {
      console.error('User login failed:', error);
      throw error;
    }
  }

  /**
   * Organization login (Admin)
   */
  static async organizationLogin(data: SigninRequest): Promise<ApiResponse<SigninResponse>> {
    try {
      const response = await apiClient.post<SigninResponse>(
        this.ENDPOINTS.ORGANIZATION_LOGIN,
        data
      );

      // Store auth token for successful login
      if (response.status === 'success' && response.token) {
        apiClient.setAuthToken(response.token, true);
      }

      return response;
    } catch (error) {
      console.error('Organization login failed:', error);
      throw error;
    }
  }

  /**
   * User logout
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post(this.ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear token locally
      apiClient.clearAuthToken();
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(): Promise<ApiResponse<any>> {
    return await apiClient.get(this.ENDPOINTS.PROFILE);
  }

  /**
   * Refresh token
   */
  static async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiClient.post<{ token: string }>(this.ENDPOINTS.REFRESH);
    
    if (response.status === 'success' && response.token) {
      apiClient.setAuthToken(response.token, true);
    }

    return response;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return !!token;
  }

  /**
   * Get current auth token
   */
  static getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  /**
   * Store user email for OTP verification
   */
  static setVerificationEmail(email: string): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('verification_email', email);
    }
  }

  /**
   * Get stored verification email
   */
  static getVerificationEmail(): string | null {
    if (typeof window === 'undefined') return null;
    
    return sessionStorage.getItem('verification_email');
  }

  /**
   * Clear verification email
   */
  static clearVerificationEmail(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('verification_email');
    }
  }
}