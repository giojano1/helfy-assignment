import apiClient from "../../../lib/axios";
import type { Category, Product, ProductFilters } from "../types";

interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiEnvelope<T> {
  success: true;
  data: T;
}

export const catalogService = {
  getProducts: async (filters: ProductFilters = {}): Promise<PaginatedProducts> => {
    const res = await apiClient.get<ApiEnvelope<PaginatedProducts>>("/products", {
      params: filters,
    });
    return res.data.data;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const res = await apiClient.get<ApiEnvelope<Product>>(`/products/${slug}`);
    return res.data.data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const res = await apiClient.get<ApiEnvelope<Product[]>>("/products/featured");
    return res.data.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get<ApiEnvelope<Category[]>>("/categories");
    return res.data.data;
  },
};
