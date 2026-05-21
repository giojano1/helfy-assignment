import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cartStore";
import type { AddToCartDto } from "../types";

export function useAddToCart() {
  const queryClient = useQueryClient();
  const openDrawer = useCartStore((s) => s.openDrawer);

  return useMutation({
    mutationFn: (dto: AddToCartDto) => cartService.addItem(dto),
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart);
      openDrawer();
      toast.success("Added to cart");
    },
    onError: () => {
      toast.error("Failed to add item to cart.");
    },
  });
}
