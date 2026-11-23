import { useState } from "react";

import { forgotPassword, resetPassword } from "../api/passwordRecoveryApi";

import {
  checkPassword,
  isEmail,
} from "../components/registration/registrationUtils";

export const RECOVERY_STEP = {
  EMAIL: 1,
  OTP: 2,
  PASSWORD: 3,
  SUCCESS: 4,
};

export default function usePasswordRecovery() {
  const [step, setStep] = useState(RECOVERY_STEP.EMAIL);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Xóa các thông báo cũ
  const clearMessages = () => {
    setErrors({});
    setApiError("");
    setNotice("");
  };

  // ======================
  // BƯỚC 1: EMAIL
  // ======================

  const changeEmail = (value) => {
    setEmail(value);
    clearMessages();
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();

    if (submitting) return;

    clearMessages();

    if (!isEmail(email)) {
      setErrors({
        email: "Vui lòng nhập email hợp lệ.",
      });
      return;
    }

    try {
      setSubmitting(true);

      await forgotPassword(email);

      setStep(RECOVERY_STEP.OTP);

      setNotice(
        "Nếu email đủ điều kiện, hệ thống sẽ gửi mã OTP. " +
          "Vui lòng kiểm tra hộp thư và thư mục Spam.",
      );
    } catch (error) {
      setApiError(error.message || "Không thể gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // ======================
  // BƯỚC 2: OTP
  // ======================

  const changeOtp = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 6);

    setOtp(cleaned);
    setErrors({});
    setApiError("");
  };

  const handleContinueOtp = (event) => {
    event.preventDefault();
    clearMessages();

    if (!/^\d{6}$/.test(otp)) {
      setErrors({
        otp: "Mã OTP phải gồm đúng 6 chữ số.",
      });
      return;
    }

    // Backend xác minh OTP tại bước reset-password
    setStep(RECOVERY_STEP.PASSWORD);
  };

  const handleResendOtp = async () => {
    if (submitting) return;

    clearMessages();

    try {
      setSubmitting(true);

      await forgotPassword(email);

      setOtp("");

      setNotice(
        "Đã tiếp nhận yêu cầu. Nếu đủ điều kiện, " +
          "mã mới sẽ được gửi đến email. " +
          "Hệ thống có giới hạn thời gian giữa các lần gửi.",
      );
    } catch (error) {
      setApiError(error.message || "Không thể gửi lại OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeEmail = () => {
    clearMessages();
    setOtp("");
    setStep(RECOVERY_STEP.EMAIL);
  };

  // ======================
  // BƯỚC 3: MẬT KHẨU
  // ======================

  const changeNewPassword = (value) => {
    setNewPassword(value);
    setErrors({});
    setApiError("");
  };

  const changeConfirmPassword = (value) => {
    setConfirmPassword(value);
    setErrors({});
    setApiError("");
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (submitting) return;

    clearMessages();

    const passwordErrors = checkPassword(newPassword, confirmPassword);

    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return;
    }

    try {
      setSubmitting(true);

      await resetPassword(email, otp, newPassword);

      // Xóa dữ liệu nhạy cảm sau khi thành công
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");

      setStep(RECOVERY_STEP.SUCCESS);
    } catch (error) {
      setApiError(
        error.message ||
          "Không thể đặt lại mật khẩu. " + "Vui lòng kiểm tra OTP và thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToOtp = () => {
    clearMessages();
    setStep(RECOVERY_STEP.OTP);
  };

  // ======================
  // DỮ LIỆU CHO COMPONENTS
  // ======================

  return {
    step,

    emailStepProps: {
      email,
      error: errors.email,
      apiError,
      submitting,
      onEmailChange: changeEmail,
      onSubmit: handleSendOtp,
    },

    otpStepProps: {
      email,
      otp,
      error: errors.otp,
      apiError,
      notice,
      submitting,
      onOtpChange: changeOtp,
      onSubmit: handleContinueOtp,
      onResend: handleResendOtp,
      onChangeEmail: handleChangeEmail,
    },

    passwordStepProps: {
      newPassword,
      confirmPassword,
      passwordError: errors.password,
      confirmPasswordError: errors.confirmPassword,
      apiError,
      submitting,
      onNewPasswordChange: changeNewPassword,
      onConfirmPasswordChange: changeConfirmPassword,
      onSubmit: handleResetPassword,
      onBack: handleBackToOtp,
    },
  };
}
