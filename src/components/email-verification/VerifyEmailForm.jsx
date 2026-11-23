import VerificationEmailField from "./VerificationEmailField";
import OtpDigitInputs from "./OtpDigitInputs";

export default function VerifyEmailForm({
  registeredEmail,
  email,
  editEmail,
  maskedEmail,
  digits,
  digitRefs,
  submitting,
  resending,
  cooldown,
  busy,
  canVerify,
  error,
  notice,
  onEmailChange,
  onStartEditEmail,
  onFinishEditEmail,
  onDigitChange,
  onDigitPaste,
  onDigitKeyDown,
  onSubmit,
  onResend,
}) {
  return (
    <form className="bd-reg-form bd-otp-form" onSubmit={onSubmit} noValidate>
      <VerificationEmailField
        registeredEmail={registeredEmail}
        email={email}
        editEmail={editEmail}
        maskedEmail={maskedEmail}
        onEmailChange={onEmailChange}
        onStartEditEmail={onStartEditEmail}
        onFinishEditEmail={onFinishEditEmail}
      />

      <OtpDigitInputs
        digits={digits}
        digitRefs={digitRefs}
        busy={busy}
        error={error}
        onDigitChange={onDigitChange}
        onDigitPaste={onDigitPaste}
        onDigitKeyDown={onDigitKeyDown}
      />

      {error && (
        <div className="bd-reg-notice bd-reg-notice-error" role="alert">
          {error}
        </div>
      )}

      {notice && (
        <div className="bd-reg-notice bd-reg-notice-success" role="status">
          {notice}
        </div>
      )}

      <button
        className="bd-reg-submit"
        type="submit"
        disabled={!canVerify || resending}
      >
        {submitting ? "Đang xác minh..." : "Xác minh email"}
      </button>

      <div className="bd-otp-resend">
        <span>Chưa nhận được mã?</span>

        <button
          type="button"
          className="bd-otp-text-button"
          onClick={onResend}
          disabled={busy || cooldown > 0}
        >
          {resending
            ? "Đang gửi..."
            : cooldown > 0
              ? `Gửi lại sau ${cooldown}s`
              : "Gửi lại mã OTP"}
        </button>
      </div>
    </form>
  );
}
