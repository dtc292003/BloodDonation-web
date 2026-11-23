
import AddressSelector from "../AddressSelector";
import { FormField } from "../RegistrationFields";

export default function MedicalUnitSection({
  form,
  errors,
  onChange,
  onLocationChange,
}) {
  return (
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
        Khai báo thông tin chính thức của cơ sở
        để ADMIN xét duyệt.
      </p>

      <FormField
        label="Tên cơ sở y tế"
        name="unitName"
        value={form.unitName}
        onChange={onChange}
        error={errors.unitName}
        maxLength={150}
        placeholder="Ví dụ: Bệnh viện Đa khoa Cần Thơ"
        required
      />

      <FormField
        label="Loại hình cơ sở"
        name="unitType"
        value={form.unitType}
        onChange={onChange}
        error={errors.unitType}
        maxLength={30}
        placeholder="Ví dụ: Bệnh viện đa khoa"
        required
      />

      <FormField
        label="Địa chỉ cơ sở"
        name="unitAddress"
        value={form.unitAddress}
        onChange={onChange}
        error={errors.unitAddress}
        maxLength={255}
        placeholder="Số nhà, tên đường, khu vực..."
        required
      />

      <AddressSelector
        province={form.province}
        onChange={onLocationChange}
        errors={errors}
      />

      <FormField
        label="Số điện thoại cơ sở"
        name="unitPhone"
        value={form.unitPhone}
        onChange={onChange}
        error={errors.unitPhone}
        type="tel"
        maxLength={20}
        placeholder="Số điện thoại liên hệ"
      />
    </section>
  );
}
