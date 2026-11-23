import { FormNotice } from "../RegistrationFields";

import MedicalAccountSection from "./MedicalAccountSection";
import MedicalUnitSection from "./MedicalUnitSection";
import MedicalDocumentSection from "./MedicalDocumentSection";

export default function MedicalRegistrationForm({
  form,
  file,
  errors,
  apiError,
  submitting,
  change,
  changeLocation,
  changeFile,
  submit,
}) {
  return (
    <form onSubmit={submit} noValidate className="bd-reg-form">
      {apiError && <FormNotice>{apiError}</FormNotice>}

      <MedicalAccountSection form={form} errors={errors} onChange={change} />

      <MedicalUnitSection
        form={form}
        errors={errors}
        onChange={change}
        onLocationChange={changeLocation}
      />

      <MedicalDocumentSection
        form={form}
        file={file}
        errors={errors}
        onChange={change}
        onFileChange={changeFile}
      />

      <div className="bd-reg-approval-note">
        <span className="material-symbols-outlined" aria-hidden="true">
          info
        </span>

        <p>
          Sau khi đăng ký, hệ thống gửi OTP đến email cơ sở y tế. Tài khoản chỉ
          được đăng nhập sau khi ADMIN phê duyệt.
        </p>
      </div>

      <button className="bd-reg-submit" type="submit" disabled={submitting}>
        {submitting ? "Đang gửi hồ sơ..." : "Gửi hồ sơ đăng ký"}
      </button>
    </form>
  );
}
