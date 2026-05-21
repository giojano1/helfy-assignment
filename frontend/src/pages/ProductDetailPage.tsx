import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useProduct } from "../features/catalog/hooks/useProduct";
import { useAddToCart } from "../features/cart/hooks/useAddToCart";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Rating } from "../components/ui/Rating";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Skeleton } from "../components/ui/Skeleton";

const page = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug ?? "");
  const { mutate: addToCart, isPending } = useAddToCart();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-12 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-4">
            <Skeleton height="32px" className="w-3/4" />
            <Skeleton height="20px" className="w-1/2" />
            <Skeleton height="48px" className="w-1/3" />
            <Skeleton height="120px" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Product not found.</p>
      </div>
    );
  }

  const images = product.images.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
  const currentImage = images[imgIdx];
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: product.category?.name ?? "", href: `/products?categoryId=${product.categoryId}` },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {currentImage ? (
                <img
                  src={currentImage.url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-text-muted">No image</div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setImgIdx(i)}
                    className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                      i === imgIdx ? "border-brand-primary" : "border-white/10"
                    }`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <Link
                to={`/products?categoryId=${product.categoryId}`}
                className="text-sm text-brand-primary hover:underline"
              >
                {product.category?.name}
              </Link>
              <h1 className="mt-1 text-3xl font-bold text-text-primary">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <Rating value={product.rating} />
              <span className="text-sm text-text-muted">{product.reviewCount} reviews</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-text-primary">${Number(product.price).toFixed(2)}</span>
              {product.comparePrice && (
                <span className="text-lg text-text-muted line-through">${Number(product.comparePrice).toFixed(2)}</span>
              )}
              {product.comparePrice && (
                <Badge color="green">
                  {Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)}% off
                </Badge>
              )}
            </div>

            <Badge color={isOutOfStock ? "red" : "green"}>
              {isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}
            </Badge>

            <p className="text-sm text-text-muted leading-relaxed">{product.description}</p>

            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-white/10">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-text-muted hover:text-text-primary"
                  >
                    −
                  </button>
                  <span className="min-w-[2.5rem] text-center text-sm font-medium text-text-primary">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 text-text-muted hover:text-text-primary"
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={() => addToCart({ productId: product.id, quantity: qty })}
                  isLoading={isPending}
                  leftIcon={<ShoppingCart size={16} />}
                  className="flex-1"
                >
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
