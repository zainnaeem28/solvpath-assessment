import type { OrdersStatusFilter } from "../hooks/useOrders";
import type { OrderStats } from "../hooks/useOrderStats";
import { formatMoney } from "@/lib/format";
import "./OrdersStatStrip.css";

export interface OrdersStatStripProps {
  stats: OrderStats;
  loading?: boolean;
  active: OrdersStatusFilter;
  onSelect: (key: OrdersStatusFilter) => void;
}

export function OrdersStatStrip({
  stats,
  loading = false,
  active,
  onSelect,
}: OrdersStatStripProps) {
  const cards = [
    {
      key: "all" as const,
      label: "All orders",
      value: String(stats.total),
      hint: "Account history",
      tone: "brand",
    },
    {
      key: "delivered" as const,
      label: "Delivered",
      value: String(stats.byStatus.delivered),
      hint: "Ready for returns",
      tone: "success",
    },
    {
      key: "shipped" as const,
      label: "In transit",
      value: String(stats.byStatus.shipped),
      hint: "On the way",
      tone: "info",
    },
    {
      key: "processing" as const,
      label: "Processing",
      value: String(stats.byStatus.processing),
      hint: "Being prepared",
      tone: "warning",
    },
    {
      key: "return_ready" as const,
      label: "Return-ready",
      value: String(stats.returnReady),
      hint: formatMoney(stats.spendCents) + " lifetime spend",
      tone: "accent",
    },
  ];

  return (
    <div className={`stat-strip${loading ? " stat-strip--loading" : ""}`} role="list">
      {cards.map((card) => {
        const isActive =
          card.key === "return_ready"
            ? active === "delivered"
            : active === card.key;
        return (
          <button
            key={card.key}
            type="button"
            role="listitem"
            className={`stat-card stat-card--${card.tone}${isActive ? " is-active" : ""}`}
            onClick={() => {
              onSelect(card.key === "return_ready" ? "delivered" : card.key);
            }}
            aria-pressed={isActive}
          >
            <span className="stat-card__label">{card.label}</span>
            <span className="stat-card__value">{card.value}</span>
            <span className="stat-card__hint">{card.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
