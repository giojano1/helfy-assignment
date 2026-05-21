import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartService } from "../services/cart.service";
import type { Cart } from "../types";

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      cartService.updateItem(id, { quantity }),
    onMutate: async ({ id, quantity }) => {
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
      if (ctx?.prev) queryClient.setQueryData(["cart"], ctx.prev);
      toast.error("Failed to update item.");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
