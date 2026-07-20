import type { Order, OrderStatus, Page } from "@/api/mockApi";

export type OrdersStatusFilter = OrderStatus | "all";

/** Mirrors mockApi listOrders filtering/pagination (client-side, same rules). */
export function filterAndPaginateOrders(
  orders: Order[],
  params: {
    page: number;
    pageSize: number;
    status: OrdersStatusFilter;
    query: string;
  },
): Page<Order> {
  const { page, pageSize, status, query } = params;
  const q = query.trim().toLowerCase();
  const filtered = orders.filter((o) => {
    if (status !== "all" && o.status !== status) return false;
    if (!q) return true;
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.items.some((i) => i.name.toLowerCase().includes(q))
    );
  });
  const start = (page - 1) * pageSize;
  return {
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  };
}
