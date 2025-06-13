import { TimeSlot, Trip, TripItem } from '@/features/trip/domain/models/Trip'
import { create } from 'zustand'

type TripItemsByDate = {
  [date: string]: {
    [timeSlot in TimeSlot]?: TripItem[]
  }
}

// Trip state management using Zustand
type ManualTripState = {
  trip: Partial<Trip>
  itemsByDate: TripItemsByDate
  deleteTripItem: (itemId: string, date: Date) => void
  setManualTrip: (trip: Partial<Trip>) => void
  resetManualTrip: () => void
  updateTripItem: (updatedItem: TripItem, date: Date) => void
  addTripItems: (items: TripItem[], date: Date) => void
  getItemsForDate: (date: Date) => TripItem[]
  log: () => void
}

export const useManualTripStore = create<ManualTripState>((set, get) => ({
  // Initialize trip with an empty object
  trip: {},
  itemsByDate: {},

  // Set the new trip data, merging with existing state
  setManualTrip: (trip) =>
    set((state) => ({
      trip: { ...state.trip, ...trip },
    })),

  // Reset trip to an empty object
  resetManualTrip: () => set({ trip: {}, itemsByDate: {} }),

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
      const currentItemsByDate = state.itemsByDate[dateStr] || {}
      const newItemsByDate: { [key in TimeSlot]?: TripItem[] } = {}

      // Group items by time slot
      items.forEach((item) => {
        const timeSlot = item.timeInDate
        if (!newItemsByDate[timeSlot]) {
          newItemsByDate[timeSlot] = []
        }
        // Only add the item if it's not already in the array
        if (
          !newItemsByDate[timeSlot]?.some(
            (existingItem) => existingItem.item_id === item.item_id
          )
        ) {
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
        item.item_id === updatedItem.item_id
          ? { ...item, ...updatedItem }
          : item
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
          newItemsByDate[timeSlot as TimeSlot] = newItemsByDate[
            timeSlot as TimeSlot
          ]?.filter((item) => item.item_id !== itemId)
        }
      })

      return {
        itemsByDate: {
          ...state.itemsByDate,
          [dateStr]: newItemsByDate,
        },
      }
    }),

  log: () => {
    const state = get()
    console.log(
      'Manual Trip State:',
      JSON.stringify(
        {
          trip: state.trip,
          itemsByDate: state.itemsByDate,
        },
        null,
        2
      )
    )
  },
}))
