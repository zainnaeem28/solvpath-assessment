import "./Spinner.css";

export interface SpinnerProps {
  label?: string;
  size?: "sm" | "md";
}

export function Spinner({ label = "Loading", size = "md" }: SpinnerProps) {
  return (
    <div className={`spinner spinner--${size}`} role="status" aria-live="polite">
      <span className="spinner__ring" aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  );
}
