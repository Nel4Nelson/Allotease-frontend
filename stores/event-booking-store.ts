import { create } from "zustand";
import { persist } from "zustand/middleware";

// Event booking interfaces
export interface EventBookingData {
  eventId: string | null;
  numberOfTickets: number;
}

// Payload interface for API submission
export interface EventBookingPayload {
  email: string;
  phoneNumber: string;
  fullName: string;
  eventId: string;
  numberOfTickets: number;
  callbackURL: string;
}

// User data interface
export interface EventBookingUserData {
  email: string;
  phoneNumber: string;
  fullName: string;
}

interface EventBookingState {
  bookingData: EventBookingData;

  // Actions
  setEventId: (eventId: string) => void;
  setNumberOfTickets: (numberOfTickets: number) => void;
  clearEventBookingData: () => void;

  // Computed values
  getEventBookingPayload: (userData: EventBookingUserData) => EventBookingPayload;
}

// Initial state
const initialEventBookingData: EventBookingData = {
  eventId: null,
  numberOfTickets: 1,
};

export const useEventBookingStore = create<EventBookingState>()(
  persist(
    (set, get) => ({
      bookingData: initialEventBookingData,

      // Set the event ID and reset tickets if switching to a different event
      setEventId: (eventId: string) => {
        set((state) => {
          // If switching to a different event, reset the tickets
          if (state.bookingData.eventId && state.bookingData.eventId !== eventId) {
            return {
              bookingData: {
                eventId,
                numberOfTickets: 1,
              },
            };
          }

          // Same event or first time setting, just update eventId
          return {
            bookingData: {
              ...state.bookingData,
              eventId,
            },
          };
        });
      },

      // Set number of tickets
      setNumberOfTickets: (numberOfTickets: number) => {
        set((state) => ({
          bookingData: {
            ...state.bookingData,
            numberOfTickets: Math.max(1, numberOfTickets), // Ensure minimum of 1
          },
        }));
      },

      // Clear all event booking data
      clearEventBookingData: () => {
        set({ bookingData: initialEventBookingData });
      },

      // Get the complete event booking payload ready for API
      getEventBookingPayload: (userData: EventBookingUserData) => {
        const { bookingData } = get();
        const currentEventId = bookingData.eventId || "";
        
        return {
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          fullName: userData.fullName,
          eventId: currentEventId,
          numberOfTickets: bookingData.numberOfTickets,
          callbackURL: `${window.location.origin}/${currentEventId}?type=events`,
        };
      },
    }),
    {
      name: "event-booking-storage", // Key for sessionStorage
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);