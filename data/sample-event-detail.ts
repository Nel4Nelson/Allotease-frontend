import { EventDetail } from '@/types/event-details';

export const sampleEventDetail: EventDetail = {
  id: 'event-suicide-prevention-2024',
  title: 'Timely and Adaptive Strategies to Optimize Suicide Prevention among Youth',
  description: `**Timely and Adaptive Strategies to Optimize Suicide Prevention among Youth** is a vital event focused on innovative approaches to address youth suicide prevention. This session will explore practical, evidence-based strategies tailored to the unique challenges faced by young people today.

Experts in mental health, education, and social work will discuss timely interventions and adaptive solutions designed to reduce risk and support resilience in youth. The event aims to empower participants with the tools and knowledge to make a meaningful impact in suicide prevention efforts within their communities.`,
  
  images: {
    hero: '/images/web-cam.png',
    gallery: [
      '/images/web-cam.png',
      '/images/event-gallery-1.jpg',
      '/images/event-gallery-2.jpg',
    ],
  },

  schedule: [
    {
      id: 'schedule-1',
      startTime: '9:30',
      endTime: '10:00',
      title: 'Registration and Breakfast',
      description: 'Arrive to get settled into the venue and meet others before we kick off the day.',
      type: 'registration',
    },
    {
      id: 'schedule-2',
      startTime: '10:00',
      endTime: '10:30',
      title: 'Welcome Address',
      description: 'Join our MC and special guests as they officially kick off the day and set the mood for the event.',
      type: 'session',
    },
    {
      id: 'schedule-3',
      startTime: '10:30',
      endTime: '12:00',
      title: 'Profitability: How Company Culture Can Drive Sustainable Growth (Keynote)',
      description: 'Explore the inspirational story of our first speaker overcoming business and finance challenges.',
      type: 'session',
    },
    {
      id: 'schedule-4',
      startTime: '12:00',
      endTime: '13:00',
      title: 'The Changing Role of the CFO with Rita Pajotra',
      description: 'Get to know the peers in the room. An interactive activity to get conversations going before we head into lunch.',
      type: 'session',
    },
  ],

  location: {
    venue: 'Solution Arena',
    address: 'Solution Arena Lagos, LA 100252',
    city: 'Lagos',
    coordinates: {
      lat: 6.5244,
      lng: 3.3792,
    },
    mapImage: '/images/map.svg',
  },

  registration: {
    isOpen: true,
    deadline: 'Sep 21, 2024',
    pricing: {
      type: 'free',
    },
    maxAttendees: 200,
    currentAttendees: 156,
  },

  organizer: {
    id: 'flend-worldwide',
    name: 'Flend Worldwide',
    avatar: '/icons/star.svg',
    followersCount: '117.5K',
    isFollowing: false,
    isVerified: true,
    bio: 'Leading organizer of mental health and wellness events across Africa.',
  },

  categories: [
    { id: 'cat-1', name: 'Nigerian events', color: '#FF5B00' },
    { id: 'cat-2', name: 'Health & Wellness', color: '#10B981' },
    { id: 'cat-3', name: 'Mental Health', color: '#8B5CF6' },
    { id: 'cat-4', name: 'Youth Development', color: '#F59E0B' },
    { id: 'cat-5', name: 'Community', color: '#EF4444' },
    { id: 'cat-6', name: 'Education', color: '#3B82F6' },
    { id: 'cat-7', name: 'Nonprofit', color: '#6B7280' },
  ],

  status: {
    ticketSalesEnding: true,
    registrationOpen: true,
    eventPassed: false,
  },

  dates: {
    startDate: '2024-09-21T10:00:00Z',
    endDate: '2024-09-21T16:00:00Z',
    registrationDeadline: '2024-09-21T00:00:00Z',
    timezone: 'WAT',
  },
};

// Mock data for related events (using existing event structure)
export const relatedEvents = [
  {
    id: 'related-1',
    title: 'Mental Health Awareness Workshop',
    images: { hero: '/images/web-cam.jpeg' },
    dates: { startDate: '2024-10-15T14:00:00Z' },
    location: { city: 'Abuja', venue: 'Community Center' },
    registration: { pricing: { type: 'free' as const } },
    organizer: { name: 'Health First Initiative', followersCount: '45.8K' },
  },
  {
    id: 'related-2',
    title: 'Youth Leadership Summit',
    images: { hero: '/images/web-cam.jpeg' },
    dates: { startDate: '2024-11-20T09:00:00Z' },
    location: { city: 'Lagos', venue: 'Youth Center' },
    registration: { pricing: { type: 'paid' as const, amount: 50, currency: '$' } },
    organizer: { name: 'Youth Empowerment Network', followersCount: '67.4K' },
  },
  {
    id: 'related-3',
    title: 'Community Wellness Fair',
    images: { hero: '/images/web-cam.jpeg' },
    dates: { startDate: '2024-12-05T11:00:00Z' },
    location: { city: 'Port Harcourt', venue: 'City Hall' },
    registration: { pricing: { type: 'free' as const } },
    organizer: { name: 'Wellness Community', followersCount: '89.2K' },
  },
];