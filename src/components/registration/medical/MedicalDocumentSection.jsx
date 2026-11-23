import { useRef } from "react";
import { TextAreaField } from "../RegistrationFields";

export default function MedicalDocumentSection({
  form,
  file,
  errors,
  onChange,
  onFileChange,
}) {
  const fileInputRef = useRef(null);

  return (
    <section
      className="bd-reg-section"
      aria-labelledby="bd-medical-document-title"
    >
      <h2 id="bd-medical-document-title" className="bd-reg-section-title">
        3. Giấy tờ xác minh
      </h2>

      <p className="bd-reg-section-description">
        Cung cấp thông tin và giấy tờ chứng minh cơ sở y tế được phép hoạt động.
      </p>

      <TextAreaField
        label="Thông tin giấy phép hoặc căn cứ xác minh"
        name="verificationInfo"
        value={form.verificationInfo}
        onChange={onChange}
        error={errors.verificationInfo}
        placeholder="Số giấy phép, cơ quan cấp, thông tin xác minh..."
        rows={3}
        required
      />

      <div className="bd-reg-field">
        <label htmlFor="bd-medical-file" className="bd-reg-label">
          Ảnh / bản scan giấy tờ <span className="bd-reg-required">*</span>
        </label>

        <input
          id="bd-medical-file"
          ref={fileInputRef}
          type="file"
          className="bd-reg-file-native"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          onChange={onFileChange}
          aria-describedby={
            errors.document
              ? "bd-medical-file-hint bd-medical-file-error"
              : "bd-medical-file-hint"
          }
        />

        <button
          type="button"
          className={`bd-reg-upload ${
            errors.document ? "bd-reg-upload-error" : ""
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            upload_file
          </span>

          <span className="bd-reg-upload-title">
            {file ? file.name : "Chọn ảnh hoặc bản scan giấy tờ"}
          </span>

          <span id="bd-medical-file-hint" className="bd-reg-upload-caption">
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
        Giấy tờ xác minh chỉ dành cho ADMIN kiểm tra và phê duyệt hồ sơ.
      </p>
    </section>
  );
}
