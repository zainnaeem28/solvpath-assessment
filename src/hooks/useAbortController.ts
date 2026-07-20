import { useCallback, useEffect, useRef } from "react";

/** Stable AbortController helper — abort previous request on deps change / unmount. */
export function useAbortController() {
  const controllerRef = useRef<AbortController | null>(null);

  const nextSignal = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    return controllerRef.current.signal;
  }, []);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return { nextSignal };
}
