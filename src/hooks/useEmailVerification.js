import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { resendEmailOtp, verifyEmail } from "../api/emailOtpApi";

import useOtpDigits from "./useOtpDigits";

import {
  OTP_LENGTH,
  validEmail,
  maskEmail,
} from "../utils/emailVerificationUtils";

export default function useEmailVerification() {
  const location = useLocation();

  const registeredEmail =
    typeof location.state?.email === "string"
      ? location.state.email.trim().toLowerCase()
      : "";

  const accountType =
    location.state?.accountType === "MEDICAL" ? "MEDICAL" : "USER";

  const [email, setEmail] = useState(registeredEmail);
  const [editEmail, setEditEmail] = useState(!registeredEmail);

  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [verified, setVerified] = useState(false);

  const {
    digits,
    otp,
    digitRefs,
    applyDigits,
    handlePaste,
    handleKeyDown,
    resetDigits,
    focusFirstDigit,
  } = useOtpDigits(() => setError(""));

  const normalizedEmail = email.trim().toLowerCase();

  const busy = submitting || resending;

  const canVerify =
    validEmail(normalizedEmail) && otp.length === OTP_LENGTH && !submitting;

  // Đếm ngược 60 giây khi gửi lại OTP
  useEffect(() => {
    if (cooldown <= 0) return undefined;

    const timeout = window.setTimeout(() => {
      setCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [cooldown]);

  // Thay đổi email
  const changeEmail = (value) => {
    setEmail(value);
    setError("");
    setNotice("");
  };

  const startEditEmail = () => {
    setEditEmail(true);
  };

  const finishEditEmail = () => {
    if (validEmail(normalizedEmail)) {
      setEditEmail(false);
    }
  };

  // Xác minh mã OTP
  const handleVerify = async (event) => {
    event.preventDefault();

    if (!validEmail(normalizedEmail)) {
      setError("Vui lòng nhập email đăng ký hợp lệ.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Mã OTP phải gồm đúng 6 chữ số.");
      return;
    }

    if (busy) return;

    setSubmitting(true);
    setError("");
    setNotice("");

    try {
      await verifyEmail(normalizedEmail, otp);

      setVerified(true);
    } catch (apiError) {
      setError(apiError?.message || "Xác minh thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Gửi lại mã OTP
  const handleResend = async () => {
    if (!validEmail(normalizedEmail)) {
      setError("Vui lòng nhập email đăng ký hợp lệ để gửi lại mã.");
      setEditEmail(true);
      return;
    }

    if (busy || cooldown > 0) return;

    setResending(true);
    setError("");
    setNotice("");

    try {
      await resendEmailOtp(normalizedEmail);

      resetDigits();

      setNotice("Đã yêu cầu gửi mã mới. Hãy kiểm tra email, kể cả mục Spam.");

      // Giới hạn nút ở giao diện
      setCooldown(60);

      focusFirstDigit();
    } catch (apiError) {
      setError(apiError?.message || "Không thể gửi lại mã. Vui lòng thử lại.");
    } finally {
      setResending(false);
    }
  };

  return {
    verified,
    accountType,
    normalizedEmail,

    formProps: {
      registeredEmail,
      email,
      editEmail,
      maskedEmail: maskEmail(normalizedEmail),

      digits,
      digitRefs,

      submitting,
      resending,
      cooldown,
      busy,
      canVerify,
      error,
      notice,

      onEmailChange: changeEmail,
      onStartEditEmail: startEditEmail,
      onFinishEditEmail: finishEditEmail,

      onDigitChange: applyDigits,
      onDigitPaste: handlePaste,
      onDigitKeyDown: handleKeyDown,

      onSubmit: handleVerify,
      onResend: handleResend,
    },
  };
}
