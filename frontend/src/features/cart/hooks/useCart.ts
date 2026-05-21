import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cartStore";
import { useGuestCartStore } from "../store/guestCartStore";
import { useAuth } from "../../auth/hooks/useAuth";
import type { CartItem } from "../types";

const EMPTY: CartItem[] = [];

export function useCart() {
  const { isAuthenticated } = useAuth();
  const setTotalItems = useCartStore((s) => s.setTotalItems);
  const guestItems = useGuestCartStore((s) => s.items);

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  });

  const items: CartItem[] = isAuthenticated
    ? (query.data?.items ?? EMPTY)
    : (guestItems as CartItem[]);

  useEffect(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    setTotalItems(count);
  }, [items, setTotalItems]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  return { ...query, items, totalItems, totalPrice };
}
