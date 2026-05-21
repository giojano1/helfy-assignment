import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useOrder } from "../features/account/hooks/useOrders";
import { OrderStatusTimeline } from "../features/account/components/OrderStatusTimeline";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { ErrorCard } from "../components/ui/ErrorCard";
import type { OrderStatus } from "../features/checkout/types";

const page = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

const statusColor: Record<OrderStatus, "yellow" | "blue" | "green" | "red" | "gray"> = {
  pending: "yellow",
  processing: "blue",
  shipped: "blue",
  delivered: "green",
  cancelled: "red",
};

function OrderDetailSkeleton() {
  return (
    <div>
      <Skeleton height="20px" className="mb-6 w-32" />
      <div className="mb-6 flex items-center justify-between">
        <Skeleton height="32px" className="w-48" />
        <Skeleton height="24px" className="w-20 rounded-full" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <Skeleton height="16px" className="mb-3 w-12" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
                <div className="flex flex-1 flex-col gap-1">
                  <Skeleton height="14px" className="w-3/4" />
                  <Skeleton height="12px" className="w-1/4" />
                </div>
                <Skeleton height="14px" className="w-16" />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <Skeleton height="16px" className="mb-2 w-32" />
            <Skeleton height="14px" className="w-2/3" />
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <Skeleton height="16px" className="mb-3 w-20" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton height="14px" className="w-16" />
                  <Skeleton height="14px" className="w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <Skeleton height="16px" className="mb-4 w-24" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton height="14px" className="w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError, refetch } = useOrder(id ?? "");

  if (isLoading) return <OrderDetailSkeleton />;

  if (isError) {
    return <ErrorCard message="Failed to load order." onRetry={() => void refetch()} />;
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
                        <img src={img.url} alt={item.product.name} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-1 text-sm text-text-primary">{item.product.name}</p>
                      <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-text-primary">${Number(item.total).toFixed(2)}</span>
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
                <span className="text-text-primary">${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Shipping</span>
                <span className="text-text-primary">${Number(order.shippingCost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Tax</span>
                <span className="text-text-primary">${Number(order.tax).toFixed(2)}</span>
              </div>
              <hr className="border-white/10" />
              <div className="flex justify-between font-semibold">
                <span className="text-text-primary">Total</span>
                <span className="text-text-primary">${Number(order.total).toFixed(2)}</span>
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
