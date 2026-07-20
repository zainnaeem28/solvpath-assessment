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
    <div className="orders-table" role="region" aria-label="Order stats">
      <table>
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Total</th>
            <th scope="col">Status</th>
            <th scope="col">Date</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const lead = order.items[0];
            const qty = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const total = orderTotalCents(order.items);
            const canReturn = order.status === "delivered";

            return (
              <tr key={order.id}>
                <td>
                  <div className="orders-table__product">
                    <span
                      className="orders-table__thumb"
                      style={{ background: lead?.thumbColor ?? "var(--brand-soft)" }}
                      aria-hidden
                    />
                    <div>
                      <strong>{lead?.name ?? order.orderNumber}</strong>
                      <small>
                        {order.orderNumber}
                        {order.items.length > 1 ? ` · +${order.items.length - 1} more` : ""}
                      </small>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="orders-table__total-cell">
                    <span>{qty}x</span>
                    <small>{formatMoney(total)}</small>
                  </div>
                </td>
                <td>
                  <Badge tone={STATUS_TONES[order.status]}>
                    {STATUS_LABELS[order.status]}
                  </Badge>
                </td>
                <td>{formatDate(order.placedAt)}</td>
                <td>
                  {canReturn ? (
                    <Link to={`/orders/${order.id}/return`} className="orders-table__cta">
                      Return
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
