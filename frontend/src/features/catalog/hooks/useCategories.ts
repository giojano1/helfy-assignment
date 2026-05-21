import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../services/catalog.service";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: catalogService.getCategories,
    staleTime: 5 * 60 * 1000,
  });
}
