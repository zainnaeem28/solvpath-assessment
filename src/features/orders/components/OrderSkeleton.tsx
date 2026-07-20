import "./OrderSkeleton.css";

export function OrderSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="order-skeleton" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="order-skeleton__card">
          <div className="order-skeleton__row">
            <div className="skeleton order-skeleton__title" />
            <div className="skeleton order-skeleton__badge" />
          </div>
          <div className="skeleton order-skeleton__line" />
          <div className="skeleton order-skeleton__line order-skeleton__line--short" />
          <div className="order-skeleton__footer">
            <div className="skeleton order-skeleton__price" />
            <div className="skeleton order-skeleton__cta" />
          </div>
        </div>
      ))}
    </div>
  );
}
