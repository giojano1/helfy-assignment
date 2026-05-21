import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { checkoutService } from "../services/checkout.service";
import { useCheckoutStore } from "../store/checkoutStore";
import type { CreateOrderDto } from "../types";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { setPlacedOrder, nextStep } = useCheckoutStore();

  return useMutation({
    mutationFn: (dto: CreateOrderDto) => checkoutService.createOrder(dto),
    onSuccess: (order) => {
      setPlacedOrder(order);
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      nextStep();
    },
    onError: () => {
      toast.error("Failed to place order. Please try again.");
    },
  });
}
