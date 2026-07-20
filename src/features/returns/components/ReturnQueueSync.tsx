import { useEffect } from "react";
import { flushReturnQueue } from "@/features/returns/lib/flushQueue";

/** Flushes the offline/failed return queue on mount and whenever we come back online. */
export function ReturnQueueSync() {
  useEffect(() => {
    void flushReturnQueue();

    const onOnline = () => {
      void flushReturnQueue();
    };

    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);

  return null;
}
