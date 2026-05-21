import { motion } from "framer-motion";
import { useState } from "react";
import { Package } from "lucide-react";
import { useOrders } from "../features/account/hooks/useOrders";
import { OrderHistoryTable } from "../features/account/components/OrderHistoryTable";
import { Pagination } from "../components/ui/Pagination";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { ErrorCard } from "../components/ui/ErrorCard";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

const page = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

function OrdersTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {["Order", "Date", "Status", "Total", ""].map((h) => (
              <th key={h} className="px-4 py-3 text-left font-medium text-text-muted">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              <td className="px-4 py-3"><Skeleton height="16px" className="w-24" /></td>
              <td className="px-4 py-3"><Skeleton height="16px" className="w-20" /></td>
              <td className="px-4 py-3"><Skeleton height="20px" className="w-20 rounded-full" /></td>
              <td className="px-4 py-3"><Skeleton height="16px" className="w-16" /></td>
              <td className="px-4 py-3"><Skeleton height="16px" className="w-10" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, refetch } = useOrders(currentPage);

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
      <h1 className="mb-6 text-2xl font-bold text-text-primary">Order History</h1>

      {isLoading ? (
        <OrdersTableSkeleton />
      ) : isError ? (
        <ErrorCard message="Failed to load orders." onRetry={() => void refetch()} />
      ) : !data?.items.length ? (
        <EmptyState
          icon={<Package size={48} />}
          title="No orders yet"
          description="When you place an order, it will appear here."
          action={
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          <OrderHistoryTable orders={data.items} />
          {data.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                page={currentPage}
                totalPages={data.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
