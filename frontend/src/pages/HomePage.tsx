import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useFeaturedProducts } from "../features/catalog/hooks/useProduct";
import { useCategories } from "../features/catalog/hooks/useCategories";
import { ProductGrid } from "../features/catalog/components/ProductGrid";
import { ErrorCard } from "../components/ui/ErrorCard";
import { useAddToCart } from "../features/cart/hooks/useAddToCart";
import type { Product } from "../features/catalog/types";

const page = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

export default function HomePage() {
  const { data: featured, isLoading, isError, refetch } = useFeaturedProducts();
  const { data: categories } = useCategories();
  const { mutate: addToCart } = useAddToCart();

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      quantity: 1,
      productSnapshot: {
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        images: product.images,
      },
    });
  };

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
      <section className="relative overflow-hidden bg-brand-gradient px-4 py-24 text-center">
        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold text-white md:text-6xl">
            Shop the future,<br />delivered today.
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Premium products for the modern lifestyle.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-primary transition-transform hover:scale-105"
          >
            Browse Products <ArrowRight size={16} />
          </Link>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent)]" />
      </section>

      {categories && categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="mb-8 text-2xl font-bold text-text-primary">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-colors hover:border-brand-primary/40 hover:bg-white/8"
              >
                <span className="font-medium text-text-primary group-hover:text-brand-primary transition-colors">
                  {cat.name}
                </span>
                <ArrowRight size={16} className="text-text-muted group-hover:text-brand-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-8 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary">Featured Products</h2>
          <Link to="/products" className="text-sm text-brand-primary hover:underline">
            View all
          </Link>
        </div>
        {isError ? (
          <ErrorCard
            message="Failed to load featured products."
            onRetry={() => void refetch()}
          />
        ) : (
          <ProductGrid
            products={featured}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
          />
        )}
      </section>
    </motion.div>
  );
}
