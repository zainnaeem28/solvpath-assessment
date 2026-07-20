import { useEffect, useMemo, useState } from "react";
import { listOrders, type Order, type OrderStatus } from "@/api/mockApi";
import { useAbortController } from "@/hooks/useAbortController";
import { toUserMessage, withRetry } from "@/lib/apiClient";
import { orderTotalCents } from "@/lib/format";
import { STATUS_LABELS } from "../status";

export interface DashboardMetrics {
  totalOrders: number;
  delivered: number;
  inTransit: number;
  processing: number;
  cancelled: number;
  returnReady: number;
  spendCents: number;
}

export interface StatusSlice {
  key: OrderStatus;
  name: string;
  value: number;
  fill: string;
}

export interface SpendPoint {
  month: string;
  spend: number;
  orders: number;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  delivered: "#127A3B",
  shipped: "#1D4ED8",
  processing: "#B45309",
  cancelled: "#B91C1C",
};

function buildMetrics(orders: Order[]): DashboardMetrics {
  const metrics: DashboardMetrics = {
    totalOrders: orders.length,
    delivered: 0,
    inTransit: 0,
    processing: 0,
    cancelled: 0,
    returnReady: 0,
    spendCents: 0,
  };

  for (const order of orders) {
    metrics.spendCents += orderTotalCents(order.items);
    if (order.status === "delivered") {
      metrics.delivered += 1;
      metrics.returnReady += 1;
    } else if (order.status === "shipped") {
      metrics.inTransit += 1;
    } else if (order.status === "processing") {
      metrics.processing += 1;
    } else if (order.status === "cancelled") {
      metrics.cancelled += 1;
    }
  }

  return metrics;
}

function buildStatusSlices(orders: Order[]): StatusSlice[] {
  const counts: Record<OrderStatus, number> = {
    delivered: 0,
    shipped: 0,
    processing: 0,
    cancelled: 0,
  };
  for (const order of orders) counts[order.status] += 1;

  return (Object.keys(counts) as OrderStatus[])
    .map((key) => ({
      key,
      name: STATUS_LABELS[key],
      value: counts[key],
      fill: STATUS_COLORS[key],
    }))
    .filter((slice) => slice.value > 0);
}

function buildSpendSeries(orders: Order[]): SpendPoint[] {
  const buckets = new Map<
    string,
    { label: string; spend: number; orders: number }
  >();

  for (const order of orders) {
    const date = new Date(`${order.placedAt}T12:00:00`);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "2-digit",
    }).format(date);
    const current = buckets.get(key) ?? { label, spend: 0, orders: 0 };
    current.spend += orderTotalCents(order.items) / 100;
    current.orders += 1;
    buckets.set(key, current);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, row]) => ({
      month: row.label,
      spend: Math.round(row.spend * 100) / 100,
      orders: row.orders,
    }));
}

export function useOrderDashboard() {
  const { nextSignal } = useAbortController();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const signal = nextSignal();
    let active = true;
    setLoading(true);
    setError(null);

    withRetry(
      () => listOrders({ page: 1, pageSize: 100, status: "all", query: "", signal }),
      { signal, retries: 2 },
    )
      .then((page) => {
        if (!active) return;
        setOrders(page.data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(toUserMessage(err, "We couldn't load dashboard insights."));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [nextSignal, reloadKey]);

  const metrics = useMemo(() => buildMetrics(orders), [orders]);
  const statusSlices = useMemo(() => buildStatusSlices(orders), [orders]);
  const spendSeries = useMemo(() => buildSpendSeries(orders), [orders]);

  return {
    orders,
    metrics,
    statusSlices,
    spendSeries,
    loading,
    error,
    retry: () => setReloadKey((k) => k + 1),
  };
}
