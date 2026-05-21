import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../../../store/authStore";
import type { AddToCartDto, Cart } from "../types";

export function useAddToCart() {
  const queryClient = useQueryClient();
  const openDrawer = useCartStore((s) => s.openDrawer);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (dto: AddToCartDto) => {
      if (!isAuthenticated) {
        navigate("/login");
        return Promise.reject(new Error("unauthenticated"));
      }
      return cartService.addItem(dto);
    },
    onMutate: async (dto) => {
      if (!isAuthenticated) return;
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const prev = queryClient.getQueryData<Cart>(["cart"]);
      if (prev) {
        const existing = prev.items.find((i) => i.productId === dto.productId);
        if (existing) {
          queryClient.setQueryData<Cart>(["cart"], {
            ...prev,
            items: prev.items.map((i) =>
              i.productId === dto.productId
                ? { ...i, quantity: i.quantity + dto.quantity }
                : i,
            ),
          });
        }
      }
      return { prev };
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart);
      openDrawer();
      toast.success("Added to cart");
    },
    onError: (err: Error, _vars, ctx) => {
      if (err.message === "unauthenticated") return;
      if (ctx?.prev) queryClient.setQueryData(["cart"], ctx.prev);
      toast.error("Failed to add item to cart.");
    },
    onSettled: (_data, err) => {
      if (err?.message === "unauthenticated") return;
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
