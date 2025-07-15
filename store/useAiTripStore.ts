import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type TripRequest = {
  budget: number
  city: string
  days: number
  enFoodAttributes: string[]
  enLocationAttributes: string[]
  enMedicalConditions: string[]
  enSpecialRequirements: string[]
  locationPreference: string
  locationsPerDay: number
  startDate: string
  title: string
  viFoodAttributes: string[]
  viLocationAttributes: string[]
  viMedicalConditions: string[]
  viSpecialRequirements: string[]
}

interface AiTripState {
  request: TripRequest | null
  setLocsPerDay: (locationsPerDay: number) => void
  setFoodAttributes: (en: string[], vi: string[]) => void
  setLocAttributes: (en: string[], vi: string[]) => void
  setMedicalConditions: (en: string[], vi: string[]) => void
  setSpecialRequirements: (en: string[], vi: string[]) => void
  setLocPreference: (preference: string) => void
  setRequest: (updates: Partial<TripRequest>) => void
  clearRequest: () => void
}

export const useAiTripStore = create<AiTripState>()(
  immer((set) => ({
    request: null,

    setLocsPerDay: (locationsPerDay) =>
      set((state) => {
        if (state.request) state.request.locationsPerDay = locationsPerDay
      }),

    setFoodAttributes: (en, vi) =>
      set((state) => {
        if (state.request) {
          state.request.enFoodAttributes = en
          state.request.viFoodAttributes = vi
        }
      }),

    setLocAttributes: (en, vi) =>
      set((state) => {
        if (state.request) {
          state.request.enLocationAttributes = en
          state.request.viLocationAttributes = vi
        }
      }),

    setMedicalConditions: (en, vi) =>
      set((state) => {
        if (state.request) {
          state.request.enMedicalConditions = en
          state.request.viMedicalConditions = vi
        }
      }),

    setSpecialRequirements: (en, vi) =>
      set((state) => {
        if (state.request) {
          state.request.enSpecialRequirements = en
          state.request.viSpecialRequirements = vi
        }
      }),

    setLocPreference: (preference) =>
      set((state) => {
        if (state.request) {
          state.request.locationPreference = preference
        }
      }),

    setRequest: (updates) =>
      set((state) => {
        console.log(updates)
        if (!state.request) state.request = updates as TripRequest
        else Object.assign(state.request, updates)
        console.log('Updated request:', state.request)
      }),

    clearRequest: () =>
      set((state) => {
        state.request = null
      }),
  }))
)
