import { create } from "zustand";

interface CartUiState {
  isDrawerOpen: boolean;
  totalItems: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  setTotalItems: (count: number) => void;
}

export const useCartStore = create<CartUiState>((set) => ({
  isDrawerOpen: false,
  totalItems: 0,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  setTotalItems: (count: number) => set({ totalItems: count }),
}));
