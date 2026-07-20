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
import "./ReturnFlow.css";

export interface ReturnFlowProps {
  order: Order;
}

export function ReturnFlow({ order }: ReturnFlowProps) {
  const flow = useReturnFlow(order);

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
        state={flow.receipt}
      />
    );
  }

  return (
    <section className="return-flow">
      <header className="return-flow__intro">
        <Link to="/" className="return-flow__back-link">
          ← Back to orders
        </Link>
        <h1 className="return-flow__title">Return or exchange</h1>
        <p className="return-flow__subtitle">
          Order {order.orderNumber} · placed {formatDate(order.placedAt)}
        </p>
      </header>

      <StepIndicator steps={flow.steps} currentIndex={flow.stepIndex} />

      <div className="return-flow__panel">
        {flow.step === "items" ? (
          <div className="return-flow__step">
            <h2>Which items are you sending back?</h2>
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
          </div>
        ) : null}

        {flow.step === "reason" ? (
          <div className="return-flow__step">
            <h2>Why are you returning these?</h2>
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
              onChange={(e) =>
                flow.setReason(e.target.value as typeof flow.reason)
              }
            />
            <TextArea
              id="return-comment"
              label="Additional details (optional)"
              hint="Share anything that helps us process this faster."
              value={flow.comment}
              onChange={(e) => flow.setComment(e.target.value)}
            />
          </div>
        ) : null}

        {flow.step === "resolution" ? (
          <div className="return-flow__step">
            <h2>How should we make this right?</h2>
            <p className="return-flow__help">
              Store credit includes a 10% bonus on the returned value.
            </p>
            <ResolutionPicker
              value={flow.resolution}
              onChange={flow.setResolution}
              subtotalCents={flow.subtotalCents}
              error={flow.fieldErrors.resolution}
            />
          </div>
        ) : null}

        {flow.step === "review" ? (
          <div className="return-flow__step">
            <h2>Review and submit</h2>
            <p className="return-flow__help">Double-check the details before we create your return.</p>

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
                <dd>
                  {flow.resolution ? RESOLUTION_COPY[flow.resolution].title : "—"}
                </dd>
              </div>
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

            {flow.submitError ? (
              <ErrorBanner
                message={flow.submitError}
                onRetry={() => {
                  void flow.submit();
                }}
                retryLabel="Submit again"
              />
            ) : null}
          </div>
        ) : null}
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
