import { ApiError } from "@/api/mockApi";

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  signal?: AbortSignal;
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = window.setTimeout(() => resolve(), ms);
    const onAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function isRetryable(err: unknown): boolean {
  if (err instanceof DOMException && err.name === "AbortError") return false;
  if (err instanceof ApiError) return err.status >= 500 || err.status === 429;
  // Unknown / programmer errors should fail fast; network TypeErrors may retry.
  return err instanceof TypeError;
}

/**
 * Retry transient API failures. Does not change mockApi behavior —
 * it just handles flaky networks the way a real client should.
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const retries = options.retries ?? 2;
  const delayMs = options.delayMs ?? 400;
  let attempt = 0;

  for (;;) {
    try {
      return await fn();
    } catch (err) {
      if (!isRetryable(err) || attempt >= retries) throw err;
      attempt += 1;
      await wait(delayMs * attempt, options.signal);
    }
  }
}

export function toUserMessage(err: unknown, fallback: string): string {
  if (err instanceof DOMException && err.name === "AbortError") return fallback;
  if (err instanceof ApiError) return err.message;
  return fallback;
}
