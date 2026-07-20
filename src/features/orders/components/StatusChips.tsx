import type { OrdersStatusFilter } from "../lib/filterOrders";
import { STATUS_LABELS } from "../status";
import "./StatusChips.css";

const FILTERS: OrdersStatusFilter[] = ["all", "delivered", "shipped", "processing", "cancelled"];

export interface StatusChipsProps {
  value: OrdersStatusFilter;
  onChange: (value: OrdersStatusFilter) => void;
  disabled?: boolean;
}

export function StatusChips({ value, onChange, disabled = false }: StatusChipsProps) {
  return (
    <div className="status-chips" role="radiogroup" aria-label="Filter by status">
      {FILTERS.map((filter) => {
        const selected = value === filter;
        return (
          <button
            key={filter}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`status-chips__chip${selected ? " is-selected" : ""}`}
            disabled={disabled}
            onClick={() => onChange(filter)}
          >
            {STATUS_LABELS[filter]}
          </button>
        );
      })}
    </div>
  );
}
