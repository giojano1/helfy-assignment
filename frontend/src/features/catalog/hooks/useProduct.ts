import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../services/catalog.service";

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => catalogService.getProductBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: catalogService.getFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  });
}
