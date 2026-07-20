import type { ReturnResolution } from "@/api/mockApi";
import { formatMoney } from "@/lib/format";
import {
  RESOLUTION_COPY,
  calculateStoreCreditCents,
} from "../lib/money";
import "./ResolutionPicker.css";

export interface ResolutionPickerProps {
  value: ReturnResolution | null;
  onChange: (value: ReturnResolution) => void;
  subtotalCents: number;
  error?: string;
}

const OPTIONS: ReturnResolution[] = ["refund", "exchange", "store_credit"];

export function ResolutionPicker({
  value,
  onChange,
  subtotalCents,
  error,
}: ResolutionPickerProps) {
  return (
    <fieldset className="resolution">
      <legend className="sr-only">Choose a resolution</legend>
      <div className="resolution__list" role="radiogroup" aria-label="Resolution">
        {OPTIONS.map((option) => {
          const copy = RESOLUTION_COPY[option];
          const selected = value === option;
          const amount =
            option === "store_credit"
              ? calculateStoreCreditCents(subtotalCents)
              : subtotalCents;

          return (
            <label
              key={option}
              className={`resolution__option${selected ? " resolution__option--selected" : ""}`}
            >
              <input
                type="radio"
                name="resolution"
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
              />
              <span className="resolution__body">
                <span className="resolution__title">{copy.title}</span>
                <span className="resolution__desc">{copy.description}</span>
                {option !== "exchange" ? (
                  <span className="resolution__amount">
                    {option === "store_credit" ? "Credit value" : "Refund amount"}:{" "}
                    <strong>{formatMoney(amount)}</strong>
                    {option === "store_credit" ? (
                      <span className="resolution__bonus"> includes +10% bonus</span>
                    ) : null}
                  </span>
                ) : (
                  <span className="resolution__amount">
                    Exchange value: <strong>{formatMoney(subtotalCents)}</strong>
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p className="resolution__error" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
