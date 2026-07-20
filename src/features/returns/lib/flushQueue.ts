import { ApiError, submitReturn } from "@/api/mockApi";
import { readReturnQueue, writeReturnQueue, type QueuedReturn } from "./offlineQueue";

let flushing = false;

/** Attempt to submit any queued returns (offline / failed submits). */
export async function flushReturnQueue(): Promise<{
  sent: string[];
  remaining: QueuedReturn[];
}> {
  if (flushing) return { sent: [], remaining: readReturnQueue() };
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { sent: [], remaining: readReturnQueue() };
  }

  flushing = true;
  const sent: string[] = [];

  try {
    const queue = [...readReturnQueue()];
    const remaining: QueuedReturn[] = [];

    for (const entry of queue) {
      try {
        await submitReturn(entry.request);
        sent.push(entry.id);
      } catch (err) {
        const dropClientError =
          err instanceof ApiError &&
          err.status >= 400 &&
          err.status < 500 &&
          err.status !== 408;
        if (!dropClientError) {
          remaining.push(entry);
        }
      }
    }

    writeReturnQueue(remaining);
    return { sent, remaining };
  } finally {
    flushing = false;
  }
}
