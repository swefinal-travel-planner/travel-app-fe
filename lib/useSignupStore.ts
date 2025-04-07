import { create } from "zustand";

interface SignupRequest {
  name?: string;
  email?: string;
  password?: string;
}

interface SignupState {
  request: SignupRequest | null;
  setRequest: (request: SignupRequest) => void;
  clearRequest: () => void;
}

export const useSignupStore = create<SignupState>()((set) => ({
  request: null,
  setRequest: (request) => set({ request }),
  clearRequest: () => set({ request: null }),
}));
