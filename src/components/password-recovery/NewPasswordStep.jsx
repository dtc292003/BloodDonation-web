
import {
  PasswordField,
  FormNotice,
} from "../registration/RegistrationFields";

export default function NewPasswordStep({
  newPassword,
  confirmPassword,
  passwordError,
  confirmPasswordError,
  apiError,
  submitting,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onBack,
}) {
  return (
    <>
      <h1 className="bd-reg-title">Đặt mật khẩu mới</h1>

      <p className="bd-reg-subtitle">
        Tạo mật khẩu mới.
      </p>

      <form
        onSubmit={onSubmit}
        className="bd-reg-form"
        noValidate
      >
        {apiError && <FormNotice>{apiError}</FormNotice>}

        <PasswordField
          label="Mật khẩu mới"
          name="password"
          value={newPassword}
          onChange={(event) =>
            onNewPasswordChange(event.target.value)
          }
          error={passwordError}
        />

        <PasswordField
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(event) =>
            onConfirmPasswordChange(event.target.value)
          }
          error={confirmPasswordError}
        />

        <p className="bd-reg-hint">
          mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
        </p>

        <button
          type="submit"
          className="bd-reg-submit"
          disabled={submitting}
        >
          {submitting ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
        </button>

        <button
          type="button"
          className="bd-reg-tab"
          disabled={submitting}
          onClick={onBack}
        >
          Quay lại nhập OTP
        </button>
      </form>
    </>
  );
}
