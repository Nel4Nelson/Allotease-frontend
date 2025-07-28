export type UserType = "attendee" | "admin";
export type UserRole = "user" | "allocator";

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface OrganizationFormData {
  organizationName: string;
  phoneNumber: string;
  accountInfo: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AdminSignupRequest extends SignupRequest {
  organizationName: string;
  phoneNumber: string;
  accountInfo: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

// OTP Types
export interface ResendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface PartialUpgradeRequest {
  organizationName: string;
  businessCategory: string;
  businessBio: string;
  phoneNumber: string;
  dateOfBirth: string; // ISO string format
}

// User Data Types
export interface User {
  _id: string;
  email: string;
  role: UserRole;
  firstname: string;
  lastname: string;
  isVerified: boolean;
  business?: BusinessInfo;
}

export interface BusinessInfo {
  organizationName: string;
  businessCategory: string;
  businessBio: string;
  updatedAt: string;
}

// JWT Token Payload
export interface TokenPayload {
  _id: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Base API Response interface
export interface BaseApiResponse {
  status: string;
  message?: string;
}

// API Response Types - These match your actual API responses exactly
export interface SignupResponse extends BaseApiResponse {
  token?: string;
}

export interface SigninResponse extends BaseApiResponse {
  token: string;
  user: User;
}

export interface OtpResponse extends BaseApiResponse {
  token: string;
  user: User;
}

export interface ResendOtpResponse extends BaseApiResponse {
  message: string;
}

export interface PartialUpgradeResponse extends BaseApiResponse {
  token: string;
  message: string;
  data: {
    user: User;
  };
}

export interface LogoutResponse extends BaseApiResponse {
  message: string;
  token: string; // Empty string according to your API
}

export interface ApiError {
  status: string;
  message: string;
  isOperational?: boolean;
}
