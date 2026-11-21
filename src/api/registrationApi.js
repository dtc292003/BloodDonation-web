// Chỉ dành cho đăng ký công khai; không thay đổi authApi/AuthProvider hiện có.
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api')
  .replace(/\/+$/, '');

export class RegistrationApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'RegistrationApiError';
    this.status = status;
  }
}

async function readResponse(response) {
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      // Spring có thể trả text thay vì JSON.
      payload = { message: text };
    }
  }

  if (!response.ok) {
    const validation = payload?.errors;
    const firstValidation = Array.isArray(validation)
      ? validation[0]?.defaultMessage || validation[0]?.message
      : null;
    const message = firstValidation || payload?.detail || payload?.message ||
      (response.status === 409 ? 'Email này đã được sử dụng.' :
        response.status === 413 ? 'Dung lượng tài liệu vượt quá giới hạn cho phép.' :
          response.status === 415 ? 'Định dạng dữ liệu gửi lên không được hỗ trợ.' :
            'Không thể gửi đăng ký. Vui lòng kiểm tra thông tin và thử lại.');
    throw new RegistrationApiError(message, response.status);
  }

  return payload;
}

async function postJson(path, data) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    throw new RegistrationApiError('Không kết nối được Backend. Hãy kiểm tra Spring Boot đang chạy ở cổng 3000.');
  }
  return readResponse(response);
}

export function registerUser(data) {
  // Không nhận roleName từ form để tránh tự ý thay quyền ở UI.
  return postJson('/auth/register', {
    ...data,
    roleName: 'USER',
  });
}

export async function registerMedicalWithDocument(data, document) {
  if (!(document instanceof File)) {
    throw new RegistrationApiError('Vui lòng chọn giấy tờ xác minh.');
  }

  const body = new FormData();
  // @RequestPart("request") của Spring cần Content-Type riêng = application/json.
  body.append('request', new Blob([JSON.stringify(data)], {
    type: 'application/json',
  }));
  body.append('document', document, document.name);

  let response;
  try {
    response = await fetch(`${BASE_URL}/auth/register-medical-with-document`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      // KHÔNG tự đặt Content-Type ở đây; trình duyệt sẽ thêm multipart boundary.
      body,
    });
  } catch {
    throw new RegistrationApiError('Không kết nối được Backend. Hãy kiểm tra Spring Boot đang chạy ở cổng 3000.');
  }

  return readResponse(response);
}
