import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartService } from "../services/cart.service";
import { useGuestCartStore } from "../store/guestCartStore";
import { useAuthStore } from "../../../store/authStore";
import type { Cart } from "../types";

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const guestUpdateItem = useGuestCartStore((s) => s.updateItem);

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }): Promise<Cart | null> => {
      if (!isAuthenticated) {
        guestUpdateItem(id, quantity);
        return null;
      }
      return cartService.updateItem(id, { quantity });
    },
    onMutate: async ({ id, quantity }) => {
      if (!isAuthenticated) return;
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const prev = queryClient.getQueryData<Cart>(["cart"]);
      if (prev) {
        queryClient.setQueryData<Cart>(["cart"], {
          ...prev,
          items: prev.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (!isAuthenticated) return;
      if (ctx?.prev) queryClient.setQueryData(["cart"], ctx.prev);
      toast.error("Failed to update item.");
    },
    onSettled: () => {
      if (!isAuthenticated) return;
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
