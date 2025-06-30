// /types/events.ts
export type EventType = "remote" | "venue";

export interface AgendaItem {
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}

export interface EventLocation {
  address: string;
  latitude?: number;
  longitude?: number;
  placeName?: string;
}

export interface EventFormData {
  // Basic Info
  title: string;
  description: string;
  image?: File;
  
  // Event Type & Location
  eventType: EventType;
  location?: EventLocation;
  
  // Date & Time
  startTime: string;
  endTime?: string;
  
  // Details
  capacity: number;
  price: number;
  isFree: boolean;
  
  // Agenda
  agenda: AgendaItem[];
  
  // Tags/Categories
  tags: string[];
}

export interface CreateEventRequest {
  title: string;
  description: string;
  eventType: EventType;
  startTime: string;
  price: number;
  capacity: number;
  agenda: AgendaItem[];
  tags: string[];
  image?: File;
  location?: EventLocation;
}

export interface CreateEventResponse {
  status: string;
  message?: string;
  data?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface EventPreviewData extends EventFormData {
  id?: string;
  createdAt?: string;
  organizerName?: string;
  organizerId?: string;
}

// Tag Categories
export const EVENT_CATEGORIES = [
  { label: "Regional events", value: "regional-events", color: "#FF5B00" },
  { label: "Innovation", value: "innovation", color: "#FF5B00" },
  { label: "Lagos events", value: "lagos-events", color: "#FF5B00" },
  { label: "Future", value: "future", color: "#FF5B00" },
  { label: "Lagos spirituality conference", value: "lagos-spirituality", color: "#FF5B00" },
  { label: "Conference", value: "conference", color: "#FF5B00" },
  { label: "Things to do in Lagos", value: "things-lagos", color: "#FF5B00" },
  { label: "Empowerment", value: "empowerment", color: "#FF5B00" },
] as const;

export type EventCategory = typeof EVENT_CATEGORIES[number]["value"];

// Form step types
export type CreateEventStep = "basic" | "datetime" | "details" | "preview";

export interface CreateEventStepProps {
  data: Partial<EventFormData>;
  onNext: (data: Partial<EventFormData>) => void;
  onBack?: () => void;
  isLoading?: boolean;
}