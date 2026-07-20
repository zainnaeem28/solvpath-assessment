import { Button } from "@/components/atoms/Button";
import "./ErrorBanner.css";

export interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorBanner({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
}: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      <div className="error-banner__copy">
        <strong className="error-banner__title">{title}</strong>
        <p className="error-banner__message">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
