
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerMedicalWithDocument } from "../../api/registrationApi";
import AddressSelector from "../../components/registration/AddressSelector";

import {
  FormField,
  PasswordField,
  TextAreaField,
  FormNotice,
} from "../../components/registration/RegistrationFields";

import {
  checkPassword,
  isEmail,
  validateDocument,
} from "../../components/registration/registrationUtils";

import "../../styles/registration.css";

const INITIAL = {
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

function validate(form, file) {
  const errors = checkPassword(
    form.password,
    form.confirmPassword
  );

  // Email cơ sở y tế
  if (!isEmail(form.email)) {
    errors.email = "Email cơ sở y tế không hợp lệ.";
  } else if (form.email.trim().length > 254) {
    errors.email = "Email tối đa 254 ký tự.";
  }

  // Tên cơ sở
  if (!form.unitName.trim()) {
    errors.unitName = "Vui lòng nhập tên cơ sở y tế.";
  } else if (form.unitName.trim().length > 150) {
    errors.unitName = "Tên cơ sở tối đa 150 ký tự.";
  }

  // Loại cơ sở
  if (!form.unitType.trim()) {
    errors.unitType = "Vui lòng nhập loại hình cơ sở.";
  } else if (form.unitType.trim().length > 30) {
    errors.unitType = "Loại hình tối đa 30 ký tự.";
  }

  // Địa chỉ
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

  // Giấy phép
  if (!form.verificationInfo.trim()) {
    errors.verificationInfo =
      "Vui lòng nhập thông tin giấy phép/xác minh.";
  }

  const fileError = validateDocument(file);

  if (fileError) {
    errors.document = fileError;
  }

  return errors;
}

export default function MedicalRegisterPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(INITIAL);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const change = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setApiError("");
  };

  const changeLocation = ({ province, ward }) => {
    setForm((prev) => ({
      ...prev,
      province,
      ward,
    }));

    setErrors((prev) => ({
      ...prev,
      province: undefined,
      ward: undefined,
    }));

    setApiError("");
  };

  const changeFile = (event) => {
    const nextFile = event.target.files?.[0] || null;

    setFile(nextFile);

    setErrors((prev) => ({
      ...prev,
      document: nextFile
        ? validateDocument(nextFile)
        : "Vui lòng chọn giấy tờ xác minh.",
    }));

    setApiError("");
  };

  const submit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    const nextErrors = validate(form, file);

    setErrors(nextErrors);
    setApiError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // Payload đúng theo DTO Backend mới
    const payload = {
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

    try {
      setSubmitting(true);

      await registerMedicalWithDocument(payload, file);

      // Chuyển sang xác minh OTP
      navigate("/verify-email", {
        state: {
          email: payload.email,
          accountType: "MEDICAL",
        },
      });
    } catch (error) {
      setApiError(
        error?.message ||
          "Không thể đăng ký cơ sở y tế. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bd-reg-page bd-reg-medical-page">
      <div className="bd-reg-topline">
        ĐƠN VỊ Y TẾ
      </div>

      <h1 className="bd-reg-title">
        Đăng ký cơ sở y tế
      </h1>

      <p className="bd-reg-subtitle">
        Tạo tài khoản cho cơ sở y tế.
        Sau khi xác minh email, hồ sơ cần được
        ADMIN phê duyệt trước khi đăng nhập.
      </p>

      <nav
        className="bd-reg-tabs"
        aria-label="Loại tài khoản"
      >
        <Link
          className="bd-reg-tab"
          to="/register"
        >
          Cá nhân
        </Link>

        <Link
          className="bd-reg-tab is-active"
          to="/register-medical"
          aria-current="page"
        >
          Đơn vị y tế
        </Link>
      </nav>

      <form
        onSubmit={submit}
        noValidate
        className="bd-reg-form"
      >
        {apiError && (
          <FormNotice>{apiError}</FormNotice>
        )}

        {/* 1. Tài khoản cơ sở y tế */}
        <section
          className="bd-reg-section"
          aria-labelledby="bd-medical-account-title"
        >
          <h2
            id="bd-medical-account-title"
            className="bd-reg-section-title"
          >
            1. Thông tin tài khoản
          </h2>

          <p className="bd-reg-section-description">
            Email này dùng để nhận OTP, đăng nhập
            và nhận thông báo của hệ thống.
          </p>

          <FormField
            label="Email cơ sở y tế"
            name="email"
            value={form.email}
            onChange={change}
            error={errors.email}
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="medical@gmail.com"
            required
          />

          <div className="bd-reg-grid-two">
            <PasswordField
              label="Mật khẩu"
              name="password"
              value={form.password}
              onChange={change}
              error={errors.password}
            />

            <PasswordField
              label="Nhập lại mật khẩu"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={change}
              error={errors.confirmPassword}
            />
          </div>

          <p className="bd-reg-hint">
            Mật khẩu từ 8–64 ký tự; tối đa
            72 byte UTF-8.
          </p>
        </section>

        {/* 2. Thông tin cơ sở y tế */}
        <section
          className="bd-reg-section"
          aria-labelledby="bd-medical-unit-title"
        >
          <h2
            id="bd-medical-unit-title"
            className="bd-reg-section-title"
          >
            2. Thông tin cơ sở y tế
          </h2>

          <p className="bd-reg-section-description">
            Khai báo thông tin chính thức của
            cơ sở để ADMIN xét duyệt.
          </p>

          <FormField
            label="Tên cơ sở y tế"
            name="unitName"
            value={form.unitName}
            onChange={change}
            error={errors.unitName}
            maxLength={150}
            placeholder="Ví dụ: Bệnh viện Đa khoa Cần Thơ"
            required
          />

          <FormField
            label="Loại hình cơ sở"
            name="unitType"
            value={form.unitType}
            onChange={change}
            error={errors.unitType}
            maxLength={30}
            placeholder="Ví dụ: Bệnh viện đa khoa"
            required
          />

          <FormField
            label="Địa chỉ cơ sở"
            name="unitAddress"
            value={form.unitAddress}
            onChange={change}
            error={errors.unitAddress}
            maxLength={255}
            placeholder="Số nhà, tên đường, khu vực..."
            required
          />

          <AddressSelector
            province={form.province}
            onChange={changeLocation}
            errors={errors}
          />

          <FormField
            label="Số điện thoại cơ sở"
            name="unitPhone"
            value={form.unitPhone}
            onChange={change}
            error={errors.unitPhone}
            type="tel"
            maxLength={20}
            placeholder="Số điện thoại liên hệ"
          />
        </section>

        {/* 3. Giấy tờ xác minh */}
        <section
          className="bd-reg-section"
          aria-labelledby="bd-medical-document-title"
        >
          <h2
            id="bd-medical-document-title"
            className="bd-reg-section-title"
          >
            3. Giấy tờ xác minh
          </h2>

          <p className="bd-reg-section-description">
            Cung cấp thông tin và giấy tờ chứng minh
            cơ sở y tế được phép hoạt động.
          </p>

          <TextAreaField
            label="Thông tin giấy phép hoặc căn cứ xác minh"
            name="verificationInfo"
            value={form.verificationInfo}
            onChange={change}
            error={errors.verificationInfo}
            placeholder="Số giấy phép, cơ quan cấp, thông tin xác minh..."
            rows={3}
            required
          />

          <div className="bd-reg-field">
            <label
              htmlFor="bd-medical-file"
              className="bd-reg-label"
            >
              Ảnh / bản scan giấy tờ{" "}
              <span className="bd-reg-required">
                *
              </span>
            </label>

            <input
              id="bd-medical-file"
              ref={fileInputRef}
              type="file"
              className="bd-reg-file-native"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={changeFile}
              aria-describedby="bd-medical-file-hint bd-medical-file-error"
            />

            <button
              type="button"
              className={`bd-reg-upload ${
                errors.document
                  ? "bd-reg-upload-error"
                  : ""
              }`}
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
              >
                upload_file
              </span>

              <span className="bd-reg-upload-title">
                {file
                  ? file.name
                  : "Chọn ảnh hoặc bản scan giấy tờ"}
              </span>

              <span
                id="bd-medical-file-hint"
                className="bd-reg-upload-caption"
              >
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Nhấn để thay đổi tài liệu`
                  : "PDF, JPG, PNG · Tối đa 5 MB"}
              </span>
            </button>

            {errors.document && (
              <span
                id="bd-medical-file-error"
                className="bd-reg-error"
                role="alert"
              >
                {errors.document}
              </span>
            )}
          </div>

          <p className="bd-reg-hint">
            Giấy tờ xác minh chỉ dành cho ADMIN
            kiểm tra và phê duyệt hồ sơ.
          </p>
        </section>

        <div className="bd-reg-approval-note">
          <span
            className="material-symbols-outlined"
            aria-hidden="true"
          >
            info
          </span>

          <p>
            Sau khi đăng ký, hệ thống gửi OTP
            đến email cơ sở y tế. Tài khoản chỉ
            được đăng nhập sau khi ADMIN phê duyệt.
          </p>
        </div>

        <button
          className="bd-reg-submit"
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Đang gửi hồ sơ..."
            : "Gửi hồ sơ đăng ký"}
        </button>
      </form>

      <p className="bd-reg-footer">
        Đã có tài khoản?{" "}
        <Link to="/login">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
