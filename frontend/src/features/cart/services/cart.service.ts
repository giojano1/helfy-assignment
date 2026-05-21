import apiClient from "../../../lib/axios";
import type { AddToCartDto, Cart, UpdateCartItemDto } from "../types";

interface ApiEnvelope<T> {
  success: true;
  data: T;
}

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const res = await apiClient.get<ApiEnvelope<Cart>>("/cart");
    return res.data.data;
  },

  addItem: async (dto: AddToCartDto): Promise<Cart> => {
    const res = await apiClient.post<ApiEnvelope<Cart>>("/cart/items", dto);
    return res.data.data;
  },

  updateItem: async (id: string, dto: UpdateCartItemDto): Promise<Cart> => {
    const res = await apiClient.patch<ApiEnvelope<Cart>>(`/cart/items/${id}`, dto);
    return res.data.data;
  },

  removeItem: async (id: string): Promise<Cart> => {
    const res = await apiClient.delete<ApiEnvelope<Cart>>(`/cart/items/${id}`);
    return res.data.data;
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete("/cart");
  },

  mergeCart: async (items: Array<{ productId: string; quantity: number }>): Promise<Cart> => {
    const res = await apiClient.post<ApiEnvelope<Cart>>("/cart/merge", { items });
    return res.data.data;
  },
};
