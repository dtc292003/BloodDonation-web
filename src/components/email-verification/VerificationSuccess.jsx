import { Link } from "react-router";

export default function VerificationSuccess({ email, accountType }) {
  return (
    <div className="bd-reg-page bd-otp-page">
      <section className="bd-otp-success" role="status">
        <span
          className="material-symbols-outlined bd-otp-main-icon"
          aria-hidden="true"
        >
          verified
        </span>

        <h1 className="bd-reg-title">Xác minh email thành công</h1>

        <p className="bd-reg-subtitle">
          Email <strong>{email}</strong> đã được xác minh.
        </p>

        {accountType === "MEDICAL" && (
          <p className="bd-otp-medical-note">
            Tài khoản MEDICAL vẫn cần được ADMIN phê duyệt trước khi sử dụng các
            chức năng dành cho đơn vị y tế.
          </p>
        )}

        <Link to="/login" className="bd-otp-login-link">
          Đến trang đăng nhập
        </Link>
      </section>
    </div>
  );
}
