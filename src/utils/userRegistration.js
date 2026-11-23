import {
  checkPassword,
  isEmail,
  isPastDate,
} from "../components/registration/registrationUtils";

// Dữ liệu khởi tạo
export const INITIAL_USER_FORM = {
  fullName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  password: "",
  confirmPassword: "",
};

// Kiểm tra thông tin đăng ký
export function validateUserRegistration(form) {
  const errors = checkPassword(form.password, form.confirmPassword);

  // Họ và tên
  if (!form.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên.";
  } else if (form.fullName.trim().length > 150) {
    errors.fullName = "Họ tên tối đa 150 ký tự.";
  }

  // Email
  if (!isEmail(form.email)) {
    errors.email = "Email không đúng định dạng.";
  }

  // Số điện thoại
  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = "Vui lòng nhập số điện thoại.";
  }

  // Ngày sinh
  if (!form.dateOfBirth) {
    errors.dateOfBirth = "Vui lòng chọn ngày sinh.";
  } else if (!isPastDate(form.dateOfBirth)) {
    errors.dateOfBirth = "Ngày sinh phải là ngày trong quá khứ.";
  }

  // Giới tính
  if (!form.gender) {
    errors.gender = "Vui lòng chọn giới tính.";
  }

  return errors;
}

// Chuẩn bị payload đúng DTO Backend
export function buildUserRegistrationPayload(form) {
  return {
    fullName: form.fullName.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
    phoneNumber: form.phoneNumber.trim(),
    dateOfBirth: form.dateOfBirth,
    gender: form.gender,
    address: form.address.trim() || null,
  };
}
