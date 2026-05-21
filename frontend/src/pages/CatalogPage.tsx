import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../features/catalog/hooks/useProducts";
import { ProductGrid } from "../features/catalog/components/ProductGrid";
import { ProductFilters } from "../features/catalog/components/ProductFilters";
import { ProductSearch } from "../features/catalog/components/ProductSearch";
import { SortDropdown } from "../features/catalog/components/SortDropdown";
import { Pagination } from "../components/ui/Pagination";
import { useAddToCart } from "../features/cart/hooks/useAddToCart";
import type { ProductFilters as Filters } from "../features/catalog/types";
import type { Product } from "../features/catalog/types";

const page = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

function useFiltersFromUrl(): [Filters, (patch: Partial<Filters>) => void] {
  const [params, setParams] = useSearchParams();

  const filters: Filters = {
    q: params.get("q") ?? undefined,
    categoryId: params.get("categoryId") ?? undefined,
    minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
    inStock: params.get("inStock") === "true" ? true : undefined,
    sort: (params.get("sort") as Filters["sort"]) ?? undefined,
    order: (params.get("order") as Filters["order"]) ?? undefined,
    page: params.get("page") ? Number(params.get("page")) : 1,
    limit: 16,
  };

  const update = useCallback(
    (patch: Partial<Filters>) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(patch).forEach(([k, v]) => {
          if (v === undefined || v === null) {
            next.delete(k);
          } else {
            next.set(k, String(v));
          }
        });
        if (patch.q !== undefined || Object.keys(patch).some((k) => k !== "page")) {
          next.delete("page");
        }
        return next;
      });
    },
    [setParams],
  );

  return [filters, update];
}

export default function CatalogPage() {
  const [filters, updateFilters] = useFiltersFromUrl();
  const { data, isLoading } = useProducts(filters);
  const { mutate: addToCart } = useAddToCart();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    addToCart({ productId: product.id, quantity: 1 });
  };

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-text-primary">All Products</h1>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-60">
            <ProductSearch
              value={filters.q ?? ""}
              onChange={(q) => updateFilters({ q: q || undefined })}
            />
          </div>
          <SortDropdown
            sort={filters.sort}
            order={filters.order}
            onChange={(sort, order) => updateFilters({ sort, order })}
          />
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-text-muted transition-colors hover:bg-white/10 md:hidden"
          >
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          <div className={`${filtersOpen ? "block" : "hidden"} w-56 shrink-0 md:block`}>
            <ProductFilters filters={filters} onChange={updateFilters} />
          </div>

          <div className="flex-1 min-w-0">
            <ProductGrid
              products={data?.items}
              isLoading={isLoading}
              onAddToCart={handleAddToCart}
            />

            {data && data.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onPageChange={(p) => updateFilters({ page: p })}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
