import { useDeferredValue, useEffect, useState, startTransition } from "react";
import { Select } from "@/components/atoms/Select";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { Pagination } from "@/components/molecules/Pagination";
import { SearchField } from "@/components/molecules/SearchField";
import { OrderCard } from "./OrderCard";
import { useOrders, type OrdersStatusFilter } from "../hooks/useOrders";
import { PAGE_SIZE, STATUS_LABELS } from "../status";
import type { OrderStatus } from "@/api/mockApi";
import "./OrdersDashboard.css";

const STATUS_OPTIONS = (Object.keys(STATUS_LABELS) as Array<OrderStatus | "all">).map(
  (value) => ({ value, label: STATUS_LABELS[value] }),
);

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

  return (
    <section className="orders">
      <header className="orders__intro">
        <p className="orders__eyebrow">Your account</p>
        <h1 className="orders__title">Orders</h1>
        <p className="orders__subtitle">
          Track purchases and start a return or exchange on delivered orders.
        </p>
      </header>

      <div className="orders__toolbar">
        <SearchField
          value={queryInput}
          onChange={setQueryInput}
          placeholder="Search by order number or product"
          label="Search orders"
        />
        <Select
          id="status-filter"
          label="Filter by status"
          className="orders__status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(e) => {
            startTransition(() => {
              setStatus(e.target.value as OrdersStatusFilter);
            });
          }}
        />
      </div>

      {error ? (
        <ErrorBanner message={error} onRetry={retry} />
      ) : null}

      {isLoading && orders.length === 0 ? (
        <div className="orders__loading" aria-busy="true">
          <Spinner label="Loading orders" />
          <p>Fetching your orders…</p>
        </div>
      ) : null}

      {!isLoading && !error && orders.length === 0 ? (
        <EmptyState
          title="No orders match"
          description={
            deferredQuery || status !== "all"
              ? "Try clearing search or choosing a different status."
              : "When you place an order, it will show up here."
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
