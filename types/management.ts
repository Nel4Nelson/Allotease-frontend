export interface HostBalance {
  amount: number;
  currency: string;
  isVisible: boolean;
  pendingAmount?: number;
  availableForWithdrawal: number;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  currency: string;
  requestDate: string;
  status: "pending" | "processing" | "completed" | "failed";
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  processingTime?: string;
}

export interface HostProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  serviceTypes: ("events" | "stays" | "car-parks")[];
  stats: {
    totalListings: number;
    activeListings: number;
    totalBookings: number;
    totalEarnings: number;
    rating: number;
    reviewCount: number;
  };
  joinDate: string;
}

export interface ManagementStats {
  totalReservations: {
    count: number;
    growth: number;
  };
  checkInsToday: {
    count: number;
    growth: number;
  };
  availableSpaces: {
    count: number;
    growth: number;
  };
  revenueThisMonth: {
    amount: number;
    currency: string;
    growth: number;
  };
}

export interface ReservationItem {
  id?: string;
  type?: "event" | "stay" | "car-park";
  guestName?: string;
  serviceName?: string;
  roomType?: string;
  dates: {
    start: string;
    end: string;
  };
  status: "pending" | "confirmed" | "cancelled";
  amount?: number;
  currency?: string;
  guestContact?: string;
}

export interface HostListing {
  id: string;
  type: "event" | "stay" | "car-park";
  title: string;
  image: {
    src: string;
    alt: string;
  };
  status: "active" | "inactive" | "draft";
  pricing: {
    type: "free" | "paid";
    amount?: number;
    currency?: string;
  };
  stats: {
    views: number;
    bookings: number;
    revenue: number;
  };
  location: {
    city: string;
    venue: string;
  };
  createdDate: string;
  lastUpdated: string;
}

// Component Props
export interface BalanceCardProps {
  balance: HostBalance;
  onToggleVisibility: () => void;
  onWithdraw: () => void;
  isLoading?: boolean;
}

export interface WithdrawalCardProps {
  hostProfile: HostProfile;
  onWithdraw: () => void;
  isLoading?: boolean;
}

export interface ManagementStatsProps {
  stats: ManagementStats;
  isLoading?: boolean;
}

export interface RecentReservationsProps {
  reservations: ReservationItem[];
  isLoading?: boolean;
  onViewAll: () => void;
}

export interface HostListingsGridProps {
  listings: HostListing[];
  activeFilter: "all" | "event" | "stay" | "car-park";
  onFilterChange: (filter: "all" | "event" | "stay" | "car-park") => void;
  isLoading?: boolean;
}

export interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface StayReservationsResponse {
  reservations: ReservationItem[];
  pagination: PaginationMeta;
}

export interface EventReservationsResponse {
  events: ReservationItem[];
  pagination: PaginationMeta;
}

export interface SideBarItem {
  title: string;
  Icon: React.ComponentType<any>;
  href: string;
}

export interface ReservationStatCard {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}
