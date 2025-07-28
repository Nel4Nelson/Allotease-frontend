export interface EventDetail {
  id: string;
  title: string;
  description: string;
  images: {
    hero: string;
    gallery?: string[];
  };
  schedule: EventScheduleItem[];
  location: EventLocation;
  registration: EventRegistration;
  organizer: EventOrganizer;
  categories: EventCategory[];
  status: EventStatus;
  dates: EventDates;
}

export interface EventScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  type?: 'registration' | 'session' | 'break' | 'networking';
}

export interface EventLocation {
  venue: string;
  address: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  mapImage?: string;
}

export interface EventRegistration {
  isOpen: boolean;
  deadline: string;
  pricing: {
    type: 'free' | 'paid';
    amount?: number;
    currency?: string;
  };
  maxAttendees?: number;
  currentAttendees?: number;
  requirements?: string[];
}

export interface EventOrganizer {
  id: string;
  name: string;
  avatar?: string;
  followersCount: string;
  isFollowing: boolean;
  isVerified: boolean;
  bio?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface EventStatus {
  ticketSalesEnding: boolean;
  registrationOpen: boolean;
  eventPassed: boolean;
}

export interface EventDates {
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  timezone: string;
}

// Component Props
export interface EventHeroImageProps {
  src: string;
  alt: string;
  className?: string;
}

export interface EventHeaderProps {
  title: string;
  description: string;
  status: EventStatus;
  organizer: EventOrganizer;
}

export interface RegistrationCardProps {
  registration: EventRegistration;
  onRegister: () => void;
  isLoading?: boolean;
}

export interface EventScheduleProps {
  schedule: EventScheduleItem[];
  title?: string;
}

export interface EventLocationProps {
  location: EventLocation;
}

export interface EventCategoriesProps {
  categories: EventCategory[];
  organizer: EventOrganizer;
  onFollowToggle: (organizerId: string) => void;
}

export interface RelatedEventsProps {
  events: EventDetail[];
  title?: string;
  description?: string;
}