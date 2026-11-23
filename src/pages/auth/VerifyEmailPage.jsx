import { Link } from "react-router";

import useEmailVerification from "../../hooks/useEmailVerification";

import VerifyEmailForm from "../../components/email-verification/VerifyEmailForm";
import VerificationSuccess from "../../components/email-verification/VerificationSuccess";

import "../../styles/registration.css";
import "../../styles/verify-email.css";

export default function VerifyEmailPage() {
  const { verified, accountType, normalizedEmail, formProps } =
    useEmailVerification();

  if (verified) {
    return (
      <VerificationSuccess email={normalizedEmail} accountType={accountType} />
    );
  }

  return (
    <div className="bd-reg-page bd-otp-page">
      <div className="bd-otp-header">
        <span
          className="material-symbols-outlined bd-otp-main-icon"
          aria-hidden="true"
        >
          mark_email_unread
        </span>

        <div className="bd-reg-topline">XÁC MINH TÀI KHOẢN</div>

        <h1 className="bd-reg-title">Xác minh email</h1>

        <p className="bd-reg-subtitle">
          Nhập mã gồm 6 chữ số đã được gửi đến địa chỉ email đăng ký.
        </p>
      </div>

      <VerifyEmailForm {...formProps} />

      <p className="bd-reg-footer">
        <Link to="/login">Quay về đăng nhập</Link>
      </p>
    </div>
  );
}
