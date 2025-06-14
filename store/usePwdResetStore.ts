import { create } from 'zustand'

interface PwdResetState {
  email: string | null
  otp: string | null
  setEmail: (email: string) => void
  setOtp: (otp: string) => void
  clearRequest: () => void
}

export const usePwdResetStore = create<PwdResetState>()((set) => ({
  email: null,
  otp: null,
  setEmail: (email) => set({ email }),
  setOtp: (otp) => set({ otp }),
  clearRequest: () => set({ email: null, otp: null }),
}))
