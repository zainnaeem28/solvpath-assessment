import { Input } from "@/components/atoms/Input";
import "./SearchField.css";

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
  label = "Search",
  id = "search",
}: SearchFieldProps) {
  return (
    <div className="search-field">
      <span className="search-field__icon" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M7.25 12.5a5.25 5.25 0 1 1 0-10.5 5.25 5.25 0 0 1 0 10.5Zm0-1.5a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Zm5.78 3.28a.75.75 0 0 0 1.06-1.06l-2.5-2.5a.75.75 0 0 0-1.06 1.06l2.5 2.5Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <Input
        id={id}
        className="search-field__input"
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type="search"
        autoComplete="off"
      />
    </div>
  );
}
