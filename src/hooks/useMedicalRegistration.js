import { useState } from "react";
import { useNavigate } from "react-router";

import { registerMedicalWithDocument } from "../api/registrationApi";

import { validateDocument } from "../components/registration/registrationUtils";

import {
  INITIAL_MEDICAL_FORM,
  validateMedicalRegistration,
  buildMedicalRegistrationPayload,
} from "../utils/medicalRegistration";

export default function useMedicalRegistration() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_MEDICAL_FORM);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Cập nhật các trường thông thường
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

  // Cập nhật tỉnh và phường/xã
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

  // Chọn giấy tờ xác minh
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

  // Gửi đăng ký cơ sở y tế
  const submit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    const nextErrors = validateMedicalRegistration(form, file);

    setErrors(nextErrors);
    setApiError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = buildMedicalRegistrationPayload(form);

    try {
      setSubmitting(true);

      await registerMedicalWithDocument(payload, file);

      // Chuyển sang xác minh email
      navigate("/verify-email", {
        state: {
          email: payload.email,
          accountType: "MEDICAL",
        },
      });
    } catch (error) {
      setApiError(
        error?.message || "Không thể đăng ký cơ sở y tế. Vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    file,
    errors,
    apiError,
    submitting,
    change,
    changeLocation,
    changeFile,
    submit,
  };
}
