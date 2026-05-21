import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useOrder } from "../features/account/hooks/useOrders";
import { OrderStatusTimeline } from "../features/account/components/OrderStatusTimeline";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import type { OrderStatus } from "../features/checkout/types";

const page = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

const statusColor: Record<OrderStatus, "yellow" | "blue" | "green" | "red" | "gray"> = {
  pending: "yellow",
  processing: "blue",
  shipped: "blue",
  delivered: "green",
  cancelled: "red",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id ?? "");

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-text-muted">Order not found.</p>;
  }

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
      <Link to="/account/orders" className="mb-6 flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors">
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </h1>
        <Badge color={statusColor[order.status]}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-3 text-sm font-semibold text-text-primary">Items</p>
            <div className="flex flex-col gap-3">
              {order.items.map((item) => {
                const img = item.product.images.find((i) => i.isPrimary) ?? item.product.images[0];
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    {img && (
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                        <img src={img.url} alt={item.product.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-1 text-sm text-text-primary">{item.product.name}</p>
                      <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-text-primary">${item.total.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 text-sm font-semibold text-text-primary">Shipping Address</p>
            <p className="text-sm text-text-muted">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.country} {order.shippingAddress.zip}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-3 text-sm font-semibold text-text-primary">Summary</p>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-text-primary">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Shipping</span>
                <span className="text-text-primary">${order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Tax</span>
                <span className="text-text-primary">${order.tax.toFixed(2)}</span>
              </div>
              <hr className="border-white/10" />
              <div className="flex justify-between font-semibold">
                <span className="text-text-primary">Total</span>
                <span className="text-text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="mb-4 text-sm font-semibold text-text-primary">Order Status</p>
          <OrderStatusTimeline status={order.status} />
        </div>
      </div>
    </motion.div>
  );
}
