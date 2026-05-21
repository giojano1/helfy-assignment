import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useUpdateCartItem } from "../hooks/useUpdateCartItem";
import { useRemoveCartItem } from "../hooks/useRemoveCartItem";
import type { CartItem as CartItemType } from "../types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { mutate: updateQty } = useUpdateCartItem();
  const { mutate: remove } = useRemoveCartItem();
  const image = item.product.images.find((i) => i.isPrimary) ?? item.product.images[0];

  return (
    <div className="flex gap-3 py-3">
      <Link to={`/products/${item.product.slug}`} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
        {image && <img src={image.url} alt={item.product.name} className="h-full w-full object-cover" />}
      </Link>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <Link
          to={`/products/${item.product.slug}`}
          className="line-clamp-1 text-sm font-medium text-text-primary hover:text-brand-primary transition-colors"
        >
          {item.product.name}
        </Link>
        <span className="text-xs text-text-muted">${item.price.toFixed(2)} each</span>

        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-center rounded-lg border border-white/10">
            <button
              onClick={() => updateQty({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
              className="px-2 py-1 text-text-muted hover:text-text-primary text-sm"
            >
              −
            </button>
            <span className="min-w-[1.5rem] text-center text-sm text-text-primary">{item.quantity}</span>
            <button
              onClick={() => updateQty({ id: item.id, quantity: item.quantity + 1 })}
              className="px-2 py-1 text-text-muted hover:text-text-primary text-sm"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => remove(item.id)}
              className="rounded p-1 text-text-muted transition-colors hover:bg-brand-accent/20 hover:text-brand-accent"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
