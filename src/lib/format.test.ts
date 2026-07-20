import { describe, expect, it } from "vitest";
import { formatDate, formatMoney, orderTotalCents } from "./format";
import { initialsFromName } from "./initials";

describe("formatMoney", () => {
  it("formats cents as USD", () => {
    expect(formatMoney(18400)).toBe("$184.00");
    expect(formatMoney(0)).toBe("$0.00");
  });
});

describe("formatDate", () => {
  it("formats ISO dates for display", () => {
    expect(formatDate("2026-06-03")).toMatch(/Jun/);
    expect(formatDate("2026-06-03")).toMatch(/2026/);
  });
});

describe("orderTotalCents", () => {
  it("sums line totals", () => {
    expect(
      orderTotalCents([
        { unitPriceCents: 14200, quantity: 1 },
        { unitPriceCents: 4200, quantity: 1 },
      ]),
    ).toBe(18400);
  });
});

describe("initialsFromName", () => {
  it("builds two-letter initials", () => {
    expect(initialsFromName("Maya Chen")).toBe("MC");
    expect(initialsFromName("Aurora")).toBe("AU");
    expect(initialsFromName("")).toBe("?");
  });
});
