import { TimeSlot, TripItem } from '@/features/trip/domain/models/Trip'
import { TripRequest } from '@/store/useAiTripStore'
import { create } from 'zustand'

type TripItemsByDate = {
  [date: string]: {
    [timeSlot in TimeSlot]?: TripItem[]
  }
}

// Trip state management using Zustand
type ManualTripRequest = TripRequest & { id?: number }

type ManualTripState = {
  request: ManualTripRequest | null
  itemsByDate: TripItemsByDate
  isEditMode: boolean
  deleteTripItem: (itemId: string, date: Date) => void
  setRequest: (updates: Partial<ManualTripRequest>) => void
  resetManualTrip: () => void
  updateTripItem: (updatedItem: TripItem, date: Date) => void
  addTripItems: (items: TripItem[], date: Date) => void
  getItemsForDate: (date: Date) => TripItem[]
  loadExistingTrip: (tripData: any, tripItems: TripItem[]) => void
  setEditMode: (isEdit: boolean) => void
  log: () => void
}

export const useManualTripStore = create<ManualTripState>((set, get) => ({
  // Initialize trip with an empty object
  request: null,
  itemsByDate: {},
  isEditMode: false,
  // Set the new trip data, merging with existing state
  setRequest: (updates: Partial<TripRequest>) =>
    set((state) => ({
      request: { ...state.request, ...updates } as TripRequest,
    })),

  // Reset trip to an empty object
  resetManualTrip: () => set({ request: null, itemsByDate: {}, isEditMode: false }),

  // Get items for a specific date
  getItemsForDate: (date: Date) => {
    const dateStr = date.toDateString()
    const itemsByDate = get().itemsByDate[dateStr] || {}
    return Object.values(itemsByDate).flat()
  },

  // Add trip items for a specific date
  addTripItems: (items: TripItem[], date: Date) =>
    set((state) => {
      const dateStr = date.toDateString()
      const newItemsByDate: { [key in TimeSlot]?: TripItem[] } = {}

      // Group items by time slot
      items.forEach((item) => {
        const timeSlot = item.timeInDate
        newItemsByDate[timeSlot] ??= []
        // Only add the item if it's not already in the array
        if (!newItemsByDate[timeSlot]?.some((existingItem) => existingItem.item_id === item.item_id)) {
          newItemsByDate[timeSlot]?.push(item)
        }
      })

      return {
        itemsByDate: {
          ...state.itemsByDate,
          [dateStr]: newItemsByDate,
        },
      }
    }),

  // Update a specific trip item
  updateTripItem: (updatedItem: TripItem, date: Date) =>
    set((state) => {
      const dateStr = date.toDateString()
      const currentItemsByDate = state.itemsByDate[dateStr] || {}
      const timeSlot = updatedItem.timeInDate

      if (!currentItemsByDate[timeSlot]) {
        return state
      }

      const updatedItems = currentItemsByDate[timeSlot]?.map((item) =>
        item.item_id === updatedItem.item_id ? { ...item, ...updatedItem } : item
      )

      return {
        itemsByDate: {
          ...state.itemsByDate,
          [dateStr]: {
            ...currentItemsByDate,
            [timeSlot]: updatedItems,
          },
        },
      }
    }),

  // Delete a trip item
  deleteTripItem: (itemId: string, date: Date) =>
    set((state) => {
      const dateStr = date.toDateString()
      const currentItemsByDate = state.itemsByDate[dateStr] || {}
      const newItemsByDate = { ...currentItemsByDate }

      // Remove item from its time slot
      Object.keys(newItemsByDate).forEach((timeSlot) => {
        if (newItemsByDate[timeSlot as TimeSlot]) {
          newItemsByDate[timeSlot as TimeSlot] = newItemsByDate[timeSlot as TimeSlot]?.filter(
            (item) => item.item_id !== itemId
          )
        }
      })

      return {
        itemsByDate: {
          ...state.itemsByDate,
          [dateStr]: newItemsByDate,
        },
      }
    }),

  // Set edit mode
  setEditMode: (isEdit: boolean) => set({ isEditMode: isEdit }),

  // Load existing trip data for editing
  loadExistingTrip: (tripData: any, tripItems: TripItem[]) => {
    set(() => {
      const request: ManualTripRequest = {
        id: tripData.id,
        title: tripData.title || 'Untitled Trip',
        city: tripData.city || '',
        startDate: tripData.startDate,
        days: tripData.days || 1,
        // Provide default values for required TripRequest fields
        budget: tripData.budget || 0,
        enFoodAttributes: tripData.enFoodAttributes || [],
        enLocationAttributes: tripData.enLocationAttributes || [],
        enMedicalConditions: tripData.enMedicalConditions || [],
        enSpecialRequirements: tripData.enSpecialRequirements || [],
        locationPreference: tripData.locationPreference || '',
        locationsPerDay: tripData.locationsPerDay || 3,
        viFoodAttributes: tripData.viFoodAttributes || [],
        viLocationAttributes: tripData.viLocationAttributes || [],
        viMedicalConditions: tripData.viMedicalConditions || [],
        viSpecialRequirements: tripData.viSpecialRequirements || [],
      }

      // Group trip items by date and time slot
      const itemsByDate: TripItemsByDate = {}

      tripItems.forEach((item) => {
        const tripDay = item.tripDay || 1
        const itemDate = new Date(tripData.startDate)
        itemDate.setDate(itemDate.getDate() + (tripDay - 1))
        const dateStr = itemDate.toDateString()

        const timeSlot = item.timeInDate || 'morning'

        if (!itemsByDate[dateStr]) {
          itemsByDate[dateStr] = {}
        }
        if (!itemsByDate[dateStr][timeSlot]) {
          itemsByDate[dateStr][timeSlot] = []
        }

        itemsByDate[dateStr][timeSlot]!.push(item)
      })

      return {
        request,
        itemsByDate,
        isEditMode: true,
      }
    })
  },

  log: () => {
    const state = get()
    console.log(
      'Manual Trip State:',
      JSON.stringify(
        {
          trip: state.request,
          itemsByDate: state.itemsByDate,
        },
        null,
        2
      )
    )
  },
}))
