import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { StaysFormData } from "@/types/stays-form-schema";
import type { LocationData } from '@/components/ui/location-selector'

// SessionStorage key
const STORAGE_KEY = 'stays-form-data'

// Facility detail interface for caching
export interface FacilityDetail {
  _id: string
  name: string
  icon: string
  createdAt: string
  updatedAt: string
}

// Unit data interface
export interface UnitData {
  id: string;                    // Frontend generated ID
  title: string;               
  description: string;      
  price: number;               
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  quantity: number;           
  facilities: string[];          // Unit-specific facility IDs
}

// Serializable form data (excludes File objects)
interface SerializableFormData {
  accommodationTitle: string
  accommodationDescription: string
  location?: LocationData
  accommodationType: string
  facilities: string[] // Stay-level facility IDs
  units: UnitData[]    // Array of units with their facilities
}

interface StaysFormStore {
  // Form data
  formData: Partial<StaysFormData>
  
  // Non-persisted state
  hasImages: boolean // Track if images are uploaded
  facilitiesCache: Map<string, FacilityDetail> // Cache facility details for preview
  
  // Actions
  updateFormData: (data: Partial<StaysFormData>) => void
  setHasImages: (hasImages: boolean) => void
  
  // Stay-level facilities
  addFacility: (facilityId: string) => void
  removeFacility: (facilityId: string) => void
  
  // Units management
  addUnit: (unit: Omit<UnitData, 'id'>) => void
  updateUnit: (unitId: string, updates: Partial<UnitData>) => void
  removeUnit: (unitId: string) => void
  addUnitFacility: (unitId: string, facilityId: string) => void
  removeUnitFacility: (unitId: string, facilityId: string) => void
  
  // Cache management
  setFacilitiesCache: (facilities: FacilityDetail[]) => void
  getFacilityFromCache: (facilityId: string) => FacilityDetail | undefined
  clearFacilitiesCache: () => void
  
  resetForm: () => void
  
  // Getters
  getImageFiles: () => File[]
  getSelectedFacilities: () => string[]
  getUnits: () => UnitData[]
  getUnit: (unitId: string) => UnitData | undefined
  hasMinimumData: () => boolean
  isFormComplete: () => boolean
  getMissingFields: () => string[]
  
  // Internal
  _loadFromSessionStorage: () => void
  _saveToSessionStorage: () => void
}

// Helper to serialize form data for sessionStorage
const serializeFormData = (data: Partial<StaysFormData>): Partial<SerializableFormData> => {
  const { ...rest } = data
  return {
    ...rest,
    facilities: data.facilities || [],
    units: data.units || [],
    // Exclude images array from serialization
  }
}

// Helper to deserialize form data from sessionStorage
const deserializeFormData = (data: Partial<SerializableFormData>): Partial<StaysFormData> => {
  return {
    ...data,
    images: [], // Always start with empty images array
    facilities: data.facilities || [],
    units: data.units || [],
  }
}

export const useStaysFormStore = create<StaysFormStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    formData: {
      accommodationTitle: '',
      accommodationDescription: '',
      images: [],
      location: undefined,
      accommodationType: '',
      facilities: [], // Stay-level facility IDs
      units: [],      // Array of units with their facilities
    },
    hasImages: false,
    facilitiesCache: new Map(),

    // Update form data
    updateFormData: (data: Partial<StaysFormData>) => {
      set((state) => {
        const newFormData = { ...state.formData, ...data }
        
        // Track images state
        if (data.images !== undefined) {
          const hasImages = data.images.length > 0
          return {
            formData: newFormData,
            hasImages
          }
        }
        
        return { formData: newFormData }
      })
    },

    // Set images state
    setHasImages: (hasImages: boolean) => {
      set({ hasImages })
    },

    // Add facility to selection
    addFacility: (facilityId: string) => {
      set((state) => {
        const currentFacilities = state.formData.facilities || []
        if (!currentFacilities.includes(facilityId)) {
          const newFacilities = [...currentFacilities, facilityId]
          return {
            formData: {
              ...state.formData,
              facilities: newFacilities
            }
          }
        }
        return state
      })
    },

    // Remove facility from selection
    removeFacility: (facilityId: string) => {
      set((state) => {
        const currentFacilities = state.formData.facilities || []
        const newFacilities = currentFacilities.filter(id => id !== facilityId)
        return {
          formData: {
            ...state.formData,
            facilities: newFacilities
          }
        }
      })
    },

    // Add unit
    addUnit: (unit: Omit<UnitData, 'id'>) => {
      set((state) => {
        const newUnit: UnitData = {
          ...unit,
          id: Math.random().toString(36).substr(2, 9) // Generate ID
        }
        const currentUnits = state.formData.units || []
        return {
          formData: {
            ...state.formData,
            units: [...currentUnits, newUnit]
          }
        }
      })
    },

    // Update unit
    updateUnit: (unitId: string, updates: Partial<UnitData>) => {
      set((state) => {
        const currentUnits = state.formData.units || []
        const updatedUnits = currentUnits.map(unit =>
          unit.id === unitId ? { ...unit, ...updates } : unit
        )
        return {
          formData: {
            ...state.formData,
            units: updatedUnits
          }
        }
      })
    },

    // Remove unit
    removeUnit: (unitId: string) => {
      set((state) => {
        const currentUnits = state.formData.units || []
        const filteredUnits = currentUnits.filter(unit => unit.id !== unitId)
        return {
          formData: {
            ...state.formData,
            units: filteredUnits
          }
        }
      })
    },

    // Add facility to specific unit
    addUnitFacility: (unitId: string, facilityId: string) => {
      set((state) => {
        const currentUnits = state.formData.units || []
        const updatedUnits = currentUnits.map(unit => {
          if (unit.id === unitId) {
            const currentFacilities = unit.facilities || []
            if (!currentFacilities.includes(facilityId)) {
              return {
                ...unit,
                facilities: [...currentFacilities, facilityId]
              }
            }
          }
          return unit
        })
        return {
          formData: {
            ...state.formData,
            units: updatedUnits
          }
        }
      })
    },

    // Remove facility from specific unit
    removeUnitFacility: (unitId: string, facilityId: string) => {
      set((state) => {
        const currentUnits = state.formData.units || []
        const updatedUnits = currentUnits.map(unit => {
          if (unit.id === unitId) {
            const filteredFacilities = (unit.facilities || []).filter(id => id !== facilityId)
            return {
              ...unit,
              facilities: filteredFacilities
            }
          }
          return unit
        })
        return {
          formData: {
            ...state.formData,
            units: updatedUnits
          }
        }
      })
    },

    // Set facilities cache for preview
    setFacilitiesCache: (facilities: FacilityDetail[]) => {
      set((state) => {
        const newCache = new Map(state.facilitiesCache)
        facilities.forEach(facility => {
          newCache.set(facility._id, facility)
        })
        return { facilitiesCache: newCache }
      })
    },

    // Get facility from cache
    getFacilityFromCache: (facilityId: string) => {
      const { facilitiesCache } = get()
      return facilitiesCache.get(facilityId)
    },

    // Clear facilities cache
    clearFacilitiesCache: () => {
      set({ facilitiesCache: new Map() })
    },

    // Reset form
    resetForm: () => {
      set({
        formData: {
          accommodationTitle: '',
          accommodationDescription: '',
          images: [],
          location: undefined,
          accommodationType: '',
          facilities: [],
          units: [],
        },
        hasImages: false,
        facilitiesCache: new Map(),
      })
      // Clear sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    },

    // Get image files
    getImageFiles: () => {
      const { formData } = get()
      return formData.images || []
    },

    // Get selected facilities
    getSelectedFacilities: () => {
      const { formData } = get()
      return formData.facilities || []
    },

    // Get units array
    getUnits: () => {
      const { formData } = get()
      return formData.units || []
    },

    // Get specific unit by ID
    getUnit: (unitId: string) => {
      const { formData } = get()
      const units = formData.units || []
      return units.find(unit => unit.id === unitId)
    },

    // Check if has minimum data for live preview
    hasMinimumData: () => {
      const { formData } = get()
      return !!(formData.accommodationTitle && formData.accommodationDescription)
    },

    // Check if form is complete for submission
    isFormComplete: (): boolean => {
      const { formData, hasImages } = get()
      
      // Check required basic fields
      if (!formData.accommodationTitle || !formData.accommodationDescription || 
          !hasImages || !formData.accommodationType) {
        return false
      }

      // Check location (all fields required)
      if (!formData.location || !formData.location.address || 
          !formData.location.city || !formData.location.state || 
          !formData.location.country) {
        return false
      }

      // Stay-level facilities are required
      if (!formData.facilities || formData.facilities.length === 0) {
        return false
      }

      // At least one unit is required
      if (!formData.units || formData.units.length === 0) {
        return false
      }

      // All units must be complete
      const incompleteUnit = formData.units.find(unit =>
        !unit.title || !unit.description || !unit.price || unit.price <= 0 ||
        !unit.frequency || !unit.quantity || unit.quantity <= 0
      )

      if (incompleteUnit) {
        return false
      }

      return true
    },

    // Get missing fields for tooltip
    getMissingFields: () => {
      const { formData, hasImages } = get()
      const missing: string[] = []

      if (!formData.accommodationTitle) missing.push('Accommodation title')
      if (!formData.accommodationDescription) missing.push('Accommodation description')
      if (!hasImages) missing.push('Accommodation images')
      if (!formData.accommodationType) missing.push('Accommodation type')
      
      // Check location
      if (!formData.location?.address) missing.push('Accommodation address')
      if (!formData.location?.city) missing.push('Accommodation city')
      if (!formData.location?.state) missing.push('Accommodation state')
      if (!formData.location?.country) missing.push('Accommodation country')

      // Check stay-level facilities
      if (!formData.facilities || formData.facilities.length === 0) {
        missing.push('At least one facility')
      }

      // Check units
      if (!formData.units || formData.units.length === 0) {
        missing.push('At least one accommodation unit')
      } else {
        // Check individual units
        formData.units.forEach((unit, index) => {
          if (!unit.title) missing.push(`Unit ${index + 1}: Title`)
          if (!unit.description) missing.push(`Unit ${index + 1}: Description`)
          if (!unit.price || unit.price <= 0) missing.push(`Unit ${index + 1}: Price`)
          if (!unit.frequency) missing.push(`Unit ${index + 1}: Pricing frequency`)
          if (!unit.quantity || unit.quantity <= 0) missing.push(`Unit ${index + 1}: Quantity`)
        })
      }

      return missing
    },

    // Load from sessionStorage
    _loadFromSessionStorage: () => {
      try {
        if (typeof window === 'undefined') return
        
        const stored = sessionStorage.getItem(STORAGE_KEY)
        if (stored) {
          const serializedData: Partial<SerializableFormData> = JSON.parse(stored)
          const formData = deserializeFormData(serializedData)
          set((state) => ({
            formData: { ...state.formData, ...formData }
          }))
        }
      } catch (error) {
        console.error('Failed to load from sessionStorage:', error)
      }
    },

    // Save to sessionStorage
    _saveToSessionStorage: () => {
      try {
        if (typeof window === 'undefined') return
        
        const { formData } = get()
        const serializedData = serializeFormData(formData)
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(serializedData))
      } catch (error) {
        console.error('Failed to save to sessionStorage:', error)
      }
    },
  }))
)

// Auto-save to sessionStorage when formData changes (exclude hasImages and cache)
useStaysFormStore.subscribe(
  (state) => state.formData,
  () => {
    const store = useStaysFormStore.getState()
    store._saveToSessionStorage()
  }
)

// Load from sessionStorage on store creation
if (typeof window !== 'undefined') {
  useStaysFormStore.getState()._loadFromSessionStorage()
}