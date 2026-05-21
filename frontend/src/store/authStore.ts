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

const SESSION_HINT_KEY = "_hs";

export function hasSessionHint(): boolean {
  return localStorage.getItem(SESSION_HINT_KEY) === "1";
}

export const useAuthStore = create<AuthState>((set, get) => {
  registerAuthAccessors(
    () => get().accessToken,
    (token: string) => set({ accessToken: token }),
    () => {
      localStorage.removeItem(SESSION_HINT_KEY);
      set({ user: null, accessToken: null, isAuthenticated: false });
    },
  );

  return {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
    setAuth: (user: UserProfile, token: string) => {
      localStorage.setItem(SESSION_HINT_KEY, "1");
      set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
    },
    setAccessToken: (token: string) => set({ accessToken: token }),
    setIsLoading: (loading: boolean) => set({ isLoading: loading }),
    clearAuth: () => {
      localStorage.removeItem(SESSION_HINT_KEY);
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    },
  };
});
