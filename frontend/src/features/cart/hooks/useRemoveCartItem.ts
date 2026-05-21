import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartService } from "../services/cart.service";
import { useGuestCartStore } from "../store/guestCartStore";
import { useAuthStore } from "../../../store/authStore";
import type { Cart } from "../types";

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const guestRemoveItem = useGuestCartStore((s) => s.removeItem);

  return useMutation({
    mutationFn: async (id: string): Promise<Cart | null> => {
      if (!isAuthenticated) {
        guestRemoveItem(id);
        return null;
      }
      return cartService.removeItem(id);
    },
    onMutate: async (id) => {
      if (!isAuthenticated) return;
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const prev = queryClient.getQueryData<Cart>(["cart"]);
      if (prev) {
        queryClient.setQueryData<Cart>(["cart"], {
          ...prev,
          items: prev.items.filter((i) => i.id !== id),
        });
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (!isAuthenticated) return;
      if (ctx?.prev) queryClient.setQueryData(["cart"], ctx.prev);
      toast.error("Failed to remove item.");
    },
    onSettled: () => {
      if (!isAuthenticated) return;
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
