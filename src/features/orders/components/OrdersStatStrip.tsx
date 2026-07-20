import type { OrdersStatusFilter } from "../hooks/useOrders";
import type { OrderStats } from "../hooks/useOrderStats";
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
  const pending = stats.byStatus.processing + stats.byStatus.shipped;

  const cards = [
    {
      key: "delivered" as const,
      label: "Orders Completed",
      value: stats.byStatus.delivered,
      tone: "success" as const,
      icon: "check" as const,
    },
    {
      key: "processing" as const,
      label: "Orders Pending",
      value: pending,
      tone: "info" as const,
      icon: "hourglass" as const,
    },
    {
      key: "cancelled" as const,
      label: "Orders Cancelled",
      value: stats.byStatus.cancelled,
      tone: "danger" as const,
      icon: "cancel" as const,
    },
    {
      key: "all" as const,
      label: "Return-ready",
      value: stats.returnReady,
      tone: "accent" as const,
      icon: "return" as const,
    },
  ];

  return (
    <div className={`stat-strip${loading ? " stat-strip--loading" : ""}`} role="list">
      {cards.map((card) => {
        const isActive =
          card.key === "all"
            ? active === "delivered"
            : card.key === "processing"
              ? active === "processing" || active === "shipped"
              : active === card.key;

        return (
          <button
            key={card.key}
            type="button"
            role="listitem"
            className={`stat-card${isActive ? " is-active" : ""}`}
            onClick={() => onSelect(card.key === "all" ? "delivered" : card.key)}
            aria-pressed={isActive}
          >
            <span className={`stat-card__icon stat-card__icon--${card.tone}`} aria-hidden>
              <StatIcon name={card.icon} />
            </span>
            <span className="stat-card__copy">
              <span className="stat-card__label">{card.label}</span>
              <span className="stat-card__value">{card.value}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function StatIcon({ name }: { name: "check" | "hourglass" | "cancel" | "return" }) {
  if (name === "check") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 13.5 9.5 18 19 7"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "hourglass") {
    return (
      <svg width="18" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 3h12M6 21h12M8 3v4.5L12 12l4-4.5V3M8 21v-4.5L12 12l4 4.5V21"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "cancel") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 7l10 10M17 7 7 17"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12a8 8 0 1 0 2.3-5.6M4 5v4h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
