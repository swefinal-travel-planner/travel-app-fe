import { create } from 'zustand'

export interface AiTripRequest {
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
  request: AiTripRequest | null
  setCity: (city: string) => void
  setTripLength: (startDate: string, days: number) => void
  setLocsPerDay: (locationsPerDay: number) => void
  setFoodAttributes: (enAttributes: string[], viAttributes: string[]) => void
  setLocAttributes: (enAttributes: string[], viAttributes: string[]) => void
  setMedicalConditions: (enConditions: string[], viConditions: string[]) => void
  setSpecialRequirements: (enRequirements: string[], viRequirements: string[]) => void
  setTitle: (title: string) => void
  setLocPreference: (preference: string) => void
  clearRequest: () => void
}

export const useAiTripStore = create<AiTripState>()((set) => ({
  request: null,
  setCity: (city: string) =>
    set((state) => ({
      request: { ...state.request, city } as AiTripRequest,
    })),
  setTripLength: (startDate: string, days: number) =>
    set((state) => ({
      request: {
        ...state.request,
        startDate: startDate,
        days,
      } as AiTripRequest,
    })),
  setLocsPerDay: (locationsPerDay: number) =>
    set((state) => ({
      request: { ...state.request, locationsPerDay } as AiTripRequest,
    })),
  setFoodAttributes: (enAttributes: string[], viAttributes: string[]) =>
    set((state) => ({
      request: {
        ...state.request,
        enFoodAttributes: enAttributes,
        viFoodAttributes: viAttributes,
      } as AiTripRequest,
    })),
  setLocAttributes: (enAttributes: string[], viAttributes: string[]) =>
    set((state) => ({
      request: {
        ...state.request,
        enLocationAttributes: enAttributes,
        viLocationAttributes: viAttributes,
      } as AiTripRequest,
    })),
  setMedicalConditions: (enConditions: string[], viConditions: string[]) =>
    set((state) => ({
      request: {
        ...state.request,
        enMedicalConditions: enConditions,
        viMedicalConditions: viConditions,
      } as AiTripRequest,
    })),
  setSpecialRequirements: (enRequirements: string[], viRequirements: string[]) =>
    set((state) => ({
      request: {
        ...state.request,
        enSpecialRequirements: enRequirements,
        viSpecialRequirements: viRequirements,
      } as AiTripRequest,
    })),
  setTitle: (title: string) =>
    set((state) => ({
      request: { ...state.request, title } as AiTripRequest,
    })),
  setLocPreference: (preference: string) =>
    set((state) => ({
      request: {
        ...state.request,
        locationPreference: preference,
      } as AiTripRequest,
    })),
  clearRequest: () => set({ request: null }),
}))
