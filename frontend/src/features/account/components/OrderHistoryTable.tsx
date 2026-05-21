import { Link } from "react-router-dom";
import { Badge } from "../../../components/ui/Badge";
import type { Order, OrderStatus } from "../../checkout/types";

interface OrderHistoryTableProps {
  orders: Order[];
}

const statusColor: Record<OrderStatus, "yellow" | "blue" | "green" | "red" | "gray"> = {
  pending: "yellow",
  processing: "blue",
  shipped: "blue",
  delivered: "green",
  cancelled: "red",
};

export function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="px-4 py-3 text-left font-medium text-text-muted">Order</th>
            <th className="px-4 py-3 text-left font-medium text-text-muted">Date</th>
            <th className="px-4 py-3 text-left font-medium text-text-muted">Status</th>
            <th className="px-4 py-3 text-right font-medium text-text-muted">Total</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-white/5 transition-colors">
              <td className="px-4 py-3 font-mono text-text-primary">
                #{order.id.slice(0, 8).toUpperCase()}
              </td>
              <td className="px-4 py-3 text-text-muted">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <Badge color={statusColor[order.status]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right font-medium text-text-primary">
                ${order.total.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/account/orders/${order.id}`}
                  className="text-brand-primary hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
