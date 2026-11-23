export default function OtpDigitInputs({
  digits,
  digitRefs,
  busy,
  error,
  onDigitChange,
  onDigitPaste,
  onDigitKeyDown,
}) {
  return (
    <div className="bd-reg-field">
      <label htmlFor="bd-otp-digit-0" className="bd-reg-label">
        Mã xác minh OTP
      </label>

      <div className="bd-otp-digits" aria-label="Nhập mã OTP 6 chữ số">
        {digits.map((digit, index) => (
          <input
            key={index}
            id={`bd-otp-digit-${index}`}
            ref={(element) => {
              digitRefs.current[index] = element;
            }}
            className="bd-otp-digit"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Chữ số thứ ${index + 1} của mã OTP`}
            aria-invalid={Boolean(error)}
            value={digit}
            onChange={(event) => onDigitChange(index, event.target.value)}
            onPaste={(event) => onDigitPaste(event, index)}
            onKeyDown={(event) => onDigitKeyDown(event, index)}
            disabled={busy}
          />
        ))}
      </div>

      <p className="bd-reg-hint">Bạn có thể dán cả mã 6 số vào bất kỳ ô nào.</p>
    </div>
  );
}
