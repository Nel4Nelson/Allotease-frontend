import { UserTicket, UserProfile, FollowedOrganizer } from "@/types/tickets";

export const sampleUserProfile: UserProfile = {
  id: "user-obi-ruby",
  name: "Obi Ruby",
  email: "obiruby@gmail.com",
  avatar: "/icons/star.svg",
  stats: {
    followingCount: 15,
    ticketsCount: 8,
    eventsAttended: 12,
  },
};

export const sampleFollowedOrganizers: FollowedOrganizer[] = [
  {
    id: "organizer-1",
    name: "Flend Worldwide",
    avatar: "/icons/star.svg",
    followersCount: "117.5K",
    isFollowing: true,
    isVerified: true,
    type: "event-organizer",
  },
  {
    id: "organizer-2",
    name: "Chidex Stanley",
    avatar: "/icons/star.svg",
    followersCount: "45.2K",
    isFollowing: true,
    isVerified: false,
    type: "event-organizer",
  },
  {
    id: "organizer-3",
    name: "Ada Lovelace",
    avatar: "/icons/star.svg",
    followersCount: "89.1K",
    isFollowing: false,
    isVerified: true,
    type: "accommodation-host",
  },
  {
    id: "organizer-4",
    name: "John Doe",
    avatar: "/icons/star.svg",
    followersCount: "32.8K",
    isFollowing: true,
    isVerified: false,
    type: "parking-operator",
  },
  {
    id: "organizer-5",
    name: "TechHub Africa",
    avatar: "/icons/star.svg",
    followersCount: "234.1K",
    isFollowing: false,
    isVerified: true,
    type: "event-organizer",
  },
];

export const sampleUserTickets: UserTicket[] = [
  {
    id: "ticket-1",
    type: "event",
    serviceId: "event-suicide-prevention-2024",
    title:
      "Timely and Adaptive Strategies to Optimize Suicide Prevention among Youth",
    image: {
      src: "/images/web-cam.jpeg",
      alt: "Mental health conference",
    },
    date: {
      day: "Thursday",
      time: "6:00 PM GMT+1",
    },
    status: "upcoming",
    pricing: {
      type: "free",
    },
    provider: {
      name: "Flend Worldwide",
      followersCount: "117.5K",
      verified: true,
    },
    location: {
      city: "Lagos",
      venue: "Solution Arena",
    },
    bookingDetails: {
      bookingId: "BK-2024-001",
      bookingDate: "2024-09-15T10:30:00Z",
      attendees: 2,
    },
  },
  {
    id: "ticket-2",
    type: "event",
    serviceId: "event-tech-summit-2024",
    title: "Tech Innovation Summit 2024",
    image: {
      src: "/images/web-cam.jpeg",
      alt: "Technology summit",
    },
    date: {
      day: "Monday",
      time: "9:00 AM GMT+1",
    },
    status: "upcoming",
    pricing: {
      type: "paid",
      amount: 150,
      currency: "$",
    },
    provider: {
      name: "TechHub Africa",
      followersCount: "234.1K",
      verified: true,
    },
    location: {
      city: "Lagos",
      venue: "Eko Convention Center",
    },
    bookingDetails: {
      bookingId: "BK-2024-002",
      bookingDate: "2024-09-10T14:20:00Z",
      attendees: 1,
    },
  },
  {
    id: "ticket-3",
    type: "stay",
    serviceId: "stay-luxury-hotel-lagos",
    title: "Luxury Waterfront Hotel Suite",
    image: {
      src: "/images/web-cam.jpeg",
      alt: "Hotel suite",
    },
    date: {
      day: "Friday",
      time: "Check-in 3:00 PM",
    },
    status: "upcoming",
    pricing: {
      type: "paid",
      amount: 200,
      currency: "$",
    },
    provider: {
      name: "Waterfront Hotels",
      followersCount: "56.7K",
      verified: true,
    },
    location: {
      city: "Lagos",
      venue: "Victoria Island",
    },
    bookingDetails: {
      bookingId: "BK-2024-003",
      bookingDate: "2024-09-12T16:45:00Z",
      attendees: 2,
      specialRequests: "Late check-out requested",
    },
  },
  {
    id: "ticket-4",
    type: "event",
    serviceId: "event-wellness-fair-2024",
    title: "Community Health and Wellness Fair",
    image: {
      src: "/images/web-cam.jpeg",
      alt: "Wellness fair",
    },
    date: {
      day: "Saturday",
      time: "10:00 AM GMT+1",
    },
    status: "past",
    pricing: {
      type: "free",
    },
    provider: {
      name: "Health First Initiative",
      followersCount: "45.8K",
      verified: false,
    },
    location: {
      city: "Abuja",
      venue: "National Stadium",
    },
    bookingDetails: {
      bookingId: "BK-2024-004",
      bookingDate: "2024-08-20T11:30:00Z",
      attendees: 1,
    },
  },
  {
    id: "ticket-5",
    type: "car-park",
    serviceId: "parking-downtown-lagos",
    title: "Downtown Premium Parking",
    image: {
      src: "/images/web-cam.jpeg",
      alt: "Parking facility",
    },
    date: {
      day: "Monday",
      time: "8:00 AM - 6:00 PM",
    },
    status: "upcoming",
    pricing: {
      type: "paid",
      amount: 25,
      currency: "$",
    },
    provider: {
      name: "City Parking Solutions",
      followersCount: "12.3K",
      verified: true,
    },
    location: {
      city: "Lagos",
      venue: "Lagos Island",
    },
    bookingDetails: {
      bookingId: "BK-2024-005",
      bookingDate: "2024-09-14T09:15:00Z",
      attendees: 1,
      specialRequests: "Compact car space preferred",
    },
  },
  {
    id: "ticket-6",
    type: "event",
    serviceId: "event-entrepreneurship-bootcamp",
    title: "Youth Entrepreneurship Bootcamp",
    image: {
      src: "/images/web-cam.jpeg",
      alt: "Entrepreneurship bootcamp",
    },
    date: {
      day: "Tuesday",
      time: "1:00 PM GMT+1",
    },
    status: "past",
    pricing: {
      type: "free",
    },
    provider: {
      name: "Youth Empowerment Network",
      followersCount: "67.4K",
      verified: true,
    },
    location: {
      city: "Port Harcourt",
      venue: "University of Port Harcourt",
    },
    bookingDetails: {
      bookingId: "BK-2024-006",
      bookingDate: "2024-08-25T13:45:00Z",
      attendees: 1,
    },
  },
];

// Filter tickets by type and status
export const getFilteredTickets = (
  tickets: UserTicket[],
  type: "all" | "event" | "stay" | "car-park" = "all",
  status: "all" | "upcoming" | "past" = "all"
): UserTicket[] => {
  return tickets.filter((ticket) => {
    const typeMatch = type === "all" || ticket.type === type;
    const statusMatch = status === "all" || ticket.status === status;
    return typeMatch && statusMatch;
  });
};
