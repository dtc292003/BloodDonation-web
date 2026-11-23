import { FormField, SelectField, GENDER_OPTIONS } from "../RegistrationFields";

import { todayLocal } from "../registrationUtils";

export default function UserPersonalFields({ form, errors, onChange }) {
  return (
    <>
      <FormField
        label="Họ và tên"
        name="fullName"
        value={form.fullName}
        onChange={onChange}
        error={errors.fullName}
        maxLength={150}
        autoComplete="name"
        placeholder="Nhập họ và tên đầy đủ"
        required
      />

      <div className="grid grid-cols-2 gap-[3.5px] max-[1100px]:grid-cols-1">
        <FormField
          label="Email"
          name="email"
          value={form.email}
          onChange={onChange}
          error={errors.email}
          type="email"
          autoComplete="email"
          placeholder="ten@example.com"
          required
        />

        <FormField
          label="Số điện thoại"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={onChange}
          error={errors.phoneNumber}
          type="tel"
          autoComplete="tel"
          placeholder="Số điện thoại liên hệ"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-[3.5px] max-[1100px]:grid-cols-1">
        <FormField
          label="Ngày sinh"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={onChange}
          error={errors.dateOfBirth}
          type="date"
          max={todayLocal()}
          required
        />

        <SelectField
          label="Giới tính"
          name="gender"
          value={form.gender}
          onChange={onChange}
          error={errors.gender}
          options={GENDER_OPTIONS}
          required
        />
      </div>

      <FormField
        label="Địa chỉ (không bắt buộc)"
        name="address"
        value={form.address}
        onChange={onChange}
        placeholder="Địa chỉ hiện tại"
        autoComplete="street-address"
      />
    </>
  );
}
