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

  const id = receipt?.returnId ?? returnId ?? "";
  const queued = id.startsWith("queued_");

  return (
    <div className="return-success-page">
      <section className="return-success" aria-labelledby="return-success-title">
        <div className="return-success__mark" aria-hidden>
          ✓
        </div>
        <h1 id="return-success-title">{queued ? "Saved for later" : "You're all set"}</h1>
        <p className="return-success__copy">
          {queued
            ? "You're offline, so we saved this return on this device. We'll submit it automatically when you're back online."
            : "Your return is in. We'll email shipping instructions shortly."}
        </p>
        {receipt?.notice ? (
          <p className="return-success__notice" role="status">
            {receipt.notice}
          </p>
        ) : null}
        <Link to="/" className="return-success__cta">
          Back to orders
        </Link>
      </section>
    </div>
  );
}
