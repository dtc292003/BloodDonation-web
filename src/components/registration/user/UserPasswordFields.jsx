import { PasswordField } from "../RegistrationFields";

export default function UserPasswordFields({ form, errors, onChange }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-[3.5px] max-[1100px]:grid-cols-1">
        <PasswordField
          label="Mật khẩu"
          name="password"
          value={form.password}
          onChange={onChange}
          error={errors.password}
        />

        <PasswordField
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword}
        />
      </div>

      <p className="-mt-2 text-xs leading-[1.6] text-[#64748B]">
        Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký
        tự đặc biệt.
      </p>
    </>
  );
}
