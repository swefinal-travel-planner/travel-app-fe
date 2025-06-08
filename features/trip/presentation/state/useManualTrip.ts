import { Trip, TripItem } from '@/features/trip/domain/models/Trip'
import { create } from 'zustand'

// Trip state management using Zustand
type ManualTripState = {
  trip: Partial<Trip>
  deleteTripItem: (itemId: string) => void
  setManualTrip: (trip: Partial<Trip>) => void
  resetManualTrip: () => void
  updateTripItem: (updatedItem: TripItem) => void
}

export const useManualTripStore = create<ManualTripState>((set) => ({
  // Initialize trip with an empty object
  trip: {},

  // Set the new trip data, merging with existing state
  setManualTrip: (trip) =>
    set((state) => ({
      trip: { ...state.trip, ...trip },
    })),

  // Reset trip to an empty object
  resetManualTrip: () => set({ trip: {} }),

  // Update a specific trip item by merging the existing item with the updated data
  updateTripItem: (updatedItem) =>
    set((state) => {
      const currentItems = state.trip.items ?? []
      const updatedItems = currentItems.map((item) =>
        item.item_id === updatedItem.item_id
          ? { ...item, ...updatedItem }
          : item
      )

      return {
        trip: {
          ...state.trip,
          items: updatedItems,
        },
      }
    }),

  deleteTripItem: (itemId) =>
    set((state) => {
      const updatedItems = state.trip.items?.filter(
        (item) => item.item_id !== itemId
      )
      return {
        trip: {
          ...state.trip,
          items: updatedItems,
        },
      }
    }),
}))
