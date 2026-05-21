import { Check, Clock } from "lucide-react";
import type { OrderStatus } from "../../checkout/types";

const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

const LABELS: Record<OrderStatus, string> = {
  pending: "Order Placed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

interface OrderStatusTimelineProps {
  status: OrderStatus;
}

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-brand-accent/30 bg-brand-accent/10 px-4 py-3">
        <Clock size={16} className="text-brand-accent" />
        <span className="text-sm text-brand-accent">Order Cancelled</span>
      </div>
    );
  }

  const currentIdx = STATUSES.indexOf(status);

  return (
    <div className="flex flex-col gap-0">
      {STATUSES.map((s, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  done
                    ? "bg-brand-primary text-white"
                    : "border-2 border-white/20 text-text-muted"
                }`}
              >
                {done ? <Check size={12} /> : i + 1}
              </div>
              {i < STATUSES.length - 1 && (
                <div className={`h-8 w-px ${done ? "bg-brand-primary" : "bg-white/20"}`} />
              )}
            </div>
            <div className="pb-6 pt-1">
              <p
                className={`text-sm font-medium ${
                  active ? "text-brand-primary" : done ? "text-text-primary" : "text-text-muted"
                }`}
              >
                {LABELS[s]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
