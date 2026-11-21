import { useId, useState } from 'react';

export function FormField({ label, name, value, onChange, error, required = false,
  type = 'text', placeholder, autoComplete, maxLength, min, max, inputMode, note }) {
  const id = useId();
  return (
    <div className="bd-reg-field">
      <label htmlFor={id} className="bd-reg-label">
        {label}{required && <span className="bd-reg-required" aria-hidden="true"> *</span>}
      </label>
      <input id={id} className={`bd-reg-input ${error ? 'bd-reg-input-error' : ''}`}
        name={name} type={type} value={value ?? ''} onChange={onChange}
        placeholder={placeholder} autoComplete={autoComplete}
        required={required} maxLength={maxLength} min={min} max={max} inputMode={inputMode}
        aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : note ? `${id}-note` : undefined}
      />
      {note && !error && <span id={`${id}-note`} className="bd-reg-hint">{note}</span>}
      {error && <span id={`${id}-error`} className="bd-reg-error">{error}</span>}
    </div>
  );
}

export function PasswordField({ label, name, value, onChange, error, autoComplete = 'new-password', required = true }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="bd-reg-field">
      <label htmlFor={id} className="bd-reg-label">
        {label}{required && <span className="bd-reg-required" aria-hidden="true"> *</span>}
      </label>
      <div className={`bd-reg-password-wrap ${error ? 'bd-reg-input-error' : ''}`}>
        <input id={id} className="bd-reg-password-input" name={name}
          type={visible ? 'text' : 'password'} value={value ?? ''}
          onChange={onChange} autoComplete={autoComplete} minLength={8} maxLength={64}
          required={required} aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button type="button" className="bd-reg-eye" onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          aria-pressed={visible}>
          <span className="material-symbols-outlined" aria-hidden="true">{visible ? 'visibility_off' : 'visibility'}</span>
        </button>
      </div>
      {error && <span id={`${id}-error`} className="bd-reg-error">{error}</span>}
    </div>
  );
}

export function SelectField({ label, name, value, onChange, options, error, required = false }) {
  const id = useId();
  return (
    <div className="bd-reg-field">
      <label htmlFor={id} className="bd-reg-label">
        {label}{required && <span className="bd-reg-required" aria-hidden="true"> *</span>}
      </label>
      <select id={id} className={`bd-reg-input bd-reg-select ${error ? 'bd-reg-input-error' : ''}`}
        name={name} value={value} onChange={onChange} required={required} aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}>
        <option value="">Chọn giới tính</option>
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <span id={`${id}-error`} className="bd-reg-error">{error}</span>}
    </div>
  );
}

export function TextAreaField({ label, name, value, onChange, error, required = false, placeholder, rows = 3 }) {
  const id = useId();
  return (
    <div className="bd-reg-field">
      <label htmlFor={id} className="bd-reg-label">
        {label}{required && <span className="bd-reg-required" aria-hidden="true"> *</span>}
      </label>
      <textarea id={id} className={`bd-reg-input bd-reg-textarea ${error ? 'bd-reg-input-error' : ''}`}
        name={name} value={value ?? ''} onChange={onChange} rows={rows}
        placeholder={placeholder} required={required} aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <span id={`${id}-error`} className="bd-reg-error">{error}</span>}
    </div>
  );
}

export function FormNotice({ variant = 'error', children }) {
  return <div className={`bd-reg-notice bd-reg-notice-${variant}`} role={variant === 'error' ? 'alert' : 'status'}>{children}</div>;
}

export const GENDER_OPTIONS = [
  { value: 'NAM', label: 'Nam' },
  { value: 'NU', label: 'Nữ' },
  { value: 'KHAC', label: 'Khác' },
];

export function RegistrationSuccess({ email, medical = false }) {
  return (
    <section className="bd-reg-success" role="status">
      <span className="material-symbols-outlined bd-reg-success-icon" aria-hidden="true">mark_email_read</span>
      <h2>Đã gửi mã xác minh</h2>
      <p>Tài khoản đã được tạo và hệ thống đã gửi OTP đến <strong>{email}</strong>.</p>
      <p>Vui lòng xác minh email để tiếp tục.{medical ? ' Sau khi xác minh, đơn vị y tế mới vẫn cần được ADMIN phê duyệt.' : ''}</p>
      <p className="bd-reg-hint">Hãy kiểm tra hộp thư, kể cả thư mục Spam. Tài khoản cần hoàn tất xác minh email trước khi sử dụng.</p>
      <a href="/login" className="bd-reg-secondary-link">Quay về đăng nhập</a>
    </section>
  );
}
