
import { useId, useState } from "react";

import {
  fieldWrapper,
  fieldLabel,
  fieldRequired,
  fieldError,
  fieldControl,
  fieldControlError,
} from "./fieldStyles";

export default function PasswordField({
  label,
  name,
  value,
  onChange,
  error,
  autoComplete = "new-password",
  required = true,
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);

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

      <div
        className={`
          ${fieldControl}
          flex w-full min-w-0 items-center overflow-hidden
          focus-within:border-[#B4232D]
          focus-within:shadow-[0_0_0_3px_rgba(180,35,45,0.08)]
          ${error ? fieldControlError : ""}
        `}
      >
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value ?? ""}
          onChange={onChange}
          autoComplete={autoComplete}
          minLength={8}
          maxLength={64}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="
            h-10 min-w-0 flex-1
            border-0 bg-transparent
            px-3 py-2
            text-[13.5px] text-[#263445]
            outline-none
            placeholder:text-[#94A3B8]
          "
        />

        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          aria-pressed={visible}
          className="
            grid h-10 w-10 shrink-0
            cursor-pointer place-items-center
            border-0 bg-transparent p-0
            text-[#68788A]
            hover:text-[#B4232D]
            focus-visible:outline-2
            focus-visible:outline-offset-2px
            focus-visible:outline-[#B4232D]
          "
        >
          <span
            className="
              material-symbols-outlined
              text-[20px] leading-none
            "
            aria-hidden="true"
          >
            {visible ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>

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
