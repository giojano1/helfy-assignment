import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../features/cart/hooks/useCart";
import { CartItem } from "../features/cart/components/CartItem";
import { CartSummary } from "../features/cart/components/CartSummary";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";

const page = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

export default function CartPage() {
  const { items, totalPrice, isLoading } = useCart();

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-text-primary">Shopping Cart</h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-20 text-center">
            <ShoppingCart size={64} className="text-text-muted opacity-30" />
            <p className="text-xl font-semibold text-text-primary">Your cart is empty</p>
            <p className="text-text-muted">Browse our products and add something you love.</p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-white/10 bg-white/5 divide-y divide-white/10 px-5">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
            <div>
              <CartSummary subtotal={totalPrice} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
