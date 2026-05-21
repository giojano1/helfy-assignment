import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cartStore";
import { useGuestCartStore } from "../store/guestCartStore";
import { useAuthStore } from "../../../store/authStore";
import type { Cart } from "../types";

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  productSnapshot?: {
    name: string;
    slug: string;
    price: number;
    images: Array<{ url: string; isPrimary: boolean }>;
  };
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const openDrawer = useCartStore((s) => s.openDrawer);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const guestAddItem = useGuestCartStore((s) => s.addItem);

  return useMutation({
    mutationFn: async (payload: AddToCartPayload): Promise<Cart | null> => {
      if (!isAuthenticated) {
        if (payload.productSnapshot) {
          guestAddItem({
            productId: payload.productId,
            quantity: payload.quantity,
            price: payload.productSnapshot.price,
            product: {
              id: payload.productId,
              name: payload.productSnapshot.name,
              slug: payload.productSnapshot.slug,
              images: payload.productSnapshot.images,
            },
          });
        }
        return null;
      }
      return cartService.addItem({ productId: payload.productId, quantity: payload.quantity });
    },
    onMutate: async (payload) => {
      if (!isAuthenticated) return;
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const prev = queryClient.getQueryData<Cart>(["cart"]);
      if (prev) {
        const existing = prev.items.find((i) => i.productId === payload.productId);
        if (existing) {
          queryClient.setQueryData<Cart>(["cart"], {
            ...prev,
            items: prev.items.map((i) =>
              i.productId === payload.productId
                ? { ...i, quantity: i.quantity + payload.quantity }
                : i,
            ),
          });
        }
      }
      return { prev };
    },
    onSuccess: (cart) => {
      openDrawer();
      toast.success("Added to cart");
      if (cart) {
        queryClient.setQueryData(["cart"], cart);
      }
    },
    onError: (_err: Error, _vars, ctx) => {
      if (!isAuthenticated) return;
      if (ctx?.prev) queryClient.setQueryData(["cart"], ctx.prev);
      toast.error("Failed to add item to cart.");
    },
    onSettled: (_data, _err) => {
      if (!isAuthenticated) return;
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
