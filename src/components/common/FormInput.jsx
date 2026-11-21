
import { useState } from "react";
import GoogleIcon from "./GoogleIcon";

function FormInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled = false,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType =
    isPassword && showPassword ? "text" : type;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[#263445]"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          className={`h-11 w-full rounded-md border border-[#CBD5E1] bg-white px-3 text-sm text-[#263445] outline-none transition-colors placeholder:text-slate-400 focus:border-[#B4232D] focus:ring-2 focus:ring-[#B4232D]/15 disabled:bg-slate-50 ${
            isPassword ? "pr-12" : ""
          }`}
        />

        {isPassword && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
            }
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-[#B4232D] disabled:opacity-50"
          >
            <GoogleIcon
              name={
                showPassword
                  ? "visibility_off"
                  : "visibility"
              }
              size={20}
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default FormInput;
