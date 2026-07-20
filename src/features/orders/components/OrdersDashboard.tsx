import { useEffect, useMemo, useState, startTransition } from "react";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { Pagination } from "@/components/molecules/Pagination";
import { SearchField } from "@/components/molecules/SearchField";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { OrderCard } from "./OrderCard";
import { OrderSkeleton } from "./OrderSkeleton";
import { OrdersOverview } from "./OrdersOverview";
import { StatusChips } from "./StatusChips";
import { useOrderCatalog } from "../hooks/useOrderCatalog";
import { buildMetrics, buildSpendSeries, buildStatusSlices } from "../lib/dashboard";
import { filterAndPaginateOrders, type OrdersStatusFilter } from "../lib/filterOrders";
import { PAGE_SIZE } from "../status";
import "./OrdersDashboard.css";

export function OrdersDashboard() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrdersStatusFilter>("all");
  const [queryInput, setQueryInput] = useState("");
  const debouncedQuery = useDebouncedValue(queryInput.trim(), 300);

  const {
    orders: catalog,
    loading: catalogLoading,
    error,
    retry,
    status: catalogStatus,
  } = useOrderCatalog();

  useEffect(() => {
    setPage(1);
  }, [status, debouncedQuery]);

  const metrics = useMemo(() => buildMetrics(catalog), [catalog]);
  const statusSlices = useMemo(() => buildStatusSlices(catalog), [catalog]);
  const spendSeries = useMemo(() => buildSpendSeries(catalog), [catalog]);

  const pageResult = useMemo(
    () =>
      filterAndPaginateOrders(catalog, {
        page,
        pageSize: PAGE_SIZE,
        status,
        query: debouncedQuery,
      }),
    [catalog, page, status, debouncedQuery],
  );

  const isLoading = catalogLoading;
  const orders = pageResult.data;
  const total = pageResult.total;
  const showSkeleton = isLoading && catalog.length === 0 && !error;
  const listRefreshing = isLoading && catalog.length > 0;
  const hasActiveFilters = Boolean(debouncedQuery) || status !== "all";

  const setFilter = (next: OrdersStatusFilter) => {
    startTransition(() => setStatus(next));
    const list = document.getElementById("orders-list");
    list?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="orders-page">
      <OrdersOverview
        metrics={metrics}
        statusSlices={statusSlices}
        spendSeries={spendSeries}
        loading={isLoading && catalogStatus !== "success"}
        error={error}
        onRetry={retry}
        onFilterStatus={setFilter}
      />

      <section className="orders" id="orders-list" aria-label="Order list">
        <header className="orders__intro">
          <h2>Your Orders</h2>
          <p>Search, filter, and open a return on delivered orders.</p>
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
            disabled={isLoading && catalog.length === 0}
            onChange={setFilter}
          />
        </div>

        {error ? (
          <ErrorBanner title="Couldn't load orders" message={error} onRetry={retry} />
        ) : null}

        {showSkeleton ? <OrderSkeleton count={3} /> : null}

        {listRefreshing ? (
          <p className="orders__refreshing" aria-live="polite">
            <Spinner size="sm" label="Updating" /> Updating results…
          </p>
        ) : null}

        {!isLoading && !error && orders.length === 0 ? (
          <EmptyState
            title="No Orders Found"
            description={
              hasActiveFilters
                ? "Try a different search or clear the status filter."
                : "Orders you place will show up here."
            }
            actionLabel={hasActiveFilters ? "Clear filters" : undefined}
            onAction={
              hasActiveFilters
                ? () => {
                    setQueryInput("");
                    setStatus("all");
                  }
                : undefined
            }
          />
        ) : null}

        {orders.length > 0 ? (
          <div className={`orders__list${listRefreshing ? " orders__list--dim" : ""}`}>
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
    </div>
  );
}
