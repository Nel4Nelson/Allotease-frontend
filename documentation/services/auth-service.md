# 🔐 AuthService Documentation

## Overview

The AuthService is a centralized authentication service that provides a clean, type-safe interface for all authentication-related operations in the Allotease platform. It acts as a single source of truth for authentication logic, abstracting away the complexity of API calls, token management, and error handling.

## 🎯 Why This Architecture Matters

### **Single Responsibility Principle**
The AuthService follows the Single Responsibility Principle by handling **only** authentication concerns. This makes the codebase:
- **Easier to debug** - All auth issues trace back to one service
- **Easier to test** - Isolated authentication logic
- **Easier to maintain** - Changes only affect one place
- **Easier to scale** - New auth features have a clear home

### **Centralized vs Scattered Approach**

#### ❌ **Without AuthService (Scattered Approach)**
```typescript
// In SignUp component
const handleSignup = async (data) => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (result.token) {
      localStorage.setItem('token', result.token); // Inconsistent storage
    }
  } catch (error) {
    // Handle error differently everywhere
  }
};

// In SignIn component  
const handleSignin = async (data) => {
  try {
    const response = await fetch('/api/auth/login', { /* different setup */ });
    const result = await response.json();
    if (result.token) {
      sessionStorage.setItem('auth_token', result.token); // Different key!
    }
  } catch (error) {
    // Different error handling
  }
};
```

**Problems with this approach:**
- **Inconsistent token storage** (localStorage vs sessionStorage)
- **Different error handling** in each component
- **Repeated API setup code** in every component
- **Hard to change** - updates needed in multiple places
- **Difficult to test** - auth logic spread across components

#### ✅ **With AuthService (Centralized Approach)**
```typescript
// In any component
const handleSignup = async (data) => {
  try {
    const response = await AuthService.signup(data);
    // Token management handled automatically
    // Consistent error handling
    // Type safety guaranteed
  } catch (error) {
    // Standardized error handling
  }
};
```

**Benefits of this approach:**
- **Consistent behavior** across all components
- **Automatic token management** - no manual storage logic
- **Standardized error handling** - same patterns everywhere
- **Type safety** - compile-time error catching
- **Single place to change** - updates affect entire app

## 🏗️ Service Architecture

### Class Structure
```typescript
export class AuthService {
  private static readonly ENDPOINTS = { /* API endpoints */ };
  
  // Public methods for components to use
  static async signup(data: SignupRequest): Promise<ApiResponse<SignupResponse>>
  static async userLogin(data: SigninRequest): Promise<ApiResponse<SigninResponse>>
  static async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<OtpResponse>>
  // ... other methods
}
```

### **Why Static Methods?**
Static methods are used because:
1. **No state needed** - Auth operations are stateless
2. **Simple usage** - No need to create instances
3. **Global access** - Available anywhere in the app
4. **Memory efficient** - No object instantiation overhead

## 📚 API Reference

### **Core Authentication Methods**

#### `signup(data: SignupRequest)`
**Purpose**: Registers a new user (attendee) in the system.

```typescript
// Usage Example
const signupData = {
  firstname: "John",
  lastname: "Doe", 
  email: "john@example.com",
  password: "SecurePass123!",
  confirmPassword: "SecurePass123!"
};

try {
  const response = await AuthService.signup(signupData);
  if (response.status === 'success') {
    // Signup successful - redirect to email verification
    AuthService.setVerificationEmail(signupData.email);
    router.push('/email-verification');
  }
} catch (error) {
  // Handle signup error
  setError(error.message);
}
```

**What it does internally:**
1. Sends POST request to `/auth/signup`
2. Handles any network or API errors
3. Returns typed response for consistent handling
4. Logs errors for debugging

#### `adminSignup(data: AdminSignupRequest)` *(Archived)*
**Purpose**: Registers an admin user with organization details.

```typescript
// Usage Example (when needed)
const adminData = {
  firstname: "Jane",
  lastname: "Smith",
  email: "jane@company.com", 
  password: "AdminPass123!",
  confirmPassword: "AdminPass123!",
  organizationName: "Acme Corp",
  phoneNumber: "+2348012345678",
  accountInfo: "Corporate Account"
};

const response = await AuthService.adminSignup(adminData);
```

**Note**: Currently archived but maintained for future admin onboarding features.

#### `userLogin(data: SigninRequest)`
**Purpose**: Authenticates a user and manages their session.

```typescript
// Usage Example
const loginData = {
  email: "john@example.com",
  password: "SecurePass123!"
};

try {
  const response = await AuthService.userLogin(loginData);
  if (response.status === 'success') {
    // Token automatically stored
    // User is now authenticated
    window.location.href = '/';
  }
} catch (error) {
  setError("Invalid credentials. Please try again.");
}
```

**What it does internally:**
1. Sends credentials to `/auth/login`
2. **Automatically stores auth token** on success
3. Sets up authenticated session
4. Enables subsequent authenticated API calls

#### `organizationLogin(data: SigninRequest)` *(Available)*
**Purpose**: Authenticates organization/admin users.

```typescript
const response = await AuthService.organizationLogin(loginData);
// Same interface as userLogin, different endpoint
```

### **OTP Verification Methods**

#### `verifyOtp(data: VerifyOtpRequest)`
**Purpose**: Verifies email OTP and completes registration.

```typescript
// Usage Example
const otpData = {
  email: AuthService.getVerificationEmail(),
  otp: "123456"
};

try {
  const response = await AuthService.verifyOtp(otpData);
  if (response.status === 'success') {
    // OTP verified, token stored, user fully registered
    AuthService.clearVerificationEmail();
    router.push('/');
  }
} catch (error) {
  setError("Invalid OTP. Please try again.");
}
```

**What it does internally:**
1. Verifies OTP with backend
2. **Automatically stores auth token** on success
3. Completes user registration process
4. Sets up authenticated session

#### `resendOtp(data: ResendOtpRequest)`
**Purpose**: Requests a new OTP code.

```typescript
// Usage Example
const resendData = {
  email: AuthService.getVerificationEmail()
};

try {
  const response = await AuthService.resendOtp(resendData);
  if (response.status === 'success') {
    setMessage("New OTP sent to your email");
  }
} catch (error) {
  setError("Failed to send OTP. Please try again.");
}
```

### **Session Management Methods**

#### `logout()`
**Purpose**: Securely logs out the user and cleans up session.

```typescript
// Usage Example
const handleLogout = async () => {
  try {
    await AuthService.logout();
    // Token automatically cleared
    // User redirected to login
    router.push('/signin');
  } catch (error) {
    // Logout still completes locally even if API fails
    router.push('/signin');
  }
};
```

**What it does internally:**
1. Notifies backend of logout (invalidates server session)
2. **Always clears local token** (even if API fails)
3. Ensures complete cleanup

#### `isAuthenticated()`
**Purpose**: Checks if user has a valid session.

```typescript
// Usage Example
const ProtectedRoute = ({ children }) => {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/signin" />;
  }
  return children;
};

// Or in useEffect
useEffect(() => {
  if (!AuthService.isAuthenticated()) {
    router.push('/signin');
  }
}, []);
```

**What it does internally:**
1. Checks both localStorage and sessionStorage
2. Returns boolean for easy conditional logic
3. Handles SSR safely (returns false on server)

#### `getAuthToken()`
**Purpose**: Retrieves current authentication token.

```typescript
// Usage Example (rare - usually handled automatically)
const token = AuthService.getAuthToken();
if (token) {
  // Manual API call with token
  fetch('/api/data', {
    headers: { Authorization: `Bearer ${token}` }
  });
}
```

**Note**: Rarely needed directly as apiClient handles token automatically.

### **Email Verification Helpers**

#### `setVerificationEmail(email: string)`
**Purpose**: Stores email for OTP verification process.

```typescript
// Usage Example (in signup success)
if (signupResponse.status === 'success') {
  AuthService.setVerificationEmail(userData.email);
  router.push('/email-verification');
}
```

#### `getVerificationEmail()`
**Purpose**: Retrieves stored verification email.

```typescript
// Usage Example (in OTP verification)
const email = AuthService.getVerificationEmail();
if (!email) {
  // Redirect back to signup
  router.push('/signup');
  return;
}
```

#### `clearVerificationEmail()`
**Purpose**: Cleans up verification email after successful verification.

```typescript
// Usage Example (after successful OTP)
if (otpResponse.status === 'success') {
  AuthService.clearVerificationEmail();
  router.push('/');
}
```

## 🔄 Authentication Flow Examples

### **Complete Signup Flow**
```typescript
// 1. User Registration
const signupResponse = await AuthService.signup(userData);
if (signupResponse.status === 'success') {
  // 2. Store email for verification
  AuthService.setVerificationEmail(userData.email);
  
  // 3. Navigate to OTP verification
  router.push('/email-verification');
}

// 4. OTP Verification (on verification page)
const otpResponse = await AuthService.verifyOtp({
  email: AuthService.getVerificationEmail(),
  otp: userEnteredOtp
});

if (otpResponse.status === 'success') {
  // 5. Clear verification email
  AuthService.clearVerificationEmail();
  
  // 6. User is now authenticated with stored token
  router.push('/');
}
```

### **Complete Login Flow**
```typescript
// 1. User Login
const loginResponse = await AuthService.userLogin(credentials);

if (loginResponse.status === 'success') {
  // 2. Token automatically stored
  // 3. User immediately authenticated
  window.location.href = '/';
}
```

### **Protected Route Check**
```typescript
// In any protected component
useEffect(() => {
  if (!AuthService.isAuthenticated()) {
    router.push('/signin');
  }
}, []);
```

### **Logout Flow**
```typescript
// In any component
const handleLogout = async () => {
  await AuthService.logout(); // Clears token automatically
  router.push('/signin');
};
```

## 🛡️ Security Features

### **Automatic Token Management**
- **Secure Storage**: Handles localStorage vs sessionStorage appropriately
- **Automatic Injection**: Tokens automatically added to API requests
- **Cleanup**: Tokens cleared on logout or errors
- **Persistence**: Configurable persistent vs session-only storage

### **Error Handling**
- **Consistent Errors**: Standardized error responses across all methods
- **Graceful Degradation**: Continues operation even when some operations fail
- **Detailed Logging**: Comprehensive error logging for debugging
- **Type Safety**: Compile-time error prevention

### **Session Security**
- **Server Validation**: All tokens validated server-side
- **Auto Refresh**: Token refresh capabilities built-in
- **Secure Cleanup**: Complete session cleanup on logout
- **SSR Safety**: Safe server-side rendering support

## 🎯 Best Practices for Junior Developers

### **DO's**
```typescript
// ✅ Always use AuthService for auth operations
const response = await AuthService.signup(data);

// ✅ Handle errors consistently
try {
  const response = await AuthService.userLogin(data);
} catch (error) {
  setError(error.message);
}

// ✅ Check authentication status
if (!AuthService.isAuthenticated()) {
  router.push('/signin');
}

// ✅ Let AuthService manage tokens
// Token storage is automatic, don't do it manually
```

### **DON'Ts**
```typescript
// ❌ Don't make direct API calls for auth
const response = await fetch('/auth/login', { /* manual setup */ });

// ❌ Don't manage tokens manually
localStorage.setItem('token', someToken);

// ❌ Don't duplicate auth logic
// Use AuthService methods instead of reimplementing

// ❌ Don't ignore error handling
AuthService.signup(data); // Missing try/catch

// ❌ Don't bypass AuthService
// Always go through the service layer
```

### **Common Patterns**

#### **Component State Pattern**
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleAuth = async (data) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const response = await AuthService.signup(data);
    
    if (response.status === 'success') {
      // Handle success
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

#### **Protected Route Pattern**
```typescript
const ProtectedComponent = () => {
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push('/signin');
    }
  }, []);

  if (!AuthService.isAuthenticated()) {
    return <div>Redirecting...</div>;
  }

  return <div>Protected Content</div>;
};
```

## 🔧 Integration with ApiClient

The AuthService works seamlessly with the ApiClient:

```typescript
// AuthService automatically:
// 1. Stores tokens after successful auth
apiClient.setAuthToken(response.token, true);

// 2. ApiClient automatically:
//    - Adds Authorization header to requests
//    - Handles token refresh
//    - Manages token persistence

// This means components never need to worry about:
// - Adding auth headers
// - Managing token lifecycle  
// - Handling token refresh
```

## 🚀 Performance Benefits

### **Reduced Bundle Size**
- **No Duplicate Code**: Auth logic written once, used everywhere
- **Tree Shaking**: Unused auth methods eliminated from bundle
- **Lazy Loading**: Only auth methods actually used are loaded

### **Improved Caching**
- **Consistent API Calls**: Same endpoints called consistently
- **Better HTTP Caching**: Predictable request patterns
- **Reduced Network Calls**: Centralized token management

### **Development Speed**
- **Faster Development**: No need to rewrite auth logic
- **Fewer Bugs**: Tested, centralized implementation
- **Easier Debugging**: Single place to add logging/debugging

## 🧪 Testing Benefits

### **Easier Mocking**
```typescript
// Mock entire AuthService for tests
jest.mock('@/services/auth-service', () => ({
  AuthService: {
    signup: jest.fn(),
    userLogin: jest.fn(),
    isAuthenticated: jest.fn(),
  }
}));
```

### **Isolated Testing**
```typescript
// Test components without worrying about auth implementation
const mockAuthService = {
  signup: jest.fn().mockResolvedValue({ status: 'success' })
};

// Component tests focus on UI logic, not auth details
```

### **Integration Testing**
```typescript
// Test auth flows end-to-end
describe('Authentication Flow', () => {
  it('should complete signup flow', async () => {
    const signupSpy = jest.spyOn(AuthService, 'signup');
    // Test complete flow through service
  });
});
```

## 📈 Scalability Advantages

### **Easy Feature Addition**
```typescript
// Adding new auth method is simple
class AuthService {
  // Existing methods...
  
  // New method follows same pattern
  static async socialLogin(provider: string): Promise<ApiResponse<SigninResponse>> {
    try {
      const response = await apiClient.post(`/auth/${provider}`);
      
      if (response.status === 'success' && response.token) {
        apiClient.setAuthToken(response.token, true);
      }
      
      return response;
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      throw error;
    }
  }
}
```

### **Easy Maintenance**
- **Single Place to Update**: API changes only require service updates
- **Backward Compatibility**: Interface changes managed centrally
- **Version Management**: Easier to support multiple API versions

### **Team Collaboration**
- **Clear Contracts**: Well-defined interfaces for team members
- **Reduced Conflicts**: Less merge conflicts in auth-related code
- **Knowledge Sharing**: New team members learn one service pattern

---

## 💡 Why This Approach Wins

1. **Junior Developer Friendly**: Clear, consistent patterns to follow
2. **Senior Developer Approved**: Follows industry best practices
3. **Maintainable**: Changes in one place affect entire application
4. **Testable**: Easy to mock, test, and debug
5. **Scalable**: Easy to extend with new features
6. **Type Safe**: Compile-time error prevention
7. **Performance**: Optimized for bundle size and runtime performance

The AuthService represents a **service layer pattern** that separates concerns, improves code reusability, and creates a maintainable foundation for authentication in modern web applications. This architecture investment pays dividends as the application grows and the team scales.