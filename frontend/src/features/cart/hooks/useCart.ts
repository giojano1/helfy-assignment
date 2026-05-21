import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cartStore";
import { useAuth } from "../../auth/hooks/useAuth";
import type { CartItem } from "../types";

const EMPTY: CartItem[] = [];

export function useCart() {
  const { isAuthenticated } = useAuth();
  const setTotalItems = useCartStore((s) => s.setTotalItems);

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    const count = query.data?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
    setTotalItems(count);
  }, [query.data, setTotalItems]);

  const items = query.data?.items ?? EMPTY;
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  return { ...query, items, totalItems, totalPrice };
}
