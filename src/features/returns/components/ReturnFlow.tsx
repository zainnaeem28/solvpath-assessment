import { useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import type { Order } from "@/api/mockApi";
import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";
import { TextArea } from "@/components/atoms/TextArea";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { StepIndicator } from "@/components/molecules/StepIndicator";
import { formatDate, formatMoney } from "@/lib/format";
import { RESOLUTION_COPY } from "../lib/money";
import { useReturnFlow } from "../hooks/useReturnFlow";
import { ReturnItemPicker } from "./ReturnItemPicker";
import { ResolutionPicker } from "./ResolutionPicker";
import { ExchangePicker } from "./ExchangePicker";
import "./ReturnFlow.css";

export interface ReturnFlowProps {
  order: Order;
}

export function ReturnFlow({ order }: ReturnFlowProps) {
  const flow = useReturnFlow(order);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    if (liveRef.current) {
      liveRef.current.textContent = `Step ${flow.stepIndex + 1} of ${flow.steps.length}: ${
        flow.steps[flow.stepIndex]?.label ?? ""
      }`;
    }
  }, [flow.stepIndex, flow.steps]);

  if (order.status !== "delivered") {
    return (
      <section className="return-flow">
        <ErrorBanner
          title="Returns aren't available yet"
          message="You can start a return once this order is delivered."
        />
        <Link to="/" className="return-flow__back-link">
          Back to orders
        </Link>
      </section>
    );
  }

  if (flow.receipt) {
    return (
      <Navigate
        to={`/returns/${flow.receipt.returnId}/success`}
        replace
        state={{
          ...flow.receipt,
          notice: flow.submitNotice,
        }}
      />
    );
  }

  return (
    <section className="return-flow">
      <div className="sr-only" aria-live="polite" aria-atomic="true" ref={liveRef} />

      <header className="return-flow__intro">
        <Link to="/" className="return-flow__back-link">
          ← Back to orders
        </Link>
        <h1 className="return-flow__title">Return or Exchange</h1>
        <p className="return-flow__subtitle">
          Order {order.orderNumber} · placed {formatDate(order.placedAt)}
        </p>
      </header>

      {flow.restored ? (
        <div className="return-flow__restored" role="status">
          <p>We restored your in-progress return from this device.</p>
          <Button variant="ghost" size="sm" onClick={flow.dismissRestored}>
            Dismiss
          </Button>
        </div>
      ) : null}

      <StepIndicator steps={flow.steps} currentIndex={flow.stepIndex} />

      <div className="return-flow__panel">
        <div className="return-flow__step">
          <h2 tabIndex={-1} ref={headingRef}>
            {flow.step === "items" && "Which items are you sending back?"}
            {flow.step === "reason" && "Why are you returning these?"}
            {flow.step === "resolution" && "How should we make this right?"}
            {flow.step === "review" && "Review and Submit"}
          </h2>

          {flow.step === "items" ? (
            <>
              <p className="return-flow__help">
                Only return-eligible items are listed. Adjust quantities if you kept some.
              </p>
              <ReturnItemPicker
                items={flow.eligibleItems}
                quantities={flow.quantities}
                onChangeQuantity={flow.setItemQuantity}
                error={flow.fieldErrors.items}
              />
              {flow.subtotalCents > 0 ? (
                <p className="return-flow__subtotal">
                  Selected value: <strong>{formatMoney(flow.subtotalCents)}</strong>
                </p>
              ) : null}
            </>
          ) : null}

          {flow.step === "reason" ? (
            <>
              <p className="return-flow__help">This helps us improve quality and fulfillment.</p>
              <Select
                id="return-reason"
                label="Return reason"
                value={flow.reason}
                error={flow.fieldErrors.reason}
                options={[
                  { value: "", label: "Select a reason" },
                  ...flow.reasons.map((r) => ({ value: r, label: r })),
                ]}
                onChange={(e) => flow.setReason(e.target.value as typeof flow.reason)}
              />
              <TextArea
                id="return-comment"
                label="Additional details (optional)"
                hint="Share anything that helps us process this faster."
                value={flow.comment}
                onChange={(e) => flow.setComment(e.target.value)}
              />
            </>
          ) : null}

          {flow.step === "resolution" ? (
            <>
              <p className="return-flow__help">
                Store credit includes a 10% bonus on the returned value. Exchanges need a
                replacement size and color.
              </p>
              <ResolutionPicker
                value={flow.resolution}
                onChange={flow.setResolution}
                subtotalCents={flow.subtotalCents}
                error={flow.fieldErrors.resolution}
              />
              {flow.resolution === "exchange" ? (
                <ExchangePicker
                  items={flow.selectedItems.map(({ item }) => item)}
                  selections={flow.exchangeSelections}
                  onChange={flow.setExchangeSelection}
                  error={flow.fieldErrors.exchange}
                />
              ) : null}
            </>
          ) : null}

          {flow.step === "review" ? (
            <>
              <p className="return-flow__help">
                Double-check the details before we create your return.
              </p>

              <dl className="return-flow__summary">
                <div>
                  <dt>Items</dt>
                  <dd>
                    <ul>
                      {flow.selectedItems.map(({ item, quantity }) => (
                        <li key={item.id}>
                          {item.name} × {quantity} ({formatMoney(item.unitPriceCents * quantity)})
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt>Reason</dt>
                  <dd>
                    {flow.reason}
                    {flow.comment.trim() ? (
                      <span className="return-flow__comment"> — {flow.comment.trim()}</span>
                    ) : null}
                  </dd>
                </div>
                <div>
                  <dt>Resolution</dt>
                  <dd>{flow.resolution ? RESOLUTION_COPY[flow.resolution].title : "—"}</dd>
                </div>
                {flow.resolution === "exchange" ? (
                  <div>
                    <dt>Exchange preferences</dt>
                    <dd>
                      <ul>
                        {flow.selectedItems.map(({ item }) => {
                          const sel = flow.exchangeSelections[item.id];
                          return (
                            <li key={item.id}>
                              {item.name}: {sel?.size ?? "—"} / {sel?.color ?? "—"}
                            </li>
                          );
                        })}
                      </ul>
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt>
                    {flow.resolution === "store_credit"
                      ? "Store credit"
                      : flow.resolution === "exchange"
                        ? "Exchange value"
                        : "Refund amount"}
                  </dt>
                  <dd className="return-flow__amount">
                    {formatMoney(flow.resolutionAmountCents)}
                    {flow.resolution === "store_credit" ? (
                      <span className="return-flow__bonus-note">
                        {" "}
                        (includes +10% on {formatMoney(flow.subtotalCents)})
                      </span>
                    ) : null}
                  </dd>
                </div>
              </dl>

              {flow.submitNotice ? (
                <p className="return-flow__notice" role="status">
                  {flow.submitNotice}
                </p>
              ) : null}

              {flow.submitError ? (
                <ErrorBanner
                  message={flow.submitError}
                  onRetry={() => {
                    void flow.submit();
                  }}
                  retryLabel="Submit again"
                />
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      <footer className="return-flow__actions">
        <Button
          variant="secondary"
          onClick={flow.goBack}
          disabled={flow.stepIndex === 0 || flow.submitting}
        >
          Back
        </Button>
        {flow.step === "review" ? (
          <Button loading={flow.submitting} onClick={() => void flow.submit()}>
            Submit return
          </Button>
        ) : (
          <Button onClick={flow.goNext} disabled={flow.eligibleItems.length === 0}>
            Continue
          </Button>
        )}
      </footer>
    </section>
  );
}
