import { create } from "zustand";
import { persist } from "zustand/middleware";

// Booking interfaces
export interface SelectedUnit {
  unitId: string;
  numberOfUnits: number;
}

export interface BookingData {
  stayId: string | null;
  units: SelectedUnit[];
  checkInDate: string | null;
  checkOutDate: string | null;
}

interface BookingState {
  bookingData: BookingData;

  // Actions
  setStayId: (stayId: string) => void;
  addUnit: (unitId: string) => void;
  removeUnit: (unitId: string) => void;
  updateUnitQuantity: (unitId: string, numberOfUnits: number) => void;
  setDateRange: (checkInDate: Date, checkOutDate: Date) => void;
  clearBookingData: () => void;

  // Computed values
  getTotalUnits: () => number;
  isUnitSelected: (unitId: string) => boolean;
  getUnitQuantity: (unitId: string) => number;
  getBookingPayload: () => BookingData & { callbackURL: string };
}

// Initial state
const initialBookingData: BookingData = {
  stayId: null,
  units: [],
  checkInDate: null,
  checkOutDate: null,
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
                checkInDate: null,
                checkOutDate: null,
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

      // Add a unit to selection
      addUnit: (unitId: string) => {
        set((state) => {
          const existingUnit = state.bookingData.units.find(
            (u) => u.unitId === unitId
          );

          if (existingUnit) {
            // Unit already selected, don't add again
            return state;
          }

          return {
            bookingData: {
              ...state.bookingData,
              units: [...state.bookingData.units, { unitId, numberOfUnits: 1 }],
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

      // Set check-in and check-out dates
      setDateRange: (checkInDate: Date, checkOutDate: Date) => {
        set((state) => ({
          bookingData: {
            ...state.bookingData,
            checkInDate: checkInDate.toISOString(),
            checkOutDate: checkOutDate.toISOString(),
          },
        }));
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

      // Get the complete booking payload ready for API
      getBookingPayload: () => {
        const { bookingData } = get();
        const currentStayId = bookingData.stayId || "";
        
        return {
          stayId: currentStayId,
          units: bookingData.units,
          // Use the actual selected dates, not current time
          checkInDate: bookingData.checkInDate || new Date().toISOString(),
          checkOutDate: bookingData.checkOutDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          callbackURL: `${window.location.origin}/${currentStayId}?type=stays`,
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