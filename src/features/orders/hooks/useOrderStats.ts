import { useEffect, useMemo, useState } from "react";
import {
  ApiError,
  listOrders,
  type Order,
  type OrderStatus,
} from "@/api/mockApi";
import { useAbortController } from "@/hooks/useAbortController";
import { orderTotalCents } from "@/lib/format";

export interface OrderStats {
  total: number;
  byStatus: Record<OrderStatus, number>;
  returnReady: number;
  spendCents: number;
}

const EMPTY: OrderStats = {
  total: 0,
  byStatus: {
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  },
  returnReady: 0,
  spendCents: 0,
};

function computeStats(orders: Order[]): OrderStats {
  const byStatus: OrderStats["byStatus"] = {
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  let returnReady = 0;
  let spendCents = 0;

  for (const order of orders) {
    byStatus[order.status] += 1;
    spendCents += orderTotalCents(order.items);
    if (order.status === "delivered") returnReady += 1;
  }

  return {
    total: orders.length,
    byStatus,
    returnReady,
    spendCents,
  };
}

export function useOrderStats() {
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

    listOrders({ page: 1, pageSize: 100, status: "all", query: "", signal })
      .then((page) => {
        if (!active) return;
        setOrders(page.data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof ApiError
            ? err.message
            : "We couldn't load dashboard summary.",
        );
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [nextSignal, reloadKey]);

  const stats = useMemo(() => (orders.length ? computeStats(orders) : EMPTY), [orders]);

  return {
    stats,
    orders,
    loading,
    error,
    retry: () => setReloadKey((k) => k + 1),
  };
}
