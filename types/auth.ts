export type UserType = "attendee" | "admin";

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

// API Response Types
export interface SignupResponse {
  status: string;
  message?: string;
  token?: string;
}

export interface SigninResponse {
  status: string;
  token: string;
}

export interface OtpResponse {
  status: string;
  token: string;
}

export interface ResendOtpResponse {
  status: string;
  message: string;
}

export interface ApiError {
  status: string;
  message: string;
  isOperational?: boolean;
}