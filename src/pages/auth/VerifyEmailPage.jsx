import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { resendEmailOtp, verifyEmail } from '../../api/emailOtpApi';
import '../../styles/registration.css';
import '../../styles/verify-email.css';

const OTP_LENGTH = 6;
const EMPTY_DIGITS = ['', '', '', '', '', ''];

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function maskEmail(email) {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const [name, domain] = parts;
  return `${name.slice(0, Math.min(3, name.length))}***@${domain}`;
}

export default function VerifyEmailPage() {
  const location = useLocation();
  const registeredEmail = typeof location.state?.email === 'string'
    ? location.state.email.trim().toLowerCase()
    : '';
  const accountType = location.state?.accountType === 'MEDICAL' ? 'MEDICAL' : 'USER';

  const [email, setEmail] = useState(registeredEmail);
  const [editEmail, setEditEmail] = useState(!registeredEmail);
  const [digits, setDigits] = useState(EMPTY_DIGITS);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [verified, setVerified] = useState(false);
  const digitRefs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timeout = window.setTimeout(() => {
      setCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [cooldown]);

  const otp = digits.join('');
  const normalizedEmail = email.trim().toLowerCase();
  const canVerify = validEmail(normalizedEmail) && otp.length === OTP_LENGTH && !submitting;
  const busy = submitting || resending;

  function applyDigits(index, value) {
    // Hỗ trợ cả gõ từng số và autofill chuỗi 6 chữ số trên điện thoại.
    const numbers = value.replace(/\D/g, '');
    if (!numbers) {
      setDigits((prev) => prev.map((digit, i) => i === index ? '' : digit));
      return;
    }
    const next = [...digits];
    const start = numbers.length === OTP_LENGTH ? 0 : index;
    [...numbers].slice(0, OTP_LENGTH - start).forEach((digit, i) => {
      next[start + i] = digit;
    });
    setDigits(next);
    setError('');
    const target = Math.min(OTP_LENGTH - 1, start + numbers.length);
    digitRefs.current[target]?.focus();
  }

  function handlePaste(event, index) {
    const text = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!text) return;
    event.preventDefault();
    const next = [...digits];
    const start = text.length === OTP_LENGTH ? 0 : index;
    [...text].slice(0, OTP_LENGTH - start).forEach((digit, i) => {
      next[start + i] = digit;
    });
    setDigits(next);
    setError('');
    const target = Math.min(OTP_LENGTH - 1, start + text.length);
    digitRefs.current[target]?.focus();
  }

  function handleKeyDown(event, index) {
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      digitRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault();
      digitRefs.current[index + 1]?.focus();
    } else if (event.key === 'Backspace') {
      event.preventDefault();
      if (digits[index]) {
        setDigits((prev) => prev.map((digit, i) => i === index ? '' : digit));
      } else if (index > 0) {
        setDigits((prev) => prev.map((digit, i) => i === index - 1 ? '' : digit));
        digitRefs.current[index - 1]?.focus();
      }
    }
  }

  async function handleVerify(event) {
    event.preventDefault();
    if (!validEmail(normalizedEmail)) {
      setError('Vui lòng nhập email đăng ký hợp lệ.');
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError('Mã OTP phải gồm đúng 6 chữ số.');
      return;
    }
    if (busy) return;

    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      await verifyEmail(normalizedEmail, otp);
      setVerified(true);
    } catch (apiError) {
      setError(apiError?.message || 'Xác minh thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (!validEmail(normalizedEmail)) {
      setError('Vui lòng nhập email đăng ký hợp lệ để gửi lại mã.');
      setEditEmail(true);
      return;
    }
    if (busy || cooldown > 0) return;
    setResending(true);
    setError('');
    setNotice('');
    try {
      await resendEmailOtp(normalizedEmail);
      setDigits([...EMPTY_DIGITS]);
      setNotice('Đã yêu cầu gửi mã mới. Hãy kiểm tra email, kể cả mục Spam.');
      setCooldown(60); // Giới hạn nút phía giao diện; Backend vẫn quyết định giới hạn thực tế.
      digitRefs.current[0]?.focus();
    } catch (apiError) {
      setError(apiError?.message || 'Không thể gửi lại mã. Vui lòng thử lại.');
    } finally {
      setResending(false);
    }
  }

  if (verified) {
    return (
      <div className="bd-reg-page bd-otp-page">
        <section className="bd-otp-success" role="status">
          <span className="material-symbols-outlined bd-otp-main-icon" aria-hidden="true">verified</span>
          <h1 className="bd-reg-title">Xác minh email thành công</h1>
          <p className="bd-reg-subtitle">Email <strong>{normalizedEmail}</strong> đã được xác minh.</p>
          {accountType === 'MEDICAL' && (
            <p className="bd-otp-medical-note">
              Tài khoản MEDICAL vẫn cần được ADMIN phê duyệt trước khi sử dụng các chức năng dành cho đơn vị y tế.
            </p>
          )}
          <Link to="/login" className="bd-otp-login-link">Đến trang đăng nhập</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="bd-reg-page bd-otp-page">
      <div className="bd-otp-header">
        <span className="material-symbols-outlined bd-otp-main-icon" aria-hidden="true">mark_email_unread</span>
        <div className="bd-reg-topline">XÁC MINH TÀI KHOẢN</div>
        <h1 className="bd-reg-title">Xác minh email</h1>
        <p className="bd-reg-subtitle">
          Nhập mã gồm 6 chữ số đã được gửi đến địa chỉ email đăng ký.
        </p>
      </div>

      <form className="bd-reg-form bd-otp-form" onSubmit={handleVerify} noValidate>
        {editEmail ? (
          <div className="bd-reg-field">
            <label htmlFor="bd-otp-email" className="bd-reg-label">Email đăng ký</label>
            <input
              id="bd-otp-email"
              type="email"
              className="bd-reg-input"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
                setNotice('');
              }}
              autoComplete="email"
              placeholder="ten@example.com"
              required
            />
            {registeredEmail && (
              <button type="button" className="bd-otp-text-button"
                onClick={() => validEmail(normalizedEmail) && setEditEmail(false)}>
                Xong
              </button>
            )}
          </div>
        ) : (
          <div className="bd-otp-address">
            <span className="bd-otp-masked-email">{maskEmail(normalizedEmail)}</span>
            <button className="bd-otp-text-button" type="button" onClick={() => setEditEmail(true)}>
              Thay đổi email
            </button>
          </div>
        )}

        <div className="bd-reg-field">
          <label htmlFor="bd-otp-digit-0" className="bd-reg-label">Mã xác minh OTP</label>
          <div className="bd-otp-digits" aria-label="Nhập mã OTP 6 chữ số">
            {digits.map((digit, index) => (
              <input
                key={index}
                id={`bd-otp-digit-${index}`}
                ref={(element) => { digitRefs.current[index] = element; }}
                className="bd-otp-digit"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                aria-label={`Chữ số thứ ${index + 1} của mã OTP`}
                aria-invalid={Boolean(error)}
                value={digit}
                onChange={(event) => applyDigits(index, event.target.value)}
                onPaste={(event) => handlePaste(event, index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                disabled={busy}
              />
            ))}
          </div>
          <p className="bd-reg-hint">Bạn có thể dán cả mã 6 số vào bất kỳ ô nào.</p>
        </div>

        {error && <div className="bd-reg-notice bd-reg-notice-error" role="alert">{error}</div>}
        {notice && <div className="bd-reg-notice bd-reg-notice-success" role="status">{notice}</div>}

        <button className="bd-reg-submit" type="submit" disabled={!canVerify || resending}>
          {submitting ? 'Đang xác minh...' : 'Xác minh email'}
        </button>

        <div className="bd-otp-resend">
          <span>Chưa nhận được mã?</span>
          <button
            type="button"
            className="bd-otp-text-button"
            onClick={handleResend}
            disabled={busy || cooldown > 0}
          >
            {resending ? 'Đang gửi...' : cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi lại mã OTP'}
          </button>
        </div>
      </form>

      <p className="bd-reg-footer"><Link to="/login">Quay về đăng nhập</Link></p>
    </div>
  );
}