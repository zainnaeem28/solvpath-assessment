import { useId, useState } from "react";
import { Link } from "react-router-dom";
import type { Order, OrderItem } from "@/api/mockApi";
import { Badge } from "@/components/atoms/Badge";
import { formatDate, formatMoney, orderTotalCents } from "@/lib/format";
import { initialsFromName } from "@/lib/initials";
import { STATUS_LABELS, STATUS_TONES } from "../status";
import "./OrderCard.css";

export interface OrderCardProps {
  order: Order;
}

function LineItem({ item }: { item: OrderItem }) {
  const lineTotal = item.unitPriceCents * item.quantity;

  return (
    <li className="order-card__item">
      <span
        className="order-card__thumb"
        style={{ background: item.thumbColor ?? "var(--brand-soft)" }}
        aria-hidden
      >
        <span className="order-card__thumb-mark">{initialsFromName(item.name)}</span>
      </span>
      <div className="order-card__item-copy">
        <span className="order-card__item-name">{item.name}</span>
        {item.quantity > 1 ? (
          <span className="order-card__item-meta">
            ×{item.quantity} · {formatMoney(item.unitPriceCents)} each
          </span>
        ) : null}
      </div>
      <span className="order-card__item-price">{formatMoney(lineTotal)}</span>
    </li>
  );
}

type NoticeTone = "info" | "warning" | "neutral";

function orderNotice(status: Order["status"]): { tone: NoticeTone; title: string; detail: string } {
  switch (status) {
    case "shipped":
      return {
        tone: "info",
        title: "Tracking Soon",
        detail: "Updates appear once the carrier scans your package.",
      };
    case "processing":
      return {
        tone: "warning",
        title: "Being Prepared",
        detail: "Returns open after this order is delivered.",
      };
    case "cancelled":
      return {
        tone: "neutral",
        title: "Not Eligible for Return",
        detail: "Cancelled orders can’t be returned or exchanged.",
      };
    default:
      return {
        tone: "neutral",
        title: "Not Eligible for Return",
        detail: "Returns are only available on delivered orders.",
      };
  }
}

export function OrderCard({ order }: OrderCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsId = useId();
  const total = orderTotalCents(order.items);
  const canReturn = order.status === "delivered";
  const notice = canReturn ? null : orderNotice(order.status);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="order-card">
      <header className="order-card__header">
        <div>
          <p className="order-card__number">{order.orderNumber}</p>
          <p className="order-card__meta">
            Placed {formatDate(order.placedAt)} · {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <Badge tone={STATUS_TONES[order.status]} className="order-card__status">
          {STATUS_LABELS[order.status]}
        </Badge>
      </header>

      <ul className="order-card__items">
        {order.items.map((item) => (
          <LineItem key={item.id} item={item} />
        ))}
      </ul>

      <footer className="order-card__footer">
        <div className="order-card__total-block">
          <p className="order-card__total-label">Order total</p>
          <p className="order-card__total">{formatMoney(total)}</p>
          <button
            type="button"
            className="order-card__link"
            aria-expanded={detailsOpen}
            aria-controls={detailsId}
            onClick={() => setDetailsOpen((open) => !open)}
          >
            {detailsOpen ? "Hide details" : "View order details"}
          </button>
        </div>

        <div className="order-card__actions">
          {canReturn ? (
            <Link to={`/orders/${order.id}/return`} className="order-card__cta">
              Start a return
            </Link>
          ) : notice ? (
            <p className={`order-card__notice order-card__notice--${notice.tone}`} role="status">
              <span className="order-card__notice-title">{notice.title}</span>
              <span className="order-card__notice-detail">{notice.detail}</span>
            </p>
          ) : null}
        </div>
      </footer>

      {detailsOpen ? (
        <div id={detailsId} className="order-card__details">
          <dl>
            <div>
              <dt>Order number</dt>
              <dd>{order.orderNumber}</dd>
            </div>
            <div>
              <dt>Placed</dt>
              <dd>{formatDate(order.placedAt)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{STATUS_LABELS[order.status]}</dd>
            </div>
            <div>
              <dt>Items</dt>
              <dd>
                {order.items.map((item) => (
                  <span key={item.id} className="order-card__details-line">
                    {item.name}
                    {item.quantity > 1 ? ` ×${item.quantity}` : ""} —{" "}
                    {formatMoney(item.unitPriceCents * item.quantity)}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatMoney(total)}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </article>
  );
}
