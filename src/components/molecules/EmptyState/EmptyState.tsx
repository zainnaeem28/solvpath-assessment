import { Button } from "@/components/atoms/Button";
import "./EmptyState.css";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__mark" aria-hidden />
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__desc">{description}</p>
      {actionLabel && onAction ? (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
