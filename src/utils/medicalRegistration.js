import {
  checkPassword,
  isEmail,
  validateDocument,
} from "../components/registration/registrationUtils";

export const INITIAL_MEDICAL_FORM = {
  email: "",
  password: "",
  confirmPassword: "",
  unitName: "",
  unitType: "",
  unitAddress: "",
  province: "",
  ward: "",
  unitPhone: "",
  verificationInfo: "",
};

export function validateMedicalRegistration(form, file) {
  const errors = checkPassword(form.password, form.confirmPassword);

  if (!isEmail(form.email)) {
    errors.email = "Email cơ sở y tế không hợp lệ.";
  } else if (form.email.trim().length > 254) {
    errors.email = "Email tối đa 254 ký tự.";
  }

  if (!form.unitName.trim()) {
    errors.unitName = "Vui lòng nhập tên cơ sở y tế.";
  } else if (form.unitName.trim().length > 150) {
    errors.unitName = "Tên cơ sở tối đa 150 ký tự.";
  }

  if (!form.unitType.trim()) {
    errors.unitType = "Vui lòng nhập loại hình cơ sở.";
  } else if (form.unitType.trim().length > 30) {
    errors.unitType = "Loại hình tối đa 30 ký tự.";
  }

  if (!form.unitAddress.trim()) {
    errors.unitAddress = "Vui lòng nhập địa chỉ cơ sở.";
  } else if (form.unitAddress.trim().length > 255) {
    errors.unitAddress = "Địa chỉ tối đa 255 ký tự.";
  }

  if (!form.province) {
    errors.province = "Vui lòng chọn tỉnh/thành phố.";
  }

  if (!form.ward) {
    errors.ward = "Vui lòng chọn phường/xã.";
  }

  if (form.unitPhone.trim().length > 20) {
    errors.unitPhone = "Số điện thoại tối đa 20 ký tự.";
  }

  if (!form.verificationInfo.trim()) {
    errors.verificationInfo = "Vui lòng nhập thông tin giấy phép/xác minh.";
  }

  const fileError = validateDocument(file);

  if (fileError) {
    errors.document = fileError;
  }

  return errors;
}

export function buildMedicalRegistrationPayload(form) {
  return {
    email: form.email.trim().toLowerCase(),
    password: form.password,

    newMedicalUnit: {
      unitName: form.unitName.trim(),
      unitType: form.unitType.trim(),
      address: form.unitAddress.trim(),
      province: form.province.trim(),
      district: null,
      ward: form.ward.trim(),
      latitude: null,
      longitude: null,
      phoneNumber: form.unitPhone.trim() || null,
      verificationInfo: form.verificationInfo.trim(),
    },
  };
}
