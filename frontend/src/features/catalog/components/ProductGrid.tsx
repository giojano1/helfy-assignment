import { Skeleton } from "../../../components/ui/Skeleton";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ProductCard } from "./ProductCard";
import type { Product } from "../types";
import { Package } from "lucide-react";

interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  onAddToCart?: (product: Product) => void;
}

export function ProductGrid({ products, isLoading, onAddToCart }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-square w-full" />
            <Skeleton height="16px" className="w-3/4" />
            <Skeleton height="12px" className="w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <EmptyState
        icon={<Package size={48} />}
        title="No products found"
        description="Try adjusting your filters or search query."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
