# 🌐 ApiClient Documentation

## Overview

The ApiClient is a robust HTTP client wrapper built on top of Axios that provides a standardized, type-safe interface for all API communications in the Allotease platform. It handles authentication, error management, request/response logging, and provides specialized methods for different types of API operations including file uploads.

## 🎯 Why This Architecture Matters

### **Centralized HTTP Management**
The ApiClient follows the **Single Source of Truth** principle for all HTTP communications. This creates a unified layer that:
- **Standardizes all API calls** across the entire application
- **Centralizes authentication** token management
- **Provides consistent error handling** for all network operations
- **Enables global request/response interceptors** for logging and debugging
- **Simplifies testing** through centralized mocking

### **Scattered vs Centralized Approach**

#### ❌ **Without ApiClient (Scattered Approach)**
```typescript
// In UserService
const getUserData = async () => {
  try {
    const token = localStorage.getItem('token'); // Inconsistent token access
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch'); // Generic error handling
    }
    
    return await response.json();
  } catch (error) {
    console.error('User fetch error:', error); // Inconsistent logging
    throw error;
  }
};

// In EventService  
const createEvent = async (eventData) => {
  try {
    const authToken = sessionStorage.getItem('auth_token'); // Different storage!
    const response = await axios.post('/api/events', eventData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 5000, // Different timeout!
    });
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Manual auth handling in every service
      window.location.href = '/login';
    }
    throw new Error('Event creation failed'); // Different error format
  }
};
```

**Problems with scattered approach:**
- **Inconsistent token management** (localStorage vs sessionStorage, different keys)
- **Repeated authentication logic** in every service
- **Different error handling patterns** across services
- **Inconsistent timeouts and configurations** 
- **No centralized logging** or debugging capabilities
- **Hard to maintain** - changes needed in multiple places
- **Difficult to test** - each service has different mocking requirements

#### ✅ **With ApiClient (Centralized Approach)**
```typescript
// In any service
const getUserData = async (): Promise<ApiResponse<User>> => {
  return await apiClient.get<User>('/users');
  // Authentication, error handling, logging all automatic
};

const createEvent = async (eventData: CreateEventRequest): Promise<ApiResponse<Event>> => {
  return await apiClient.post<Event>('/events', eventData);
  // Same consistent behavior, same error handling
};

const uploadEventImage = async (formData: FormData): Promise<ApiResponse<UploadResponse>> => {
  return await apiClient.uploadFile<UploadResponse>('/events/upload', formData);
  // Specialized file upload handling
};
```

**Benefits of centralized approach:**
- **Automatic authentication** - tokens added to all requests
- **Consistent error handling** - same error format everywhere
- **Centralized logging** - all requests/responses logged consistently
- **Type safety** - compile-time error prevention
- **Specialized methods** - file uploads, different content types handled properly
- **Global configuration** - timeouts, base URLs, headers managed centrally
- **Easy testing** - single client to mock for all services

## 🏗️ Architecture Deep Dive

### **Singleton Pattern**
```typescript
// Single instance shared across entire application
export const apiClient = new ApiClient();

// Why singleton?
// 1. Consistent configuration across app
// 2. Shared interceptors and middleware
// 3. Centralized token management
// 4. Memory efficient - one instance
```

### **Axios Integration**
```typescript
class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
```

**Why Axios over Fetch?**
- **Interceptors**: Request/response middleware support
- **Automatic JSON parsing**: No manual `.json()` calls
- **Request/Response timeout**: Built-in timeout handling
- **Request cancellation**: Abort request capabilities
- **Automatic request body serialization**: Handles objects automatically
- **Better error handling**: Structured error responses
- **Upload progress**: Built-in upload progress tracking

## 📚 API Reference

### **Core HTTP Methods**

#### `get<T>(url: string, params?: any, config?: AxiosRequestConfig)`
**Purpose**: Performs GET requests with automatic authentication and type safety.

```typescript
// Usage Examples

// Simple GET request
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (userId: string): Promise<ApiResponse<User>> => {
  return await apiClient.get<User>(`/users/${userId}`);
};

// GET with query parameters
const getEvents = async (filters: EventFilters): Promise<ApiResponse<Event[]>> => {
  return await apiClient.get<Event[]>('/events', {
    category: filters.category,
    date: filters.date,
    limit: filters.limit
  });
  // Becomes: /events?category=tech&date=2024-01-01&limit=10
};

// GET with custom config
const getUsersWithLongTimeout = async (): Promise<ApiResponse<User[]>> => {
  return await apiClient.get<User[]>('/users', null, {
    timeout: 60000 // Custom 60-second timeout
  });
};
```

**What happens internally:**
1. **Authentication**: Bearer token automatically added from storage
2. **Base URL**: Prepended to create full URL
3. **Query Parameters**: Automatically serialized and appended
4. **Type Safety**: Response typed according to generic parameter
5. **Error Handling**: Network/API errors automatically caught and formatted
6. **Logging**: Request/response logged in development mode

#### `post<T>(url: string, data?: any, config?: AxiosRequestConfig)`
**Purpose**: Performs POST requests for creating resources.

```typescript
// Usage Examples

// Create user
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
}

const createUser = async (userData: CreateUserRequest): Promise<ApiResponse<UserResponse>> => {
  return await apiClient.post<UserResponse>('/users', userData);
};

// Login request
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

const login = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  return await apiClient.post<LoginResponse>('/auth/login', credentials);
};

// POST with custom headers
const createEventWithCustomHeader = async (eventData: CreateEventRequest): Promise<ApiResponse<Event>> => {
  return await apiClient.post<Event>('/events', eventData, {
    headers: {
      'X-Custom-Header': 'custom-value'
    }
  });
};
```

#### `put<T>(url: string, data?: any, config?: AxiosRequestConfig)`
**Purpose**: Performs PUT requests for full resource updates.

```typescript
// Usage Example
interface UpdateUserRequest {
  name: string;
  email: string;
  bio?: string;
}

const updateUser = async (userId: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> => {
  return await apiClient.put<User>(`/users/${userId}`, userData);
};
```

#### `patch<T>(url: string, data?: any, config?: AxiosRequestConfig)`
**Purpose**: Performs PATCH requests for partial resource updates.

```typescript
// Usage Example
interface PartialUserUpdate {
  name?: string;
  bio?: string;
}

const updateUserPartial = async (userId: string, updates: PartialUserUpdate): Promise<ApiResponse<User>> => {
  return await apiClient.patch<User>(`/users/${userId}`, updates);
};
```

#### `delete<T>(url: string, config?: AxiosRequestConfig)`
**Purpose**: Performs DELETE requests for resource removal.

```typescript
// Usage Examples

// Simple delete
const deleteUser = async (userId: string): Promise<ApiResponse<void>> => {
  return await apiClient.delete<void>(`/users/${userId}`);
};

// Delete with confirmation headers
const deleteUserWithConfirmation = async (userId: string): Promise<ApiResponse<void>> => {
  return await apiClient.delete<void>(`/users/${userId}`, {
    headers: {
      'X-Confirm-Delete': 'true'
    }
  });
};
```

### **Specialized Methods**

#### `uploadFile<T>(url: string, formData: FormData, onUploadProgress?: function)`
**Purpose**: Handles file uploads with progress tracking and proper headers.

```typescript
// Usage Examples

// Simple file upload
const uploadProfileImage = async (file: File): Promise<ApiResponse<UploadResponse>> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', 'profile');

  return await apiClient.uploadFile<UploadResponse>('/upload/profile', formData);
};

// File upload with progress tracking
const uploadEventImage = async (
  file: File, 
  onProgress: (progress: number) => void
): Promise<ApiResponse<UploadResponse>> => {
  const formData = new FormData();
  formData.append('eventImage', file);

  return await apiClient.uploadFile<UploadResponse>(
    '/events/upload', 
    formData,
    (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(progress);
    }
  );
};

// Multiple file upload
const uploadMultipleFiles = async (files: File[]): Promise<ApiResponse<UploadResponse[]>> => {
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append(`file_${index}`, file);
  });

  return await apiClient.uploadFile<UploadResponse[]>('/upload/multiple', formData);
};
```

**What makes uploadFile special:**
1. **Automatic Content-Type**: Sets `multipart/form-data` automatically
2. **Extended Timeout**: 60-second timeout for large files
3. **Progress Tracking**: Optional upload progress callback
4. **FormData Handling**: Properly handles FormData objects
5. **Authentication**: Bearer token still automatically added

### **Authentication Methods**

#### `setAuthToken(token: string, persist: boolean = false)`
**Purpose**: Stores authentication token for subsequent requests.

```typescript
// Usage Examples

// Session-only token (cleared when browser closes)
apiClient.setAuthToken(loginResponse.token, false);

// Persistent token (survives browser restart)
apiClient.setAuthToken(loginResponse.token, true);

// Real-world usage in AuthService
export class AuthService {
  static async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    if (response.status === 'success' && response.token) {
      // Automatically store token for future requests
      apiClient.setAuthToken(response.token, true);
    }
    
    return response;
  }
}
```

**Storage Logic:**
- **persist = true**: Stores in `localStorage` (survives browser restart)
- **persist = false**: Stores in `sessionStorage` (cleared when tab closes)
- **Automatic Retrieval**: All subsequent requests automatically include token

#### `clearAuthToken()`
**Purpose**: Removes stored authentication token.

```typescript
// Usage Examples

// Logout functionality
const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear token locally
    apiClient.clearAuthToken();
    window.location.href = '/signin';
  }
};

// Clear token on authentication error
// (This happens automatically in interceptors)
```

## 🔄 Interceptor System

### **Request Interceptor**
**Purpose**: Automatically enhances outgoing requests.

```typescript
// What the request interceptor does:

// 1. Adds Authentication
const token = this.getAuthToken();
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

// 2. Handles FormData
if (config.data instanceof FormData) {
  delete config.headers["Content-Type"]; // Let browser set boundary
}

// 3. Development Logging
if (process.env.NODE_ENV === "development") {
  console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
    data: config.data instanceof FormData ? "FormData" : config.data,
    params: config.params,
  });
}
```

**Benefits:**
- **Zero Configuration**: Authentication works automatically
- **Content-Type Intelligence**: Proper headers for different data types
- **Development Visibility**: See all outgoing requests
- **Consistent Headers**: Same headers applied to all requests

### **Response Interceptor**
**Purpose**: Automatically handles incoming responses and errors.

```typescript
// What the response interceptor does:

// 1. Success Logging
if (process.env.NODE_ENV === "development") {
  console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
    status: response.status,
    data: response.data,
  });
}

// 2. Error Standardization
const apiError = this.handleError(error);

// 3. Automatic Auth Handling
if (apiError.status === 401) {
  this.handleUnauthorized(); // Clears tokens, redirects to signin
}
```

**Benefits:**
- **Automatic Error Formatting**: Consistent error objects
- **Development Debugging**: See all responses and errors
- **Authentication Recovery**: Automatic handling of expired tokens
- **Centralized Error Logic**: Same error handling everywhere

## 🛡️ Error Handling System

### **Error Types**

#### **Network Errors**
```typescript
// When network is down or server unreachable
{
  message: "Network error. Please check your connection.",
  status: 0,
}
```

#### **HTTP Errors**
```typescript
// When server returns error status (400, 401, 500, etc.)
{
  message: "Invalid credentials", // From server response
  status: 401,
  code: "AUTH_FAILED",          // Optional error code
  errors: {                     // Optional validation errors
    email: ["Email is required"],
    password: ["Password too short"]
  }
}
```

#### **Timeout Errors**
```typescript
// When request takes longer than timeout
{
  message: "Request timeout. Please try again.",
  status: 408,
}
```

### **Error Handling in Services**

```typescript
// Recommended error handling pattern
const createEvent = async (eventData: CreateEventRequest): Promise<Event> => {
  try {
    const response = await apiClient.post<Event>('/events', eventData);
    
    if (response.status === 'success') {
      return response.data!;
    } else {
      throw new Error(response.message || 'Event creation failed');
    }
  } catch (error) {
    // ApiClient already formatted the error
    const apiError = error as ApiError;
    
    // Log for debugging
    console.error('Create event error:', apiError);
    
    // Re-throw for component to handle
    throw new Error(apiError.message);
  }
};
```

### **Automatic 401 Handling**

```typescript
// What happens on 401 Unauthorized:
private handleUnauthorized() {
  if (typeof window !== "undefined") {
    // 1. Clear all stored tokens
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
    
    // 2. Redirect to signin page
    window.location.href = "/signin";
  }
}
```

**Benefits:**
- **Automatic Session Recovery**: No manual token checking needed
- **Consistent Behavior**: Same 401 handling across entire app
- **Security**: Immediate token cleanup on authentication failure

## 🚀 Performance Features

### **Timeout Management**
```typescript
// Default timeout: 30 seconds
timeout: 30000,

// File upload timeout: 60 seconds  
uploadFile() {
  config.timeout = 60000;
}
```

### **Request Optimization**
- **Automatic JSON Parsing**: No manual response parsing
- **Request Deduplication**: Axios handles duplicate request cancellation
- **Memory Efficient**: Single instance shared across app
- **Connection Reuse**: HTTP keep-alive connections

### **Development Features**
```typescript
// Automatic request/response logging in development
if (process.env.NODE_ENV === "development") {
  console.log(`🚀 POST /api/events`, { data: eventData });
  console.log(`✅ POST /api/events`, { status: 201, data: createdEvent });
}
```

## 🧪 Testing Benefits

### **Easy Mocking**
```typescript
// Mock entire ApiClient for tests
jest.mock('@/services/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    uploadFile: jest.fn(),
    setAuthToken: jest.fn(),
    clearAuthToken: jest.fn(),
  }
}));

// Mock specific responses
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
mockApiClient.get.mockResolvedValue({
  status: 'success',
  data: mockUserData
});
```

### **Integration Testing**
```typescript
// Test actual HTTP behavior
describe('ApiClient Integration', () => {
  it('should add auth token to requests', async () => {
    apiClient.setAuthToken('test-token');
    
    // Make request - token should be added automatically
    await apiClient.get('/test-endpoint');
    
    // Verify Authorization header was set
    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
  });
});
```

## 🔧 Configuration Management

### **Environment-Based Configuration**
```typescript
// Base URL from environment
baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",

// Different configurations for different environments
// Development: http://localhost:3000/api
// Staging: https://api-staging.allotease.com
// Production: https://api.allotease.com
```

### **Extending Configuration**
```typescript
// Adding custom headers for specific requests
const response = await apiClient.get('/special-endpoint', null, {
  headers: {
    'X-Custom-Header': 'value',
    'X-API-Version': '2.0'
  }
});

// Custom timeout for specific request
const response = await apiClient.post('/long-operation', data, {
  timeout: 120000 // 2 minutes
});
```

## 🎯 Best Practices for Junior Developers

### **DO's**
```typescript
// ✅ Always use ApiClient for HTTP requests
const response = await apiClient.get<User[]>('/users');

// ✅ Use proper TypeScript generics
const response = await apiClient.post<CreateUserResponse>('/users', userData);

// ✅ Handle errors appropriately
try {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
} catch (error) {
  const apiError = error as ApiError;
  throw new Error(apiError.message);
}

// ✅ Use specialized methods for special cases
const response = await apiClient.uploadFile('/upload', formData, onProgress);

// ✅ Let ApiClient handle authentication
// Token management is automatic, don't add Authorization headers manually
```

### **DON'Ts**
```typescript
// ❌ Don't use fetch or axios directly
const response = await fetch('/api/users'); // Use apiClient.get() instead

// ❌ Don't manage auth headers manually
const response = await fetch('/api/users', {
  headers: { 'Authorization': `Bearer ${token}` }
}); // ApiClient handles this automatically

// ❌ Don't use different HTTP clients
const axiosResponse = await axios.get('/api/events'); // Use apiClient.get()

// ❌ Don't duplicate error handling
try {
  const response = await apiClient.get('/users');
  if (!response.ok) { // Don't check response.ok
    throw new Error('Failed');
  }
} catch (error) {
  // ApiClient already formatted the error
}

// ❌ Don't set Content-Type for FormData
await apiClient.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
}); // ApiClient handles this automatically
```

### **Common Patterns**

#### **Service Layer Pattern**
```typescript
// EventService.ts
export class EventService {
  static async getEvents(filters?: EventFilters): Promise<Event[]> {
    try {
      const response = await apiClient.get<Event[]>('/events', filters);
      
      if (response.status === 'success') {
        return response.data || [];
      }
      
      throw new Error(response.message || 'Failed to fetch events');
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Get events error:', apiError);
      throw new Error(apiError.message);
    }
  }

  static async createEvent(eventData: CreateEventRequest): Promise<Event> {
    try {
      const response = await apiClient.post<Event>('/events', eventData);
      
      if (response.status === 'success') {
        return response.data!;
      }
      
      throw new Error(response.message || 'Failed to create event');
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Create event error:', apiError);
      throw new Error(apiError.message);
    }
  }
}
```

#### **Component Integration Pattern**
```typescript
// EventList.tsx
const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const events = await EventService.getEvents();
      setEvents(events);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Component render logic...
};
```

## 📈 Scalability Advantages

### **Easy Feature Addition**
```typescript
// Adding new HTTP method is simple
class ApiClient {
  // Existing methods...
  
  // Add custom method following same pattern
  async graphql<T>(query: string, variables?: any): Promise<ApiResponse<T>> {
    return await this.post<T>('/graphql', { query, variables });
  }
  
  // Add webhook method
  async webhook<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return await this.post<T>(url, data, {
      headers: { 'X-Webhook-Signature': this.generateSignature(data) }
    });
  }
}
```

### **Easy Maintenance**
- **Single Configuration Point**: All HTTP settings in one place
- **Centralized Updates**: API changes only require client updates
- **Backward Compatibility**: Interface changes managed centrally
- **Version Management**: Easy to support multiple API versions

### **Team Collaboration**
- **Consistent Patterns**: Same HTTP patterns across all services
- **Reduced Learning Curve**: New developers learn one HTTP client
- **Code Reviews**: Easier to review when patterns are consistent
- **Knowledge Sharing**: Documentation applies to entire codebase

---

## 💡 Why This Approach Wins

### **For Junior Developers:**
1. **Simple Interface**: Just call methods, everything else is automatic
2. **Type Safety**: Compile-time error prevention
3. **Consistent Patterns**: Same approach for all HTTP operations
4. **Built-in Best Practices**: Authentication, error handling, logging included

### **For Senior Developers:**
1. **Maintainable Architecture**: Single place to manage HTTP concerns
2. **Extensible Design**: Easy to add new features and capabilities
3. **Testing Friendly**: Centralized mocking and testing strategies
4. **Performance Optimized**: Connection reuse, timeout management, request optimization

### **For the Team:**
1. **Reduced Bugs**: Centralized, tested HTTP logic
2. **Faster Development**: No need to rewrite HTTP code
3. **Easier Debugging**: All HTTP traffic logged and monitored
4. **Scalable Foundation**: Grows with application complexity

### **Technical Benefits:**
1. **Interceptor Pattern**: Automatic request/response processing
2. **Error Standardization**: Consistent error handling across app
3. **Authentication Automation**: Zero-configuration auth token management
4. **File Upload Optimization**: Specialized handling for file operations
5. **Development Tools**: Built-in logging and debugging capabilities

The ApiClient represents a **foundational infrastructure pattern** that enables rapid, reliable development while maintaining code quality and developer experience. This investment in HTTP abstraction pays massive dividends as the application scales and the team grows.