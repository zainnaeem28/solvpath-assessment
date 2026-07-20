import type { OrderItem, ReturnResolution } from "@/api/mockApi";
import type { ReturnReason } from "./money";
import type { ExchangeSelection } from "./offlineQueue";
import type { ReturnStep } from "./steps";

export interface ValidateReturnInput {
  step: ReturnStep;
  selectedCount: number;
  reason: ReturnReason | "";
  resolution: ReturnResolution | null;
  exchangeSelections: Record<string, ExchangeSelection>;
  selectedItems: OrderItem[];
}

export const EXCHANGE_SIZES = ["XS", "S", "M", "L", "XL"] as const;
export const EXCHANGE_COLORS = ["Black", "Navy", "Sand", "Forest", "White"] as const;

/** Simple inventory map — which size/color combos are in stock for exchanges. */
export function getExchangeInventory(item: OrderItem): {
  sizes: string[];
  colors: string[];
  inStock: (size: string, color: string) => boolean;
} {
  const seed = item.id.charCodeAt(item.id.length - 1);
  const sizes = [...EXCHANGE_SIZES];
  const colors = EXCHANGE_COLORS.filter((_, index) => (seed + index) % 5 !== 0);

  return {
    sizes,
    colors: colors.length > 0 ? [...colors] : ["Black", "Navy"],
    inStock: (size, color) => {
      const key = `${item.id}:${size}:${color}`;
      let hash = 0;
      for (let i = 0; i < key.length; i += 1) hash = (hash + key.charCodeAt(i) * (i + 1)) % 11;
      return hash !== 0;
    },
  };
}

export function validateReturnStep(input: ValidateReturnInput): Record<string, string> {
  const errors: Record<string, string> = {};

  if (input.step === "items" && input.selectedCount === 0) {
    errors.items = "Select at least one eligible item to return.";
  }

  if (input.step === "reason" && !input.reason) {
    errors.reason = "Please tell us why you're returning these items.";
  }

  if (input.step === "resolution") {
    if (!input.resolution) {
      errors.resolution = "Choose how you'd like us to resolve this return.";
    } else if (input.resolution === "exchange") {
      for (const item of input.selectedItems) {
        const selection = input.exchangeSelections[item.id];
        if (!selection?.size || !selection?.color) {
          errors.exchange = "Choose a size and color for each item you're exchanging.";
          break;
        }
        const inventory = getExchangeInventory(item);
        if (!inventory.inStock(selection.size, selection.color)) {
          errors.exchange = "One or more selected size/color combinations are out of stock.";
          break;
        }
      }
    }
  }

  return errors;
}
