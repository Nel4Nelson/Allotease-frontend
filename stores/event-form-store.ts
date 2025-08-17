import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { EventsFormData } from '@/components/features/create/events-form'
import { type AgendaItemData } from "@/components/ui/agenda-manager";
import type { LocationData, EventType } from '@/components/ui/location-selector'

// SessionStorage key
const STORAGE_KEY = 'event-form-data'

// Serializable form data (excludes File objects)
interface SerializableFormData {
  eventTitle: string
  eventDescription: string
  eventDate?: string // ISO string instead of Date
  startTime: string
  endTime: string
  agenda: AgendaItemData[]
  categories: string[]
  eventType: EventType
  location?: LocationData
  geoLocation?: { coordinates: [number, number] }
  onlineEventLink: string
  capacity: number
  price: number
  isFree: boolean
}

interface EventFormStore {
  // Form data
  formData: Partial<EventsFormData>
  
  // Non-persisted state
  hasImage: boolean // Track if image is uploaded
  
  // Actions
  updateFormData: (data: Partial<EventsFormData>) => void
  setHasImage: (hasImage: boolean) => void
  resetForm: () => void
  
  // Getters
  getImageFile: () => File | undefined
  hasMinimumData: () => boolean
  isFormComplete: () => boolean
  getMissingFields: () => string[]
  
  // Internal
  _loadFromSessionStorage: () => void
  _saveToSessionStorage: () => void
}

// Helper to serialize form data for sessionStorage
const serializeFormData = (data: Partial<EventsFormData>): Partial<SerializableFormData> => {
  const { eventDate, ...rest } = data
  return {
    ...rest,
    eventDate: eventDate ? eventDate.toISOString() : undefined,
    // Include geoLocation in serialization
    geoLocation: data.geoLocation,
    // Exclude image array from serialization
  }
}

// Helper to deserialize form data from sessionStorage
const deserializeFormData = (data: Partial<SerializableFormData>): Partial<EventsFormData> => {
  const { eventDate, ...rest } = data
  return {
    ...rest,
    eventDate: eventDate ? new Date(eventDate) : undefined,
    image: [], // Always start with empty image array
    geoLocation: data.geoLocation, // Include geoLocation in deserialization
  }
}

export const useEventFormStore = create<EventFormStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    formData: {
      eventTitle: '',
      eventDescription: '',
      image: [],
      eventDate: undefined,
      startTime: '',
      endTime: '',
      agenda: [],
      categories: [],
      eventType: 'remote',
      location: undefined,
      geoLocation: undefined,
      onlineEventLink: '',
      capacity: 0,
      price: 0,
      isFree: true,
    },
    hasImage: false,

    // Update form data
    updateFormData: (data: Partial<EventsFormData>) => {
      set((state) => {
        const newFormData = { ...state.formData, ...data }
        
        // Track image state
        if (data.image !== undefined) {
          const hasImage = data.image.length > 0
          return {
            formData: newFormData,
            hasImage
          }
        }
        
        return { formData: newFormData }
      })
    },

    // Set image state
    setHasImage: (hasImage: boolean) => {
      set({ hasImage })
    },

    // Reset form
    resetForm: () => {
      set({
        formData: {
          eventTitle: '',
          eventDescription: '',
          image: [],
          eventDate: undefined,
          startTime: '',
          endTime: '',
          agenda: [],
          categories: [],
          eventType: 'remote',
          location: undefined,
          geoLocation: undefined,
          onlineEventLink: '', 
          capacity: 0,
          price: 0,
          isFree: true,
        },
        hasImage: false
      })
      // Clear sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    },

    // Get image file
    getImageFile: () => {
      const { formData } = get()
      return formData.image?.[0]
    },

    // Check if has minimum data for live preview
    hasMinimumData: () => {
      const { formData } = get()
      return !!(formData.eventTitle && formData.eventDescription)
    },

    // Check if form is complete for submission
    isFormComplete: (): boolean => {
      const { formData, hasImage } = get()
      
      // Check required basic fields
      if (!formData.eventTitle || !formData.eventDescription || !hasImage || 
          !formData.eventDate || !formData.startTime || !formData.endTime ||
          !formData.capacity || formData.capacity <= 0) {
        return false;
      }

      // Check categories
      if (!formData.categories || formData.categories.length === 0) {
        return false;
      }

      // Check agenda
      if (!formData.agenda || formData.agenda.length === 0) {
        return false;
      }

      // Check if agenda items are complete
      const agendaComplete = formData.agenda.every(item => 
        Boolean(item.title && item.description && item.startTime && item.endTime)
      );
      
      if (!agendaComplete) {
        return false;
      }

      // Check location for venue events
      if (formData.eventType === 'venue') {
        if (!formData.location || !formData.location.address || 
            !formData.location.city || !formData.location.state || 
            !formData.location.country) {
          return false;
        }
      }

      // Check online event link for remote events
      if (formData.eventType === 'remote') {
        if (!formData.onlineEventLink || formData.onlineEventLink.trim().length === 0) {
          return false;
        }
      }

      // Check price for paid events
      if (!formData.isFree && (!formData.price || formData.price <= 0)) {
        return false;
      }

      return true;
    },

    // Get missing fields for tooltip
    getMissingFields: () => {
      const { formData, hasImage } = get()
      const missing: string[] = []

      if (!formData.eventTitle) missing.push('Event title')
      if (!formData.eventDescription) missing.push('Event description')
      if (!hasImage) missing.push('Cover image')
      if (!formData.eventDate) missing.push('Event date')
      if (!formData.startTime) missing.push('Start time')
      if (!formData.endTime) missing.push('End time')
      if (!formData.categories || formData.categories.length === 0) missing.push('Categories')
      if (!formData.capacity || formData.capacity <= 0) missing.push('Event capacity')
      
      // Check agenda
      if (!formData.agenda || formData.agenda.length === 0) {
        missing.push('Agenda items')
      } else {
        const incompleteAgenda = formData.agenda.some(item => 
          !item.title || !item.description || !item.startTime || !item.endTime
        )
        if (incompleteAgenda) {
          missing.push('Complete agenda details')
        }
      }

      // Check location for venue events
      if (formData.eventType === 'venue') {
        if (!formData.location?.address) missing.push('Event address')
        if (!formData.location?.city) missing.push('Event city')
        if (!formData.location?.state) missing.push('Event state')
        if (!formData.location?.country) missing.push('Event country')
      }

      // Check online event link for remote events
      if (formData.eventType === 'remote') {
        if (!formData.onlineEventLink || formData.onlineEventLink.trim().length === 0) {
          missing.push('Meeting link or event details')
        }
      }

      // Check price for paid events
      if (!formData.isFree && (!formData.price || formData.price <= 0)) {
        missing.push('Event price')
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

// Auto-save to sessionStorage when formData changes (exclude hasImage)
useEventFormStore.subscribe(
  (state) => state.formData,
  () => {
    const store = useEventFormStore.getState()
    store._saveToSessionStorage()
  }
)

// Load from sessionStorage on store creation
if (typeof window !== 'undefined') {
  useEventFormStore.getState()._loadFromSessionStorage()
}