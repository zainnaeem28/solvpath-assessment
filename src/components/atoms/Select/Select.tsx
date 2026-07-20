import type { SelectHTMLAttributes } from "react";
import "../Input/Input.css";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export function Select({
  id,
  label,
  options,
  error,
  className = "",
  ...rest
}: SelectProps) {
  const selectId = id ?? rest.name;

  return (
    <label className={`field ${className}`.trim()} htmlFor={selectId}>
      {label ? <span className="field__label">{label}</span> : null}
      <select
        id={selectId}
        className={`field__control${error ? " field__control--error" : ""}`}
        aria-invalid={error ? true : undefined}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="field__error" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
