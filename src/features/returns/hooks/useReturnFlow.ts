import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  submitReturn,
  type Order,
  type OrderItem,
  type ReturnReceipt,
  type ReturnResolution,
} from "@/api/mockApi";
import { toUserMessage, withRetry } from "@/lib/apiClient";
import {
  RETURN_REASONS,
  calculateResolutionAmountCents,
  calculateReturnSubtotalCents,
  type ReturnReason,
} from "../lib/money";
import { RETURN_STEPS, type ReturnStep } from "../lib/steps";
import { validateReturnStep } from "../lib/validation";
import { enqueueReturn, type ExchangeSelection } from "../lib/offlineQueue";
import { useReturnDraftStore } from "../store/returnDraftStore";
import { flushReturnQueue } from "../lib/flushQueue";

export type { ReturnStep };
export { RETURN_STEPS };

function initialQuantities(items: OrderItem[]): Record<string, number> {
  return Object.fromEntries(items.filter((i) => i.returnEligible).map((i) => [i.id, 0]));
}

export function useReturnFlow(order: Order | null) {
  const saveDraft = useReturnDraftStore((s) => s.saveDraft);
  const clearDraft = useReturnDraftStore((s) => s.clearDraft);
  const getDraft = useReturnDraftStore((s) => s.getDraft);

  const [stepIndex, setStepIndex] = useState(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [reason, setReason] = useState<ReturnReason | "">("");
  const [comment, setComment] = useState("");
  const [resolution, setResolution] = useState<ReturnResolution | null>(null);
  const [exchangeSelections, setExchangeSelections] = useState<Record<string, ExchangeSelection>>(
    {},
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReturnReceipt | null>(null);
  const [restored, setRestored] = useState(false);
  const hydratedRef = useRef(false);

  const orderId = order?.id;

  useEffect(() => {
    if (!order || !orderId) return;
    const draft = getDraft(orderId);
    if (draft && draft.orderId === orderId) {
      setQuantities(draft.quantities);
      setStepIndex(draft.stepIndex);
      setReason(draft.reason);
      setComment(draft.comment);
      setResolution(draft.resolution);
      setExchangeSelections(draft.exchangeSelections ?? {});
      setRestored(true);
    } else {
      setQuantities(initialQuantities(order.items));
      setStepIndex(0);
      setReason("");
      setComment("");
      setResolution(null);
      setExchangeSelections({});
      setRestored(false);
    }
    setFieldErrors({});
    setSubmitError(null);
    setSubmitNotice(null);
    setReceipt(null);
    hydratedRef.current = true;
  }, [order, orderId, getDraft]);

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
    () => (resolution ? calculateResolutionAmountCents(subtotalCents, resolution) : subtotalCents),
    [resolution, subtotalCents],
  );

  const step = RETURN_STEPS[stepIndex]?.id ?? "items";

  // Persist in-progress return across refresh
  useEffect(() => {
    if (!orderId || !hydratedRef.current || receipt) return;
    saveDraft({
      orderId,
      stepIndex,
      quantities,
      reason,
      comment,
      resolution,
      exchangeSelections,
    });
  }, [
    orderId,
    stepIndex,
    quantities,
    reason,
    comment,
    resolution,
    exchangeSelections,
    receipt,
    saveDraft,
  ]);

  const setItemQuantity = (itemId: string, quantity: number) => {
    const item = eligibleItems.find((i) => i.id === itemId);
    if (!item) return;
    const next = Math.max(0, Math.min(item.quantity, quantity));
    setQuantities((prev) => ({ ...prev, [itemId]: next }));
    if (next === 0) {
      setExchangeSelections((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    }
  };

  const setExchangeSelection = (itemId: string, patch: Partial<ExchangeSelection>) => {
    setExchangeSelections((prev) => ({
      ...prev,
      [itemId]: {
        size: prev[itemId]?.size ?? "",
        color: prev[itemId]?.color ?? "",
        ...patch,
      },
    }));
  };

  const runValidation = (current: ReturnStep): boolean => {
    const errors = validateReturnStep({
      step: current,
      selectedCount: selectedItems.length,
      reason,
      resolution,
      exchangeSelections,
      selectedItems: selectedItems.map(({ item }) => item),
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goNext = () => {
    if (!runValidation(step)) return;
    setStepIndex((i) => Math.min(i + 1, RETURN_STEPS.length - 1));
  };

  const goBack = () => {
    setFieldErrors({});
    setSubmitError(null);
    setSubmitNotice(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const buildRequest = useCallback(() => {
    if (!order || !resolution || !reason) return null;
    return {
      orderId: order.id,
      items: selectedItems.map(({ item, quantity }) => ({
        itemId: item.id,
        quantity,
      })),
      reason:
        resolution === "exchange"
          ? `${reason} | Exchange prefs: ${selectedItems
              .map(({ item }) => {
                const sel = exchangeSelections[item.id];
                return `${item.name}=${sel?.size ?? "?"}/${sel?.color ?? "?"}`;
              })
              .join("; ")}`
          : reason,
      resolution,
      comment: comment.trim() || undefined,
    };
  }, [order, resolution, reason, selectedItems, exchangeSelections, comment]);

  const submit = async () => {
    if (!order || !resolution || !reason) return;
    if (!runValidation("items") || !runValidation("reason") || !runValidation("resolution")) {
      return;
    }

    const request = buildRequest();
    if (!request) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitNotice(null);

    // Offline-friendly queue
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const queuedId = `queued_${Date.now().toString(36)}`;
      enqueueReturn({
        id: queuedId,
        createdAt: new Date().toISOString(),
        request,
        exchangeSelections,
      });
      clearDraft(order.id);
      setReceipt({
        returnId: queuedId,
        createdAt: new Date().toISOString(),
      });
      setSubmitNotice(
        "You're offline — we saved this return and will submit it when you're back online.",
      );
      setSubmitting(false);
      return;
    }

    // Optimistic notice while the network call is in flight
    setSubmitNotice("Submitting your return…");

    try {
      const result = await withRetry(() => submitReturn(request), { retries: 2 });
      clearDraft(order.id);
      setReceipt(result);
      setSubmitNotice(null);
      void flushReturnQueue();
    } catch (err: unknown) {
      const message = toUserMessage(err, "We couldn't submit your return. Please try again.");
      setSubmitError(message);
      setSubmitNotice(null);
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
    exchangeSelections,
    setExchangeSelection,
    subtotalCents,
    resolutionAmountCents,
    fieldErrors,
    goNext,
    goBack,
    submit,
    submitting,
    submitError,
    submitNotice,
    receipt,
    restored,
    dismissRestored: () => setRestored(false),
  };
}
