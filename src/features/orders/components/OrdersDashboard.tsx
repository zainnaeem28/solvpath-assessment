import { useDeferredValue, useEffect, useState, startTransition } from "react";
import { Select } from "@/components/atoms/Select";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { Pagination } from "@/components/molecules/Pagination";
import { SearchField } from "@/components/molecules/SearchField";
import { useAuthStore } from "@/features/auth/store/authStore";
import { OrderCard } from "./OrderCard";
import { OrdersStatStrip } from "./OrdersStatStrip";
import { OrdersTable } from "./OrdersTable";
import { useOrders, type OrdersStatusFilter } from "../hooks/useOrders";
import { useOrderStats } from "../hooks/useOrderStats";
import { PAGE_SIZE, STATUS_LABELS } from "../status";
import type { OrderStatus } from "@/api/mockApi";
import "./OrdersDashboard.css";

const STATUS_OPTIONS = (Object.keys(STATUS_LABELS) as Array<OrderStatus | "all">).map(
  (value) => ({ value, label: STATUS_LABELS[value] }),
);

export function OrdersDashboard() {
  const user = useAuthStore((s) => s.user);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrdersStatusFilter>("all");
  const [queryInput, setQueryInput] = useState("");
  const deferredQuery = useDeferredValue(queryInput.trim());

  const { stats, loading: statsLoading, error: statsError, retry: retryStats } =
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
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <section className="orders-dash">
      <header className="orders-dash__hero">
        <div>
          <p className="orders-dash__eyebrow">Orders dashboard</p>
          <h1 className="orders-dash__title">Welcome back, {firstName}</h1>
          <p className="orders-dash__subtitle">
            Track deliveries, filter by status, and start returns on delivered orders —
            all in one place.
          </p>
        </div>
        <div className="orders-dash__hero-panel" aria-hidden>
          <span className="orders-dash__hero-kicker">Self-service</span>
          <strong>{stats.returnReady}</strong>
          <span>orders ready for return or exchange</span>
        </div>
      </header>

      {statsError ? (
        <ErrorBanner message={statsError} onRetry={retryStats} />
      ) : null}

      <OrdersStatStrip
        stats={stats}
        loading={statsLoading}
        active={status}
        onSelect={(key) => {
          startTransition(() => setStatus(key));
        }}
      />

      <div className="orders-dash__panel">
        <div className="orders-dash__panel-head">
          <div>
            <h2 className="orders-dash__panel-title">Order activity</h2>
            <p className="orders-dash__panel-copy">
              Search by order number or product, then page through results.
            </p>
          </div>
          <div className="orders-dash__toolbar">
            <SearchField
              value={queryInput}
              onChange={setQueryInput}
              placeholder="Search order # or product"
              label="Search orders"
            />
            <Select
              id="status-filter"
              label="Filter by status"
              className="orders-dash__status"
              value={status}
              options={STATUS_OPTIONS}
              onChange={(e) => {
                startTransition(() => {
                  setStatus(e.target.value as OrdersStatusFilter);
                });
              }}
            />
          </div>
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
    </section>
  );
}
