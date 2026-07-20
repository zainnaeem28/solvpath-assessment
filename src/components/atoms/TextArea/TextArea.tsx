import type { TextareaHTMLAttributes } from "react";
import "../Input/Input.css";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function TextArea({
  id,
  label,
  hint,
  error,
  className = "",
  rows = 3,
  ...rest
}: TextAreaProps) {
  const areaId = id ?? rest.name;
  const hintId = areaId ? `${areaId}-hint` : undefined;
  const errorId = areaId ? `${areaId}-error` : undefined;

  return (
    <label className={`field ${className}`.trim()} htmlFor={areaId}>
      {label ? <span className="field__label">{label}</span> : null}
      <textarea
        id={areaId}
        rows={rows}
        className={`field__control${error ? " field__control--error" : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && errorId ? errorId : hint && hintId ? hintId : undefined}
        {...rest}
      />
      {error ? (
        <span id={errorId} className="field__error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className="field__hint">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
