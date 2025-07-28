export const APP_CONFIG = {
  name: 'Allotease',
  description: 'Find accommodations, events, and parking spaces all in one place',
  url: 'https://allotease.com',
  supportEmail: 'support@allotease.com',
} as const;

export const COLORS = {
  primary: '#FF5B00',
  primaryDark: '#BC4300',
  secondary: '#1F3A3A',
  text: {
    primary: '#1F2024',
    secondary: '#71727A',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F4F7',
    hero: '#FFF3E7',
  },
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const SERVICE_TYPES = {
  STAYS: 'stays',
  EVENTS: 'events',
  CAR_PARKS: 'car-parks',
} as const;

export const PRICING_TYPES = {
  FREE: 'free',
  PAID: 'paid',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 6,
  MAX_PAGE_SIZE: 50,
} as const;

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/allotease',
  twitter: 'https://twitter.com/allotease',
  whatsapp: 'https://whatsapp.com',
  facebook: 'https://facebook.com/allotease',
} as const;

export const API_ENDPOINTS = {
  EVENTS: '/events',
  STAYS: '/stays',
  CAR_PARKS: '/car-parks',
  USERS: '/users',
  AUTH: '/auth',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  BOOKING_CONFIRMED: 'Your booking has been confirmed!',
  PROFILE_UPDATED: 'Your profile has been updated successfully.',
  EMAIL_SENT: 'Email sent successfully.',
  SAVED: 'Changes saved successfully.',
} as const;