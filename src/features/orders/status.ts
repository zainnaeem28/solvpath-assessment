import type { OrderStatus } from "@/api/mockApi";
import type { BadgeTone } from "@/components/atoms/Badge";

export const STATUS_LABELS: Record<OrderStatus | "all", string> = {
  all: "All statuses",
  processing: "Processing",
  shipped: "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_TONES: Record<OrderStatus, BadgeTone> = {
  processing: "warning",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
};

export const PAGE_SIZE = 4;
