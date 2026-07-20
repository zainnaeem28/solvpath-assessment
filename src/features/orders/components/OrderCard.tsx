import { Link } from "react-router-dom";
import type { Order } from "@/api/mockApi";
import { Badge } from "@/components/atoms/Badge";
import { formatDate, formatMoney, orderTotalCents } from "@/lib/format";
import { STATUS_LABELS, STATUS_TONES } from "../status";
import "./OrderCard.css";

export interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const total = orderTotalCents(order.items);
  const canReturn = order.status === "delivered";
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="order-card">
      <header className="order-card__header">
        <div>
          <p className="order-card__number">{order.orderNumber}</p>
          <p className="order-card__meta">
            Placed {formatDate(order.placedAt)} · {itemCount} item
            {itemCount === 1 ? "" : "s"}
          </p>
        </div>
        <Badge tone={STATUS_TONES[order.status]}>{STATUS_LABELS[order.status]}</Badge>
      </header>

      <ul className="order-card__items">
        {order.items.map((item) => (
          <li key={item.id} className="order-card__item">
            <span
              className="order-card__thumb"
              style={{ background: item.thumbColor ?? "var(--brand-soft)" }}
              aria-hidden
            />
            <div className="order-card__item-copy">
              <span className="order-card__item-name">{item.name}</span>
              <span className="order-card__item-meta">
                Qty {item.quantity} · {formatMoney(item.unitPriceCents)} each
              </span>
            </div>
          </li>
        ))}
      </ul>

      <footer className="order-card__footer">
        <div>
          <p className="order-card__total-label">Order total</p>
          <p className="order-card__total">{formatMoney(total)}</p>
        </div>
        {canReturn ? (
          <Link to={`/orders/${order.id}/return`} className="order-card__cta">
            Start a return
          </Link>
        ) : (
          <p className="order-card__hint">
            {order.status === "cancelled"
              ? "Not eligible for return"
              : "Returns available after delivery"}
          </p>
        )}
      </footer>
    </article>
  );
}
