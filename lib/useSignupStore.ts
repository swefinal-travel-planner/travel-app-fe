import { create } from "zustand";

interface SignupRequest {
  name?: string;
  email?: string;
  password?: string;
}

interface SignupState {
  request: SignupRequest | null;
  otp: string | null;
  setOtp: (otp: string) => void;
  setRequest: (request: SignupRequest) => void;
  clearRequest: () => void;
}

export const useSignupStore = create<SignupState>()((set) => ({
  request: null,
  otp: null,
  setOtp: (otp) => set({ otp }),
  setRequest: (request) => set({ request }),
  clearRequest: () => set({ request: null }),
}));
