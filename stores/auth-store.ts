import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, TokenPayload, UserRole } from '@/types/auth';

// Add a new action to set loading state
interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string, remember?: boolean) => void;
  setUserAndToken: (user: User, token: string, remember?: boolean) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
  checkTokenExpiry: () => boolean;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  
  // Helper methods
  getUserRole: () => UserRole | null;
  isUserVerified: () => boolean;
  hasBusinessInfo: () => boolean;
  getFullName: () => string;
}

// Helper function to decode JWT token
const decodeToken = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// Helper function to check if token expires soon (within 5 minutes)
const isTokenExpiringSoon = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  const fiveMinutesFromNow = currentTime + (5 * 60); // 5 minutes in seconds
  return decoded.exp < fiveMinutesFromNow;
};

// Storage helpers
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
};

const storeToken = (token: string, remember: boolean = true): void => {
  if (typeof window === 'undefined') return;
  
  if (remember) {
    localStorage.setItem('auth_token', token);
    sessionStorage.removeItem('auth_token');
  } else {
    sessionStorage.setItem('auth_token', token);
    localStorage.removeItem('auth_token');
  }
};

const removeStoredToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
};

// Redirect to login helper
const redirectToLogin = (): void => {
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true

      // Set user data
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      // Set token and optionally persist it
      setToken: (token: string, remember: boolean = true) => {
        // Check if token is expired
        if (isTokenExpired(token)) {
          console.warn('Attempting to set expired token');
          get().logout();
          return;
        }

        // Store token in appropriate storage
        storeToken(token, remember);
        
        // Try to extract user data from token if no user data exists
        const decoded = decodeToken(token);
        const currentUser = get().user;
        
        set({ 
          token, 
          isAuthenticated: true,
          isLoading: false,
          // Only update user from token if we don't have complete user data
          ...(decoded && !currentUser && {
            user: {
              _id: decoded._id,
              email: decoded.email,
              role: decoded.role,
              firstname: '',
              lastname: '',
              isVerified: false
            } as User
          })
        });
      },

      // Set both user and token (most common case)
      setUserAndToken: (user: User, token: string, remember: boolean = true) => {
        // Check if token is expired
        if (isTokenExpired(token)) {
          console.warn('Attempting to set expired token');
          get().clearAuth();
          redirectToLogin();
          return;
        }

        storeToken(token, remember);
        set({ user, token, isAuthenticated: true, isLoading: false });
      },

      // Update user data partially
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      // Check if current token is expired and handle accordingly
      checkTokenExpiry: (): boolean => {
        const { token } = get();
        if (!token) return false;

        if (isTokenExpired(token)) {
          console.warn('Token has expired');
          get().logout();
          return false;
        }

        if (isTokenExpiringSoon(token)) {
          console.warn('Token is expiring soon');
          // You could implement refresh logic here if you had a refresh endpoint
          // For now, we'll just warn
        }

        return true;
      },

      // Clear all auth data and redirect
      logout: () => {
        removeStoredToken();
        set({ user: null, token: null, isAuthenticated: false });
        redirectToLogin();
      },

      // Clear auth data without redirect (for internal use)
      clearAuth: () => {
        removeStoredToken();
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Helper methods
      getUserRole: (): UserRole | null => {
        const { user } = get();
        return user?.role || null;
      },

      isUserVerified: (): boolean => {
        const { user } = get();
        return user?.isVerified || false;
      },

      hasBusinessInfo: (): boolean => {
        const { user } = get();
        return !!(user?.business);
      },

      getFullName: (): string => {
        const { user } = get();
        if (!user) return '';
        return `${user.firstname} ${user.lastname}`.trim();
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }), // Only persist user and auth status, not token
      onRehydrateStorage: () => (state) => {
        // Check stored token on app initialization
        if (state) {
          const storedToken = getStoredToken();
          if (storedToken && !isTokenExpired(storedToken)) {
            state.setToken(storedToken);
          } else if (storedToken) {
            // Token exists but is expired
            state.clearAuth();
          }
          // Set loading to false after rehydration is complete
          state.setLoading(false);
        }
      },
    }
  )
);

// Initialize token check on store creation
if (typeof window !== 'undefined') {
  // Set up periodic token expiry check (every 5 minutes)
  setInterval(() => {
    const store = useAuthStore.getState();
    if (store.isAuthenticated) {
      store.checkTokenExpiry();
    }
  }, 5 * 60 * 1000); // 5 minutes
}