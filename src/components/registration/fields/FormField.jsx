import { useId } from "react";

import {
  fieldWrapper,
  fieldLabel,
  fieldRequired,
  fieldError,
  fieldHint,
  fieldControl,
  fieldControlError,
} from "./fieldStyles";

export default function FormField({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  type = "text",
  placeholder,
  autoComplete,
  maxLength,
  min,
  max,
  inputMode,
  note,
}) {
  const id = useId();

  return (
    <div className={fieldWrapper}>
      <label htmlFor={id} className={fieldLabel}>
        {label}
        {required && (
          <span className={fieldRequired} aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        className={`${fieldControl} px-3 py-[2.5px] ${
          error ? fieldControlError : ""
        }`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        maxLength={maxLength}
        min={min}
        max={max}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : note ? `${id}-note` : undefined
        }
      />

      {note && !error && (
        <span id={`${id}-note`} className={fieldHint}>
          {note}
        </span>
      )}

      {error && (
        <span id={`${id}-error`} className={fieldError} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
