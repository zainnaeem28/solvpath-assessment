import { Link } from "react-router-dom";
import type { Order } from "@/api/mockApi";
import { Badge } from "@/components/atoms/Badge";
import { formatDate, formatMoney, orderTotalCents } from "@/lib/format";
import { STATUS_LABELS, STATUS_TONES } from "../status";
import "./OrdersTable.css";

export interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="orders-table" role="region" aria-label="Orders table">
      <table>
        <thead>
          <tr>
            <th scope="col">Order</th>
            <th scope="col">Placed</th>
            <th scope="col">Items</th>
            <th scope="col">Status</th>
            <th scope="col">Total</th>
            <th scope="col">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const total = orderTotalCents(order.items);
            const canReturn = order.status === "delivered";
            return (
              <tr key={order.id}>
                <td>
                  <strong className="orders-table__number">{order.orderNumber}</strong>
                </td>
                <td>{formatDate(order.placedAt)}</td>
                <td>
                  <ul className="orders-table__items">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        <span
                          className="orders-table__thumb"
                          style={{ background: item.thumbColor ?? "var(--brand-soft)" }}
                          aria-hidden
                        />
                        <span>
                          {item.name}
                          <small>
                            ×{item.quantity} · {formatMoney(item.unitPriceCents)}
                          </small>
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <Badge tone={STATUS_TONES[order.status]}>
                    {STATUS_LABELS[order.status]}
                  </Badge>
                </td>
                <td className="orders-table__total">{formatMoney(total)}</td>
                <td className="orders-table__action">
                  {canReturn ? (
                    <Link to={`/orders/${order.id}/return`} className="orders-table__cta">
                      Return / exchange
                    </Link>
                  ) : (
                    <span className="orders-table__muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
