import { describe, expect, it } from "vitest";
import type { Order } from "@/api/mockApi";
import { buildMetrics, buildStatusSlices } from "./dashboard";
import { filterAndPaginateOrders } from "./filterOrders";

const sample: Order[] = [
  {
    id: "o1",
    orderNumber: "SP-1",
    placedAt: "2026-06-01",
    status: "delivered",
    items: [
      {
        id: "i1",
        name: "Aurora Wireless Headphones",
        unitPriceCents: 1000,
        quantity: 1,
        returnEligible: true,
      },
    ],
  },
  {
    id: "o2",
    orderNumber: "SP-2",
    placedAt: "2026-06-02",
    status: "shipped",
    items: [
      {
        id: "i2",
        name: "Cloud Foam Insoles",
        unitPriceCents: 2000,
        quantity: 2,
        returnEligible: true,
      },
    ],
  },
  {
    id: "o3",
    orderNumber: "SP-3",
    placedAt: "2026-05-01",
    status: "cancelled",
    items: [
      {
        id: "i3",
        name: "Nomad Duffel",
        unitPriceCents: 500,
        quantity: 1,
        returnEligible: false,
      },
    ],
  },
];

describe("buildMetrics", () => {
  it("counts statuses and spend in cents", () => {
    const metrics = buildMetrics(sample);
    expect(metrics.totalOrders).toBe(3);
    expect(metrics.delivered).toBe(1);
    expect(metrics.inTransit).toBe(1);
    expect(metrics.cancelled).toBe(1);
    expect(metrics.returnReady).toBe(1);
    expect(metrics.spendCents).toBe(1000 + 4000 + 500);
  });
});

describe("buildStatusSlices", () => {
  it("omits zero-count statuses", () => {
    const slices = buildStatusSlices(sample);
    expect(slices.map((s) => s.key).sort()).toEqual(["cancelled", "delivered", "shipped"]);
  });
});

describe("filterAndPaginateOrders", () => {
  it("filters by status", () => {
    const page = filterAndPaginateOrders(sample, {
      page: 1,
      pageSize: 10,
      status: "delivered",
      query: "",
    });
    expect(page.total).toBe(1);
    expect(page.data[0]?.orderNumber).toBe("SP-1");
  });

  it("searches by product name", () => {
    const page = filterAndPaginateOrders(sample, {
      page: 1,
      pageSize: 10,
      status: "all",
      query: "cloud",
    });
    expect(page.total).toBe(1);
    expect(page.data[0]?.id).toBe("o2");
  });

  it("paginates results", () => {
    const page = filterAndPaginateOrders(sample, {
      page: 2,
      pageSize: 1,
      status: "all",
      query: "",
    });
    expect(page.total).toBe(3);
    expect(page.data).toHaveLength(1);
    expect(page.page).toBe(2);
  });
});
