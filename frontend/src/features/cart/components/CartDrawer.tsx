import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useCart } from "../hooks/useCart";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const close = useCartStore((s) => s.closeDrawer);
  const { items, totalPrice, isLoading } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#0F0F1A] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="text-lg font-semibold text-text-primary">Your Cart</h2>
              <button
                onClick={close}
                className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <ShoppingCart size={48} className="text-text-muted opacity-40" />
                  <p className="font-medium text-text-primary">Your cart is empty</p>
                  <p className="text-sm text-text-muted">Add some products to get started.</p>
                  <Link to="/products" onClick={close}>
                    <Button variant="secondary" size="sm">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/10 p-5">
                <CartSummary subtotal={totalPrice} onClose={close} />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
