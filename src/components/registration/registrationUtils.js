export function isPastDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function todayLocal() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function checkPassword(value, repeat) {
  const errors = {};
  if (value.length < 8 || value.length > 64) {
    errors.password = 'Mật khẩu phải từ 8 đến 64 ký tự.';
  } else if (new TextEncoder().encode(value).length > 72) {
    errors.password = 'Mật khẩu vượt quá giới hạn 72 byte của hệ thống.';
  }
  if (value !== repeat) errors.confirmPassword = 'Mật khẩu nhập lại chưa khớp.';
  return errors;
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || '').trim());
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export function validateDocument(file) {
  if (!file) return 'Vui lòng tải ảnh hoặc bản scan giấy tờ.';
  if (file.size === 0) return 'Tài liệu không được rỗng.';
  if (file.size > MAX_FILE_SIZE) return 'Dung lượng tài liệu không được vượt quá 5 MB.';
  if (!/\.(pdf|jpg|jpeg|png)$/i.test(file.name)) {
    return 'Chỉ hỗ trợ tệp PDF, JPG hoặc PNG.';
  }
  return '';
}