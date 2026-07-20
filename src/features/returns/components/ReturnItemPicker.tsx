import type { OrderItem } from "@/api/mockApi";
import { Button } from "@/components/atoms/Button";
import { formatMoney } from "@/lib/format";
import { initialsFromName } from "@/lib/initials";
import "./ReturnItemPicker.css";

export interface ReturnItemPickerProps {
  items: OrderItem[];
  quantities: Record<string, number>;
  onChangeQuantity: (itemId: string, quantity: number) => void;
  error?: string;
}

export function ReturnItemPicker({
  items,
  quantities,
  onChangeQuantity,
  error,
}: ReturnItemPickerProps) {
  if (items.length === 0) {
    return (
      <p className="return-items__empty" role="status">
        None of the items on this order are eligible for return.
      </p>
    );
  }

  return (
    <div className="return-items">
      <ul className="return-items__list">
        {items.map((item) => {
          const qty = quantities[item.id] ?? 0;
          return (
            <li key={item.id} className="return-items__row">
              <span
                className="return-items__thumb"
                style={{ background: item.thumbColor ?? "var(--brand-soft)" }}
                aria-hidden
              >
                <span className="return-items__thumb-mark">{initialsFromName(item.name)}</span>
              </span>
              <div className="return-items__copy">
                <p className="return-items__name">{item.name}</p>
                <p className="return-items__meta">
                  {formatMoney(item.unitPriceCents)} · up to {item.quantity} available
                </p>
              </div>
              <div className="return-items__qty" aria-label={`Quantity for ${item.name}`}>
                <Button
                  variant="secondary"
                  size="sm"
                  aria-label={`Decrease quantity of ${item.name}`}
                  disabled={qty <= 0}
                  onClick={() => onChangeQuantity(item.id, qty - 1)}
                >
                  −
                </Button>
                <span className="return-items__qty-value" aria-live="polite">
                  {qty}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  aria-label={`Increase quantity of ${item.name}`}
                  disabled={qty >= item.quantity}
                  onClick={() => onChangeQuantity(item.id, qty + 1)}
                >
                  +
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      {error ? (
        <p className="return-items__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
