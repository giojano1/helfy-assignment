import { useQuery } from "@tanstack/react-query";
import { accountService } from "../services/account.service";

export function useOrders(page = 1) {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: () => accountService.getOrders(page),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => accountService.getOrder(id),
    enabled: Boolean(id),
  });
}
