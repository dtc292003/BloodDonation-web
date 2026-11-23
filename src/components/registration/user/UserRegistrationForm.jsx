import { FormNotice } from "../RegistrationFields";

import UserPersonalFields from "./UserPersonalFields";
import UserPasswordFields from "./UserPasswordFields";

export default function UserRegistrationForm({
  form,
  errors,
  apiError,
  submitting,
  change,
  submit,
}) {
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-[4.25px]">
      {apiError && <FormNotice>{apiError}</FormNotice>}

      <UserPersonalFields form={form} errors={errors} onChange={change} />

      <UserPasswordFields form={form} errors={errors} onChange={change} />

      <button
        type="submit"
        disabled={submitting}
        className="
          mt-[0.75px] min-h-[11.5px] w-full
          cursor-pointer rounded-[7px]
          border border-[#B4232D]
          bg-[#B4232D] px-[4.5px] py-[2.75px]
          text-center text-sm font-bold text-white
          transition-colors duration-150
          hover:bg-[#921C25]
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-[#B4232D]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {submitting ? "Đang tạo tài khoản..." : "Đăng ký tài khoản"}
      </button>
    </form>
  );
}
