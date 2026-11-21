import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { registerMedicalWithDocument } from '../../api/registrationApi';
import AddressSelector from '../../components/registration/AddressSelector';
import {
  FormField, PasswordField, SelectField, TextAreaField, FormNotice,
  GENDER_OPTIONS,
} from '../../components/registration/RegistrationFields';
import { checkPassword, isEmail, isPastDate, todayLocal, validateDocument } from '../../components/registration/registrationUtils';
import '../../styles/registration.css';

const INITIAL = {
  fullName: '', email: '', password: '', confirmPassword: '', phoneNumber: '',
  dateOfBirth: '', gender: '', address: '',
  unitName: '', unitType: '', unitAddress: '', province: '', district: '', ward: '',
  unitPhone: '', unitEmail: '', verificationInfo: '',
};

function validate(form, file) {
  const errors = checkPassword(form.password, form.confirmPassword);
  if (!form.fullName.trim()) errors.fullName = 'Vui lòng nhập tên người đại diện.';
  if (!isEmail(form.email)) errors.email = 'Email tài khoản không đúng định dạng.';
  if (!form.gender) errors.gender = 'Vui lòng chọn giới tính.';
  if (!form.province) errors.province = 'Vui lòng chọn tỉnh/thành phố.';
  if (!form.ward) errors.ward = 'Vui lòng chọn phường/xã/đặc khu.';
  if (form.dateOfBirth && !isPastDate(form.dateOfBirth)) errors.dateOfBirth = 'Ngày sinh phải trong quá khứ.';
  if (!form.unitName.trim()) errors.unitName = 'Vui lòng nhập tên đơn vị y tế.';
  else if (form.unitName.trim().length > 150) errors.unitName = 'Tên đơn vị tối đa 150 ký tự.';
  if (!form.unitType.trim()) errors.unitType = 'Vui lòng nhập loại hình đơn vị.';
  else if (form.unitType.trim().length > 30) errors.unitType = 'Loại hình tối đa 30 ký tự.';
  if (!form.unitAddress.trim()) errors.unitAddress = 'Vui lòng nhập địa chỉ đơn vị.';
  else if (form.unitAddress.trim().length > 255) errors.unitAddress = 'Địa chỉ tối đa 255 ký tự.';
  if (form.unitPhone.trim().length > 20) errors.unitPhone = 'Số điện thoại đơn vị tối đa 20 ký tự.';
  if (form.unitEmail.trim() && !isEmail(form.unitEmail)) errors.unitEmail = 'Email đơn vị không đúng định dạng.';
  if (!form.verificationInfo.trim()) errors.verificationInfo = 'Vui lòng nhập thông tin giấy phép/xác minh.';
  const fileError = validateDocument(file);
  if (fileError) errors.document = fileError;
  return errors;
}

export default function MedicalRegisterPage() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const change = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError('');
  };

  // AddressSelector trả về tên tỉnh và phường/xã từ API (không phải DOM event).
  const changeLocation = ({ province, ward }) => {
    setForm((prev) => ({
      ...prev,
      province,
      ward,
      district: '', // Địa giới hai cấp: không còn quận/huyện hiện hành.
    }));
    setErrors((prev) => ({ ...prev, province: undefined, ward: undefined }));
    setApiError('');
  };

  const changeFile = (event) => {
    const nextFile = event.target.files?.[0] || null;
    setFile(nextFile);
    setErrors((prev) => ({ ...prev, document: nextFile ? validateDocument(nextFile) : '' }));
    setApiError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const nextErrors = validate(form, file);
    setErrors(nextErrors);
    setApiError('');
    if (Object.keys(nextErrors).length) return;

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      phoneNumber: form.phoneNumber.trim() || null,
      dateOfBirth: form.dateOfBirth || null,
      gender: form.gender,
      address: form.address.trim() || null,
      medicalUnitId: null, // Tạo đơn vị mới, KHÔNG đồng thời gửi ID đơn vị có sẵn.
      newMedicalUnit: {
        unitName: form.unitName.trim(),
        unitType: form.unitType.trim(),
        address: form.unitAddress.trim(),
        province: form.province.trim() || null,
        district: null, // Backend vẫn nhận field này; địa chỉ hiện hành dùng hai cấp.
        ward: form.ward.trim() || null,
        latitude: null, // Không bắt buộc theo DTO.
        longitude: null,
        phoneNumber: form.unitPhone.trim() || null,
        email: form.unitEmail.trim().toLowerCase() || null,
        verificationInfo: form.verificationInfo.trim(),
      },
    };

    setSubmitting(true);
    try {
      // Chỉ chuyển sang OTP sau khi Backend xác nhận đăng ký thành công.
      await registerMedicalWithDocument(payload, file);
      navigate('/verify-email', {
        state: {
          email: payload.email,
          accountType: 'MEDICAL',
        },
      });
    } catch (error) {
      setApiError(error?.message || 'Không thể đăng ký đơn vị y tế. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bd-reg-page bd-reg-medical-page">
      <div className="bd-reg-topline">ĐƠN VỊ Y TẾ</div>
      <h1 className="bd-reg-title">Đăng ký đơn vị y tế</h1>
      <p className="bd-reg-subtitle">Khai báo người đại diện và đơn vị. Hồ sơ sẽ được kiểm tra trước khi sử dụng.</p>
      <nav className="bd-reg-tabs" aria-label="Loại tài khoản">
        <Link className="bd-reg-tab" to="/register">Cá nhân</Link>
        <Link className="bd-reg-tab is-active" to="/register-medical" aria-current="page">Đơn vị y tế</Link>
      </nav>

      <form onSubmit={submit} noValidate className="bd-reg-form">
        {apiError && <FormNotice>{apiError}</FormNotice>}
        <section className="bd-reg-section" aria-labelledby="bd-medical-account-title">
          <h2 id="bd-medical-account-title" className="bd-reg-section-title">1. Thông tin người đại diện</h2>
          <p className="bd-reg-section-description">Dùng email này để đăng nhập và nhận mã OTP xác minh.</p>
          <FormField label="Họ và tên người đại diện" name="fullName" value={form.fullName} onChange={change}
            error={errors.fullName} autoComplete="name" placeholder="Họ và tên đầy đủ" required />
          <div className="bd-reg-grid-two">
            <FormField label="Email đăng nhập" name="email" value={form.email} onChange={change}
              error={errors.email} type="email" autoComplete="email" placeholder="email@example.com" required />
            <FormField label="Số điện thoại" name="phoneNumber" value={form.phoneNumber} onChange={change}
              type="tel" autoComplete="tel" placeholder="Số điện thoại đại diện" />
          </div>
          <div className="bd-reg-grid-two">
            <FormField label="Ngày sinh (không bắt buộc)" name="dateOfBirth"
              value={form.dateOfBirth} onChange={change} type="date" max={todayLocal()} error={errors.dateOfBirth} />
            <SelectField label="Giới tính" name="gender" value={form.gender} onChange={change}
              options={GENDER_OPTIONS} error={errors.gender} required />
          </div>
          <FormField label="Địa chỉ người đại diện (không bắt buộc)" name="address"
            value={form.address} onChange={change} placeholder="Địa chỉ liên hệ" />
          <div className="bd-reg-grid-two">
            <PasswordField label="Mật khẩu" name="password" value={form.password} onChange={change}
              error={errors.password} />
            <PasswordField label="Nhập lại mật khẩu" name="confirmPassword"
              value={form.confirmPassword} onChange={change} error={errors.confirmPassword} />
          </div>
          <p className="bd-reg-hint">Mật khẩu từ 8–64 ký tự; tối đa 72 byte UTF-8.</p>
        </section>

        <section className="bd-reg-section" aria-labelledby="bd-medical-unit-title">
          <h2 id="bd-medical-unit-title" className="bd-reg-section-title">2. Thông tin đơn vị y tế mới</h2>
          <p className="bd-reg-section-description">Áp dụng cho đơn vị mới, chưa có hồ sơ trong hệ thống.</p>
          <FormField label="Tên đơn vị y tế" name="unitName" value={form.unitName} onChange={change}
            error={errors.unitName} maxLength={150} placeholder="Tên đầy đủ của đơn vị" required />
          <FormField label="Loại hình đơn vị" name="unitType" value={form.unitType} onChange={change}
            error={errors.unitType} maxLength={30} placeholder="Ví dụ: Bệnh viện, trung tâm y tế" required />
          <FormField label="Địa chỉ đơn vị" name="unitAddress" value={form.unitAddress}
            onChange={change} error={errors.unitAddress} maxLength={255}
            placeholder="Số nhà, đường, khu vực..." required />
          <AddressSelector
            province={form.province}
            onChange={changeLocation}
            errors={errors}
          />
          <div className="bd-reg-grid-two">
            <FormField label="Điện thoại đơn vị" name="unitPhone" value={form.unitPhone} onChange={change}
              error={errors.unitPhone} type="tel" maxLength={20} placeholder="Số liên hệ" />
            <FormField label="Email đơn vị" name="unitEmail" value={form.unitEmail} onChange={change}
              error={errors.unitEmail} type="email" maxLength={254} placeholder="contact@example.com" />
          </div>
        </section>

        <section className="bd-reg-section" aria-labelledby="bd-medical-document-title">
          <h2 id="bd-medical-document-title" className="bd-reg-section-title">3. Giấy tờ xác minh</h2>
          <p className="bd-reg-section-description">Thông tin này giúp ADMIN kiểm tra hồ sơ của đơn vị.</p>
          <TextAreaField label="Thông tin giấy phép hoặc căn cứ xác minh" name="verificationInfo"
            value={form.verificationInfo} onChange={change} error={errors.verificationInfo}
            placeholder="Nhập số giấy phép, cơ quan cấp hoặc thông tin chứng minh tư cách đơn vị..."
            rows={3} required />
          <div className="bd-reg-field">
            <label htmlFor="bd-medical-file" className="bd-reg-label">Ảnh / bản scan giấy tờ <span className="bd-reg-required">*</span></label>
            <input id="bd-medical-file" ref={fileInputRef} type="file" className="bd-reg-file-native"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={changeFile} aria-describedby="bd-medical-file-hint bd-medical-file-error" />
            <button type="button" className={`bd-reg-upload ${errors.document ? 'bd-reg-upload-error' : ''}`}
              onClick={() => fileInputRef.current?.click()}>
              <span className="material-symbols-outlined" aria-hidden="true">upload_file</span>
              <span className="bd-reg-upload-title">{file ? file.name : 'Chọn ảnh hoặc bản scan giấy tờ'}</span>
              <span id="bd-medical-file-hint" className="bd-reg-upload-caption">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Nhấn để thay đổi tài liệu` : 'PDF, JPG, PNG · Tối đa 5 MB'}
              </span>
            </button>
            {errors.document && <span id="bd-medical-file-error" className="bd-reg-error" role="alert">{errors.document}</span>}
          </div>
          <p className="bd-reg-hint">Chỉ ADMIN được phép truy cập giấy tờ xác minh. Không tải tài liệu không liên quan đến hồ sơ.</p>
        </section>

        <div className="bd-reg-approval-note">
          <span className="material-symbols-outlined" aria-hidden="true">info</span>
          <p>Sau đăng ký, bạn cần xác minh email bằng OTP. Hồ sơ đơn vị mới sẽ chờ ADMIN phê duyệt.</p>
        </div>
        <button className="bd-reg-submit" type="submit" disabled={submitting}>
          {submitting ? 'Đang gửi hồ sơ...' : 'Gửi hồ sơ đăng ký'}
        </button>
      </form>
      <p className="bd-reg-footer">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
    </div>
  );
}