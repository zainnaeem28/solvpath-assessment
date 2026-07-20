import { useDeferredValue, useEffect, useState, startTransition } from "react";
import { Select } from "@/components/atoms/Select";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { Pagination } from "@/components/molecules/Pagination";
import { DashboardTopBar } from "@/components/organisms/DashboardTopBar";
import { OrderCard } from "./OrderCard";
import { OrdersStatStrip } from "./OrdersStatStrip";
import { OrdersTable } from "./OrdersTable";
import { DashboardAside } from "./DashboardAside";
import { useOrders, type OrdersStatusFilter } from "../hooks/useOrders";
import { useOrderStats } from "../hooks/useOrderStats";
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

  const { stats, orders: allOrders, loading: statsLoading, error: statsError, retry: retryStats } =
    useOrderStats();

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
  const readyCount = stats.byStatus.shipped + stats.byStatus.processing;

  return (
    <section className="orders-dash">
      <DashboardTopBar query={queryInput} onQueryChange={setQueryInput} />

      {statsError ? (
        <ErrorBanner message={statsError} onRetry={retryStats} />
      ) : null}

      <OrdersStatStrip
        stats={stats}
        loading={statsLoading}
        active={status}
        onSelect={(key) => startTransition(() => setStatus(key))}
      />

      <div className="orders-dash__layout">
        <div className="orders-dash__main">
          <div className="orders-dash__panel">
            <div className="orders-dash__panel-head">
              <div>
                <h2>Order Stats</h2>
                <p>
                  {readyCount > 0
                    ? `${readyCount}+ orders still in progress`
                    : "Browse and manage your recent orders"}
                </p>
              </div>
              <Select
                id="status-filter"
                label="Filter by status"
                className="orders-dash__sort"
                value={status}
                options={STATUS_OPTIONS}
                onChange={(e) => {
                  startTransition(() => {
                    setStatus(e.target.value as OrdersStatusFilter);
                  });
                }}
              />
            </div>

            {error ? <ErrorBanner message={error} onRetry={retry} /> : null}

            {isLoading && orders.length === 0 ? (
              <div className="orders-dash__loading" aria-busy="true">
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
                actionLabel={
                  deferredQuery || status !== "all" ? "Clear filters" : undefined
                }
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
              <div className={isLoading ? "orders-dash__results--dim" : undefined}>
                <div className="orders-dash__table-wrap">
                  <OrdersTable orders={orders} />
                </div>
                <div className="orders-dash__cards-wrap">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
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
          </div>
        </div>

        <DashboardAside stats={stats} orders={allOrders} />
      </div>
    </section>
  );
}
