import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../../../store/authStore";
import type { AddToCartDto } from "../types";

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
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart);
      openDrawer();
      toast.success("Added to cart");
    },
    onError: (err: Error) => {
      if (err.message === "unauthenticated") return;
      toast.error("Failed to add item to cart.");
    },
  });
}
