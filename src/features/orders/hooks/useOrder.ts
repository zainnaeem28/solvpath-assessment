import { useEffect, useState } from "react";
import { ApiError, getOrder, type Order } from "@/api/mockApi";
import { useAbortController } from "@/hooks/useAbortController";

export type OrderDetailState =
  | { status: "loading"; order: null; error: null }
  | { status: "success"; order: Order; error: null }
  | { status: "error"; order: null; error: string };

export function useOrder(orderId: string | undefined) {
  const { nextSignal } = useAbortController();
  const [state, setState] = useState<OrderDetailState>({
    status: "loading",
    order: null,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setState({
        status: "error",
        order: null,
        error: "Missing order id.",
      });
      return;
    }

    const signal = nextSignal();
    let active = true;
    setState({ status: "loading", order: null, error: null });

    getOrder(orderId, signal)
      .then((order) => {
        if (!active) return;
        setState({ status: "success", order, error: null });
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message =
          err instanceof ApiError
            ? err.message
            : "We couldn't load that order.";
        setState({ status: "error", order: null, error: message });
      });

    return () => {
      active = false;
    };
  }, [orderId, reloadKey, nextSignal]);

  return {
    ...state,
    retry: () => setReloadKey((k) => k + 1),
  };
}
