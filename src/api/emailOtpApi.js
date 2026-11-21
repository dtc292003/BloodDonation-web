const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api')
  .replace(/\/+$/, '');

export class EmailOtpApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'EmailOtpApiError';
    this.status = status;
  }
}

async function postJson(path, payload) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new EmailOtpApiError(
      'Không kết nối được Backend. Vui lòng kiểm tra Spring Boot đang chạy.'
    );
  }

  // Spring có thể trả JSON hoặc body trống.
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text ? { message: text } : null;
  }

  if (!response.ok) {
    const errors = data?.errors;
    const firstError = Array.isArray(errors)
      ? errors[0]?.defaultMessage || errors[0]?.message
      : null;
    const message = firstError || data?.detail || data?.message ||
      (response.status === 429
        ? 'Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau.'
        : response.status === 400
          ? 'Mã OTP hoặc email không hợp lệ, hoặc mã đã hết hạn.'
          : 'Không thể xử lý yêu cầu. Vui lòng thử lại.');
    throw new EmailOtpApiError(message, response.status);
  }

  return data;
}

// Đã có VerifyEmailRequest: { email, otp (6 chữ số) }.
export function verifyEmail(email, otp) {
  return postJson('/auth/verify-email', { email, otp });
}

// Cần đối chiếu Swagger: giả định endpoint resend nhận JSON { email }.
// Nếu Backend dùng @RequestParam, chỉ sửa hàm này, KHÔNG sửa Backend đang PASS.
export function resendEmailOtp(email) {
  return postJson('/auth/resend-otp', { email });
}