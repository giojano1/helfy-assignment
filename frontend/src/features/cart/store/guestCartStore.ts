import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GuestCartItem {
  id: string;
  cartId: "guest";
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{ url: string; isPrimary: boolean }>;
  };
}

interface GuestCartState {
  items: GuestCartItem[];
  addItem: (item: Omit<GuestCartItem, "id" | "cartId">) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useGuestCartStore = create<GuestCartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          }));
        } else {
          set((s) => ({
            items: [
              ...s.items,
              { ...item, id: crypto.randomUUID(), cartId: "guest" as const },
            ],
          }));
        }
      },
      updateItem: (id, quantity) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "guest-cart" },
  ),
);
