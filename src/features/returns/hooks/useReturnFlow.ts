import { useEffect, useMemo, useState } from "react";
import {
  ApiError,
  submitReturn,
  type Order,
  type OrderItem,
  type ReturnReceipt,
  type ReturnResolution,
} from "@/api/mockApi";
import {
  RETURN_REASONS,
  calculateResolutionAmountCents,
  calculateReturnSubtotalCents,
  type ReturnReason,
} from "../lib/money";

export type ReturnStep = "items" | "reason" | "resolution" | "review";

export const RETURN_STEPS: { id: ReturnStep; label: string }[] = [
  { id: "items", label: "Items" },
  { id: "reason", label: "Reason" },
  { id: "resolution", label: "Resolution" },
  { id: "review", label: "Review" },
];

function initialQuantities(items: OrderItem[]): Record<string, number> {
  return Object.fromEntries(
    items.filter((i) => i.returnEligible).map((i) => [i.id, 0]),
  );
}

export function useReturnFlow(order: Order | null) {
  const [stepIndex, setStepIndex] = useState(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [reason, setReason] = useState<ReturnReason | "">("");
  const [comment, setComment] = useState("");
  const [resolution, setResolution] = useState<ReturnResolution | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReturnReceipt | null>(null);

  const orderId = order?.id;

  useEffect(() => {
    if (!order) return;
    setQuantities(initialQuantities(order.items));
    setStepIndex(0);
    setReason("");
    setComment("");
    setResolution(null);
    setFieldErrors({});
    setSubmitError(null);
    setReceipt(null);
  }, [order, orderId]);

  const eligibleItems = useMemo(
    () => order?.items.filter((item) => item.returnEligible) ?? [],
    [order],
  );

  const selectedItems = useMemo(
    () =>
      eligibleItems
        .filter((item) => (quantities[item.id] ?? 0) > 0)
        .map((item) => ({
          item,
          quantity: quantities[item.id] ?? 0,
        })),
    [eligibleItems, quantities],
  );

  const subtotalCents = useMemo(
    () => calculateReturnSubtotalCents(eligibleItems, quantities),
    [eligibleItems, quantities],
  );

  const resolutionAmountCents = useMemo(
    () =>
      resolution
        ? calculateResolutionAmountCents(subtotalCents, resolution)
        : subtotalCents,
    [resolution, subtotalCents],
  );

  const step = RETURN_STEPS[stepIndex]?.id ?? "items";

  const setItemQuantity = (itemId: string, quantity: number) => {
    const item = eligibleItems.find((i) => i.id === itemId);
    if (!item) return;
    const next = Math.max(0, Math.min(item.quantity, quantity));
    setQuantities((prev) => ({ ...prev, [itemId]: next }));
  };

  const validateStep = (current: ReturnStep): boolean => {
    const errors: Record<string, string> = {};

    if (current === "items") {
      if (selectedItems.length === 0) {
        errors.items = "Select at least one eligible item to return.";
      }
    }

    if (current === "reason") {
      if (!reason) {
        errors.reason = "Please tell us why you're returning these items.";
      }
    }

    if (current === "resolution") {
      if (!resolution) {
        errors.resolution = "Choose how you'd like us to resolve this return.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStepIndex((i) => Math.min(i + 1, RETURN_STEPS.length - 1));
  };

  const goBack = () => {
    setFieldErrors({});
    setSubmitError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const submit = async () => {
    if (!order || !resolution || !reason) return;
    if (selectedItems.length === 0) {
      setFieldErrors({ items: "Select at least one eligible item to return." });
      setStepIndex(0);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitReturn({
        orderId: order.id,
        items: selectedItems.map(({ item, quantity }) => ({
          itemId: item.id,
          quantity,
        })),
        reason,
        resolution,
        comment: comment.trim() || undefined,
      });
      setReceipt(result);
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : "We couldn't submit your return. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    step,
    stepIndex,
    steps: RETURN_STEPS,
    eligibleItems,
    selectedItems,
    quantities,
    setItemQuantity,
    reason,
    setReason,
    reasons: RETURN_REASONS,
    comment,
    setComment,
    resolution,
    setResolution,
    subtotalCents,
    resolutionAmountCents,
    fieldErrors,
    goNext,
    goBack,
    submit,
    submitting,
    submitError,
    receipt,
  };
}
