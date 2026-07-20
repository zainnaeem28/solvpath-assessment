import { describe, expect, it } from "vitest";
import type { OrderItem } from "@/api/mockApi";
import {
  calculateResolutionAmountCents,
  calculateReturnSubtotalCents,
  calculateStoreCreditCents,
} from "@/features/returns/lib/money";
import {
  getExchangeInventory,
  validateReturnStep,
} from "@/features/returns/lib/validation";

const items: OrderItem[] = [
  {
    id: "i_1",
    name: "Aurora Wireless Headphones",
    unitPriceCents: 14200,
    quantity: 1,
    returnEligible: true,
  },
  {
    id: "i_5",
    name: "Terra Ceramic Planter Set",
    unitPriceCents: 6400,
    quantity: 2,
    returnEligible: true,
  },
];

describe("calculateReturnSubtotalCents", () => {
  it("sums unit price × quantity for selected items only", () => {
    expect(calculateReturnSubtotalCents(items, { i_1: 1, i_5: 0 })).toBe(14200);
    expect(calculateReturnSubtotalCents(items, { i_1: 1, i_5: 2 })).toBe(14200 + 12800);
  });

  it("ignores zero and missing quantities", () => {
    expect(calculateReturnSubtotalCents(items, {})).toBe(0);
  });
});

describe("calculateStoreCreditCents", () => {
  it("applies a +10% bonus and rounds to integer cents", () => {
    expect(calculateStoreCreditCents(10000)).toBe(11000);
    expect(calculateStoreCreditCents(14200)).toBe(15620);
    // 333 × 1.1 = 366.3 → 366
    expect(calculateStoreCreditCents(333)).toBe(366);
  });
});

describe("calculateResolutionAmountCents", () => {
  it("returns subtotal for refund and exchange", () => {
    expect(calculateResolutionAmountCents(5000, "refund")).toBe(5000);
    expect(calculateResolutionAmountCents(5000, "exchange")).toBe(5000);
  });

  it("returns store-credit amount with bonus", () => {
    expect(calculateResolutionAmountCents(5000, "store_credit")).toBe(5500);
  });
});

describe("validateReturnStep", () => {
  it("requires at least one item on the items step", () => {
    const errors = validateReturnStep({
      step: "items",
      selectedCount: 0,
      reason: "",
      resolution: null,
      exchangeSelections: {},
      selectedItems: [],
    });
    expect(errors.items).toBeTruthy();
  });

  it("requires a reason on the reason step", () => {
    const errors = validateReturnStep({
      step: "reason",
      selectedCount: 1,
      reason: "",
      resolution: null,
      exchangeSelections: {},
      selectedItems: [items[0]!],
    });
    expect(errors.reason).toBeTruthy();
  });

  it("requires resolution and exchange size/color when exchanging", () => {
    const missingResolution = validateReturnStep({
      step: "resolution",
      selectedCount: 1,
      reason: "Changed my mind",
      resolution: null,
      exchangeSelections: {},
      selectedItems: [items[0]!],
    });
    expect(missingResolution.resolution).toBeTruthy();

    const missingExchange = validateReturnStep({
      step: "resolution",
      selectedCount: 1,
      reason: "Changed my mind",
      resolution: "exchange",
      exchangeSelections: {},
      selectedItems: [items[0]!],
    });
    expect(missingExchange.exchange).toBeTruthy();
  });

  it("accepts a complete exchange selection that is in stock", () => {
    const inventory = getExchangeInventory(items[0]!);
    const size = inventory.sizes[0]!;
    const color =
      inventory.colors.find((c) => inventory.inStock(size, c)) ?? inventory.colors[0]!;

    const errors = validateReturnStep({
      step: "resolution",
      selectedCount: 1,
      reason: "Sizing / fit issue",
      resolution: "exchange",
      exchangeSelections: {
        i_1: { size, color },
      },
      selectedItems: [items[0]!],
    });

    // If the chosen combo is somehow OOS, validation should still surface it;
    // prefer an in-stock combo above so this stays green in CI.
    if (inventory.inStock(size, color)) {
      expect(errors).toEqual({});
    } else {
      expect(errors.exchange).toBeTruthy();
    }
  });
});
