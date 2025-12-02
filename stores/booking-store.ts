import { create } from "zustand";
import { persist } from "zustand/middleware";

// booking interfaces
export interface SelectedUnit {
  unitId: string;
  numberOfUnits: number;
  checkInDate: string | null;   
  checkOutDate: string | null;  // Keep for UI display only
  frequencyCount: number;       // Duration counter (1, 2, 3, etc.)
}

export interface BookingData {
  stayId: string | null;
  units: SelectedUnit[];
}

// booking payload interfaces - NEW STRUCTURE
export interface BookingPayloadItem {
  unitId: string;
  numberOfUnits: number;
  checkInDate: string;
  numberOfReservation: number; // This is frequencyCount (backend calculates checkout)
}

export interface BookingPayload {
  stayId: string; // Now at root level
  bookings: BookingPayloadItem[];
  callbackURL: string;
  email: string;
  phoneNumber: string;
  fullName: string;
}

interface BookingState {
  bookingData: BookingData;

  // Actions
  setStayId: (stayId: string) => void;
  addUnit: (unitId: string, frequency: string) => void;
  removeUnit: (unitId: string) => void;
  updateUnitQuantity: (unitId: string, numberOfUnits: number) => void;
  updateUnitDateRange: (unitId: string, checkInDate: Date, checkOutDate: Date, frequency: string) => void;
  updateUnitFrequencyCount: (unitId: string, frequencyCount: number, frequency: string) => void;
  clearBookingData: () => void;

  // Computed values
  getTotalUnits: () => number;
  isUnitSelected: (unitId: string) => boolean;
  getUnitQuantity: (unitId: string) => number;
  getUnitData: (unitId: string) => SelectedUnit | null;
  getBookingPayload: (userInfo: { email: string; phoneNumber: string; fullName: string }) => BookingPayload;
}

// Helper function to calculate checkout date based on frequency
const calculateCheckoutDate = (checkInDate: Date, frequencyCount: number, frequency: string): Date => {
  const checkout = new Date(checkInDate);
  
  switch (frequency) {
    case 'daily':
      checkout.setDate(checkout.getDate() + frequencyCount);
      break;
    case 'weekly':
      checkout.setDate(checkout.getDate() + (frequencyCount * 7));
      break;
    case 'monthly':
      checkout.setMonth(checkout.getMonth() + frequencyCount);
      break;
    case 'yearly':
      checkout.setFullYear(checkout.getFullYear() + frequencyCount);
      break;
    default:
      checkout.setDate(checkout.getDate() + frequencyCount);
  }
  
  return checkout;
};

// Helper function to calculate frequency count from date range
const calculateFrequencyCount = (checkInDate: Date, checkOutDate: Date, frequency: string): number => {
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  switch (frequency) {
    case 'daily':
      return Math.max(1, diffDays);
    case 'weekly':
      return Math.max(1, Math.ceil(diffDays / 7));
    case 'monthly':
      return Math.max(1, Math.ceil(diffDays / 30));
    case 'yearly':
      return Math.max(1, Math.ceil(diffDays / 365));
    default:
      return Math.max(1, diffDays);
  }
};

// Helper function to ensure date is not in the past
const ensureFutureDate = (date: Date): Date => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today
  
  if (date < now) {
    return now;
  }
  return date;
};

// Initial state
const initialBookingData: BookingData = {
  stayId: null,
  units: [],
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookingData: initialBookingData,

      // Set the stay ID and clear units if switching to a different stay
      setStayId: (stayId: string) => {
        set((state) => {
          // If switching to a different stay, clear the units
          if (state.bookingData.stayId && state.bookingData.stayId !== stayId) {
            return {
              bookingData: {
                stayId,
                units: [],
              },
            };
          }

          // Same stay or first time setting, just update stayId
          return {
            bookingData: {
              ...state.bookingData,
              stayId,
            },
          };
        });
      },

      // Add a unit to selection with initial date setup
      addUnit: (unitId: string, frequency: string) => {
        set((state) => {
          const existingUnit = state.bookingData.units.find(
            (u) => u.unitId === unitId
          );

          if (existingUnit) {
            // Unit already selected, don't add again
            return state;
          }

          // Set initial dates - checkin today, checkout based on 1 frequency unit
          const checkInDate = new Date();
          checkInDate.setHours(0, 0, 0, 0); // Start of today
          const checkOutDate = calculateCheckoutDate(checkInDate, 1, frequency);

          const newUnit: SelectedUnit = {
            unitId,
            numberOfUnits: 1,
            checkInDate: checkInDate.toISOString(),
            checkOutDate: checkOutDate.toISOString(),
            frequencyCount: 1,
          };

          return {
            bookingData: {
              ...state.bookingData,
              units: [...state.bookingData.units, newUnit],
            },
          };
        });
      },

      // Remove a unit from selection
      removeUnit: (unitId: string) => {
        set((state) => ({
          bookingData: {
            ...state.bookingData,
            units: state.bookingData.units.filter((u) => u.unitId !== unitId),
          },
        }));
      },

      // Update quantity for a specific unit
      updateUnitQuantity: (unitId: string, numberOfUnits: number) => {
        if (numberOfUnits <= 0) {
          // Remove unit if quantity is 0 or less
          get().removeUnit(unitId);
          return;
        }

        set((state) => ({
          bookingData: {
            ...state.bookingData,
            units: state.bookingData.units.map((u) =>
              u.unitId === unitId ? { ...u, numberOfUnits } : u
            ),
          },
        }));
      },

      // Update date range for a specific unit and recalculate frequency count
      updateUnitDateRange: (unitId: string, checkInDate: Date, checkOutDate: Date, frequency: string) => {
        set((state) => {
          const unit = state.bookingData.units.find((u) => u.unitId === unitId);
          if (!unit) return state;

          // Ensure checkin is not in the past
          const safeCheckInDate = ensureFutureDate(checkInDate);
          
          // Ensure checkout is after checkin
          let safeCheckOutDate = new Date(checkOutDate);
          if (safeCheckOutDate <= safeCheckInDate) {
            safeCheckOutDate = new Date(safeCheckInDate);
            safeCheckOutDate.setDate(safeCheckOutDate.getDate() + 1);
          }

          // Calculate frequency count from the date range
          const newFrequencyCount = calculateFrequencyCount(safeCheckInDate, safeCheckOutDate, frequency);

          return {
            bookingData: {
              ...state.bookingData,
              units: state.bookingData.units.map((u) =>
                u.unitId === unitId
                  ? {
                      ...u,
                      checkInDate: safeCheckInDate.toISOString(),
                      checkOutDate: safeCheckOutDate.toISOString(),
                      frequencyCount: newFrequencyCount,
                    }
                  : u
              ),
            },
          };
        });
      },

      // Update frequency count for a specific unit and recalculate checkout date
      updateUnitFrequencyCount: (unitId: string, frequencyCount: number, frequency: string) => {
        set((state) => {
          const unit = state.bookingData.units.find((u) => u.unitId === unitId);
          if (!unit || !unit.checkInDate) return state;

          const checkInDate = new Date(unit.checkInDate);
          const newCheckOutDate = calculateCheckoutDate(checkInDate, frequencyCount, frequency);

          return {
            bookingData: {
              ...state.bookingData,
              units: state.bookingData.units.map((u) =>
                u.unitId === unitId
                  ? {
                      ...u,
                      frequencyCount,
                      checkOutDate: newCheckOutDate.toISOString(),
                    }
                  : u
              ),
            },
          };
        });
      },

      // Clear all booking data
      clearBookingData: () => {
        set({ bookingData: initialBookingData });
      },

      // Get total number of units across all selected unit types
      getTotalUnits: () => {
        const { bookingData } = get();
        return bookingData.units.reduce(
          (total, unit) => total + unit.numberOfUnits,
          0
        );
      },

      // Check if a unit is selected
      isUnitSelected: (unitId: string) => {
        const { bookingData } = get();
        return bookingData.units.some((u) => u.unitId === unitId);
      },

      // Get quantity for a specific unit
      getUnitQuantity: (unitId: string) => {
        const { bookingData } = get();
        const unit = bookingData.units.find((u) => u.unitId === unitId);
        return unit ? unit.numberOfUnits : 0;
      },

      // Get full unit data for a specific unit
      getUnitData: (unitId: string) => {
        const { bookingData } = get();
        return bookingData.units.find((u) => u.unitId === unitId) || null;
      },

      // Get the complete booking payload ready for API - NEW STRUCTURE
      getBookingPayload: (userInfo: { email: string; phoneNumber: string; fullName: string }) => {
        const { bookingData } = get();
        const currentStayId = bookingData.stayId || "";
        
        // Transform units into new booking structure
        const bookings: BookingPayloadItem[] = bookingData.units
          .filter(unit => unit.checkInDate) // Only include units with checkin date
          .map(unit => ({
            unitId: unit.unitId,
            numberOfUnits: unit.numberOfUnits,
            checkInDate: unit.checkInDate!, // Backend expects ISO string
            numberOfReservation: unit.frequencyCount, // Backend calculates checkout from this
          }));
        
        // Build callback URL with current origin and stayId
        const callbackURL = typeof window !== 'undefined' 
          ? `${window.location.origin}/${currentStayId}?type=stays`
          : `https://www.allotease.com/${currentStayId}?type=stays`;
        
        return {
          stayId: currentStayId, // Now at root level
          bookings,
          callbackURL,
          ...userInfo,
        };
      },
    }),
    {
      name: "booking-storage", // Key for sessionStorage
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