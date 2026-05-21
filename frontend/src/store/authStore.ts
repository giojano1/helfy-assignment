import { create } from "zustand";
import { registerAuthAccessors } from "../lib/axios";
import type { UserProfile } from "../features/account/types";

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  setAccessToken: (token: string) => void;
  setIsLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  registerAuthAccessors(
    () => get().accessToken,
    (token: string) => set({ accessToken: token }),
    () => set({ user: null, accessToken: null, isAuthenticated: false }),
  );

  return {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
    setAuth: (user: UserProfile, token: string) =>
      set({ user, accessToken: token, isAuthenticated: true, isLoading: false }),
    setAccessToken: (token: string) => set({ accessToken: token }),
    setIsLoading: (loading: boolean) => set({ isLoading: loading }),
    clearAuth: () =>
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false }),
  };
});
