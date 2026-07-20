import type { OrderItem } from "@/api/mockApi";
import { Select } from "@/components/atoms/Select";
import { getExchangeInventory } from "../lib/validation";
import type { ExchangeSelection } from "../lib/offlineQueue";
import "./ExchangePicker.css";

export interface ExchangePickerProps {
  items: OrderItem[];
  selections: Record<string, ExchangeSelection>;
  onChange: (itemId: string, patch: Partial<ExchangeSelection>) => void;
  error?: string;
}

export function ExchangePicker({ items, selections, onChange, error }: ExchangePickerProps) {
  return (
    <div className="exchange-picker">
      <p className="exchange-picker__help">
        Pick the replacement size and color for each item. Out-of-stock combinations are disabled.
      </p>
      <ul className="exchange-picker__list">
        {items.map((item) => {
          const inventory = getExchangeInventory(item);
          const selection = selections[item.id] ?? { size: "", color: "" };
          const stockOk =
            selection.size && selection.color
              ? inventory.inStock(selection.size, selection.color)
              : true;

          return (
            <li key={item.id} className="exchange-picker__row">
              <p className="exchange-picker__name">{item.name}</p>
              <div className="exchange-picker__fields">
                <Select
                  id={`exchange-size-${item.id}`}
                  label="Size"
                  value={selection.size}
                  options={[
                    { value: "", label: "Select size" },
                    ...inventory.sizes.map((size) => ({ value: size, label: size })),
                  ]}
                  onChange={(e) => onChange(item.id, { size: e.target.value })}
                />
                <Select
                  id={`exchange-color-${item.id}`}
                  label="Color"
                  value={selection.color}
                  options={[
                    { value: "", label: "Select color" },
                    ...inventory.colors.map((color) => {
                      const available = !selection.size || inventory.inStock(selection.size, color);
                      return {
                        value: color,
                        label: available ? color : `${color} (out of stock)`,
                        disabled: !available,
                      };
                    }),
                  ]}
                  onChange={(e) => onChange(item.id, { color: e.target.value })}
                />
              </div>
              {selection.size && selection.color && !stockOk ? (
                <p className="exchange-picker__stock" role="status">
                  That size/color is out of stock — pick another combination.
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      {error ? (
        <p className="exchange-picker__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
