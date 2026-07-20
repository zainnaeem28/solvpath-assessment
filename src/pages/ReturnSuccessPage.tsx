import { Link, useLocation, useParams } from "react-router-dom";
import type { ReturnReceipt } from "@/api/mockApi";
import "./ReturnSuccessPage.css";

interface SuccessState extends ReturnReceipt {
  notice?: string | null;
}

export function ReturnSuccessPage() {
  const { returnId } = useParams<{ returnId: string }>();
  const location = useLocation();
  const receipt = (location.state as SuccessState | null) ?? null;

  const id = receipt?.returnId ?? returnId ?? "—";
  const createdAt = receipt?.createdAt
    ? new Date(receipt.createdAt).toLocaleString()
    : null;
  const queued = id.startsWith("queued_");

  return (
    <section className="return-success">
      <div className="return-success__mark" aria-hidden>
        ✓
      </div>
      <h1>{queued ? "Return saved offline" : "Return submitted"}</h1>
      <p className="return-success__copy">
        {queued
          ? "You're offline, so we queued this return on this device. We'll submit it automatically when you're back online."
          : "We've received your request. Keep this confirmation for your records — you'll get shipping instructions by email shortly."}
      </p>
      {receipt?.notice ? (
        <p className="return-success__notice" role="status">
          {receipt.notice}
        </p>
      ) : null}
      <dl className="return-success__meta">
        <div>
          <dt>{queued ? "Queue ID" : "Return ID"}</dt>
          <dd>
            <code>{id}</code>
          </dd>
        </div>
        {createdAt ? (
          <div>
            <dt>Submitted</dt>
            <dd>{createdAt}</dd>
          </div>
        ) : null}
      </dl>
      <Link to="/" className="return-success__cta">
        Back to orders
      </Link>
    </section>
  );
}
