import apiClient from "../../../lib/axios";
import type { ChangePasswordDto, UpdateProfileDto, UserProfile } from "../types";
import type { Order } from "../../checkout/types";

interface ApiEnvelope<T> {
  success: true;
  data: T;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedOrders {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface OrderListResponse {
  success: true;
  data: Order[];
  meta: PaginationMeta;
}

export const accountService = {
  getProfile: async (): Promise<UserProfile> => {
    const res = await apiClient.get<ApiEnvelope<UserProfile>>("/users/me");
    return res.data.data;
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<UserProfile> => {
    const res = await apiClient.patch<ApiEnvelope<UserProfile>>("/users/me", dto);
    return res.data.data;
  },

  changePassword: async (dto: ChangePasswordDto): Promise<void> => {
    await apiClient.patch("/users/me/password", dto);
  },

  getOrders: async (page = 1, limit = 10): Promise<PaginatedOrders> => {
    const res = await apiClient.get<OrderListResponse>("/orders", { params: { page, limit } });
    return {
      items: res.data.data,
      total: res.data.meta.total,
      page: res.data.meta.page,
      limit: res.data.meta.limit,
      totalPages: res.data.meta.totalPages,
    };
  },

  getOrder: async (id: string): Promise<Order> => {
    const res = await apiClient.get<ApiEnvelope<Order>>(`/orders/${id}`);
    return res.data.data;
  },
};
