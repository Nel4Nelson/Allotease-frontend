export interface UserTicket {
  id: string;
  type: "event" | "stay" | "car-park";
  serviceId: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  date: {
    day: string;
    time: string;
  };
  status: "upcoming" | "past" | "cancelled";
  pricing: {
    type: "free" | "paid";
    amount?: number;
    currency?: string;
  };
  provider: {
    name: string;
    followersCount: string;
    verified?: boolean;
  };
  location: {
    city: string;
    venue: string;
  };
  bookingDetails: {
    bookingId: string;
    bookingDate: string;
    attendees?: number;
    specialRequests?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  stats: {
    followingCount: number;
    ticketsCount: number;
    eventsAttended: number;
  };
}

export interface FollowedOrganizer {
  id: string;
  name: string;
  avatar?: string;
  followersCount: string;
  isFollowing: boolean;
  isVerified?: boolean;
  type: "event-organizer" | "accommodation-host" | "parking-operator";
}

export interface TicketFilters {
  type: "all" | "event" | "stay" | "car-park";
  status: "all" | "upcoming" | "past";
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Component Props
export interface UserProfileCardProps {
  profile: UserProfile;
  followedOrganizers: FollowedOrganizer[];
  onToggleFollow: (organizerId: string) => void;
}

export interface TicketGridProps {
  tickets: UserTicket[];
  isLoading?: boolean;
  onTicketClick?: (ticketId: string) => void;
}

export interface TicketFiltersProps {
  activeFilter: TicketFilters;
  onFilterChange: (filters: Partial<TicketFilters>) => void;
}

export interface FollowedOrganizersListProps {
  organizers: FollowedOrganizer[];
  onToggleFollow: (organizerId: string) => void;
  isLoading?: boolean;
}
