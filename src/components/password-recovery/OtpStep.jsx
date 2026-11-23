import { FormField, FormNotice } from "../registration/RegistrationFields";

export default function OtpStep({
  email,
  otp,
  error,
  apiError,
  notice,
  submitting,
  onOtpChange,
  onSubmit,
  onResend,
  onChangeEmail,
}) {
  return (
    <>
      <h1 className="bd-reg-title">Nhập mã xác minh</h1>

      <p className="bd-reg-subtitle">
        Mã OTP gồm 6 chữ số, có hiệu lực trong 5 phút.
      </p>

      <p className="bd-reg-hint">
        Email: <strong>{email.trim()}</strong>
      </p>

      <form onSubmit={onSubmit} className="bd-reg-form" noValidate>
        {apiError && <FormNotice>{apiError}</FormNotice>}

        {notice && (
          <p className="bd-reg-hint" role="status">
            {notice}
          </p>
        )}

        <FormField
          label="Mã OTP"
          name="otp"
          value={otp}
          onChange={(event) => onOtpChange(event.target.value)}
          error={error}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="Nhập 6 chữ số"
          required
        />

        <button type="submit" className="bd-reg-submit" disabled={submitting}>
          Tiếp tục
        </button>

        <button
          type="button"
          className="bd-reg-tab"
          disabled={submitting}
          onClick={onResend}
        >
          {submitting ? "Đang xử lý..." : "Gửi lại mã OTP"}
        </button>

        <button
          type="button"
          className="bd-reg-tab"
          disabled={submitting}
          onClick={onChangeEmail}
        >
          Thay đổi email
        </button>
      </form>
    </>
  );
}
