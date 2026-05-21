import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../services/catalog.service";
import type { ProductFilters } from "../types";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => catalogService.getProducts(filters),
  });
}
