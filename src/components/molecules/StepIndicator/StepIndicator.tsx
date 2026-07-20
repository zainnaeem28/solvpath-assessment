import "./StepIndicator.css";

export interface StepIndicatorStep {
  id: string;
  label: string;
}

export interface StepIndicatorProps {
  steps: StepIndicatorStep[];
  currentIndex: number;
}

export function StepIndicator({ steps, currentIndex }: StepIndicatorProps) {
  return (
    <ol className="steps" aria-label="Return progress">
      {steps.map((step, index) => {
        const state =
          index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";
        return (
          <li key={step.id} className={`steps__item steps__item--${state}`}>
            <span className="steps__index" aria-hidden>
              {index < currentIndex ? "✓" : index + 1}
            </span>
            <span className="steps__label">
              {state === "current" ? <span className="sr-only">Current step: </span> : null}
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
