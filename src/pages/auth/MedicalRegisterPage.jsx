import { Link } from "react-router";

import useMedicalRegistration from "../../hooks/useMedicalRegistration";

import MedicalRegistrationForm from "../../components/registration/medical/MedicalRegistrationForm";

import "../../styles/registration.css";

export default function MedicalRegisterPage() {
  const registration = useMedicalRegistration();

  return (
    <div className="bd-reg-page bd-reg-medical-page">
      <div className="bd-reg-topline">ĐƠN VỊ Y TẾ</div>

      <h1 className="bd-reg-title">Đăng ký cơ sở y tế</h1>

      <p className="bd-reg-subtitle">
        Tạo tài khoản cho cơ sở y tế. Sau khi xác minh email, hồ sơ cần được
        ADMIN phê duyệt trước khi đăng nhập.
      </p>

      <nav className="bd-reg-tabs" aria-label="Loại tài khoản">
        <Link className="bd-reg-tab" to="/register">
          Cá nhân
        </Link>

        <Link
          className="bd-reg-tab is-active"
          to="/register-medical"
          aria-current="page"
        >
          Đơn vị y tế
        </Link>
      </nav>

      <MedicalRegistrationForm {...registration} />

      <p className="bd-reg-footer">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}
