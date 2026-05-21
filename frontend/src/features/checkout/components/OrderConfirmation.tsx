import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useCheckoutStore } from "../store/checkoutStore";
import { Button } from "../../../components/ui/Button";

export function OrderConfirmation() {
  const { placedOrder, reset } = useCheckoutStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6 py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <CheckCircle size={72} className="text-green-400" />
      </motion.div>

      <div>
        <h2 className="text-2xl font-bold text-text-primary">Order Placed!</h2>
        <p className="mt-2 text-text-muted">
          Thank you for your purchase. We&apos;ll get it shipped soon.
        </p>
        {placedOrder && (
          <p className="mt-2 text-sm text-text-muted">
            Order #{placedOrder.id.slice(0, 8).toUpperCase()}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        {placedOrder && (
          <Link to={`/account/orders/${placedOrder.id}`}>
            <Button variant="secondary">View Order</Button>
          </Link>
        )}
        <Link to="/" onClick={reset}>
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </motion.div>
  );
}
