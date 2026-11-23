const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
).replace(/\/+$/, "");

// Đọc kết quả Backend
async function readResponse(response) {
  const text = await response.text();

  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.detail ||
        "Yêu cầu không thành công. Vui lòng thử lại.",
    );
  }

  return data;
}

// Hàm POST dùng chung
async function post(path, payload) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Không thể kết nối Backend. Vui lòng kiểm tra Spring Boot.",
    );
  }

  return readResponse(response);
}

// Bước 1: Yêu cầu gửi OTP về email
export function forgotPassword(email) {
  return post("/auth/forgot-password", {
    email: email.trim().toLowerCase(),
  });
}

// Bước 2: Xác minh OTP và đặt mật khẩu mới
export function resetPassword(email, otp, newPassword) {
  return post("/auth/reset-password", {
    email: email.trim().toLowerCase(),
    otp: otp.trim(),
    newPassword,
  });
}
