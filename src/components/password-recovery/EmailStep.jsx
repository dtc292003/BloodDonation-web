import { FormField, FormNotice } from "../registration/RegistrationFields";

export default function EmailStep({
  email,
  error,
  apiError,
  submitting,
  onEmailChange,
  onSubmit,
}) {
  return (
    <>
      <h1 className="bd-reg-title">Quên mật khẩu?</h1>

      <p className="bd-reg-subtitle">
        Nhập email đã đăng ký tài khoản BloodDonation để yêu cầu mã OTP đặt lại
        mật khẩu.
      </p>

      <form onSubmit={onSubmit} noValidate className="bd-reg-form">
        {apiError && <FormNotice>{apiError}</FormNotice>}

        <FormField
          label="Địa chỉ email"
          name="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          error={error}
          type="email"
          autoComplete="email"
          placeholder="example@gmail.com"
          required
        />

        <button type="submit" className="bd-reg-submit" disabled={submitting}>
          {submitting ? "Đang xử lý..." : "Gửi mã xác minh"}
        </button>
      </form>
    </>
  );
}
