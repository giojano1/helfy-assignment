import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore";
import { useGuestCartStore } from "../../cart/store/guestCartStore";
import { cartService } from "../../cart/services/cart.service";
import { authService } from "../services/auth.service";
import type { RegisterFormData } from "../types";

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const guestItems = useGuestCartStore((s) => s.items);
  const clearGuestCart = useGuestCartStore((s) => s.clear);

  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: async (res) => {
      setAuth(res.user, res.accessToken);

      if (guestItems.length > 0) {
        try {
          await cartService.mergeCart(
            guestItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          );
          clearGuestCart();
        } catch {
          // merge failure is non-critical
        }
        await queryClient.invalidateQueries({ queryKey: ["cart"] });
      }

      navigate("/");
      toast.success("Account created! Welcome aboard.");
    },
    onError: () => {
      toast.error("Registration failed. Email may already be in use.");
    },
  });
}
