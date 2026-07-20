import { useEffect, useState } from "react";
import { listOrders, type Order } from "@/api/mockApi";
import { useAbortController } from "@/hooks/useAbortController";
import { toUserMessage, withRetry } from "@/lib/apiClient";

export type CatalogLoadState =
  | { status: "idle" | "loading"; orders: Order[]; error: null }
  | { status: "success"; orders: Order[]; error: null }
  | { status: "error"; orders: Order[]; error: string };

/**
 * Single catalog fetch for the orders home page (overview + list).
 * Avoids a second listOrders round-trip for dashboard metrics.
 */
export function useOrderCatalog() {
  const { nextSignal } = useAbortController();
  const [state, setState] = useState<CatalogLoadState>({
    status: "loading",
    orders: [],
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const signal = nextSignal();
    let active = true;

    setState((prev) => ({
      status: "loading",
      orders: prev.orders,
      error: null,
    }));

    withRetry(
      () =>
        listOrders({
          page: 1,
          pageSize: 100,
          status: "all",
          query: "",
          signal,
        }),
      { signal, retries: 2 },
    )
      .then((page) => {
        if (!active) return;
        setState({ status: "success", orders: page.data, error: null });
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState((prev) => ({
          status: "error",
          orders: prev.orders,
          error: toUserMessage(err, "We couldn't load your orders. Please try again."),
        }));
      });

    return () => {
      active = false;
    };
  }, [nextSignal, reloadKey]);

  return {
    ...state,
    loading: state.status === "loading",
    retry: () => setReloadKey((k) => k + 1),
  };
}
