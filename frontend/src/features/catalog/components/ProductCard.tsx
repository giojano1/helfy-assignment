import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Rating } from "../../../components/ui/Rating";
import { Badge } from "../../../components/ui/Badge";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all hover:border-brand-primary/30 hover:bg-white/8">
      <Link to={`/products/${product.slug}`} className="relative aspect-square overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5 text-text-muted">
            No image
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge color="red">Out of Stock</Badge>
          </div>
        )}
        {product.comparePrice && !isOutOfStock && (
          <Badge color="green" className="absolute left-2 top-2">
            Sale
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/products/${product.slug}`} className="line-clamp-2 text-sm font-medium text-text-primary hover:text-brand-primary transition-colors">
          {product.name}
        </Link>

        <div className="flex items-center gap-1.5">
          <Rating value={product.rating} />
          <span className="text-xs text-text-muted">({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-text-primary">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-xs text-text-muted line-through">${product.comparePrice.toFixed(2)}</span>
            )}
          </div>

          <button
            disabled={isOutOfStock}
            onClick={() => onAddToCart?.(product)}
            className="rounded-lg bg-brand-primary/20 p-2 text-brand-primary transition-colors hover:bg-brand-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
