import { Link, useParams } from "react-router-dom";
import { Spinner } from "@/components/atoms/Spinner";
import { ErrorBanner } from "@/components/molecules/ErrorBanner";
import { useOrder } from "@/features/orders/hooks/useOrder";
import { ReturnFlow } from "@/features/returns/components/ReturnFlow";

export function ReturnFlowPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { status, order, error, retry } = useOrder(orderId);

  if (status === "loading") {
    return (
      <div className="page-status" aria-busy="true">
        <Spinner label="Loading order" />
        <p>Loading order details…</p>
      </div>
    );
  }

  if (status === "error" || !order) {
    return (
      <div className="page-status page-status--start">
        <ErrorBanner
          title="Couldn't open this return"
          message={error ?? "We couldn't find that order."}
          onRetry={retry}
        />
        <Link to="/">Back to orders</Link>
      </div>
    );
  }

  return <ReturnFlow order={order} />;
}
