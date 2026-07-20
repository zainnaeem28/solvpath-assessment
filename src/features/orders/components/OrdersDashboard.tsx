import { useDeferredValue, useEffect, useState, startTransition } from "react";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { Pagination } from "@/components/molecules/Pagination";
import { SearchField } from "@/components/molecules/SearchField";
import { OrderCard } from "./OrderCard";
import { OrderSkeleton } from "./OrderSkeleton";
import { StatusChips } from "./StatusChips";
import { useOrders, type OrdersStatusFilter } from "../hooks/useOrders";
import { PAGE_SIZE } from "../status";
import "./OrdersDashboard.css";

export function OrdersDashboard() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrdersStatusFilter>("all");
  const [queryInput, setQueryInput] = useState("");
  const deferredQuery = useDeferredValue(queryInput.trim());

  useEffect(() => {
    setPage(1);
  }, [status, deferredQuery]);

  const { status: loadStatus, data, error, retry } = useOrders({
    page,
    status,
    query: deferredQuery,
  });

  const isLoading = loadStatus === "loading";
  const orders = data?.data ?? [];
  const total = data?.total ?? 0;
  const showSkeleton = isLoading && orders.length === 0 && !error;

  return (
    <section className="orders">
      <header className="orders__intro">
        <h1>Your orders</h1>
        <p>
          Track deliveries and start a return or exchange once an order is delivered.
        </p>
      </header>

      <div className="orders__controls">
        <SearchField
          value={queryInput}
          onChange={setQueryInput}
          placeholder="Search by order number or product"
          label="Search orders"
        />
        <StatusChips
          value={status}
          disabled={isLoading && orders.length === 0}
          onChange={(next) => startTransition(() => setStatus(next))}
        />
      </div>

      {error ? (
        <ErrorBanner
          title="Couldn't load orders"
          message={error}
          onRetry={retry}
        />
      ) : null}

      {showSkeleton ? <OrderSkeleton count={3} /> : null}

      {isLoading && orders.length > 0 ? (
        <p className="orders__refreshing" aria-live="polite">
          <Spinner size="sm" label="Updating" /> Updating results…
        </p>
      ) : null}

      {!isLoading && !error && orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description={
            deferredQuery || status !== "all"
              ? "Try a different search or clear the status filter."
              : "Orders you place will show up here."
          }
          actionLabel={deferredQuery || status !== "all" ? "Clear filters" : undefined}
          onAction={
            deferredQuery || status !== "all"
              ? () => {
                  setQueryInput("");
                  setStatus("all");
                }
              : undefined
          }
        />
      ) : null}

      {orders.length > 0 ? (
        <div className={`orders__list${isLoading ? " orders__list--dim" : ""}`}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : null}

      {total > 0 ? (
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
          disabled={isLoading}
        />
      ) : null}
    </section>
  );
}
