/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";

// Generic API Response wrapper (for consistency)
export interface ApiResponse<T = any> {
  status: string;
  token?: string;
  data?: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
}

// API Client Configuration
class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
      timeout: 30000, // Increased timeout for file uploads
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Don't set Content-Type for FormData - let axios handle it
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        // Log requests in development
        if (process.env.NODE_ENV === "development") {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data instanceof FormData ? "FormData" : config.data,
            params: config.params,
          });
        }

        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log responses in development
        if (process.env.NODE_ENV === "development") {
          console.log(
            `✅ ${response.config.method?.toUpperCase()} ${
              response.config.url
            }`,
            {
              status: response.status,
              data: response.data,
            }
          );
        }

        return response;
      },
      (error: AxiosError) => {
        const apiError = this.handleError(error);

        // Log errors
        console.error("API Error:", apiError);

        // Handle specific error cases
        if (apiError.status === 401) {
          this.handleUnauthorized();
        }

        return Promise.reject(apiError);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token")
      );
    }
    return null;
  }

  private handleUnauthorized() {
    // Clear tokens
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
      // Redirect to login page
      window.location.href = "/signin";
    }
  }

  private handleError(error: AxiosError): ApiError {
    const defaultError: ApiError = {
      message: "An unexpected error occurred",
      status: 500,
    };

    if (!error.response) {
      // Network error
      return {
        ...defaultError,
        message: "Network error. Please check your connection.",
        status: 0,
      };
    }

    const { status, data } = error.response;

    return {
      message: (data as any)?.message || error.message || defaultError.message,
      status,
      code: (data as any)?.code,
      errors: (data as any)?.errors,
    };
  }

  // HTTP Methods - Return actual API response types (not wrapped)
  async get<T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.get(url, { params, ...config });
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.patch(url, data, config);
    return response.data;
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.delete(url, config);
    return response.data;
  }

  // File upload specific method
  async uploadFile<T>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 60 seconds for file uploads
    };

    if (onUploadProgress) {
      config.onUploadProgress = onUploadProgress;
    }

    const response = await this.instance.post(url, formData, config);
    return response.data;
  }

  // Auth methods
  setAuthToken(token: string, persist: boolean = false) {
    if (typeof window !== "undefined") {
      if (persist) {
        localStorage.setItem("auth_token", token);
      } else {
        sessionStorage.setItem("auth_token", token);
      }
    }
  }

  clearAuthToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for testing
export { ApiClient };