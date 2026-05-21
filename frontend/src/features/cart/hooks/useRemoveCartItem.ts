import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartService } from "../services/cart.service";
import type { Cart } from "../types";

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cartService.removeItem(id),
    onMutate: async (id) => {
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
      if (ctx?.prev) queryClient.setQueryData(["cart"], ctx.prev);
      toast.error("Failed to remove item.");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
