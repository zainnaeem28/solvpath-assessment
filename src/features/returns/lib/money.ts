import type { OrderItem, ReturnResolution } from "@/api/mockApi";

/** Returned merchandise subtotal in cents (always integer). */
export function calculateReturnSubtotalCents(
  items: OrderItem[],
  quantities: Record<string, number>,
): number {
  return items.reduce((sum, item) => {
    const qty = quantities[item.id] ?? 0;
    if (qty <= 0) return sum;
    return sum + item.unitPriceCents * qty;
  }, 0);
}

/**
 * Store credit includes a +10% bonus on returned value.
 * Round half-up to nearest cent so money stays integer.
 */
export function calculateStoreCreditCents(subtotalCents: number): number {
  return Math.round(subtotalCents * 1.1);
}

export function calculateResolutionAmountCents(
  subtotalCents: number,
  resolution: ReturnResolution,
): number {
  if (resolution === "store_credit") {
    return calculateStoreCreditCents(subtotalCents);
  }
  return subtotalCents;
}

export const RETURN_REASONS = [
  "Changed my mind",
  "Arrived damaged",
  "Wrong item received",
  "Not as described",
  "Sizing / fit issue",
  "Other",
] as const;

export type ReturnReason = (typeof RETURN_REASONS)[number];

export const RESOLUTION_COPY: Record<
  ReturnResolution,
  { title: string; description: string }
> = {
  refund: {
    title: "Refund to original payment",
    description: "We'll refund the returned item value to your original payment method.",
  },
  exchange: {
    title: "Exchange",
    description: "We'll ship a replacement once we receive the returned items.",
  },
  store_credit: {
    title: "Store credit (+10% bonus)",
    description: "Get store credit for the returned value plus a 10% bonus.",
  },
};
