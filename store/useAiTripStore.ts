import { create } from 'zustand'

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
  setFoodAttributes: (enAttributes: string[], viAttributes: string[]) => void
  setLocAttributes: (enAttributes: string[], viAttributes: string[]) => void
  setMedicalConditions: (enConditions: string[], viConditions: string[]) => void
  setSpecialRequirements: (enRequirements: string[], viRequirements: string[]) => void
  setLocPreference: (preference: string) => void
  setRequest: (updates: Partial<TripRequest>) => void
  clearRequest: () => void
}

export const useAiTripStore = create<AiTripState>()((set) => ({
  request: null,
  setLocsPerDay: (locationsPerDay: number) =>
    set((state) => ({
      request: { ...state.request, locationsPerDay } as TripRequest,
    })),
  setFoodAttributes: (enAttributes: string[], viAttributes: string[]) =>
    set((state) => ({
      request: {
        ...state.request,
        enFoodAttributes: enAttributes,
        viFoodAttributes: viAttributes,
      } as TripRequest,
    })),
  setLocAttributes: (enAttributes: string[], viAttributes: string[]) =>
    set((state) => ({
      request: {
        ...state.request,
        enLocationAttributes: enAttributes,
        viLocationAttributes: viAttributes,
      } as TripRequest,
    })),
  setMedicalConditions: (enConditions: string[], viConditions: string[]) =>
    set((state) => ({
      request: {
        ...state.request,
        enMedicalConditions: enConditions,
        viMedicalConditions: viConditions,
      } as TripRequest,
    })),
  setSpecialRequirements: (enRequirements: string[], viRequirements: string[]) =>
    set((state) => ({
      request: {
        ...state.request,
        enSpecialRequirements: enRequirements,
        viSpecialRequirements: viRequirements,
      } as TripRequest,
    })),
  setLocPreference: (preference: string) =>
    set((state) => ({
      request: {
        ...state.request,
        locationPreference: preference,
      } as TripRequest,
    })),
  setRequest: (updates: Partial<TripRequest>) =>
    set((state) => ({
      request: { ...state.request, ...updates } as TripRequest,
    })),
  clearRequest: () => set({ request: null }),
}))
