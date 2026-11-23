
import { useId } from "react";

import {
  fieldWrapper,
  fieldLabel,
  fieldRequired,
  fieldError,
  fieldControl,
  fieldControlError,
} from "./fieldStyles";

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = "Chọn giới tính",
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

      <select
        id={id}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : undefined
        }
        className={`
          ${fieldControl}
          cursor-pointer px-3 py-[2.5px]
          ${error ? fieldControlError : ""}
        `}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

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
