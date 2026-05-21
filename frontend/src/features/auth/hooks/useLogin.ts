import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore";
import { useGuestCartStore } from "../../cart/store/guestCartStore";
import { cartService } from "../../cart/services/cart.service";
import { authService } from "../services/auth.service";
import type { LoginFormData } from "../types";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const guestItems = useGuestCartStore((s) => s.items);
  const clearGuestCart = useGuestCartStore((s) => s.clear);

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
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
      toast.success(`Welcome back, ${res.user.firstName}!`);
    },
    onError: () => {
      toast.error("Invalid email or password.");
    },
  });
}
