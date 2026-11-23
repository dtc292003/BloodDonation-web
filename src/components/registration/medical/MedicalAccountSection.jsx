import { FormField, PasswordField } from "../RegistrationFields";

export default function MedicalAccountSection({ form, errors, onChange }) {
  return (
    <section
      className="bd-reg-section"
      aria-labelledby="bd-medical-account-title"
    >
      <h2 id="bd-medical-account-title" className="bd-reg-section-title">
        1. Thông tin tài khoản
      </h2>

      <p className="bd-reg-section-description">
        Email này dùng để nhận OTP, đăng nhập và nhận thông báo của hệ thống.
      </p>

      <FormField
        label="Email cơ sở y tế"
        name="email"
        value={form.email}
        onChange={onChange}
        error={errors.email}
        type="email"
        autoComplete="email"
        maxLength={254}
        placeholder="medical@gmail.com"
        required
      />

      <div className="bd-reg-grid-two">
        <PasswordField
          label="Mật khẩu"
          name="password"
          value={form.password}
          onChange={onChange}
          error={errors.password}
        />

        <PasswordField
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword}
        />
      </div>

      <p className="bd-reg-hint">
        Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký
        tự đặc biệt.
      </p>
    </section>
  );
}
