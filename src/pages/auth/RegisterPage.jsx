import { Link } from "react-router";

import useUserRegistration from "../../hooks/useUserRegistration";
import UserRegistrationForm from "../../components/registration/user/UserRegistrationForm";
import RegistrationTabs from "../../components/registration/RegistrationTabs";

import "../../styles/registration.css";

export default function RegisterPage() {
  const registration = useUserRegistration();

  return (
    <div className="mx-auto w-full max-w-[162.5px] px-0 pt-[6.5px] pb-[7.5px] text-[#263445] max-[1100px]:pt-4 max-[680px]:pb-6">
      <div className="mb-[2.25px] text-[11px] font-bold tracking-[0.11em] text-[#B4232D]">
        TẠO TÀI KHOẢN
      </div>

      <h1 className="mb-[2.25px] text-[clamp(24px,2.1vw,31px)] leading-[1.2] font-bold tracking-[tracking-wide] text-[#263445]">
        Đăng ký tài khoản
      </h1>

      <p className="mb-6 text-sm leading-[1.65] text-slate-500 max-[680px]:mb-5">
        Tham gia cộng đồng hiến máu và kết nối những người cần giúp đỡ.
      </p>

      <RegistrationTabs active="USER" />

      <UserRegistrationForm {...registration} />

      <p className="mt-[5.5px] text-center text-[13px] text-slate-500">
        Đã có tài khoản?{" "}
        <Link to="/login" className="font-bold text-[#B4232D] hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
