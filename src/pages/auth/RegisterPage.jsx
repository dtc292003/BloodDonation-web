import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { registerUser } from '../../api/registrationApi';
import {
  FormField, PasswordField, SelectField, FormNotice,
  GENDER_OPTIONS,
} from '../../components/registration/RegistrationFields';
import { checkPassword, isEmail, isPastDate, todayLocal } from '../../components/registration/registrationUtils';
import '../../styles/registration.css';

const INITIAL = {
  fullName: '', email: '', phoneNumber: '', dateOfBirth: '', gender: '', address: '',
  password: '', confirmPassword: '',
};

function validate(form) {
  const errors = checkPassword(form.password, form.confirmPassword);
  if (!form.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên.';
  else if (form.fullName.trim().length > 150) errors.fullName = 'Họ tên tối đa 150 ký tự.';
  if (!isEmail(form.email)) errors.email = 'Email không đúng định dạng.';
  if (!form.phoneNumber.trim()) errors.phoneNumber = 'Vui lòng nhập số điện thoại.';
  if (!form.dateOfBirth) errors.dateOfBirth = 'Vui lòng chọn ngày sinh.';
  else if (!isPastDate(form.dateOfBirth)) errors.dateOfBirth = 'Ngày sinh phải là ngày trong quá khứ.';
  if (!form.gender) errors.gender = 'Vui lòng chọn giới tính.';
  return errors;
}

export default function RegisterPage() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const change = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setApiError('');
    if (Object.keys(nextErrors).length) return;

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      phoneNumber: form.phoneNumber.trim(),
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      address: form.address.trim() || null,
    };

    setSubmitting(true);
    try {
      await registerUser(payload);
      navigate('/verify-email', {
        state: { email: payload.email, accountType: 'USER' },
      });
    } catch (error) {
      setApiError(error?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bd-reg-page">
      <div className="bd-reg-topline">TẠO TÀI KHOẢN</div>
      <h1 className="bd-reg-title">Đăng ký tài khoản</h1>
      <p className="bd-reg-subtitle">Tham gia cộng đồng hiến máu và kết nối những người cần giúp đỡ.</p>

      <nav className="bd-reg-tabs" aria-label="Loại tài khoản">
        <Link className="bd-reg-tab is-active" to="/register" aria-current="page">Cá nhân</Link>
        <Link className="bd-reg-tab" to="/register-medical">Đơn vị y tế</Link>
      </nav>

      <form onSubmit={submit} noValidate className="bd-reg-form">
          {apiError && <FormNotice>{apiError}</FormNotice>}
          <FormField label="Họ và tên" name="fullName" value={form.fullName} onChange={change}
            error={errors.fullName} maxLength={150} autoComplete="name" required
            placeholder="Nhập họ và tên đầy đủ" />
          <div className="bd-reg-grid-two">
            <FormField label="Email" name="email" value={form.email} onChange={change}
              error={errors.email} type="email" autoComplete="email" required
              placeholder="ten@example.com" />
            <FormField label="Số điện thoại" name="phoneNumber" value={form.phoneNumber}
              onChange={change} error={errors.phoneNumber} type="tel" autoComplete="tel"
              placeholder="Số điện thoại liên hệ" required />
          </div>
          <div className="bd-reg-grid-two">
            <FormField label="Ngày sinh" name="dateOfBirth" value={form.dateOfBirth}
              onChange={change} error={errors.dateOfBirth} type="date" max={todayLocal()} required />
            <SelectField label="Giới tính" name="gender" value={form.gender} onChange={change}
              error={errors.gender} options={GENDER_OPTIONS} required />
          </div>
          <FormField label="Địa chỉ (không bắt buộc)" name="address" value={form.address}
            onChange={change} placeholder="Địa chỉ hiện tại" autoComplete="street-address" />
          <div className="bd-reg-grid-two">
            <PasswordField label="Mật khẩu" name="password" value={form.password} onChange={change}
              error={errors.password} />
            <PasswordField label="Nhập lại mật khẩu" name="confirmPassword" value={form.confirmPassword}
              onChange={change} error={errors.confirmPassword} />
          </div>
          <p className="bd-reg-hint bd-reg-password-hint">Mật khẩu từ 8–64 ký tự; tối đa 72 byte UTF-8.</p>
          <button className="bd-reg-submit" type="submit" disabled={submitting}>
            {submitting ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}
          </button>
      </form>
      <p className="bd-reg-footer">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
    </div>
  );
}