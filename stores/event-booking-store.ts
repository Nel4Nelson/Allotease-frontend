import { create } from "zustand";
import { persist } from "zustand/middleware";

// Event booking interfaces
export interface EventBookingData {
  eventId: string | null;
  numberOfTickets: number;
}

interface EventBookingState {
  bookingData: EventBookingData;

  // Actions
  setEventId: (eventId: string) => void;
  setNumberOfTickets: (numberOfTickets: number) => void;
  clearEventBookingData: () => void;

  // Computed values
  getEventBookingPayload: () => EventBookingData & { callbackURL: string };
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
      getEventBookingPayload: () => {
        const { bookingData } = get();
        const currentEventId = bookingData.eventId || "";
        
        return {
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