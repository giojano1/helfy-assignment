import { motion } from "framer-motion";
import { useState } from "react";
import { Package } from "lucide-react";
import { useOrders } from "../features/account/hooks/useOrders";
import { OrderHistoryTable } from "../features/account/components/OrderHistoryTable";
import { Pagination } from "../components/ui/Pagination";
import { EmptyState } from "../components/ui/EmptyState";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

const page = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useOrders(currentPage);

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
      <h1 className="mb-6 text-2xl font-bold text-text-primary">Order History</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
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
