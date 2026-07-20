import type { ReturnRequest } from "@/api/mockApi";

export interface QueuedReturn {
  id: string;
  createdAt: string;
  request: ReturnRequest;
  /** Client-only exchange preferences (size/variant), attached for review & offline queue. */
  exchangeSelections?: Record<string, ExchangeSelection>;
  comment?: string;
}

export interface ExchangeSelection {
  size: string;
  color: string;
}

const QUEUE_KEY = "solvpath-return-queue";

export function readReturnQueue(): QueuedReturn[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QueuedReturn[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeReturnQueue(queue: QueuedReturn[]): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function enqueueReturn(entry: QueuedReturn): void {
  const queue = readReturnQueue();
  writeReturnQueue([...queue, entry]);
}

export function dequeueReturn(id: string): void {
  writeReturnQueue(readReturnQueue().filter((item) => item.id !== id));
}
