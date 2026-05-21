import apiClient from "../../../lib/axios";
import type { CreateOrderDto, Order } from "../types";

interface ApiEnvelope<T> {
  success: true;
  data: T;
}

export const checkoutService = {
  createOrder: async (dto: CreateOrderDto): Promise<Order> => {
    const res = await apiClient.post<ApiEnvelope<Order>>("/orders", dto);
    return res.data.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const res = await apiClient.get<ApiEnvelope<Order>>(`/orders/${id}`);
    return res.data.data;
  },
};
