import { useCategories } from "../hooks/useCategories";
import { Skeleton } from "../../../components/ui/Skeleton";
import type { ProductFilters as Filters } from "../types";

interface ProductFiltersProps {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
}

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  const { data: categories, isLoading } = useCategories();

  return (
    <aside className="flex flex-col gap-6">
      <div>
        <p className="mb-3 text-sm font-semibold text-text-primary">Category</p>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} height="20px" />)}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                checked={!filters.categoryId}
                onChange={() => onChange({ categoryId: undefined })}
                className="accent-brand-primary"
              />
              <span className="text-text-muted">All Categories</span>
            </label>
            {categories?.map((cat) => (
              <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="category"
                  checked={filters.categoryId === cat.id}
                  onChange={() => onChange({ categoryId: cat.id })}
                  className="accent-brand-primary"
                />
                <span className="text-text-muted">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-text-primary">Price Range</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) => onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <span className="text-text-muted">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) => onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>

      <div>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={filters.inStock ?? false}
            onChange={(e) => onChange({ inStock: e.target.checked || undefined })}
            className="accent-brand-primary"
          />
          <span className="text-sm text-text-muted">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}
