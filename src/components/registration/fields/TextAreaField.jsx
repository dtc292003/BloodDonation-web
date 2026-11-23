
import { useId } from "react";

import {
  fieldWrapper,
  fieldLabel,
  fieldRequired,
  fieldError,
  fieldControl,
  fieldControlError,
} from "./fieldStyles";

export default function TextAreaField({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  rows = 3,
}) {
  const id = useId();

  return (
    <div className={fieldWrapper}>
      <label htmlFor={id} className={fieldLabel}>
        {label}
        {required && (
          <span className={fieldRequired} aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>

      <textarea
        id={id}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : undefined
        }
        className={`
          ${fieldControl}
          min-h-[23.5px] resize-y
          px-3 py-[2.5px] leading-[1.55]
          ${error ? fieldControlError : ""}
        `}
      />

      {error && (
        <span
          id={`${id}-error`}
          className={fieldError}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}
