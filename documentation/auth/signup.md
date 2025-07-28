# 🔐 SignUp Flow Documentation

## Overview

The SignUp Flow is a simplified user registration system that provides a unified onboarding experience for all users. The system has been streamlined to use a single registration pathway, removing the previous admin-specific signup complexity while maintaining code archives for future reference.

## 📋 Architecture

### Component Hierarchy
```
SignUpPage (Route)
└── SignUpFlow (Layout Wrapper)
    └── AuthLayout (UI Shell)
        └── UserSignup (Business Logic)
            └── UserForm (Form Component)
```

### Design Philosophy
- **Unified Registration**: Single signup path for all users
- **Simplified Onboarding**: Streamlined user experience
- **Consistent UX**: Matches signin flow patterns and styling
- **Email Verification**: Post-signup email confirmation workflow

## 🏗️ Component Breakdown

### 1. **SignUpPage** (`app/(auth)/signup/page.tsx`)
**Purpose**: Next.js page component serving as the route entry point.

```typescript
export default function SignUpPage() {
  return <SignUpFlow />;
}
```

**Responsibilities**:
- Route definition for `/signup`
- Component bootstrapping
- SEO and metadata handling

---

### 2. **SignUpFlow** (`signup-flow.tsx`)
**Purpose**: Layout orchestrator providing consistent UI shell and Google authentication integration.

**Key Features**:
- **AuthLayout Integration**: Consistent branding and navigation
- **Google Authentication**: OAuth signup option
- **Universal Access**: All users register through the same pathway
- **Responsive Design**: Mobile-first approach

**Props Configuration**:
```typescript
<AuthLayout
  title="Sign Up"                    // Page title
  footerChildren={googleButton}      // OAuth option
  showBackButton={false}             // No back navigation
  onBack={undefined}                 // No back handler
>
```

**Google SignUp Integration**:
```typescript
const footerChildren = (
  <Button
    variant="allotease-blur"
    size="allotease-md"
    leftIcon={<AtIcon size={18} />}
    onClick={handleGoogleSignup}
    className="w-full"
  >
    Sign up with Google
  </Button>
);
```

---

### 3. **UserSignup** (`signup.tsx`)
**Purpose**: Core business logic component managing registration state and API integration.

**State Management**:
```typescript
const [isLoading, setIsLoading] = useState(false);      // API call state
const [error, setError] = useState<string | null>(null); // Error handling
```

**Registration Flow**:
1. **Form Submission**: Receives validated data from UserForm
2. **Data Mapping**: Transforms form data to API format
3. **API Integration**: Calls `AuthService.signup()` with user data
4. **Email Storage**: Stores email for verification process
5. **Navigation**: Redirects to email verification page

**Data Transformation**:
```typescript
const signupData = {
  firstname: data.firstName,
  lastname: data.lastName,
  email: data.email,
  password: data.password,
  confirmPassword: data.confirmPassword,
};
```

**Success Flow**:
```typescript
if (response.status === "success") {
  AuthService.setVerificationEmail(data.email);
  router.push("/email-verification");
}
```

**Error Handling**:
- **Network Errors**: User-friendly error messages
- **API Errors**: Structured error response handling
- **Validation Errors**: Server-side validation feedback
- **Generic Errors**: Fallback messaging

---

### 4. **UserForm** (`user-form.tsx`)
**Purpose**: Comprehensive registration form with validation and accessibility features.

**Validation Schema** (Zod):
```typescript
const userFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name is required." })
      .min(2, { message: "First name must be at least 2 characters." })
      .max(50, { message: "First name must not exceed 50 characters." })
      .regex(/^[a-zA-Z\s'-]+$/, {
        message: "First name contains invalid characters.",
      }),

    lastName: z
      .string()
      .min(1, { message: "Last name is required." })
      .min(2, { message: "Last name must be at least 2 characters." })
      .max(50, { message: "Last name must not exceed 50 characters." })
      .regex(/^[a-zA-Z\s'-]+$/, {
        message: "Last name contains invalid characters.",
      }),

    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please enter a valid email address." })
      .max(100, { message: "Email must not exceed 100 characters." }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(100, { message: "Password must not exceed 100 characters." })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
          message:
            "Password must contain uppercase, lowercase, number, and special character.",
        }
      ),

    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
```

**Form Features**:
- **Real-time Validation**: Immediate feedback on input changes
- **Password Complexity**: Strong password requirements
- **Name Validation**: Character restrictions for names
- **Email Validation**: Comprehensive email format checking
- **Password Confirmation**: Ensures password accuracy
- **Accessibility**: Full ARIA support and keyboard navigation

**Field Configuration**:
```typescript
const formFields = [
  {
    name: "firstName" as const,
    label: "First Name",
    placeholder: "First Name*",
    type: "text",
    required: true,
  },
  {
    name: "lastName" as const,
    label: "Last Name", 
    placeholder: "Last Name*",
    type: "text",
    required: true,
  },
  {
    name: "email" as const,
    label: "Email",
    placeholder: "Email*",
    type: "email",
    required: true,
  },
  {
    name: "password" as const,
    label: "Password",
    placeholder: "Password*",
    type: "password",
    required: true,
  },
  {
    name: "confirmPassword" as const,
    label: "Confirm Password",
    placeholder: "Confirm Password*",
    type: "password",
    required: true,
  },
];
```

## 🗄️ Archived Components

### AdminSignup (Deprecated)
**Status**: Archived - Not in active use
**Location**: `admin-signup.tsx`
**Purpose**: Previously handled admin-specific registration with organization details

**Why Archived**:
- Flow simplification removed role-based registration
- Maintained for potential future admin onboarding features
- Contains valuable organization form integration patterns

### OrganizationForm (Deprecated)
**Status**: Archived - Not in active use
**Location**: `organization-form.tsx`
**Purpose**: Collected organization details during admin signup

**Features Preserved**:
- Nigerian phone number validation
- Organization name validation
- Account information collection
- Zod schema validation patterns

## 🔄 Data Flow

### 1. **User Input Flow**
```
User Input → Form Validation → State Update → UI Feedback
```

### 2. **Registration Flow**
```
Form Submit → UserSignup.handleSubmit() → Data Mapping → AuthService.signup() → Email Storage → Navigation
```

### 3. **Verification Flow**
```
Successful Signup → Email Storage → Redirect to /email-verification → OTP Process
```

### 4. **Error Flow**
```
API Error → Error Parsing → State Update → Error Display → User Feedback
```

## 🎨 UI/UX Features

### Visual States
- **Default State**: Clean form with clear instructions
- **Loading State**: Button spinner and form disabled state
- **Error State**: Red error messages with specific guidance
- **Validation State**: Real-time field validation feedback

### Form Layout
- **Centered Design**: 2/3 width button for visual balance
- **Consistent Spacing**: `space-y-4` and `space-y-3` for hierarchy
- **Mobile Optimized**: Responsive design patterns
- **Progressive Enhancement**: Enhanced experience for capable devices

### Accessibility
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Keyboard Navigation**: Full keyboard accessibility
- **Error Announcements**: Screen reader error notifications
- **Focus Management**: Logical tab order and focus indicators

## 🔧 API Integration

### Endpoint
```typescript
AuthService.signup(data: SignupData)
```

### Request Format
```typescript
interface SignupData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

### Response Handling
```typescript
// Success Response
{
  status: "success",
  // Additional response data
}

// Error Response
{
  status: "fail",
  message: "Registration failed"
}
```

### Email Verification Integration
```typescript
// Email storage for verification
AuthService.setVerificationEmail(email);

// Navigation to verification
router.push("/email-verification");
```

## 🔐 Security Features

### Input Validation
- **Client-side**: Comprehensive Zod schema validation
- **Server-side**: API endpoint validation
- **Sanitization**: Input cleaning and normalization
- **Password Security**: Complex password requirements

### Data Protection
- **Password Confirmation**: Prevents typos in critical fields
- **Email Verification**: Confirms email ownership
- **Secure Transmission**: HTTPS and secure API calls

## 🚀 Performance Optimizations

### Form Performance
- **Real-time Validation**: `mode: "onChange"` for immediate feedback
- **Optimized Re-renders**: React Hook Form optimization
- **Efficient Validation**: Zod schema caching

### Bundle Size
- **Tree Shaking**: Unused code elimination
- **Component Splitting**: Modular component architecture
- **Selective Imports**: Optimized dependency loading

## 📚 Dependencies

### Core Dependencies
- **React**: UI framework with hooks
- **Next.js**: App router and navigation
- **React Hook Form**: Form state management
- **Zod**: Schema validation and type safety
- **TypeScript**: Full type coverage

### UI Dependencies
- **Custom Components**: FormInput, Button, AuthLayout
- **Icons**: Custom icon system
- **Styling**: Consistent design tokens

### Services
- **AuthService**: Registration API integration
- **Router**: Next.js navigation system

## 🔄 Future Enhancements

### Planned Features
- **Social Registration**: Extended OAuth provider support
- **Progressive Profiling**: Additional user information collection
- **Organization Signup**: Potential re-introduction of admin flows
- **Multi-step Registration**: Enhanced onboarding experience

### Technical Improvements
- **Form Persistence**: Draft saving and recovery
- **Enhanced Validation**: Real-time availability checking
- **Accessibility**: Enhanced screen reader support

## 📞 Integration Points

### Route Integration
```typescript
// app/(auth)/signup/page.tsx
import { SignUpFlow } from "@/components/features/auth";
```

### Service Integration
```typescript
// AuthService integration
import { AuthService } from "@/services/auth-service";
const response = await AuthService.signup(signupData);
```

### Component Exports
```typescript
// index.ts exports
export { SignUpFlow } from "./signup-flow";
export { UserSignup } from "./signup";
export { AdminSignup } from "./admin-signup";     // Archived
export { UserForm } from "./user-form";
export { OrganizationForm } from "./organization-form"; // Archived
```

### Type Definitions
```typescript
// @/types/auth
export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

## 🧪 Testing Considerations

### Unit Testing
```typescript
// Form validation tests
test('should validate password complexity', () => {
  // Password requirements testing
});

// Registration flow tests
test('should handle successful registration', () => {
  // Success flow verification
});

// Error handling tests  
test('should display appropriate error messages', () => {
  // Error state testing
});
```

### Integration Testing
- **Form Submission**: End-to-end registration workflow
- **API Integration**: Mock service testing
- **Navigation**: Route transition verification
- **Email Verification**: Post-signup flow testing

### Accessibility Testing
- **Screen Reader**: NVDA/JAWS compatibility
- **Keyboard Navigation**: Tab order and focus management
- **Form Validation**: Error announcement testing

---

This documentation provides a comprehensive overview of the simplified SignUp flow architecture, including archived components for future reference, enabling developers to understand, maintain, and extend the registration system effectively.