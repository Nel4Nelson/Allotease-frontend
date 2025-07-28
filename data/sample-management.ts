import { HostProfile, HostBalance, ManagementStats, ReservationItem, HostListing } from '@/types';

export const sampleHostProfile: HostProfile = {
  id: 'host-flend-worldwide',
  businessName: 'Flend Worldwide',
  ownerName: 'Obi Ruby',
  email: 'obiruby@gmail.com',
  avatar: '/icons/star.svg',
  isVerified: true,
  serviceTypes: ['events', 'stays'],
  stats: {
    totalListings: 12,
    activeListings: 8,
    totalBookings: 124,
    totalEarnings: 2150500,
    rating: 4.8,
    reviewCount: 89,
  },
  joinDate: '2023-01-15',
};

export const sampleHostBalance: HostBalance = {
  amount: 2150500,
  currency: 'NGN',
  isVisible: false,
  pendingAmount: 125000,
  availableForWithdrawal: 2025500,
};

export const sampleManagementStats: ManagementStats = {
  totalReservations: {
    count: 124,
    growth: 12,
  },
  checkInsToday: {
    count: 8,
    growth: 2,
  },
  availableSpaces: {
    count: 124,
    growth: -3,
  },
  revenueThisMonth: {
    amount: 450000,
    currency: 'NGN',
    growth: 12,
  },
};

export const sampleRecentReservations: ReservationItem[] = [
  {
    id: 'RES-1002',
    type: 'stay',
    guestName: 'Kingsley Promise',
    serviceName: 'Luxury Waterfront Suite',
    roomType: 'Classic King Room',
    dates: {
      start: '2024-05-31',
      end: '2024-06-01',
    },
    status: 'pending',
    amount: 200,
    currency: 'USD',
    guestContact: 'kingsley@example.com',
  },
  {
    id: 'RES-1003',
    type: 'event',
    guestName: 'Kingsley Promise',
    serviceName: 'Tech Innovation Summit 2024',
    dates: {
      start: '2024-05-31',
      end: '2024-06-01',
    },
    status: 'cancelled',
    amount: 150,
    currency: 'USD',
    guestContact: 'kingsley@example.com',
  },
  {
    id: 'RES-1004',
    type: 'stay',
    guestName: 'Kingsley Promise',
    serviceName: 'Downtown Apartment',
    roomType: 'Classic King Room',
    dates: {
      start: '2024-05-31',
      end: '2024-06-01',
    },
    status: 'confirmed',
    amount: 120,
    currency: 'USD',
    guestContact: 'kingsley@example.com',
  },
  {
    id: 'RES-1005',
    type: 'car-park',
    guestName: 'Kingsley Promise',
    serviceName: 'Premium Downtown Parking',
    dates: {
      start: '2024-05-31',
      end: '2024-06-01',
    },
    status: 'confirmed',
    amount: 25,
    currency: 'USD',
    guestContact: 'kingsley@example.com',
  },
  {
    id: 'RES-1006',
    type: 'event',
    guestName: 'Kingsley Promise',
    serviceName: 'Youth Entrepreneurship Workshop',
    dates: {
      start: '2024-05-31',
      end: '2024-06-01',
    },
    status: 'confirmed',
    amount: 0,
    currency: 'USD',
    guestContact: 'kingsley@example.com',
  },
];

export const sampleHostListings: HostListing[] = [
  {
    id: 'listing-1',
    type: 'event',
    title: 'Timely and Adaptive Strategies to Optimize Suicide Prevention among Youth',
    image: {
      src: '/images/web-cam.jpeg',  
      alt: 'Mental health conference',
    },
    status: 'active',
    pricing: {
      type: 'free',
    },
    stats: {
      views: 1247,
      bookings: 89,
      revenue: 0,
    },
    location: {
      city: 'Lagos',
      venue: 'Solution Arena',
    },
    createdDate: '2024-08-15',
    lastUpdated: '2024-09-10',
  },
  {
    id: 'listing-2',
    type: 'event',
    title: 'Tech Innovation Summit 2024',
    image: {
      src: '/images/web-cam.jpeg',
      alt: 'Technology summit',
    },
    status: 'active',
    pricing: {
      type: 'paid',
      amount: 150,
      currency: 'USD',
    },
    stats: {
      views: 2341,
      bookings: 156,
      revenue: 23400,
    },
    location: {
      city: 'Lagos',
      venue: 'Eko Convention Center',
    },
    createdDate: '2024-07-20',
    lastUpdated: '2024-09-12',
  },
  {
    id: 'listing-3',
    type: 'stay',
    title: 'Luxury Waterfront Hotel Suite',
    image: {
      src: '/images/web-cam.jpeg',
      alt: 'Hotel suite',
    },
    status: 'active',
    pricing: {
      type: 'paid',
      amount: 200,
      currency: 'USD',
    },
    stats: {
      views: 1876,
      bookings: 67,
      revenue: 13400,
    },
    location: {
      city: 'Lagos',
      venue: 'Victoria Island',
    },
    createdDate: '2024-06-10',
    lastUpdated: '2024-09-08',
  },
  {
    id: 'listing-4',
    type: 'event',
    title: 'Community Health and Wellness Fair',
    image: {
      src: '/images/web-cam.jpeg',
      alt: 'Wellness fair',
    },
    status: 'inactive',
    pricing: {
      type: 'free',
    },
    stats: {
      views: 892,
      bookings: 45,
      revenue: 0,
    },
    location: {
      city: 'Abuja',
      venue: 'National Stadium',
    },
    createdDate: '2024-08-01',
    lastUpdated: '2024-08-25',
  },
  {
    id: 'listing-5',
    type: 'car-park',
    title: 'Downtown Premium Parking',
    image: {
      src: '/images/web-cam.jpeg',
      alt: 'Parking facility',
    },
    status: 'active',
    pricing: {
      type: 'paid',
      amount: 25,
      currency: 'USD',
    },
    stats: {
      views: 456,
      bookings: 28,
      revenue: 700,
    },
    location: {
      city: 'Lagos',
      venue: 'Lagos Island',
    },
    createdDate: '2024-07-05',
    lastUpdated: '2024-09-14',
  },
  {
    id: 'listing-6',
    type: 'event',
    title: 'Youth Entrepreneurship Bootcamp',
    image: {
      src: '/images/web-cam.jpeg',
      alt: 'Entrepreneurship bootcamp',
    },
    status: 'draft',
    pricing: {
      type: 'free',
    },
    stats: {
      views: 0,
      bookings: 0,
      revenue: 0,
    },
    location: {
      city: 'Port Harcourt',
      venue: 'University of Port Harcourt',
    },
    createdDate: '2024-09-01',
    lastUpdated: '2024-09-15',
  },
];

// Filter listings by type
export const getFilteredListings = (
  listings: HostListing[],
  type: 'all' | 'event' | 'stay' | 'car-park' = 'all'
): HostListing[] => {
  if (type === 'all') return listings;
  return listings.filter(listing => listing.type === type);
};

// Get listings stats
export const getListingsStats = (listings: HostListing[]) => {
  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === 'active').length,
    inactive: listings.filter(l => l.status === 'inactive').length,
    draft: listings.filter(l => l.status === 'draft').length,
    totalViews: listings.reduce((sum, l) => sum + l.stats.views, 0),
    totalBookings: listings.reduce((sum, l) => sum + l.stats.bookings, 0),
    totalRevenue: listings.reduce((sum, l) => sum + l.stats.revenue, 0),
  };
  return stats;
};