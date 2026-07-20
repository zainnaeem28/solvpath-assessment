import { Link, useLocation, useParams } from "react-router-dom";
import type { ReturnReceipt } from "@/api/mockApi";
import "./ReturnSuccessPage.css";

export function ReturnSuccessPage() {
  const { returnId } = useParams<{ returnId: string }>();
  const location = useLocation();
  const receipt = (location.state as ReturnReceipt | null) ?? null;

  const id = receipt?.returnId ?? returnId ?? "—";
  const createdAt = receipt?.createdAt
    ? new Date(receipt.createdAt).toLocaleString()
    : null;

  return (
    <section className="return-success">
      <div className="return-success__mark" aria-hidden>
        ✓
      </div>
      <h1>Return submitted</h1>
      <p className="return-success__copy">
        We've received your request. Keep this confirmation for your records — you'll get
        shipping instructions by email shortly.
      </p>
      <dl className="return-success__meta">
        <div>
          <dt>Return ID</dt>
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
