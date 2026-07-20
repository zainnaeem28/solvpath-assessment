import { useEffect, useState } from "react";
import {
  listOrders,
  type ListParams,
  type Order,
  type OrderStatus,
  type Page,
} from "@/api/mockApi";
import { useAbortController } from "@/hooks/useAbortController";
import { toUserMessage, withRetry } from "@/lib/apiClient";
import { PAGE_SIZE } from "../status";

export type OrdersStatusFilter = OrderStatus | "all";

export interface UseOrdersParams {
  page: number;
  status: OrdersStatusFilter;
  query: string;
}

export type OrdersLoadState =
  | { status: "idle" | "loading"; data: Page<Order> | null; error: null }
  | { status: "success"; data: Page<Order>; error: null }
  | { status: "error"; data: Page<Order> | null; error: string };

export function useOrders({ page, status, query }: UseOrdersParams) {
  const { nextSignal } = useAbortController();
  const [state, setState] = useState<OrdersLoadState>({
    status: "loading",
    data: null,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const signal = nextSignal();
    let active = true;

    setState((prev) => ({
      status: "loading",
      data: prev.data,
      error: null,
    }));

    const params: ListParams = {
      page,
      pageSize: PAGE_SIZE,
      status,
      query,
      signal,
    };

    withRetry(() => listOrders(params), { signal, retries: 2 })
      .then((data) => {
        if (!active) return;
        setState({ status: "success", data, error: null });
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState((prev) => ({
          status: "error",
          data: prev.data,
          error: toUserMessage(
            err,
            "We couldn't load your orders. Please try again.",
          ),
        }));
      });

    return () => {
      active = false;
    };
  }, [page, status, query, reloadKey, nextSignal]);

  return {
    ...state,
    retry: () => setReloadKey((k) => k + 1),
  };
}
