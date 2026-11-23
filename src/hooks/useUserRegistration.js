import { useState } from "react";
import { useNavigate } from "react-router";

import { registerUser } from "../api/registrationApi";

import {
  INITIAL_USER_FORM,
  validateUserRegistration,
  buildUserRegistrationPayload,
} from "../utils/userRegistration";

export default function useUserRegistration() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_USER_FORM);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Cập nhật trường nhập liệu
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

  // Xử lý đăng ký USER
  const submit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    const nextErrors = validateUserRegistration(form);

    setErrors(nextErrors);
    setApiError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = buildUserRegistrationPayload(form);

    setSubmitting(true);

    try {
      await registerUser(payload);

      // Chuyển sang xác minh email
      navigate("/verify-email", {
        state: {
          email: payload.email,
          accountType: "USER",
        },
      });
    } catch (error) {
      setApiError(error?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    errors,
    apiError,
    submitting,
    change,
    submit,
  };
}
